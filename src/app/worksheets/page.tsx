
"use client";

import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";

type Worksheet = {
  id: string;
  title: string;
  category: string;
  grade: string;
  duration: string;
  description: string;
  icon: string;
  color: string;
  objective: string;
  instructions: string[];
  questions: string[];
  challenge: string;
};

type ClassroomTask = {
  id: number;
  title: string;
  category: string;
  date: string;
  completed: boolean;
};

const TASKS_KEY = "bekind-educator-tasks";
const UPDATE_EVENT = "bekind-educator-tasks-updated";

const worksheets: Worksheet[] = [
  {
    id: "bullying-awareness",
    title: "Understanding Bullying",
    category: "Bullying awareness",
    grade: "Grades 3–8",
    duration: "20 minutes",
    description:
      "Learn to recognize bullying, understand how it affects others, and identify safe ways to respond.",
    icon: "🛡️",
    color: "#e8eee3",
    objective:
      "Students will distinguish bullying from ordinary disagreements and identify ways to seek help.",
    instructions: [
      "Read each statement carefully.",
      "Think about whether the situation involves repeated harmful behavior or a disagreement.",
      "Write what the person experiencing the behavior might feel.",
      "Identify one safe action a student could take.",
      "Remember that telling a trusted adult is a way to help, not a way to get someone in trouble.",
    ],
    questions: [
      "What is one difference between bullying and an ordinary disagreement?",
      "How might someone feel if they are repeatedly excluded or targeted?",
      "Who is a trusted adult you could talk to at school?",
      "What could you do if you saw someone being bullied?",
    ],
    challenge:
      "Notice one opportunity this week to make someone feel included. Think about what changed when you acted kindly.",
  },
  {
    id: "kindness-challenges",
    title: "The Kindness Challenge",
    category: "Kindness challenges",
    grade: "Grades K–8",
    duration: "15 minutes",
    description:
      "Practice small, meaningful actions that help classmates feel welcome, valued, and included.",
    icon: "🌱",
    color: "#f7ead8",
    objective:
      "Students will identify practical ways to show kindness and build a more welcoming classroom.",
    instructions: [
      "Think about what makes you feel welcome in a classroom.",
      "Choose three kind actions from the list below or create your own.",
      "Write when and how you could put each action into practice.",
      "Choose one action to try today.",
      "Reflect on how your action might affect someone else.",
    ],
    questions: [
      "How can you welcome someone who is new to your class?",
      "What could you do if you notice someone sitting alone?",
      "How can you disagree with someone respectfully?",
      "Why does kindness matter even when nobody is watching?",
    ],
    challenge:
      "Complete three acts of kindness this week. Focus on genuine actions rather than receiving praise or rewards.",
  },
  {
    id: "reflection",
    title: "My Reflection Journal",
    category: "Reflection questions",
    grade: "Grades 3–8",
    duration: "15 minutes",
    description:
      "Use guided reflection to explore emotions, empathy, friendships, and ways to make things right.",
    icon: "📔",
    color: "#eee6f5",
    objective:
      "Students will reflect on their choices, consider other perspectives, and plan positive next steps.",
    instructions: [
      "Find a quiet moment to think about your answers.",
      "Write honestly without worrying about having a perfect answer.",
      "Consider how your actions can affect other people.",
      "If a question brings up a safety concern, consider discussing it privately with a trusted adult.",
    ],
    questions: [
      "When have you felt included by someone? What did they do?",
      "How can you tell when someone might need support?",
      "What could you do differently after hurting someone's feelings?",
      "Who helps you feel safe, respected, and understood?",
      "What is one thing you want to practice this week?",
    ],
    challenge:
      "At the end of the week, return to one answer and reflect on whether your thinking or actions have changed.",
  },
  {
    id: "cyberbullying-safety",
    title: "Think Before You Click",
    category: "Cyberbullying safety",
    grade: "Grades 4–9",
    duration: "20 minutes",
    description:
      "Explore safer responses to hurtful messages, group-chat exclusion, and online behavior.",
    icon: "💬",
    color: "#e2edf5",
    objective:
      "Students will practice safe digital choices and identify steps to take when online behavior becomes harmful.",
    instructions: [
      "Read each scenario and imagine how it might affect the people involved.",
      "Decide whether the message is respectful, unkind, or potentially harmful.",
      "Write one safe response that does not escalate the situation.",
      "Consider whether saving evidence, blocking, reporting, or seeking adult support may help.",
      "Never share passwords or personal information to prove yourself to someone.",
    ],
    questions: [
      "What should you do before forwarding an embarrassing picture?",
      "What could you do if a group chat repeatedly targets a classmate?",
      "Why might it be helpful to save evidence of harmful messages?",
      "When should you ask a trusted adult for help?",
    ],
    challenge:
      "Before posting or forwarding anything this week, pause and ask: Is it kind? Is it necessary? Could it harm someone?",
  },
  {
    id: "role-play",
    title: "Practice Being an Upstander",
    category: "Role-play scenarios",
    grade: "Grades 4–8",
    duration: "25 minutes",
    description:
      "Practice safe, supportive ways to respond when you see someone being mistreated.",
    icon: "🤝",
    color: "#f5e4e5",
    objective:
      "Students will rehearse safe ways to support others without putting themselves or anyone else at risk.",
    instructions: [
      "Choose one scenario and read it with a partner or small group.",
      "Discuss what the person experiencing the behavior might need.",
      "Practice a calm, safe response that does not increase the harm.",
      "Try another response, such as inviting the person away from the situation or asking an adult for help.",
      "After each role-play, discuss what felt helpful and what could be improved.",
    ],
    questions: [
      "What could you say if someone makes fun of a classmate?",
      "How could you help someone who is being left out?",
      "When might it be safer to get an adult instead of intervening directly?",
      "How can you check on someone privately after a difficult situation?",
    ],
    challenge:
      "Choose one safe upstander action to remember. You do not need to confront someone directly to help.",
  },
];

