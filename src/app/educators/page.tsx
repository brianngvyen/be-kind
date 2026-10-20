
"use client";

import { useState } from "react";
import AddResourceToDashboardButton from "@/components/AddResourceToDashboardButton";

type Resource = {
  id: string;
  title: string;
  category: string;
  grade: string;
  duration: string;
  description: string;
  objective: string;
  materials: string[];
  steps: string[];
  questions: string[];
};

const resources: Resource[] = [
  {
    id: "recognize-bullying",
    title: "Understanding Bullying",
    category: "Lesson plans",
    grade: "Grades 3–8",
    duration: "30 minutes",
    description:
      "Help students recognize bullying, understand its impact, and distinguish it from ordinary disagreements.",
    objective:
      "Students will identify common forms of bullying and explain why repeated, harmful behavior needs attention.",
    materials: ["Board or projector", "Paper and pencils"],
    steps: [
      "Introduce the difference between conflict and bullying.",
      "Discuss examples of verbal, social, physical, and online bullying.",
      "Present a fictional scenario and ask students what they notice.",
      "Have students identify safe ways to seek help.",
    ],
    questions: [
      "How is bullying different from a disagreement?",
      "Why might someone find it difficult to ask for help?",
      "Which trusted adults can help at school?",
    ],
  },
  {
    id: "include-everyone",
    title: "The Inclusion Challenge",
    category: "Classroom activities",
    grade: "Grades K–8",
    duration: "20 minutes",
    description:
      "Give students practical ways to make classmates feel welcome and included.",
    objective:
      "Students will practice at least two ways to include others in classroom and social activities.",
    materials: ["Paper", "Pencils", "Optional sticky notes"],
    steps: [
      "Ask students what helps them feel welcome in a group.",
      "Invite the class to brainstorm small acts of inclusion.",
      "In pairs, students act out a fictional situation where someone is left out.",
      "Each student chooses one inclusive action to practice this week.",
    ],
    questions: [
      "What can you do when someone is left out?",
      "How can you invite someone without putting them on the spot?",
      "What does inclusion look like online?",
    ],
  },
  {
    id: "bystander-to-helper",
    title: "From Bystander to Helper",
    category: "Lesson plans",
    grade: "Grades 4–8",
    duration: "35 minutes",
    description:
      "Teach students safe ways to respond when they witness hurtful behavior.",
    objective:
      "Students will identify safe response options, including supporting the targeted student and involving a trusted adult.",
    materials: ["Scenario cards", "Board or projector"],
    steps: [
      "Explain that students are not responsible for confronting someone who may be unsafe.",
      "Read a fictional bullying scenario aloud.",
      "Ask small groups to consider safe ways to respond.",
      "Discuss how to report concerns and check in privately with a classmate.",
    ],
    questions: [
      "How could you help without escalating the situation?",
      "When should an adult step in?",
      "How could you check on someone afterward?",
    ],
  },
  {
    id: "digital-citizenship",
    title: "Kindness in the Group Chat",
    category: "Discussion guides",
    grade: "Grades 5–9",
    duration: "25 minutes",
    description:
      "Start a conversation about respectful online behavior, group chats, screenshots, and hurtful messages.",
    objective:
      "Students will identify safer digital choices and know what to do when online behavior becomes harmful.",
    materials: ["Fictional chat examples", "Discussion questions"],
    steps: [
      "Show a fictional group-chat example with identifying details removed.",
      "Ask students to identify which messages could cause harm.",
      "Discuss pausing before posting, saving relevant evidence, and seeking help.",
      "Create three class agreements for respectful online communication.",
    ],
    questions: [
      "Does a message stop being harmful because it is online?",
      "What should you do if a group chat targets someone?",
      "Who could help you report harmful online behavior?",
    ],
  },
  {
    id: "empathy-map",
    title: "Walk in Their Shoes",
    category: "Classroom activities",
    grade: "Grades 2–7",
    duration: "20 minutes",
    description:
      "Use fictional situations to explore how different people may feel and what supportive actions might help.",
    objective:
      "Students will practice considering another person's perspective without making assumptions about their feelings.",
    materials: ["Scenario sheets", "Paper and pencils"],
    steps: [
      "Read a short fictional scenario about a student being excluded.",
      "Ask students to consider what the people involved might be thinking or feeling.",
      "Brainstorm supportive responses without blaming the targeted student.",
      "Invite students to write one helpful thing they could say or do.",
    ],
    questions: [
      "How can we find out what someone needs instead of assuming?",
      "What words might help someone feel supported?",
      "How can we show empathy while still setting boundaries?",
    ],
  },
  {
    id: "classroom-agreement",
    title: "Our Kindness Agreement",
    category: "Printables",
    grade: "Grades K–8",
    duration: "15 minutes",
    description:
      "Create a shared classroom agreement focused on respect, inclusion, and getting help when someone is unsafe.",
    objective:
      "Students will contribute to clear, positive expectations for how classmates treat one another.",
    materials: ["Printed agreement sheet or blank paper", "Pens or markers"],
    steps: [
      "Ask students what a safe and welcoming classroom looks and sounds like.",
      "Turn their ideas into a short list of positive commitments.",
      "Include a commitment to seek adult help when someone is being harmed.",
      "Display the agreement and revisit it throughout the school year.",
    ],
    questions: [
      "What does respect look like during a disagreement?",
      "How should we respond when someone asks for help?",
      "How can we repair harm and improve our classroom?",
    ],
  },
];

