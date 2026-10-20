
"use client";

import { useEffect, useState } from "react";

type ClassroomTask = {
  id: number;
  title: string;
  category: string;
  date: string;
  completed: boolean;
};

const initialTasks: ClassroomTask[] = [
  {
    id: 1,
    title: "Teach students to recognize bullying",
    category: "Lesson plan",
    date: "",
    completed: false,
  },
  {
    id: 2,
    title: "Start a classroom kindness challenge",
    category: "Classroom activity",
    date: "",
    completed: false,
  },
  {
    id: 3,
    title: "Discuss online safety and group chats",
    category: "Discussion",
    date: "",
    completed: false,
  },
];

const starterAgreements = [
  "We treat others with respect.",
  "We include people who feel left out.",
  "We ask a trusted adult for help when someone is being hurt.",
  "We think before we post or share online.",
];

export default function EducatorDashboardPage() {
  const [tasks, setTasks] = useState<ClassroomTask[]>(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [newCategory, setNewCategory] = useState("Classroom activity");
  const [newDate, setNewDate] = useState("");
  const [agreementItems, setAgreementItems] =
    useState<string[]>(starterAgreements);
  const [newAgreement, setNewAgreement] = useState("");
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem("bekind-educator-tasks");
      const storedAgreements = localStorage.getItem(
        "bekind-classroom-agreements"
      );

      if (storedTasks) setTasks(JSON.parse(storedTasks));
      if (storedAgreements) setAgreementItems(JSON.parse(storedAgreements));
    } catch {
      // Keep the starter data if saved data cannot be read.
    }

    setReady(true);
  }, []);

  function saveTasks(nextTasks: ClassroomTask[]) {
    setTasks(nextTasks);
    localStorage.setItem("bekind-educator-tasks", JSON.stringify(nextTasks));
    setSaved(true);
  }

  function saveAgreements(nextItems: string[]) {
    setAgreementItems(nextItems);
    localStorage.setItem(
      "bekind-classroom-agreements",
      JSON.stringify(nextItems)
    );
    setSaved(true);
  }

  function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = newTask.trim();
    if (!title) return;

    const task: ClassroomTask = {
      id: Date.now(),
      title,
      category: newCategory,
      date: newDate,
      completed: false,
    };

    saveTasks([...tasks, task]);
    setNewTask("");
    setNewDate("");
  }

  function toggleTask(id: number) {
    saveTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function removeTask(id: number) {
    saveTasks(tasks.filter((task) => task.id !== id));
  }

  function addAgreement(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const item = newAgreement.trim();
    if (!item) return;

    saveAgreements([...agreementItems, item]);
    setNewAgreement("");
  }

  function removeAgreement(index: number) {
    saveAgreements(agreementItems.filter((_, i) => i !== index));
  }

  const completedCount = tasks.filter((task) => task.completed).length;
  const completionRate =
    tasks.length === 0
      ? 0
      : Math.round((completedCount / tasks.length) * 100);

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#302822]">
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }

          body,
          main {
            background: white !important;
          }

          .print-card {
            break-inside: avoid;
            box-shadow: none !important;
          }
        }
      `}</style>

      <header className="no-print border-b border-[#e9e1d8] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#dce9dc] text-xl">
              ♡
            </span>
            <span className="text-xl font-bold">BeKind</span>
          </a>

          <nav className="flex items-center gap-4 text-sm font-medium">
            <a
              href="/educators"
              className="hidden text-[#71675e] hover:text-[#302822] sm:block"
            >
              Resource Center
            </a>
            <a
              href="/worksheets"
              className="hidden text-[#71675e] hover:text-[#302822] sm:block"
            >
              Worksheets
            </a>
            <a
              href="/"
              className="rounded-full bg-[#302822] px-5 py-2.5 text-white hover:bg-[#4b3e34]"
            >
              Student Home
            </a>
          </nav>
        </div>
      </header>

      <section className="border-b border-[#e9e1d8] bg-gradient-to-br from-[#f0eee5] via-[#faf8f5] to-[#e3eee2]">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#688365]">
            BeKind for educators
          </p>

          <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Your classroom,{" "}
                <span className="font-serif italic text-[#688365]">
                  your impact.
                </span>
              </h1>
              <p className="mt-4 max-w-2xl leading-7 text-[#71675e]">
                Organize kindness activities, plan lessons, and build a
                classroom culture where every student feels welcome.
              </p>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="no-print w-fit rounded-full bg-[#302822] px-6 py-3 font-semibold text-white hover:bg-[#4b3e34]"
            >
              Print dashboard
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {saved && (
          <div
            role="status"
            className="mb-6 rounded-2xl border border-[#d6dfd1] bg-[#e8eee3] px-4 py-3 text-sm text-[#536b51]"
          >
            Your changes are saved in this browser.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Planned activities",
              value: tasks.length,
              icon: "📚",
            },
            {
              label: "Completed activities",
              value: completedCount,
              icon: "✓",
            },
            {
              label: "Still to do",
              value: tasks.length - completedCount,
              icon: "🌱",
            },
            {
              label: "Completion",
              value: `${completionRate}%`,
              icon: "✨",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="print-card rounded-3xl border border-[#e9e1d8] bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-3xl font-semibold">{stat.value}</span>
              </div>
              <p className="mt-4 text-sm text-[#71675e]">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="print-card rounded-3xl border border-[#e9e1d8] bg-white p-6 sm:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#82927b]">
                Planning board
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                Classroom activities
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#82776c]">
                Add activities, set dates, and check them off when completed.
              </p>
            </div>

            <form
              onSubmit={addTask}
              className="no-print mt-6 space-y-3 rounded-2xl bg-[#f7f5f0] p-4"
            >
              <label className="block text-sm font-semibold">
                Activity name
                <input
                  value={newTask}
                  onChange={(event) => setNewTask(event.target.value)}
                  placeholder="e.g. Practice including others"
                  className="mt-2 w-full rounded-xl border border-[#e5ddd3] bg-white px-4 py-3 font-normal outline-none focus:border-[#82927b]"
                  required
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-semibold">
                  Activity type
                  <select
                    value={newCategory}
                    onChange={(event) => setNewCategory(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#e5ddd3] bg-white px-3 py-3 font-normal outline-none focus:border-[#82927b]"
                  >
                    <option>Classroom activity</option>
                    <option>Lesson plan</option>
                    <option>Discussion</option>
                    <option>Kindness challenge</option>
                    <option>Reflection</option>
                  </select>
                </label>

                <label className="block text-sm font-semibold">
                  Planned date
                  <input
                    type="date"
                    value={newDate}
                    onChange={(event) => setNewDate(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#e5ddd3] bg-white px-3 py-3 font-normal outline-none focus:border-[#82927b]"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="rounded-full bg-[#536b51] px-5 py-3 text-sm font-semibold text-white hover:bg-[#40553e]"
              >
                + Add activity
              </button>
            </form>

            <div className="mt-6 space-y-3">
              {ready &&
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`rounded-2xl border p-4 ${
                      task.completed
                        ? "border-[#d6dfd1] bg-[#f4f7f1]"
                        : "border-[#e9e1d8] bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        aria-label={`Mark ${task.title} as ${
                          task.completed ? "incomplete" : "complete"
                        }`}
                        className="mt-1 h-5 w-5 accent-[#536b51]"
                      />

                      <div className="min-w-0 flex-1">
                        <p
                          className={`font-semibold ${
                            task.completed
                              ? "text-[#82776c] line-through"
                              : ""
                          }`}
                        >
                          {task.title}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#82776c]">
                          <span className="rounded-full bg-[#f3efe8] px-2.5 py-1">
                            {task.category}
                          </span>
                          {task.date && (
                            <span className="rounded-full bg-[#f3efe8] px-2.5 py-1">
                              {task.date}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeTask(task.id)}
                        aria-label={`Remove ${task.title}`}
                        className="no-print rounded-lg px-2 py-1 text-sm text-[#82776c] hover:bg-[#f3efe8] hover:text-[#302822]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

              {ready && tasks.length === 0 && (
                <div className="rounded-2xl border border-dashed border-[#d6cfc5] p-8 text-center">
                  <p className="font-semibold">Your planning board is clear.</p>
                  <p className="mt-2 text-sm text-[#82776c]">
                    Add an activity above to get started.
                  </p>
                </div>
              )}
            </div>
          </section>

          <div className="space-y-8">
            <section className="print-card rounded-3xl border border-[#e9e1d8] bg-white p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#82927b]">
                Classroom culture
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                Our kindness agreement
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#82776c]">
                Start with these commitments and customize them with your
                students.
              </p>

              <ul className="mt-5 space-y-3">
                {agreementItems.map((item, index) => (
                  <li key={`${item}-${index}`} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8eee3] text-sm text-[#536b51]">
                      ✓
                    </span>
                    <span className="flex-1 text-sm leading-6">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeAgreement(index)}
                      aria-label={`Remove agreement: ${item}`}
                      className="no-print px-1 text-xs text-[#82776c] hover:text-[#302822]"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>

              <form onSubmit={addAgreement} className="no-print mt-5 space-y-3">
                <label className="block text-sm font-semibold">
                  Add a class commitment
                  <input
                    value={newAgreement}
                    onChange={(event) => setNewAgreement(event.target.value)}
                    placeholder="We listen when others speak..."
                    className="mt-2 w-full rounded-xl border border-[#e5ddd3] px-4 py-3 font-normal outline-none focus:border-[#82927b]"
                  />
                </label>
                <button
                  type="submit"
                  className="rounded-full border border-[#d6cfc5] px-4 py-2.5 text-sm font-semibold hover:bg-[#f7f5f0]"
                >
                  + Add commitment
                </button>
              </form>

              <button
                type="button"
                onClick={() => window.print()}
                className="no-print mt-5 w-full rounded-full bg-[#e8eee3] px-4 py-3 text-sm font-semibold text-[#536b51] hover:bg-[#dce9dc]"
              >
                Print kindness agreement
              </button>
            </section>

            <section className="print-card rounded-3xl bg-[#302822] p-6 text-white sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#c9d9c3]">
                Keep learning
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                Your educator toolkit
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#e0d8cf]">
                Explore ready-to-use resources and printable activities for
                your classroom.
              </p>

              <div className="no-print mt-6 space-y-3">
                <a
                  href="/educators"
                  className="block rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-[#302822] hover:bg-[#f0eee5]"
                >
                  Browse educator resources →
                </a>
                <a
                  href="/worksheets"
                  className="block rounded-full border border-white/30 px-5 py-3 text-center text-sm font-semibold hover:bg-white/10"
                >
                  Open printable worksheets →
                </a>
              </div>
            </section>
          </div>
        </div>

        <p className="mt-8 text-center text-xs leading-5 text-[#82776c]">
          This prototype saves information in the current browser on this
          device. It does not yet provide teacher accounts or shared
          school-wide data. Avoid entering identifiable student information.
        </p>
      </section>

      <footer className="border-t border-[#e9e1d8] bg-white px-6 py-7">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-[#82776c] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-[#302822]">BeKind · Helping kindness grow.</p>
          <p>Educator Dashboard · Classroom planning prototype</p>
        </div>
      </footer>
    </main>
  );
}