const categories = [
  "All worksheets",
  "Bullying awareness",
  "Kindness challenges",
  "Reflection questions",
  "Cyberbullying safety",
  "Role-play scenarios",
];

function downloadWorksheetPDF(worksheet: Worksheet) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  function ensureSpace(height: number) {
    if (y + height > pageHeight - 18) {
      pdf.addPage();
      y = 20;
    }
  }

  function addParagraph(text: string, fontSize = 11, gap = 7) {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, contentWidth);
    const height = lines.length * (fontSize * 0.48) + gap;

    ensureSpace(height);
    pdf.text(lines, margin, y);
    y += height;
  }

  function addHeading(text: string) {
    ensureSpace(14);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.text(text, margin, y);
    y += 8;
    pdf.setFont("helvetica", "normal");
  }

  pdf.setFillColor(232, 238, 227);
  pdf.rect(0, 0, pageWidth, 43, "F");

  pdf.setTextColor(48, 40, 34);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text("BeKind", margin, 18);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text("HELPING KINDNESS GROW", margin, 25);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(15);
  const titleLines = pdf.splitTextToSize(worksheet.title, contentWidth);
  pdf.text(titleLines, margin, 37);

  y = 55;
  pdf.setTextColor(48, 40, 34);

  pdf.setFontSize(10);
  pdf.text(`Grade range: ${worksheet.grade}`, margin, y);
  pdf.text(`Duration: ${worksheet.duration}`, pageWidth / 2, y);
  y += 10;

  pdf.setDrawColor(220, 213, 202);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 9;

  pdf.setFont("helvetica", "bold");
  pdf.text("Student:", margin, y);
  pdf.setFont("helvetica", "normal");
  pdf.line(margin + 20, y + 1, pageWidth / 2 - 5, y + 1);

  pdf.setFont("helvetica", "bold");
  pdf.text("Date:", pageWidth / 2 + 3, y);
  pdf.setFont("helvetica", "normal");
  pdf.line(pageWidth / 2 + 17, y + 1, pageWidth - margin, y + 1);
  y += 12;

  addHeading("Learning objective");
  addParagraph(worksheet.objective);

  addHeading("Instructions");
  worksheet.instructions.forEach((instruction, index) => {
    addParagraph(`${index + 1}. ${instruction}`, 10, 5);
  });

  addHeading("Reflection questions");
  worksheet.questions.forEach((question, index) => {
    addParagraph(`${index + 1}. ${question}`, 10, 2);
    ensureSpace(17);

    for (let line = 0; line < 2; line++) {
      pdf.setDrawColor(210, 205, 197);
      pdf.line(margin, y + 5, pageWidth - margin, y + 5);
      y += 8;
    }

    y += 3;
  });

  addHeading("Your kindness challenge");
  addParagraph(worksheet.challenge, 10, 8);

  ensureSpace(15);
  pdf.setFontSize(8);
  pdf.setTextColor(110, 100, 91);
  pdf.text(
    "BeKind | Be respectful. Include others. Ask for help when needed.",
    margin,
    pageHeight - 10
  );

  const safeName = worksheet.id.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  pdf.save(`bekind-${safeName}.pdf`);
}

