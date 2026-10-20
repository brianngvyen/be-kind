"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type School = {
  id: string;
  name: string;
  level: string;
  gradeRange: string;
};

type Activity = {
  id: string;
  title: string;
  description: string;
  audience: string;
  completed: boolean;
  schoolKey: string;
  gradeRange: string;
  dueDate: string;
};

type Assignment = {
  id: string;
  activityId: string;
  schoolId: string;
  completed: boolean;
  completedAt: string | null;
};

type PlanField = "name" | "school_year";

function ProgressBar({ value }: { value: number }) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className="h-2.5 overflow-hidden rounded-full bg-[#e9e5dc]"
      role="progressbar"
      aria-label="Plan implementation progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeValue}
    >
      <div
        className="h-full rounded-full bg-[#668263] transition-all"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

function audienceLabel(key: string) {
  const labels: Record<string, string> = {
    all: "All schools",
    elementary: "Elementary schools",
    middle: "Middle schools",
    high: "High schools",
    staff: "School leaders and staff",
  };

  return labels[key] ?? key;
}

export default function DistrictDashboard() {
  const [districtName, setDistrictName] = useState("");
  const [schools, setSchools] = useState<School[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentSchoolByActivity, setAssignmentSchoolByActivity] =
    useState<Record<string, string>>({});
  const [assigningActivityId, setAssigningActivityId] = useState<string | null>(
    null
  );

  const [planId, setPlanId] = useState<string | null>(null);
  const [planName, setPlanName] = useState("");
  const [schoolYear, setSchoolYear] = useState("");

  const [newSchoolName, setNewSchoolName] = useState("");
  const [newSchoolLevel, setNewSchoolLevel] = useState("elementary");
  const [newSchoolGradeRange, setNewSchoolGradeRange] = useState("K–5");
  const [schoolSaving, setSchoolSaving] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newSchoolKey, setNewSchoolKey] = useState("all");
  const [newGradeRange, setNewGradeRange] = useState("K–12");
  const [newDueDate, setNewDueDate] = useState("");
  const [newAssignedSchoolId, setNewAssignedSchoolId] = useState("");

  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(
    "Connecting to the district database..."
  );

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      const supabase = createClient();

      try {
        setSavedMessage("Loading district data from Supabase...");

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        if (!user) {
          window.location.href = "/login";
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("district_id, role")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (
          !profile ||
          profile.role !== "district_admin" ||
          !profile.district_id
        ) {
          window.location.href = "/";
          return;
        }

        const [
          { data: district, error: districtError },
          { data: schoolRows, error: schoolsError },
          { data: planRows, error: plansError },
        ] = await Promise.all([
          supabase
            .from("districts")
            .select("name")
            .eq("id", profile.district_id)
            .maybeSingle(),

          supabase
            .from("schools")
            .select("id, name, school_level, grade_range")
            .eq("district_id", profile.district_id)
            .order("name", { ascending: true }),

          supabase
            .from("prevention_plans")
            .select("id, name, school_year, created_at")
            .eq("district_id", profile.district_id)
            .order("created_at", { ascending: false })
            .limit(1),
        ]);

        if (districtError) throw districtError;
        if (schoolsError) throw schoolsError;
        if (plansError) throw plansError;

        const plan = planRows?.[0] ?? null;

        let activityRows: Array<{
          id: string;
          title: string;
          description: string;
          audience: string;
          completed: boolean;
          school_key: string;
          grade_range: string;
          due_date: string | null;
        }> = [];

        if (plan) {
          const { data, error } = await supabase
            .from("activities")
            .select(
              "id, title, description, audience, completed, school_key, grade_range, due_date"
            )
            .eq("plan_id", plan.id)
            .order("created_at", { ascending: true });

          if (error) throw error;
          activityRows = data ?? [];
        }

        let assignmentRows: Array<{
          id: string;
          activity_id: string;
          school_id: string;
          completed: boolean;
          completed_at: string | null;
        }> = [];

        if (activityRows.length > 0) {
          const { data: rows, error: assignmentsError } = await supabase
            .from("activity_assignments")
            .select("id, activity_id, school_id, completed, completed_at")
            .in(
              "activity_id",
              activityRows.map((activity) => activity.id)
            );

          if (assignmentsError) throw assignmentsError;
          assignmentRows = rows ?? [];
        }

        if (cancelled) return;

        setDistrictName(district?.name ?? "District workspace");

        setSchools(
          (schoolRows ?? []).map((school) => ({
            id: school.id,
            name: school.name,
            level: school.school_level || "School",
            gradeRange: school.grade_range || "",
          }))
        );

        setPlanId(plan?.id ?? null);
        setPlanName(plan?.name ?? "");
        setSchoolYear(plan?.school_year ?? "");

        setAssignments(
          assignmentRows.map((assignment) => ({
            id: assignment.id,
            activityId: assignment.activity_id,
            schoolId: assignment.school_id,
            completed: assignment.completed,
            completedAt: assignment.completed_at,
          }))
        );

        setActivities(
          activityRows.map((activity) => ({
            id: activity.id,
            title: activity.title,
            description: activity.description,
            audience: activity.audience,
            completed: activity.completed,
            schoolKey: activity.school_key,
            gradeRange: activity.grade_range,
            dueDate: activity.due_date ?? "",
          }))
        );

        if (!plan) {
          setSavedMessage(
            "Connected to Supabase, but this district has no prevention plan yet."
          );
        } else {
          setSavedMessage("District data loaded from Supabase.");
        }
      } catch (error) {
        console.error("Failed to load the district dashboard:", error);

        if (!cancelled) {
          setSavedMessage(
            error instanceof Error
              ? `Could not load district data: ${error.message}`
              : "Could not load district data. Check your connection and database policies."
          );
        }
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  async function addSchool(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = newSchoolName.trim();
    const gradeRange = newSchoolGradeRange.trim();

    if (!name) {
      setSavedMessage("Please enter a school name.");
      return;
    }

    if (!gradeRange) {
      setSavedMessage("Please enter a grade range.");
      return;
    }

    setSchoolSaving(true);
    setSavedMessage("Adding school...");

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;
      if (!user) throw new Error("Please sign in again.");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("district_id, role")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (
        !profile ||
        profile.role !== "district_admin" ||
        !profile.district_id
      ) {
        throw new Error("Your account is not linked to a district.");
      }

      const { data, error } = await supabase
        .from("schools")
        .insert({
          district_id: profile.district_id,
          name,
          school_level: newSchoolLevel,
          grade_range: gradeRange,
        })
        .select("id, name, school_level, grade_range")
        .single();

      if (error) throw error;

      const addedSchool: School = {
        id: data.id,
        name: data.name,
        level: data.school_level || "School",
        gradeRange: data.grade_range || "",
      };

      setSchools((current) =>
        [...current, addedSchool].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );

      setNewSchoolName("");
      setNewSchoolLevel("elementary");
      setNewSchoolGradeRange("K–5");

      setSavedMessage(`${name} was added successfully.`);
    } catch (error) {
      console.error("Could not add school:", error);

      setSavedMessage(
        error instanceof Error
          ? `Could not add school: ${error.message}`
          : "Could not add school. Check your Supabase policies."
      );
    } finally {
      setSchoolSaving(false);
    }
  }

  const completedPlanItems = activities.filter(
    (activity) => activity.completed
  ).length;

  const planProgress = activities.length
    ? Math.round((completedPlanItems / activities.length) * 100)
    : 0;

  const activitySummary = useMemo(
    () => ({
      total: activities.length,
      completed: completedPlanItems,
      remaining: activities.length - completedPlanItems,
    }),
    [activities, completedPlanItems]
  );

  const audienceSummary = useMemo(() => {
    const groups = [
      { key: "all", label: "All schools" },
      { key: "elementary", label: "Elementary schools" },
      { key: "middle", label: "Middle schools" },
      { key: "high", label: "High schools" },
      { key: "staff", label: "School leaders and staff" },
    ];

    return groups.map((group) => {
      const matchingActivities = activities.filter(
        (activity) => activity.schoolKey === group.key
      );

      const completed = matchingActivities.filter(
        (activity) => activity.completed
      ).length;

      return {
        ...group,
        total: matchingActivities.length,
        completed,
        remaining: matchingActivities.length - completed,
      };
    });
  }, [activities]);

  const schoolProgress = useMemo(() => {
    return schools.map((school) => {
      const schoolAssignments = assignments.filter(
        (item) => item.schoolId === school.id
      );

      const completed = schoolAssignments.filter(
        (item) => item.completed
      ).length;

      return {
        ...school,
        totalAssignments: schoolAssignments.length,
        completedAssignments: completed,
        remainingAssignments: schoolAssignments.length - completed,
        percentage: schoolAssignments.length
          ? Math.round((completed / schoolAssignments.length) * 100)
          : 0,
      };
    });
  }, [schools, assignments]);

  const dueDateSummary = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const datedActivities = activities.filter((activity) => activity.dueDate);

    const overdue = datedActivities.filter((activity) => {
      if (activity.completed) return false;
      const dueDate = new Date(`${activity.dueDate}T00:00:00`);
      return dueDate < today;
    }).length;

    const upcoming = datedActivities.filter((activity) => {
      if (activity.completed) return false;
      const dueDate = new Date(`${activity.dueDate}T00:00:00`);
      return dueDate >= today;
    }).length;

    return { dated: datedActivities.length, overdue, upcoming };
  }, [activities]);

  async function toggleActivity(id: string) {
    if (!planId) return;

    const activity = activities.find((item) => item.id === id);
    if (!activity) return;

    const nextCompleted = !activity.completed;
    const supabase = createClient();

    setSavedMessage("Saving activity status...");

    const { error } = await supabase
      .from("activities")
      .update({ completed: nextCompleted })
      .eq("id", id)
      .eq("plan_id", planId);

    if (error) {
      console.error("Could not update activity:", error);
      setSavedMessage(`Could not update activity: ${error.message}`);
      return;
    }

    setActivities((current) =>
      current.map((item) =>
        item.id === id ? { ...item, completed: nextCompleted } : item
      )
    );

    setSavedMessage("Activity status saved to Supabase.");
  }

  async function assignActivityToSchool(activityId: string) {
    const schoolId = assignmentSchoolByActivity[activityId];

    if (!schoolId) {
      setSavedMessage(
        "Choose a registered school before assigning this activity."
      );
      return;
    }

    if (
      assignments.some(
        (item) =>
          item.activityId === activityId && item.schoolId === schoolId
      )
    ) {
      setSavedMessage("This activity is already assigned to that school.");
      return;
    }

    setAssigningActivityId(activityId);
    setSavedMessage("Assigning activity to school...");

    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from("activity_assignments")
        .insert({ activity_id: activityId, school_id: schoolId })
        .select("id, activity_id, school_id, completed, completed_at")
        .single();

      if (error) throw error;

      setAssignments((current) => [
        ...current,
        {
          id: data.id,
          activityId: data.activity_id,
          schoolId: data.school_id,
          completed: data.completed,
          completedAt: data.completed_at,
        },
      ]);

      setAssignmentSchoolByActivity((current) => ({
        ...current,
        [activityId]: "",
      }));

      setSavedMessage("Activity assigned to the selected school.");
    } catch (error) {
      console.error("Could not assign activity to school:", error);

      setSavedMessage(
        error instanceof Error
          ? `Could not assign activity: ${error.message}`
          : "Could not assign activity to school."
      );
    } finally {
      setAssigningActivityId(null);
    }
  }

  async function toggleSchoolAssignment(assignment: Assignment) {
    const nextCompleted = !assignment.completed;
    const supabase = createClient();

    setSavedMessage("Saving school assignment status...");

    const { data, error } = await supabase
      .from("activity_assignments")
      .update({
        completed: nextCompleted,
        completed_at: nextCompleted ? new Date().toISOString() : null,
      })
      .eq("id", assignment.id)
      .select("id, activity_id, school_id, completed, completed_at")
      .single();

    if (error) {
      console.error("Could not update school assignment:", error);
      setSavedMessage(`Could not update school assignment: ${error.message}`);
      return;
    }

    setAssignments((current) =>
      current.map((item) =>
        item.id === data.id
          ? {
              id: data.id,
              activityId: data.activity_id,
              schoolId: data.school_id,
              completed: data.completed,
              completedAt: data.completed_at,
            }
          : item
      )
    );

    setSavedMessage("School assignment status saved.");
  }

  async function removeSchoolAssignment(assignment: Assignment) {
    const school = schools.find((item) => item.id === assignment.schoolId);

    const confirmed = window.confirm(
      `Remove this activity assignment from ${school?.name ?? "this school"}?`
    );

    if (!confirmed) return;

    const supabase = createClient();

    const { error } = await supabase
      .from("activity_assignments")
      .delete()
      .eq("id", assignment.id);

    if (error) {
      console.error("Could not remove school assignment:", error);
      setSavedMessage(`Could not remove assignment: ${error.message}`);
      return;
    }

    setAssignments((current) =>
      current.filter((item) => item.id !== assignment.id)
    );

    setSavedMessage("School assignment removed.");
  }

  async function addActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!planId) {
      setSavedMessage("Create a prevention plan before adding activities.");
      return;
    }

    const title = newTitle.trim();
    if (!title) return;

    setSaving(true);
    setSavedMessage("Saving new activity...");

    const supabase = createClient();
    const audience = audienceLabel(newSchoolKey);

    try {
      const { data, error } = await supabase
        .from("activities")
        .insert({
          plan_id: planId,
          title,
          description: newDescription.trim() || "No description added yet.",
          audience,
          completed: false,
          school_key: newSchoolKey,
          grade_range: newGradeRange,
          due_date: newDueDate || null,
        })
        .select(
          "id, title, description, audience, completed, school_key, grade_range, due_date"
        )
        .single();

      if (error) throw error;

      const activity: Activity = {
        id: data.id,
        title: data.title,
        description: data.description,
        audience: data.audience,
        completed: data.completed,
        schoolKey: data.school_key,
        gradeRange: data.grade_range,
        dueDate: data.due_date ?? "",
      };

      setActivities((current) => [...current, activity]);

      if (newAssignedSchoolId) {
        const { data: assignmentData, error: assignmentError } =
          await supabase
            .from("activity_assignments")
            .insert({
              activity_id: data.id,
              school_id: newAssignedSchoolId,
            })
            .select("id, activity_id, school_id, completed, completed_at")
            .single();

        if (assignmentError) {
          setSavedMessage(
            `Activity created, but school assignment failed: ${assignmentError.message}`
          );
        } else {
          setAssignments((current) => [
            ...current,
            {
              id: assignmentData.id,
              activityId: assignmentData.activity_id,
              schoolId: assignmentData.school_id,
              completed: assignmentData.completed,
              completedAt: assignmentData.completed_at,
            },
          ]);
        }
      }

      setNewTitle("");
      setNewDescription("");
      setNewSchoolKey("all");
      setNewGradeRange("K–12");
      setNewDueDate("");
      setNewAssignedSchoolId("");

      setSavedMessage((current) =>
        current.startsWith("Activity created, but school assignment failed:")
          ? current
          : "Activity created and saved to Supabase."
      );
    } catch (error) {
      console.error("Could not create activity:", error);

      setSavedMessage(
        error instanceof Error
          ? `Could not create activity: ${error.message}`
          : "Could not create activity."
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeActivity(id: string) {
    if (!planId) return;

    const confirmed = window.confirm(
      "Delete this activity permanently from the district plan?"
    );

    if (!confirmed) return;

    const supabase = createClient();
    setSavedMessage("Deleting activity...");

    const { error } = await supabase
      .from("activities")
      .delete()
      .eq("id", id)
      .eq("plan_id", planId);

    if (error) {
      console.error("Could not delete activity:", error);
      setSavedMessage(`Could not delete activity: ${error.message}`);
      return;
    }

    setActivities((current) =>
      current.filter((activity) => activity.id !== id)
    );

    setAssignments((current) =>
      current.filter((assignment) => assignment.activityId !== id)
    );

    setSavedMessage("Activity deleted from Supabase.");
  }

  async function savePlanField(field: PlanField, value: string) {
    if (!planId) return;

    const supabase = createClient();
    setSavedMessage("Saving prevention plan...");

    const { error } = await supabase
      .from("prevention_plans")
      .update({ [field]: value.trim() })
      .eq("id", planId);

    if (error) {
      console.error("Could not save prevention plan:", error);
      setSavedMessage(`Could not save plan: ${error.message}`);
      return;
    }

    setSavedMessage("Prevention plan saved to Supabase.");
  }

  function schoolLabel(schoolKey: string) {
    return audienceLabel(schoolKey);
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#302822]">
      <nav className="border-b border-[#e9e1d8] bg-white print:hidden">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#dce9dc] text-xl">
              ♡
            </span>
            <span className="text-xl font-bold">BeKind</span>
          </Link>

          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <Link href="/educators" className="hover:underline">
              Resource Center
            </Link>
            <Link href="/educators/dashboard" className="hover:underline">
              Educator Dashboard
            </Link>
            <Link href="/worksheets" className="hover:underline">
              Worksheets
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
        <div className="mb-8 rounded-2xl border border-[#d6e4d3] bg-[#f0f6ee] p-4">
          <p className="font-semibold text-[#426340]">
            {loaded ? "District database status" : "Connecting to Supabase"}
          </p>
          <p className="mt-1 text-sm leading-6 text-[#586c55]">
            {districtName
              ? `${districtName}. District plans and activities are loaded from authenticated Supabase records.`
              : "Checking your signed-in account and district permissions."}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#586c55]" aria-live="polite">
            {savedMessage}
          </p>
        </div>

        <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#668263]">
              District workspace
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              District dashboard
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-[#766c63]">
              Organize prevention activities, review available district
              records, and manage your prevention plan for the school year.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 print:hidden">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-xl border border-[#ded5ca] bg-white px-4 py-2.5 text-sm font-semibold hover:bg-[#f5f0e9]"
            >
              Print overview
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl border border-[#ded5ca] bg-white px-4 py-2.5 text-sm font-semibold hover:bg-[#f5f0e9]"
            >
              Refresh data
            </button>
          </div>
        </header>

        {/* Dashboard summary cards */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#e9e1d8] bg-white p-5">
            <p className="text-sm text-[#766c63]">Schools in district</p>
            <p className="mt-3 text-3xl font-bold">
              {loaded ? schools.length : "—"}
            </p>
            <p className="mt-1 text-xs text-[#766c63]">
              Registered school records
            </p>
          </div>

          <div className="rounded-2xl border border-[#e9e1d8] bg-white p-5">
            <p className="text-sm text-[#766c63]">Student enrollment</p>
            <p className="mt-3 text-2xl font-bold">Not recorded</p>
            <p className="mt-1 text-xs text-[#766c63]">
              Enrollment is not stored in the current schema.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e9e1d8] bg-white p-5">
            <p className="text-sm text-[#766c63]">
              School activity progress
            </p>
            <p className="mt-3 text-3xl font-bold">
              {loaded
                ? assignments.length > 0
                  ? `${Math.round(
                      (assignments.filter((assignment) => assignment.completed)
                        .length /
                        assignments.length) *
                        100
                    )}%`
                  : "0%"
                : "—"}
            </p>
            <p className="mt-1 text-xs text-[#766c63]">
              {loaded
                ? `${
                    assignments.filter((assignment) => assignment.completed)
                      .length
                  } of ${assignments.length} school assignments completed`
                : "Loading school activity progress..."}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e9e1d8] bg-white p-5">
            <p className="text-sm text-[#766c63]">Plan tasks completed</p>
            <p className="mt-3 text-3xl font-bold">
              {loaded ? `${planProgress}%` : "—"}
            </p>
            <p className="mt-1 text-xs text-[#766c63]">
              {loaded
                ? `${activitySummary.completed} of ${activitySummary.total} tasks completed`
                : "Loading plan activities"}
            </p>
          </div>
        </section>

        {/* District analytics */}
        <section className="mt-8" aria-labelledby="analytics-heading">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#668263]">
              District analytics
            </p>
            <h2 id="analytics-heading" className="mt-2 text-2xl font-bold">
              Prevention progress at a glance
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#766c63]">
              These metrics update from the activities loaded for the current
              prevention plan.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-2xl border border-[#e9e1d8] bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">Activity completion</h3>
                  <p className="mt-1 text-sm text-[#766c63]">
                    Completed tasks compared with outstanding tasks
                  </p>
                </div>
                <span className="rounded-full bg-[#edf2e9] px-3 py-1 text-sm font-semibold text-[#4e684b]">
                  {loaded ? `${planProgress}% complete` : "Loading"}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium">Completed</span>
                    <span className="text-[#766c63]">
                      {loaded
                        ? `${activitySummary.completed} of ${activitySummary.total}`
                        : "—"}
                    </span>
                  </div>
                  <div
                    className="h-3 overflow-hidden rounded-full bg-[#e9e5dc]"
                    role="progressbar"
                    aria-label="Completed activities"
                    aria-valuemin={0}
                    aria-valuemax={activitySummary.total || 1}
                    aria-valuenow={activitySummary.completed}
                  >
                    <div
                      className="h-full rounded-full bg-[#668263] transition-all"
                      style={{ width: `${planProgress}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium">Outstanding</span>
                    <span className="text-[#766c63]">
                      {loaded
                        ? `${activitySummary.remaining} of ${activitySummary.total}`
                        : "—"}
                    </span>
                  </div>
                  <div
                    className="h-3 overflow-hidden rounded-full bg-[#e9e5dc]"
                    role="progressbar"
                    aria-label="Outstanding activities"
                    aria-valuemin={0}
                    aria-valuemax={activitySummary.total || 1}
                    aria-valuenow={activitySummary.remaining}
                  >
                    <div
                      className="h-full rounded-full bg-[#d7a46b] transition-all"
                      style={{
                        width: `${
                          activities.length
                            ? (activitySummary.remaining / activities.length) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {activities.length === 0 && loaded && (
                <p className="mt-4 rounded-xl bg-[#f7f4ef] p-3 text-sm text-[#766c63]">
                  Add activities to begin tracking prevention-plan progress.
                </p>
              )}
            </article>

            <article className="rounded-2xl border border-[#e9e1d8] bg-white p-6 sm:p-8">
              <h3 className="text-lg font-bold">Activity audience</h3>
              <p className="mt-1 text-sm text-[#766c63]">
                Number of plan tasks assigned to each audience category
              </p>

              <div className="mt-5 space-y-4">
                {audienceSummary.map((group) => {
                  const percentage = group.total
                    ? Math.round((group.completed / group.total) * 100)
                    : 0;

                  return (
                    <div key={group.key}>
                      <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium">{group.label}</span>
                        <span className="shrink-0 text-[#766c63]">
                          {loaded
                            ? `${group.completed}/${group.total} complete`
                            : "—"}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#e9e5dc]">
                        <div
                          className="h-full rounded-full bg-[#668263] transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 text-xs leading-5 text-[#766c63]">
                Audience categories describe each activity's intended
                audience. They do not indicate that an individual school has
                been assigned or completed the task.
              </p>
            </article>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <article className="rounded-2xl border border-[#e9e1d8] bg-white p-5">
              <p className="text-sm text-[#766c63]">Activities with due dates</p>
              <p className="mt-2 text-3xl font-bold">
                {loaded ? dueDateSummary.dated : "—"}
              </p>
              <p className="mt-1 text-xs text-[#766c63]">
                Tasks with a saved deadline
              </p>
            </article>

            <article className="rounded-2xl border border-[#e9e1d8] bg-white p-5">
              <p className="text-sm text-[#766c63]">Upcoming outstanding</p>
              <p className="mt-2 text-3xl font-bold">
                {loaded ? dueDateSummary.upcoming : "—"}
              </p>
              <p className="mt-1 text-xs text-[#766c63]">
                Incomplete tasks due today or later
              </p>
            </article>

            <article className="rounded-2xl border border-[#e9e1d8] bg-white p-5">
              <p className="text-sm text-[#766c63]">Overdue outstanding</p>
              <p className="mt-2 text-3xl font-bold">
                {loaded ? dueDateSummary.overdue : "—"}
              </p>
              <p className="mt-1 text-xs text-[#766c63]">
                Incomplete tasks with past due dates
              </p>
            </article>
          </div>
        </section>

        {/* Prevention plan settings */}
        <section className="mt-8 rounded-2xl border border-[#e9e1d8] bg-white p-6 sm:p-8">
          <div className="grid gap-5 md:grid-cols-[1fr_220px]">
            <div>
              <label
                htmlFor="planName"
                className="text-sm font-semibold text-[#51483f]"
              >
                Prevention plan name
              </label>
              <input
                id="planName"
                value={planName}
                onChange={(event) => setPlanName(event.target.value)}
                onBlur={() => void savePlanField("name", planName)}
                disabled={!planId || !loaded}
                maxLength={150}
                className="mt-2 w-full rounded-xl border border-[#ded5ca] bg-[#fffdfa] px-4 py-3 outline-none focus:border-[#668263] disabled:bg-[#f7f4ef]"
                placeholder="Enter a plan name"
              />
            </div>

            <div>
              <label
                htmlFor="schoolYear"
                className="text-sm font-semibold text-[#51483f]"
              >
                School year
              </label>
              <input
                id="schoolYear"
                value={schoolYear}
                onChange={(event) => setSchoolYear(event.target.value)}
                onBlur={() => void savePlanField("school_year", schoolYear)}
                disabled={!planId || !loaded}
                maxLength={30}
                className="mt-2 w-full rounded-xl border border-[#ded5ca] bg-[#fffdfa] px-4 py-3 outline-none focus:border-[#668263] disabled:bg-[#f7f4ef]"
                placeholder="2026–2027"
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between gap-4 text-sm">
              <span className="font-semibold">Plan implementation</span>
              <span className="text-[#766c63]">
                {loaded ? `${planProgress}%` : "Loading"}
              </span>
            </div>
            <ProgressBar value={planProgress} />
          </div>

          {!planId && loaded && (
            <p className="mt-4 text-sm text-[#9a5148]">
              No prevention plan is available. Create a plan before adding
              activities.
            </p>
          )}
        </section>

        {/* School overview and registration form */}
        <section className="mt-10">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#668263]">
              School overview
            </p>
            <h2 className="mt-2 text-2xl font-bold">Schools and progress</h2>
            <p className="mt-2 text-sm leading-6 text-[#766c63]">
              Register schools in this district, then assign prevention
              activities and track each school's progress.
            </p>
          </div>

          <form
            onSubmit={addSchool}
            className="mb-6 rounded-2xl border border-[#e9e1d8] bg-white p-6 sm:p-8 print:hidden"
          >
            <h3 className="text-xl font-bold">Register a school</h3>

            <p className="mt-2 text-sm leading-6 text-[#766c63]">
              Add a school to this district so you can assign prevention
              activities and track its progress.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div>
                <label
                  htmlFor="newSchoolName"
                  className="text-sm font-semibold"
                >
                  School name
                </label>
                <input
                  id="newSchoolName"
                  value={newSchoolName}
                  onChange={(event) => setNewSchoolName(event.target.value)}
                  required
                  maxLength={150}
                  disabled={!loaded || schoolSaving}
                  placeholder="e.g. Northside Elementary"
                  className="mt-2 w-full rounded-xl border border-[#ded5ca] bg-white px-4 py-3 outline-none focus:border-[#668263] disabled:bg-[#f7f4ef]"
                />
              </div>

              <div>
                <label
                  htmlFor="newSchoolLevel"
                  className="text-sm font-semibold"
                >
                  School level
                </label>
                <select
                  id="newSchoolLevel"
                  value={newSchoolLevel}
                  onChange={(event) => {
                    const level = event.target.value;
                    setNewSchoolLevel(level);

                    if (level === "elementary") {
                      setNewSchoolGradeRange("K–5");
                    } else if (level === "middle") {
                      setNewSchoolGradeRange("6–8");
                    } else if (level === "high") {
                      setNewSchoolGradeRange("9–12");
                    } else {
                      setNewSchoolGradeRange("Other");
                    }
                  }}
                  disabled={!loaded || schoolSaving}
                  className="mt-2 w-full rounded-xl border border-[#ded5ca] bg-white px-4 py-3 outline-none focus:border-[#668263] disabled:bg-[#f7f4ef]"
                >
                  <option value="elementary">Elementary</option>
                  <option value="middle">Middle</option>
                  <option value="high">High</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="newSchoolGradeRange"
                  className="text-sm font-semibold"
                >
                  Grade range
                </label>
                <input
                  id="newSchoolGradeRange"
                  value={newSchoolGradeRange}
                  onChange={(event) =>
                    setNewSchoolGradeRange(event.target.value)
                  }
                  required
                  maxLength={30}
                  disabled={!loaded || schoolSaving}
                  placeholder="e.g. K–5"
                  className="mt-2 w-full rounded-xl border border-[#ded5ca] bg-white px-4 py-3 outline-none focus:border-[#668263] disabled:bg-[#f7f4ef]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!loaded || schoolSaving || !newSchoolName.trim()}
              className="mt-5 rounded-xl bg-[#668263] px-5 py-3 font-semibold text-white transition hover:bg-[#526c50] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {schoolSaving ? "Adding school..." : "+ Add school"}
            </button>
          </form>

          {!loaded ? (
            <p className="rounded-2xl border border-[#e9e1d8] bg-white p-6 text-sm text-[#766c63]">
              Loading school records...
            </p>
          ) : schools.length === 0 ? (
            <p className="rounded-2xl border border-[#e9e1d8] bg-white p-6 text-sm leading-6 text-[#766c63]">
              No schools are registered for this district yet. Use the form
              above to add the first school.
            </p>
          ) : (
            <div className="grid gap-5 lg:grid-cols-3">
              {schoolProgress.map((school) => (
                <article
                  key={school.id}
                  className="rounded-2xl border border-[#e9e1d8] bg-white p-6"
                >
                  <p className="text-sm font-medium text-[#668263]">
                    {school.level}
                  </p>
                  <h3 className="mt-2 text-xl font-bold">{school.name}</h3>

                  {school.gradeRange && (
                    <p className="mt-2 text-sm text-[#766c63]">
                      Grades: {school.gradeRange}
                    </p>
                  )}

                  <div className="mt-5 rounded-xl bg-[#f7f4ef] p-4">
                    {school.totalAssignments === 0 ? (
                      <>
                        <p className="text-sm font-semibold">
                          No activities assigned yet
                        </p>
                        <p className="mt-1 text-sm leading-6 text-[#766c63]">
                          Use an activity's school assignment controls below
                          to assign work to this school.
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold">
                            School activity progress
                          </p>
                          <span className="text-sm font-bold">
                            {school.percentage}%
                          </span>
                        </div>
                        <div className="mt-3">
                          <ProgressBar value={school.percentage} />
                        </div>
                        <p className="mt-2 text-sm text-[#766c63]">
                          {school.completedAssignments} of{" "}
                          {school.totalAssignments} assignments completed
                        </p>
                        <p className="mt-1 text-xs text-[#766c63]">
                          {school.remainingAssignments} remaining
                        </p>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Activities and plan builder */}
        <section className="mt-10 grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-[#e9e1d8] bg-white p-6 sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#668263]">
                Action plan
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                Prevention activities
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#766c63]">
                Check off tasks as they are completed. Changes are saved to
                the district database.
              </p>
            </div>

            {!loaded ? (
              <p className="rounded-xl bg-[#f7f4ef] p-5 text-sm text-[#766c63]">
                Loading activities...
              </p>
            ) : activities.length === 0 ? (
              <p className="rounded-xl bg-[#f7f4ef] p-5 text-sm text-[#766c63]">
                No activities are associated with the current prevention
                plan. Add a task using the form.
              </p>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => {
                  const activityAssignments = assignments.filter(
                    (item) => item.activityId === activity.id
                  );

                  return (
                    <article
                      key={activity.id}
                      className="rounded-xl border border-[#e9e1d8] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={activity.completed}
                          onChange={() => void toggleActivity(activity.id)}
                          disabled={!planId}
                          aria-label={`Mark ${activity.title} ${
                            activity.completed ? "incomplete" : "complete"
                          }`}
                          className="mt-1 h-4 w-4 accent-[#668263]"
                        />

                        <div className="min-w-0 flex-1">
                          <h3
                            className={`font-semibold ${
                              activity.completed
                                ? "text-[#766c63] line-through"
                                : ""
                            }`}
                          >
                            {activity.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-[#766c63]">
                            {activity.description}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full bg-[#edf2e9] px-3 py-1 text-[#4e684b]">
                              {schoolLabel(activity.schoolKey)}
                            </span>
                            <span className="rounded-full bg-[#f7f4ef] px-3 py-1 text-[#766c63]">
                              Grades: {activity.gradeRange}
                            </span>

                            {activity.dueDate && (
                              <span className="rounded-full bg-[#f7f4ef] px-3 py-1 text-[#766c63]">
                                Due: {activity.dueDate}
                              </span>
                            )}
                          </div>

                          <div className="mt-4 rounded-xl bg-[#f7f4ef] p-4">
                            <p className="text-sm font-semibold">
                              School assignments
                            </p>

                            {activityAssignments.length === 0 ? (
                              <p className="mt-1 text-sm text-[#766c63]">
                                Not assigned to an individual school yet.
                              </p>
                            ) : (
                              <div className="mt-3 space-y-2">
                                {activityAssignments.map((assignment) => {
                                  const assignedSchool = schools.find(
                                    (school) =>
                                      school.id === assignment.schoolId
                                  );

                                  return (
                                    <div
                                      key={assignment.id}
                                      className="flex flex-wrap items-center gap-2 rounded-lg border border-[#e4ddd3] bg-white p-3"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={assignment.completed}
                                        onChange={() =>
                                          void toggleSchoolAssignment(
                                            assignment
                                          )
                                        }
                                        aria-label={`Mark ${
                                          activity.title
                                        } at ${
                                          assignedSchool?.name ?? "school"
                                        } ${
                                          assignment.completed
                                            ? "incomplete"
                                            : "complete"
                                        }`}
                                        className="h-4 w-4 accent-[#668263]"
                                      />

                                      <span
                                        className={`flex-1 text-sm ${
                                          assignment.completed
                                            ? "text-[#766c63] line-through"
                                            : "font-medium"
                                        }`}
                                      >
                                        {assignedSchool?.name ??
                                          "Unknown school"}
                                      </span>

                                      <span className="text-xs text-[#766c63]">
                                        {assignment.completed
                                          ? "Completed"
                                          : "Outstanding"}
                                      </span>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          void removeSchoolAssignment(
                                            assignment
                                          )
                                        }
                                        className="text-xs font-semibold text-[#9a5148] hover:underline"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {schools.length > 0 && (
                              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                                <select
                                  value={
                                    assignmentSchoolByActivity[activity.id] ??
                                    ""
                                  }
                                  onChange={(event) =>
                                    setAssignmentSchoolByActivity(
                                      (current) => ({
                                        ...current,
                                        [activity.id]: event.target.value,
                                      })
                                    )
                                  }
                                  disabled={
                                    assigningActivityId === activity.id
                                  }
                                  aria-label={`Choose school for ${activity.title}`}
                                  className="min-w-0 flex-1 rounded-lg border border-[#ded5ca] bg-white px-3 py-2 text-sm outline-none focus:border-[#668263]"
                                >
                                  <option value="">
                                    Choose a registered school
                                  </option>
                                  {schools.map((school) => {
                                    const alreadyAssigned = assignments.some(
                                      (item) =>
                                        item.activityId === activity.id &&
                                        item.schoolId === school.id
                                    );

                                    return (
                                      <option
                                        key={school.id}
                                        value={school.id}
                                        disabled={alreadyAssigned}
                                      >
                                        {school.name}
                                        {alreadyAssigned
                                          ? " (already assigned)"
                                          : ""}
                                      </option>
                                    );
                                  })}
                                </select>

                                <button
                                  type="button"
                                  onClick={() =>
                                    void assignActivityToSchool(activity.id)
                                  }
                                  disabled={
                                    assigningActivityId === activity.id ||
                                    !(assignmentSchoolByActivity[
                                      activity.id
                                    ] ?? "")
                                  }
                                  className="rounded-lg bg-[#668263] px-4 py-2 text-sm font-semibold text-white hover:bg-[#526c50] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {assigningActivityId === activity.id
                                    ? "Assigning..."
                                    : "Assign to school"}
                                </button>
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => void removeActivity(activity.id)}
                            disabled={!planId}
                            className="mt-3 text-xs font-semibold text-[#9a5148] hover:underline disabled:opacity-50 print:hidden"
                          >
                            Remove task
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#e9e1d8] bg-white p-6 sm:p-8 print:hidden">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#668263]">
              Plan builder
            </p>
            <h2 className="mt-2 text-2xl font-bold">Add an activity</h2>
            <p className="mt-2 text-sm leading-6 text-[#766c63]">
              Create a prevention task and choose its school audience, grade
              range, and optional due date.
            </p>

            <form onSubmit={addActivity} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="activityTitle"
                  className="text-sm font-semibold"
                >
                  Activity title
                </label>
                <input
                  id="activityTitle"
                  value={newTitle}
                  onChange={(event) => setNewTitle(event.target.value)}
                  required
                  disabled={!planId || !loaded || saving}
                  maxLength={120}
                  placeholder="e.g. Hold a kindness week"
                  className="mt-2 w-full rounded-xl border border-[#ded5ca] px-4 py-3 outline-none focus:border-[#668263] disabled:bg-[#f7f4ef]"
                />
              </div>

              <div>
                <label
                  htmlFor="activityDescription"
                  className="text-sm font-semibold"
                >
                  Description
                </label>
                <textarea
                  id="activityDescription"
                  value={newDescription}
                  onChange={(event) => setNewDescription(event.target.value)}
                  rows={4}
                  disabled={!planId || !loaded || saving}
                  maxLength={1000}
                  placeholder="Describe the activity and its goal."
                  className="mt-2 w-full rounded-xl border border-[#ded5ca] px-4 py-3 outline-none focus:border-[#668263] disabled:bg-[#f7f4ef]"
                />
              </div>

              <div>
                <label
                  htmlFor="activitySchool"
                  className="text-sm font-semibold"
                >
                  School audience
                </label>
                <select
                  id="activitySchool"
                  value={newSchoolKey}
                  onChange={(event) => setNewSchoolKey(event.target.value)}
                  disabled={!planId || !loaded || saving}
                  className="mt-2 w-full rounded-xl border border-[#ded5ca] bg-white px-4 py-3 outline-none focus:border-[#668263] disabled:bg-[#f7f4ef]"
                >
                  <option value="all">All schools</option>
                  <option value="elementary">Elementary schools</option>
                  <option value="middle">Middle schools</option>
                  <option value="high">High schools</option>
                  <option value="staff">School leaders and staff</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="activityAssignedSchool"
                  className="text-sm font-semibold"
                >
                  Assign to a specific school (optional)
                </label>
                <select
                  id="activityAssignedSchool"
                  value={newAssignedSchoolId}
                  onChange={(event) =>
                    setNewAssignedSchoolId(event.target.value)
                  }
                  disabled={
                    !planId || !loaded || saving || schools.length === 0
                  }
                  className="mt-2 w-full rounded-xl border border-[#ded5ca] bg-white px-4 py-3 outline-none focus:border-[#668263] disabled:bg-[#f7f4ef]"
                >
                  <option value="">
                    Do not assign to an individual school
                  </option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs leading-5 text-[#766c63]">
                  The audience category above and the individual school
                  assignment are tracked separately.
                </p>
              </div>

              <div>
                <label
                  htmlFor="activityGrades"
                  className="text-sm font-semibold"
                >
                  Grade range or audience
                </label>
                <select
                  id="activityGrades"
                  value={newGradeRange}
                  onChange={(event) => setNewGradeRange(event.target.value)}
                  disabled={!planId || !loaded || saving}
                  className="mt-2 w-full rounded-xl border border-[#ded5ca] bg-white px-4 py-3 outline-none focus:border-[#668263] disabled:bg-[#f7f4ef]"
                >
                  <option value="K–12">K–12</option>
                  <option value="K–5">K–5</option>
                  <option value="6–8">6–8</option>
                  <option value="9–12">9–12</option>
                  <option value="K–8">K–8</option>
                  <option value="6–12">6–12</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="activityDueDate"
                  className="text-sm font-semibold"
                >
                  Due date (optional)
                </label>
                <input
                  id="activityDueDate"
                  type="date"
                  value={newDueDate}
                  onChange={(event) => setNewDueDate(event.target.value)}
                  disabled={!planId || !loaded || saving}
                  className="mt-2 w-full rounded-xl border border-[#ded5ca] bg-white px-4 py-3 outline-none focus:border-[#668263] disabled:bg-[#f7f4ef]"
                />
              </div>

              <button
                type="submit"
                disabled={!planId || !loaded || saving}
                className="w-full rounded-xl bg-[#668263] px-5 py-3 font-semibold text-white transition hover:bg-[#526c50] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Add activity"}
              </button>
            </form>
          </div>
        </section>

        <footer className="mt-12 border-t border-[#e9e1d8] pt-6 text-sm text-[#766c63]">
          <div className="flex flex-col justify-between gap-3 sm:flex-row">
            <p>BeKind · District prevention planning</p>
            <Link href="/" className="font-semibold hover:underline">
              Return to homepage
            </Link>
          </div>
          <p className="mt-3 text-xs leading-5">
            District plans and activities are loaded from Supabase. Student
            enrollment and school-level implementation metrics are not
            available until the corresponding data is recorded. Follow
            approved district safeguarding and reporting procedures.
          </p>
        </footer>
      </div>
    </main>
  );
}