const categories = [
  "All resources",
  "Lesson plans",
  "Classroom activities",
  "Discussion guides",
  "Printables",
];

export default function EducatorResourceCenter() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All resources");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const query = search.trim().toLowerCase();

  const filteredResources = resources.filter((resource) => {
    const matchesCategory =
      category === "All resources" || resource.category === category;

    const searchableText = [
      resource.title,
      resource.description,
      resource.category,
      resource.grade,
      resource.objective,
      ...resource.materials,
      ...resource.steps,
      ...resource.questions,
    ]
      .join(" ")
      .toLowerCase();

    return (
      matchesCategory &&
      (query.length === 0 || searchableText.includes(query))
    );
  });

  const featuredResource = resources[0];

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#302822]">
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          .educator-resource-card {
            break-inside: avoid;
            box-shadow: none !important;
            border: 1px solid #d6d3d1 !important;
          }

          main {
            background: white !important;
          }
        }
      `}</style>

      <nav className="no-print border-b border-[#e9e1d8] bg-white/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#dce9dc] text-xl">
              ♡
            </span>
            <span className="text-xl font-bold tracking-tight">BeKind</span>
          </a>

          <div className="flex items-center gap-3 text-sm font-medium sm:gap-5">
            <a
              href="/"
              className="hidden text-[#71675e] hover:text-[#302822] sm:block"
            >
              Student Home
            </a>

            <a
              href="/stories"
              className="hidden text-[#71675e] hover:text-[#302822] sm:block"
            >
              Stories
            </a>

            <a
              href="/worksheets"
              className="hidden text-[#536b51] hover:underline sm:block"
            >
              Worksheets
            </a>

            <a
              href="/educators/dashboard"
              className="hidden text-[#536b51] hover:underline sm:block"
            >
              Educator Dashboard
            </a>

            <a
              href="/dashboard"
              className="rounded-full bg-[#302822] px-4 py-2.5 text-white transition hover:bg-[#4b3e34] sm:px-5"
            >
              Student Dashboard
            </a>
          </div>
        </div>
      </nav>

      <section className="overflow-hidden border-b border-[#e9e1d8] bg-gradient-to-br from-[#f0eee5] via-[#faf8f5] to-[#e3eee2]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1.2fr_0.8fr] md:items-center md:py-24">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d6dfd1] bg-white/70 px-4 py-2 text-sm font-medium text-[#536b51]">
              <span>✳</span>
              BeKind for educators
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Build a classroom where{" "}
              <span className="font-serif italic text-[#688365]">
                everyone belongs.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#71675e]">
              Ready-to-use lesson plans, classroom activities, and discussion
              guides to help students practice empathy, recognize bullying, and
              build a culture of respect.
            </p>

            <div className="no-print mt-8 flex flex-wrap gap-3">
              <a
                href="#resources"
                className="rounded-full bg-[#302822] px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#4b3e34]"
              >
                Explore resources ↓
              </a>

              <a
                href="/worksheets"
                className="rounded-full border border-[#d6cfc5] bg-white px-6 py-3 font-semibold transition hover:bg-[#f3efe8]"
              >
                Printable worksheets →
              </a>

              <a
                href="/educators/dashboard"
                className="rounded-full border border-[#d6cfc5] bg-white px-6 py-3 font-semibold transition hover:bg-[#f3efe8]"
              >
                Educator Dashboard →
              </a>

              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-full border border-[#d6cfc5] bg-white px-6 py-3 font-semibold transition hover:bg-[#f3efe8]"
              >
                Print resource center
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-white/80 bg-white/75 p-7 shadow-xl shadow-[#554737]/5 sm:p-9">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#82927b]">
                    Your teaching toolkit
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    Small actions. Safer classrooms.
                  </h2>
                </div>
                <span className="text-3xl">🌱</span>
              </div>

              <div className="mt-7 space-y-3">
                {[
                  ["01", "Recognize bullying", "Learn the warning signs"],
                  ["02", "Practice inclusion", "Make room for everyone"],
                  ["03", "Respond safely", "Know when to get help"],
                ].map(([number, title, description]) => (
                  <div
                    key={number}
                    className="flex items-center gap-4 rounded-2xl bg-[#f7f5f0] p-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dce9dc] text-sm font-bold text-[#536b51]">
                      {number}
                    </span>
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="mt-0.5 text-sm text-[#82776c]">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-xs leading-5 text-[#82776c]">
                Designed as a starting point for educators. Adapt activities
                to your students&apos; ages, needs, and school policies.
              </p>
            </div>
            <div className="absolute -right-4 -top-5 -z-10 h-28 w-28 rounded-full bg-[#dce9dc]" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              value: resources.length.toString().padStart(2, "0"),
              label: "Starter resources",
              detail: "Ready to explore",
              icon: "📚",
            },
            {
              value: "4",
              label: "Resource types",
              detail: "Different teaching formats",
              icon: "🗂️",
            },
            {
              value: "K–9",
              label: "Grade coverage",
              detail: "Adapt to your classroom",
              icon: "🎒",
            },
            {
              value: "15–35",
              label: "Minutes per activity",
              detail: "Short classroom sessions",
              icon: "⏱️",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-[#e9e1d8] bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-2xl font-semibold">{stat.value}</span>
              </div>
              <p className="mt-4 font-semibold">{stat.label}</p>
              <p className="mt-1 text-sm text-[#82776c]">{stat.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-6 overflow-hidden rounded-[2rem] bg-[#e8eee3] p-7 sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#688365]">
              Featured lesson
            </p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
              {featuredResource.title}
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-[#5f6659]">
              {featuredResource.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-white/80 px-3 py-1.5">
                {featuredResource.grade}
              </span>
              <span className="rounded-full bg-white/80 px-3 py-1.5">
                {featuredResource.duration}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setCategory("All resources");
              setSearch("");
              setExpandedId(featuredResource.id);
              document.getElementById("resources")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="no-print whitespace-nowrap rounded-full bg-[#536b51] px-6 py-3 font-semibold text-white transition hover:bg-[#40553e]"
          >
            View lesson plan →
          </button>
        </div>
      </section>

      <section id="resources" className="scroll-mt-8 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#82927b]">
                The resource library
              </p>
              <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
                What does your classroom need?
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-[#82776c]">
                Search by topic or browse the collection. Open any resource for
                its learning objective, materials, activity steps, and
                discussion questions.
              </p>
            </div>
            <p className="text-sm text-[#82776c]">
              {filteredResources.length}{" "}
              {filteredResources.length === 1 ? "resource" : "resources"} found
            </p>
          </div>

          <div className="no-print mt-8 grid gap-4 md:grid-cols-[1fr_auto]">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">
                Search resources
              </span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Try bullying, empathy, group chats..."
                className="w-full rounded-2xl border border-[#e5ddd3] bg-[#faf8f5] px-5 py-3.5 outline-none transition placeholder:text-[#a49a8f] focus:border-[#82927b] focus:ring-2 focus:ring-[#dce9dc]"
              />
            </label>

            <label className="block md:min-w-64">
              <span className="mb-2 block text-sm font-semibold">
                Filter by type
              </span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-2xl border border-[#e5ddd3] bg-[#faf8f5] px-4 py-3.5 outline-none focus:border-[#82927b] focus:ring-2 focus:ring-[#dce9dc]"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {filteredResources.map((resource) => {
              const isExpanded = expandedId === resource.id;

              return (
                <article
                  key={resource.id}
                  className="educator-resource-card rounded-3xl border border-[#e9e1d8] bg-[#fffefd] p-6 transition hover:border-[#cbd9c6] hover:shadow-lg hover:shadow-[#554737]/5 sm:p-7"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#e8eee3] px-3 py-1 text-xs font-semibold text-[#536b51]">
                      {resource.category}
                    </span>
                    <span className="rounded-full bg-[#f3efe8] px-3 py-1 text-xs font-medium text-[#71675e]">
                      {resource.grade}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-semibold">
                    {resource.title}
                  </h3>
                  <p className="mt-3 leading-7 text-[#82776c]">
                    {resource.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm text-[#71675e]">
                    <span>◷</span>
                    <span>{resource.duration}</span>
                    <span className="mx-1">·</span>
                    <span>{resource.materials.length} materials</span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : resource.id)
                    }
                    aria-expanded={isExpanded}
                    className="no-print mt-6 flex w-full items-center justify-between rounded-2xl border border-[#e9e1d8] px-4 py-3 text-left font-semibold transition hover:bg-[#f7f5f0]"
                  >
                    <span>
                      {isExpanded ? "Close resource" : "Open resource"}
                    </span>
                    <span>{isExpanded ? "−" : "+"}</span>
                  </button>

                  {isExpanded && (
                    <div className="mt-6 border-t border-[#e9e1d8] pt-6">
                      <div>
                        <h4 className="font-semibold">Learning objective</h4>
                        <p className="mt-2 text-sm leading-6 text-[#71675e]">
                          {resource.objective}
                        </p>
                      </div>

                      <div className="mt-6">
                        <h4 className="font-semibold">Materials</h4>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[#71675e]">
                          {resource.materials.map((material) => (
                            <li key={material}>{material}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6">
                        <h4 className="font-semibold">Activity steps</h4>
                        <ol className="mt-3 space-y-3">
                          {resource.steps.map((step, index) => (
                            <li
                              key={step}
                              className="flex gap-3 text-sm leading-6 text-[#71675e]"
                            >
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e8eee3] text-xs font-bold text-[#536b51]">
                                {index + 1}
                              </span>
                              <span className="pt-0.5">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="mt-6 rounded-2xl bg-[#f7f5f0] p-5">
                        <h4 className="font-semibold">
                          Discussion questions
                        </h4>
                        <ul className="mt-3 space-y-3">
                          {resource.questions.map((question) => (
                            <li
                              key={question}
                              className="flex gap-2 text-sm leading-6 text-[#71675e]"
                            >
                              <span className="text-[#82927b]">✳</span>
                              <span>{question}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="no-print mt-5 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="rounded-full bg-[#302822] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4b3e34]"
                        >
                          Print this resource
                        </button>
                      </div>

                      <AddResourceToDashboardButton resource={resource} />
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {filteredResources.length === 0 && (
            <div className="mt-8 rounded-3xl border border-dashed border-[#d6cfc5] bg-[#faf8f5] px-6 py-14 text-center">
              <p className="text-3xl">🔎</p>
              <h3 className="mt-4 text-xl font-semibold">
                No matching resources
              </h3>
              <p className="mt-2 text-[#82776c]">
                Try a different search term or select another resource type.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All resources");
                }}
                className="no-print mt-5 rounded-full bg-[#302822] px-5 py-3 text-sm font-semibold text-white"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-[2rem] bg-[#302822] px-7 py-10 text-white sm:px-12 sm:py-14">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#c9d9c3]">
            A safer classroom starts with support
          </p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
            You don&apos;t have to handle bullying concerns alone.
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-[#e0d8cf]">
            Follow your school&apos;s safeguarding and reporting procedures.
            When a student may be in immediate danger, contact the appropriate
            emergency services. Adapt these educational materials to local
            requirements and student needs.
          </p>

          <div className="no-print mt-7 flex flex-wrap gap-3">
            <a
              href="https://www.stopbullying.gov/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white px-6 py-3 font-semibold text-[#302822] transition hover:bg-[#f0eee5]"
            >
              Visit StopBullying.gov ↗
            </a>
            <a
              href="/worksheets"
              className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Get printable worksheets →
            </a>
            <a
              href="/educators/dashboard"
              className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Open Educator Dashboard →
            </a>
            <a
              href="/"
              className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Return to BeKind
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e9e1d8] bg-white px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-[#82776c] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-[#302822]">
            BeKind <span className="font-normal">· Helping kindness grow.</span>
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="/worksheets"
              className="font-semibold text-[#536b51] hover:underline"
            >
              Printable worksheets →
            </a>
            <a
              href="/educators/dashboard"
              className="font-semibold text-[#536b51] hover:underline"
            >
              Educator Dashboard →
            </a>
            <a
              href="/dashboard"
              className="font-semibold text-[#536b51] hover:underline"
            >
              Student dashboard →
            </a>
          </div>

          <p>Educational resources · Adapt to your school&apos;s policies.</p>
        </div>
      </footer>
    </main>
  );
}