function PrintWorksheet({
  worksheet,
  onClose,
}: {
  worksheet: Worksheet;
  onClose: () => void;
}) {
  const [planningMessage, setPlanningMessage] = useState("");
  const [alreadyAdded, setAlreadyAdded] = useState(false);

  function addToPlanningBoard() {
    try {
      const stored = localStorage.getItem(TASKS_KEY);
      const tasks: ClassroomTask[] = stored ? JSON.parse(stored) : [];

      const taskCategory = `Worksheet · ${worksheet.category}`;

      const existingTask = tasks.some(
        (task) =>
          task.title === worksheet.title &&
          task.category === taskCategory
      );

      if (existingTask) {
        setAlreadyAdded(true);
        setPlanningMessage(
          "This worksheet is already on your planning board."
        );
        return;
      }

      const newTask: ClassroomTask = {
        id: Date.now(),
        title: worksheet.title,
        category: taskCategory,
        date: "",
        completed: false,
      };

      localStorage.setItem(
        TASKS_KEY,
        JSON.stringify([...tasks, newTask])
      );

      window.dispatchEvent(new Event(UPDATE_EVENT));

      setAlreadyAdded(true);
      setPlanningMessage("Worksheet added to your planning board!");
    } catch {
      setPlanningMessage(
        "Could not save this worksheet. Please try again."
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#302822]/60 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="worksheet-preview-title"
    >
      <div className="mx-auto max-w-3xl rounded-3xl bg-[#faf8f5] shadow-2xl">
        <div className="no-print sticky top-0 z-10 flex items-center justify-between gap-4 rounded-t-3xl border-b border-[#e9e1d8] bg-white px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#688365]">
              Worksheet preview
            </p>
            <h2 className="mt-1 font-semibold text-[#302822]">
              {worksheet.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close worksheet preview"
            className="rounded-full border border-[#e9e1d8] px-4 py-2 text-sm font-semibold hover:bg-[#f7f5f0]"
          >
            Close ×
          </button>
        </div>

        <div id="bekind-print-area" className="p-6 sm:p-10">
          <div className="border-b border-[#d9dfd2] pb-6">
            <p className="text-sm font-bold tracking-wide text-[#688365]">
              ♡ BeKind
            </p>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#688365]">
              {worksheet.category}
            </p>

            <h1
              id="worksheet-preview-title"
              className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              {worksheet.title}
            </h1>

            <p className="mt-3 leading-7 text-[#71675e]">
              {worksheet.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2 text-sm text-[#71675e]">
              <span className="rounded-full bg-white px-3 py-1.5">
                {worksheet.grade}
              </span>
              <span className="rounded-full bg-white px-3 py-1.5">
                {worksheet.duration}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <span className="text-sm font-semibold">Student name</span>
                <div className="mt-3 border-b border-[#bfb6aa]" />
              </div>

              <div>
                <span className="text-sm font-semibold">Date</span>
                <div className="mt-3 border-b border-[#bfb6aa]" />
              </div>
            </div>
          </div>

          <section className="mt-7">
            <h3 className="text-lg font-semibold">Learning objective</h3>
            <p className="mt-2 leading-7 text-[#71675e]">
              {worksheet.objective}
            </p>
          </section>

          <section className="mt-7">
            <h3 className="text-lg font-semibold">Instructions</h3>

            <ol className="mt-3 space-y-3">
              {worksheet.instructions.map((instruction, index) => (
                <li key={instruction} className="flex gap-3 leading-7">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e8eee3] text-sm font-semibold text-[#536b51]">
                    {index + 1}
                  </span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-7">
            <h3 className="text-lg font-semibold">Reflection questions</h3>

            <div className="mt-3 space-y-6">
              {worksheet.questions.map((question, index) => (
                <div key={question}>
                  <p className="leading-7">
                    <span className="mr-2 font-semibold text-[#688365]">
                      {index + 1}.
                    </span>
                    {question}
                  </p>

                  <div className="mt-4 space-y-5">
                    <div className="border-b border-[#d9d1c6]" />
                    <div className="border-b border-[#d9d1c6]" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-[#d6dfd1] bg-[#e8eee3] p-5">
            <h3 className="font-semibold text-[#40553e]">
              Your kindness challenge
            </h3>

            <p className="mt-2 leading-7 text-[#536b51]">
              {worksheet.challenge}
            </p>
          </section>

          <p className="mt-8 text-center text-xs text-[#82776c]">
            BeKind · Be respectful. Include others. Ask for help when needed.
          </p>
        </div>

        <div className="no-print rounded-b-3xl border-t border-[#e9e1d8] bg-white p-5 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={addToPlanningBoard}
              disabled={alreadyAdded}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                alreadyAdded
                  ? "cursor-default bg-[#e8eee3] text-[#536b51]"
                  : "bg-[#536b51] text-white hover:bg-[#40553e]"
              }`}
            >
              {alreadyAdded
                ? "✓ On planning board"
                : "+ Add to planning board"}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full border border-[#d6cfc5] px-5 py-3 text-sm font-semibold hover:bg-[#f7f5f0]"
            >
              Print worksheet
            </button>

            <button
              type="button"
              onClick={() => downloadWorksheetPDF(worksheet)}
              className="rounded-full bg-[#302822] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4b3e34]"
            >
              Download PDF ↓
            </button>
          </div>

          {planningMessage && (
            <p role="status" className="mt-3 text-sm text-[#536b51]">
              {planningMessage}
            </p>
          )}

          {alreadyAdded && (
            <a
              href="/educators/dashboard"
              className="mt-3 inline-block text-sm font-semibold text-[#536b51] underline underline-offset-4"
            >
              View educator dashboard →
            </a>
          )}
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }

          #bekind-print-area,
          #bekind-print-area * {
            visibility: visible !important;
          }

          #bekind-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 20px !important;
            background: white !important;
          }

          @page {
            size: letter;
            margin: 0.5in;
          }
        }
      `}</style>
    </div>
  );
}

export default function WorksheetsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All worksheets");
  const [selectedWorksheet, setSelectedWorksheet] =
    useState<Worksheet | null>(null);

  const filteredWorksheets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return worksheets.filter((worksheet) => {
      const matchesCategory =
        category === "All worksheets" || worksheet.category === category;

      const searchableText = [
        worksheet.title,
        worksheet.category,
        worksheet.grade,
        worksheet.duration,
        worksheet.description,
        worksheet.objective,
        ...worksheet.instructions,
        ...worksheet.questions,
        worksheet.challenge,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#302822]">
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <header className="no-print border-b border-[#e9e1d8] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <a href="/" className="flex shrink-0 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#dce9dc] text-xl">
              ♡
            </span>
            <span className="text-xl font-bold">BeKind</span>
          </a>

          <nav className="flex flex-wrap items-center justify-end gap-4 text-sm font-medium">
            <a href="/" className="text-[#71675e] hover:text-[#302822]">
              Home
            </a>

            <a
              href="/stories"
              className="hidden text-[#71675e] hover:text-[#302822] sm:block"
            >
              Stories
            </a>

            <a
              href="/dashboard"
              className="hidden text-[#71675e] hover:text-[#302822] sm:block"
            >
              Student dashboard
            </a>

            <a
              href="/educators"
              className="hidden text-[#71675e] hover:text-[#302822] sm:block"
            >
              Educators
            </a>

            <a
              href="/educators/dashboard"
              className="rounded-full bg-[#302822] px-4 py-2.5 text-white hover:bg-[#4b3e34]"
            >
              Planning board
            </a>
          </nav>
        </div>
      </header>

      <section className="border-b border-[#e9e1d8] bg-gradient-to-br from-[#f0eee5] via-[#faf8f5] to-[#e3eee2]">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#688365]">
            BeKind educator toolkit
          </p>

          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Printable worksheets for{" "}
            <span className="font-serif italic text-[#688365]">
              kinder classrooms.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl leading-7 text-[#71675e]">
            Explore activities that help students recognize bullying, build
            empathy, practice digital safety, and become safe upstanders.
            Preview, print, download, or add a worksheet to your classroom plan.
          </p>

          <div className="no-print mt-7 flex flex-wrap gap-3">
            <a
              href="/educators/dashboard"
              className="rounded-full bg-[#536b51] px-5 py-3 text-sm font-semibold text-white hover:bg-[#40553e]"
            >
              Open planning board →
            </a>

            <a
              href="/educators"
              className="rounded-full border border-[#d6cfc5] bg-white/70 px-5 py-3 text-sm font-semibold hover:bg-white"
            >
              Educator resource center
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
        <div className="no-print rounded-3xl border border-[#e9e1d8] bg-white p-5 sm:p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_260px]">
            <label className="block text-sm font-semibold">
              Search worksheets
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Try kindness, group chats, empathy..."
                className="mt-2 w-full rounded-xl border border-[#e5ddd3] bg-[#faf8f5] px-4 py-3 font-normal outline-none transition focus:border-[#82927b]"
              />
            </label>

            <label className="block text-sm font-semibold">
              Filter by topic
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="mt-2 w-full rounded-xl border border-[#e5ddd3] bg-[#faf8f5] px-3 py-3 font-normal outline-none focus:border-[#82927b]"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[#82776c]">
            <p>
              {filteredWorksheets.length}{" "}
              {filteredWorksheets.length === 1 ? "worksheet" : "worksheets"}{" "}
              available
            </p>

            {(search || category !== "All worksheets") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All worksheets");
                }}
                className="font-semibold text-[#536b51] underline underline-offset-4"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {filteredWorksheets.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredWorksheets.map((worksheet) => (
              <article
                key={worksheet.id}
                className="flex flex-col rounded-3xl border border-[#e9e1d8] bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
                    style={{ backgroundColor: worksheet.color }}
                  >
                    {worksheet.icon}
                  </span>

                  <span className="rounded-full bg-[#f3efe8] px-3 py-1.5 text-xs font-medium text-[#71675e]">
                    {worksheet.duration}
                  </span>
                </div>

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.1em] text-[#688365]">
                  {worksheet.category}
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {worksheet.title}
                </h2>

                <p className="mt-3 flex-1 text-sm leading-6 text-[#71675e]">
                  {worksheet.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2 text-xs text-[#82776c]">
                  <span className="rounded-full bg-[#faf8f5] px-3 py-1.5">
                    {worksheet.grade}
                  </span>

                  <span className="rounded-full bg-[#faf8f5] px-3 py-1.5">
                    {worksheet.questions.length} questions
                  </span>
                </div>

                <div className="no-print mt-6 flex flex-wrap gap-2 border-t border-[#eee8df] pt-5">
                  <button
                    type="button"
                    onClick={() => setSelectedWorksheet(worksheet)}
                    className="rounded-full bg-[#302822] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4b3e34]"
                  >
                    Preview worksheet
                  </button>

                  <button
                    type="button"
                    onClick={() => downloadWorksheetPDF(worksheet)}
                    className="rounded-full border border-[#d6cfc5] px-4 py-2.5 text-sm font-semibold hover:bg-[#f7f5f0]"
                  >
                    Download PDF ↓
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-[#d6cfc5] bg-white p-10 text-center">
            <span className="text-3xl">🔎</span>

            <h2 className="mt-4 text-xl font-semibold">
              No worksheets found
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#71675e]">
              Try another search or choose a different topic.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All worksheets");
              }}
              className="no-print mt-5 rounded-full bg-[#536b51] px-5 py-3 text-sm font-semibold text-white hover:bg-[#40553e]"
            >
              Show all worksheets
            </button>
          </div>
        )}
      </section>

      <footer className="border-t border-[#e9e1d8] bg-white px-6 py-7">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-[#82776c] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-[#302822]">
            BeKind · Helping kindness grow.
          </p>
          <p>Printable worksheets · Educator toolkit</p>
        </div>
      </footer>

      {selectedWorksheet && (
        <PrintWorksheet
          worksheet={selectedWorksheet}
          onClose={() => setSelectedWorksheet(null)}
        />
      )}
    </main>
  );
}
