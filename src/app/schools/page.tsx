
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type School = {
  id: string;
  district_id: string;
  name: string;
  school_level: string;
  grade_range: string | null;
  created_at: string;
};

const emptyForm = {
  name: "",
  school_level: "elementary",
  grade_range: "",
};

const schoolLevelLabels: Record<string, string> = {
  elementary: "Elementary",
  middle: "Middle",
  high: "High",
  other: "Other",
};

export default function SchoolsPage() {
  const router = useRouter();

  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadSchools() {
      const supabase = createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace("/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, district_id")
        .eq("id", user.id)
        .maybeSingle();

      if (
        profileError ||
        !profile ||
        profile.role !== "district_admin" ||
        !profile.district_id
      ) {
        router.replace("/");
        return;
      }

      setDistrictId(profile.district_id);

      const { data, error: schoolsError } = await supabase
        .from("schools")
        .select(
          "id, district_id, name, school_level, grade_range, created_at"
        )
        .eq("district_id", profile.district_id)
        .order("name", { ascending: true });

      if (schoolsError) {
        setError(schoolsError.message);
      } else {
        setSchools((data ?? []) as School[]);
      }

      setLoading(false);
    }

    void loadSchools();
  }, [router]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!districtId || !form.name.trim()) {
      setError("Please enter a school name.");
      return;
    }

    const allowedLevels = ["elementary", "middle", "high", "other"];

    if (!allowedLevels.includes(form.school_level)) {
      setError("Please select a valid school level.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    const supabase = createClient();

    const schoolData = {
      name: form.name.trim(),
      school_level: form.school_level,
      grade_range: form.grade_range.trim() || null,
    };

    if (editingId) {
      const { data, error: updateError } = await supabase
        .from("schools")
        .update(schoolData)
        .eq("id", editingId)
        .eq("district_id", districtId)
        .select(
          "id, district_id, name, school_level, grade_range, created_at"
        )
        .single();

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }

      setSchools((current) =>
        current
          .map((school) => (school.id === editingId ? (data as School) : school))
          .sort((a, b) => a.name.localeCompare(b.name))
      );

      setForm(emptyForm);
      setEditingId(null);
      setMessage("School updated successfully.");
    } else {
      const { data, error: insertError } = await supabase
        .from("schools")
        .insert({
          ...schoolData,
          district_id: districtId,
        })
        .select(
          "id, district_id, name, school_level, grade_range, created_at"
        )
        .single();

      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }

      setSchools((current) =>
        [...current, data as School].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );

      setForm(emptyForm);
      setEditingId(null);
      setMessage("School added successfully.");
    }

    setSaving(false);
  }

  function startEditing(school: School) {
    setEditingId(school.id);

    setForm({
      name: school.name,
      school_level: school.school_level.toLowerCase(),
      grade_range: school.grade_range ?? "",
    });

    setError("");
    setMessage("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteSchool(school: School) {
    const confirmed = window.confirm(
      `Delete "${school.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");
    setDeletingId(school.id);

    const supabase = createClient();

    const { data, error: deleteError } = await supabase
      .from("schools")
      .delete()
      .eq("id", school.id)
      .eq("district_id", districtId)
      .select("id");

    if (deleteError) {
      setError(deleteError.message);
      setDeletingId(null);
      return;
    }

    if (!data || data.length === 0) {
      setError(
        "The school was not deleted. Check your permissions and try again."
      );
      setDeletingId(null);
      return;
    }

    setSchools((current) =>
      current.filter((item) => item.id !== school.id)
    );

    if (editingId === school.id) {
      setForm(emptyForm);
      setEditingId(null);
    }

    setMessage("School deleted successfully.");
    setDeletingId(null);
  }

  const filteredSchools = schools.filter((school) => {
    const searchableText = [
      school.name,
      school.school_level,
      school.grade_range ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(search.toLowerCase());
  });

  const elementaryCount = schools.filter(
    (school) => school.school_level.toLowerCase() === "elementary"
  ).length;

  const middleAndHighCount = schools.filter((school) => {
    const level = school.school_level.toLowerCase();
    return level === "middle" || level === "high";
  }).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 text-slate-700">
        Loading schools...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
              BeKind · District Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold">School Management</h1>

            <p className="mt-2 text-slate-600">
              Manage the schools participating in your district&apos;s
              prevention program.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/district")}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-semibold hover:bg-slate-100"
          >
            Back to Dashboard
          </button>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total schools</p>
            <p className="mt-2 text-3xl font-bold">{schools.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Elementary schools</p>
            <p className="mt-2 text-3xl font-bold">{elementaryCount}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Middle &amp; high schools</p>
            <p className="mt-2 text-3xl font-bold">{middleAndHighCount}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">
            {editingId ? "Edit school" : "Register a school"}
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Enter the school&apos;s details below.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 sm:grid-cols-2"
          >
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">
                School name *
              </span>

              <input
                required
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="e.g. Northside Elementary"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">
                School level *
              </span>

              <select
                required
                value={form.school_level}
                onChange={(event) =>
                  setForm({ ...form, school_level: event.target.value })
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-teal-600"
              >
                <option value="elementary">Elementary</option>
                <option value="middle">Middle</option>
                <option value="high">High</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-semibold">
                Grade range (optional)
              </span>

              <input
                value={form.grade_range}
                onChange={(event) =>
                  setForm({ ...form, grade_range: event.target.value })
                }
                placeholder="e.g. K–5 or Grades 6–8"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
              />
            </label>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 p-3 text-sm text-red-700 sm:col-span-2"
              >
                {error}
              </p>
            )}

            {message && (
              <p
                role="status"
                className="rounded-xl bg-teal-50 p-3 text-sm text-teal-800 sm:col-span-2"
              >
                {message}
              </p>
            )}

            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save changes"
                    : "Add school"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-300 px-5 py-3 font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Registered schools</h2>

              <p className="mt-1 text-sm text-slate-600">
                {schools.length} school{schools.length === 1 ? "" : "s"} in
                your district
              </p>
            </div>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search schools..."
              aria-label="Search schools"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 sm:w-64"
            />
          </div>

          {filteredSchools.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center">
              <p className="font-semibold">
                {schools.length === 0
                  ? "No schools registered yet"
                  : "No matching schools"}
              </p>

              <p className="mt-2 text-sm text-slate-600">
                {schools.length === 0
                  ? "Use the form above to register your first school."
                  : "Try a different search term."}
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="px-3 py-3 font-semibold">School</th>
                    <th className="px-3 py-3 font-semibold">Level</th>
                    <th className="px-3 py-3 font-semibold">Grade range</th>
                    <th className="px-3 py-3 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredSchools.map((school) => (
                    <tr
                      key={school.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-3 py-4 font-semibold">
                        {school.name}
                      </td>

                      <td className="px-3 py-4">
                        <span className="rounded-full bg-teal-50 px-3 py-1 text-teal-800">
                          {schoolLevelLabels[
                            school.school_level.toLowerCase()
                          ] ?? school.school_level}
                        </span>
                      </td>

                      <td className="px-3 py-4 text-slate-600">
                        {school.grade_range || "—"}
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => startEditing(school)}
                            className="font-semibold text-teal-700 hover:underline"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={deletingId === school.id}
                            onClick={() => void deleteSchool(school)}
                            className="font-semibold text-red-600 hover:underline disabled:opacity-50"
                          >
                            {deletingId === school.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
