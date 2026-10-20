
"use client";

import { useEffect, useState } from "react";
import { syncEarnedXP } from "@/lib/bekind-xp";

const LESSONS_KEY = "bekind-completed-lessons";
const MISSIONS_KEY = "bekind-completed-missions";
const STORIES_KEY = "bekind-completed-stories";

const lessons = [
  {
    id: "what-is-bullying",
    number: "01",
    icon: "📚",
    title: "Understand bullying",
    description:
      "Learn what bullying is, why it happens, and how to recognize the signs.",
    tag: "START LEARNING",
    color: "bg-emerald-50",
    href: "/learn/what-is-bullying",
  },
  {
    id: "cyberbullying",
    number: "02",
    icon: "💬",
    title: "Understand cyberbullying",
    description:
      "Recognize online harassment and learn how to respond safely.",
    tag: "DIGITAL SAFETY",
    color: "bg-violet-50",
    href: "/learn/cyberbullying",
  },
  {
    id: "help-a-friend",
    number: "03",
    icon: "🤝",
    title: "Be there for someone",
    description:
      "Discover safe, meaningful ways to support a friend who is struggling.",
    tag: "BUILD EMPATHY",
    color: "bg-amber-50",
    href: "/learn/help-a-friend",
  },
  {
    id: "if-it-happens",
    number: "04",
    icon: "🛡️",
    title: "If bullying happens to you",
    description:
      "Explore ways to seek support, protect yourself, and find help.",
    tag: "FIND SUPPORT",
    color: "bg-sky-50",
    href: "/learn/if-it-happens",
  },
];

const scenarios = [
  {
    situation:
      "You notice a classmate sitting alone while other students make fun of them.",
    options: [
      "Join in so you fit in.",
      "Check on them privately and offer support.",
      "Record it and post it online.",
    ],
    correct: 1,
    feedback:
      "Checking in privately can help someone feel less alone. If bullying continues or anyone may be unsafe, tell a trusted adult.",
  },
  {
    situation:
      "Someone shares an embarrassing picture of a student in a group chat.",
    options: [
      "Forward it to your friends.",
      "Ignore it and keep scrolling.",
      "Don't share it, support the student, and report the post.",
    ],
    correct: 2,
    feedback:
      "Don't spread the image. Keep relevant evidence when safe, use the platform's reporting tools, and involve a trusted adult.",
  },
  {
    situation:
      "A friend tells you that other students keep threatening them.",
    options: [
      "Listen, take them seriously, and get help from a trusted adult.",
      "Promise to keep it secret no matter what.",
      "Tell your friend to threaten them back.",
    ],
    correct: 0,
    feedback:
      "Listen without blaming your friend. Threats should be taken seriously. Tell a trusted adult, and seek immediate help if anyone is in danger.",
  },
];

const missions = [
  {
    id: "give-compliment",
    title: "Give a genuine compliment",
    description: "Recognize something positive about another person.",
    time: "2 MIN",
    icon: "💚",
  },
  {
    id: "include-someone",
    title: "Make room for someone",
    description: "Invite someone to join a conversation or activity.",
    time: "5 MIN",
    icon: "🫶",
  },
  {
    id: "learn-how-to-help",
    title: "Learn how to help",
    description: "Discover one safe way to respond to bullying.",
    time: "3 MIN",
    icon: "🛡️",
  },
];

const stories = [
  {
    id: "lunch-table",
    number: "01",
    title: "The Empty Seat",
    description:
      "Someone is being left out at lunch. What can you do to help them feel included?",
    icon: "🫶",
    color: "bg-emerald-50",
    tag: "INCLUSION",
  },
  {
    id: "group-chat",
    number: "02",
    title: "The Group Chat",
    description:
      "A cruel meme is spreading online. Explore safe ways to respond.",
    icon: "📱",
    color: "bg-violet-50",
    tag: "CYBERBULLYING",
  },
  {
    id: "hallway",
    number: "03",
    title: "The Hallway Incident",
    description:
      "A classmate is being mocked in the hallway. How could you help?",
    icon: "🏫",
    color: "bg-amber-50",
    tag: "BE AN UPSTANDER",
  },
];

function readStringArray(key: string): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) || "[]");

    if (Array.isArray(value)) {
      return value.filter(
        (item): item is string => typeof item === "string"
      );
    }
  } catch {
    // Start with empty progress if saved data is invalid.
  }

  return [];
}

export default function Home() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [completedStories, setCompletedStories] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const currentScenario = scenarios[scenarioIndex];

  useEffect(() => {
    const savedLessons = readStringArray(LESSONS_KEY);
    const savedMissions = readStringArray(MISSIONS_KEY);
    const savedStories = readStringArray(STORIES_KEY);

    const validLessons = lessons
      .filter(
        (lesson) =>
          savedLessons.includes(lesson.id) ||
          savedLessons.includes(lesson.href)
      )
      .map((lesson) => lesson.id);

    const validMissions = missions
      .filter((mission) => savedMissions.includes(mission.id))
      .map((mission) => mission.id);

    const validStories = stories
      .filter((story) => savedStories.includes(story.id))
      .map((story) => story.id);

    setCompletedLessons(validLessons);
    setCompletedMissions(validMissions);
    setCompletedStories(validStories);
    setIsLoaded(true);

    syncEarnedXP();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(MISSIONS_KEY, JSON.stringify(completedMissions));
    } catch {
      console.error("Unable to save BeKind kindness progress.");
    }
  }, [completedMissions, isLoaded]);

  function nextScenario() {
    setScenarioIndex((current) => (current + 1) % scenarios.length);
    setSelectedAnswer(null);
  }

  function toggleMission(missionId: string) {
    const updated = completedMissions.includes(missionId)
      ? completedMissions.filter((id) => id !== missionId)
      : [...completedMissions, missionId];

    try {
      localStorage.setItem(MISSIONS_KEY, JSON.stringify(updated));
      setCompletedMissions(updated);
      syncEarnedXP();
    } catch {
      console.error("Unable to save BeKind kindness progress.");
    }
  }

  const completedMissionCount = missions.filter((mission) =>
    completedMissions.includes(mission.id)
  ).length;

  const missionPercentage = Math.round(
    (completedMissionCount / missions.length) * 100
  );

  const completedLessonCount = lessons.filter((lesson) =>
    completedLessons.includes(lesson.id)
  ).length;

  const completedStoryCount = stories.filter((story) =>
    completedStories.includes(story.id)
  ).length;

  return (
    <main className="min-h-screen bg-[#FAFAF7] text-[#20352D]">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#E8EAE3] bg-[#FAFAF7]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#176B50] text-xl text-white">
              ♥
            </span>
            <span className="text-2xl font-extrabold tracking-tight">
              BeKind<span className="text-[#176B50]">.</span>
            </span>
          </a>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-5 text-sm font-medium text-[#65746C] lg:flex"
          >
            <a className="transition hover:text-[#176B50]" href="#learn">
              Learn
            </a>
            <a className="transition hover:text-[#176B50]" href="#stories">
              Stories
            </a>
            <a className="transition hover:text-[#176B50]" href="#practice">
              Practice
            </a>
            <a className="transition hover:text-[#176B50]" href="#missions">
              Kindness missions
            </a>
            <a className="transition hover:text-[#176B50]" href="#help">
              Get help
            </a>
            <a
              className="transition hover:text-[#176B50]"
              href="/educators"
            >
              Educators
            </a>
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <a
              href="/educators"
              className="rounded-full border border-[#DDE3DA] px-4 py-2.5 text-sm font-semibold text-[#176B50] transition hover:border-[#176B50] hover:bg-emerald-50"
            >
              For educators
            </a>
            <a
              href="/dashboard"
              className="rounded-full bg-[#176B50] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#10543E]"
            >
              My dashboard →
            </a>
          </div>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-lg border border-[#E0E5DD] px-3 py-2 text-xl sm:hidden"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col gap-1 border-t border-[#E8EAE3] px-5 py-3 sm:hidden"
          >
            {[
              ["Learn", "#learn"],
              ["BeKind Stories", "#stories"],
              ["Practice", "#practice"],
              ["Kindness missions", "#missions"],
              ["Get help", "#help"],
              ["Educators", "/educators"],
              ["Student dashboard", "/dashboard"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-xl px-3 py-3 font-medium hover:bg-emerald-50 ${
                  label === "Educators" ? "text-[#176B50]" : ""
                }`}
              >
                {label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#DCEFE3] opacity-70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-0 h-64 w-64 rounded-full bg-[#F3E9D8] opacity-60 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 md:grid-cols-2 md:py-28">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#D8E9DD] bg-white px-4 py-2 text-sm font-medium text-[#176B50] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#40A578]" />
              A little kindness goes a long way
            </div>

            <h1 className="max-w-xl text-5xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Make kindness
              <span className="block text-[#176B50]">your superpower.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-[#65746C]">
              School can be tough sometimes. BeKind helps you understand
              bullying, practice real-life situations, support others safely,
              and make every day a little better.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#learn"
                className="rounded-full bg-[#176B50] px-7 py-3.5 font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-[#10543E]"
              >
                Start learning →
              </a>
              <a
                href="/stories"
                className="rounded-full border border-[#DDE3DA] bg-white px-7 py-3.5 font-semibold transition hover:border-[#176B50]"
              >
                Play BeKind Stories
              </a>
            </div>

            <div className="mt-9 flex items-center gap-3 text-sm text-[#65746C]">
              <div className="flex -space-x-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#FAFAF7] bg-[#E6D9FA]">
                  🌱
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#FAFAF7] bg-[#F8E5C6]">
                  ☀️
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#FAFAF7] bg-[#D5EBDD]">
                  💚
                </span>
              </div>
              <span>Small actions. Real impact.</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -right-3 top-12 h-24 w-24 rounded-full bg-[#E4D9FA] sm:-right-6" />
            <div className="absolute -bottom-5 -left-3 h-20 w-20 rounded-full bg-[#F6E2B9] sm:-left-6" />

            <div className="relative rounded-[2rem] border border-white bg-white p-5 shadow-2xl shadow-[#294D3B]/10 sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#176B50]">
                    YOUR DAILY REMINDER
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">You belong here.</h2>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E5F3E9] text-2xl">
                  💚
                </span>
              </div>

              <div className="my-7 flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-[#EAF4EC]">
                <div className="text-center">
                  <div className="text-7xl">🌻</div>
                  <p className="mt-3 text-sm font-medium text-[#356B4E]">
                    Grow kindness, every day.
                  </p>
                </div>
              </div>

              <p className="text-sm leading-6 text-[#65746C]">
                You don't have to fix everything to make a difference. One
                supportive word or one brave, safe action can matter.
              </p>

              <a
                href="/dashboard"
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#E5F3E9] px-5 py-3.5 font-semibold text-[#176B50] transition hover:bg-[#D5EBDD]"
              >
                Visit your dashboard →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick progress */}
      <section className="border-y border-[#E5E9E0] bg-white py-6">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 sm:grid-cols-3 sm:px-8">
          <ProgressSummary
            icon="📚"
            label="Lessons completed"
            value={isLoaded ? `${completedLessonCount} / ${lessons.length}` : "—"}
          />
          <ProgressSummary
            icon="📖"
            label="Stories completed"
            value={isLoaded ? `${completedStoryCount} / ${stories.length}` : "—"}
          />
          <ProgressSummary
            icon="💚"
            label="Kindness missions"
            value={isLoaded ? `${completedMissionCount} / ${missions.length}` : "—"}
          />
        </div>
      </section>

      {/* Learn */}
      <section id="learn" className="scroll-mt-24 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#176B50]">
                Learn something meaningful
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Kindness starts with understanding.
              </h2>
            </div>
            <p className="max-w-md leading-7 text-[#65746C]">
              Build your confidence, recognize bullying, and learn how to make
              a difference without putting yourself at risk.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {lessons.map((lesson) => {
              const completed = completedLessons.includes(lesson.id);

              return (
                <article
                  key={lesson.id}
                  className="group flex flex-col rounded-3xl border border-[#EAEBE5] bg-white p-6 transition hover:-translate-y-1 hover:border-[#C6DFCF] hover:shadow-xl hover:shadow-[#294D3B]/5"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${lesson.color}`}
                    >
                      {lesson.icon}
                    </span>
                    <span className="text-sm font-bold text-[#A3ADA5]">
                      {lesson.number}
                    </span>
                  </div>

                  <p className="mt-7 text-xs font-bold tracking-wider text-[#176B50]">
                    {lesson.tag}
                  </p>
                  <h3 className="mt-2 text-xl font-bold">{lesson.title}</h3>
                  <p className="mt-3 flex-1 leading-7 text-[#65746C]">
                    {lesson.description}
                  </p>

                  {completed && (
                    <p className="mt-4 text-sm font-semibold text-[#176B50]">
                      ✓ Lesson completed
                    </p>
                  )}

                  <a
                    href={lesson.href}
                    className="mt-5 inline-flex items-center gap-2 font-semibold text-[#176B50] transition group-hover:gap-3"
                  >
                    {completed ? "Review lesson" : "Explore topic"} <span>→</span>
                  </a>
                </article>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <a
              href="/learn"
              className="inline-flex rounded-full border border-[#DDE3DA] bg-white px-6 py-3 font-semibold transition hover:border-[#176B50] hover:text-[#176B50]"
            >
              Explore all lessons →
            </a>
          </div>
        </div>
      </section>

      {/* BeKind Stories */}
      <section id="stories" className="scroll-mt-24 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-end gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#176B50]">
                Your choices matter
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Step into BeKind Stories.
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-[#65746C]">
                Explore realistic school situations, make choices, and discover
                safe ways to support people experiencing bullying or exclusion.
              </p>
            </div>
            <a
              href="/stories"
              className="inline-flex w-fit rounded-full bg-[#176B50] px-6 py-3 font-semibold text-white transition hover:bg-[#10543E]"
            >
              Explore all stories →
            </a>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {stories.map((story) => {
              const completed = completedStories.includes(story.id);

              return (
                <article
                  key={story.id}
                  className="group flex flex-col rounded-3xl border border-[#E5E9E0] bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#294D3B]/5"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${story.color}`}
                    >
                      {story.icon}
                    </span>
                    <span className="text-sm font-bold text-[#A3ADA5]">
                      {story.number}
                    </span>
                  </div>

                  <p className="mt-6 text-xs font-bold tracking-wider text-[#176B50]">
                    {story.tag}
                  </p>
                  <h3 className="mt-2 text-xl font-bold">{story.title}</h3>
                  <p className="mt-3 flex-1 leading-7 text-[#65746C]">
                    {story.description}
                  </p>

                  {completed && (
                    <p className="mt-4 text-sm font-semibold text-[#176B50]">
                      ✓ Completed
                    </p>
                  )}

                  <a
                    href="/stories"
                    className="mt-5 inline-flex items-center gap-2 font-semibold text-[#176B50] transition group-hover:gap-3"
                  >
                    {completed ? "Play again" : "Play this story"} <span>→</span>
                  </a>
                </article>
              );
            })}
          </div>

          <p className="mt-5 text-sm leading-6 text-[#65746C]">
            These cards open the story library. Choose a scenario there to
            begin or replay it.
          </p>
        </div>
      </section>

      {/* Quick scenario practice */}
      <section
        id="practice"
        className="scroll-mt-24 bg-[#F0F5EF] py-20 sm:py-24"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#176B50]">
              Practice makes progress
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              What would you do?
            </h2>
            <p className="mt-5 leading-8 text-[#65746C]">
              Real-life situations aren't always easy. Practice different
              responses in a quick, judgment-free quiz and discover ways to help.
            </p>
            <a
              href="/stories"
              className="mt-7 inline-flex rounded-full border border-[#DDE3DA] bg-white px-6 py-3 font-semibold text-[#176B50] transition hover:border-[#176B50]"
            >
              Try the full story simulator →
            </a>
            <div className="mt-7 flex items-center gap-3 text-sm font-medium text-[#65746C]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl">
                🎯
              </span>
              Learn at your own pace. No judgment.
            </div>
          </div>

          <div className="rounded-3xl border border-[#E4E9DF] bg-white p-6 shadow-xl shadow-[#294D3B]/5 sm:p-9">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-[#E5F3E9] px-3 py-1.5 text-xs font-bold text-[#176B50]">
                SCENARIO {scenarioIndex + 1} OF {scenarios.length}
              </span>
              <button
                type="button"
                onClick={() => {
                  setScenarioIndex(0);
                  setSelectedAnswer(null);
                }}
                className="text-sm font-semibold text-[#176B50] hover:underline"
              >
                Restart quiz
              </button>
            </div>

            <h3 className="mt-7 text-xl font-bold leading-8">
              {currentScenario.situation}
            </h3>
            <p className="mt-2 text-sm text-[#65746C]">
              Choose the response you think would help most.
            </p>

            <div className="mt-6 space-y-3">
              {currentScenario.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === currentScenario.correct;

                let optionStyle =
                  "border-[#E6EAE3] bg-white hover:border-[#9DC7AA] hover:bg-[#F8FBF8]";

                if (selectedAnswer !== null && isSelected && isCorrect) {
                  optionStyle = "border-emerald-500 bg-emerald-50";
                } else if (
                  selectedAnswer !== null &&
                  isSelected &&
                  !isCorrect
                ) {
                  optionStyle = "border-amber-400 bg-amber-50";
                } else if (selectedAnswer !== null && isCorrect) {
                  optionStyle = "border-emerald-300 bg-emerald-50";
                }

                return (
                  <button
                    key={option}
                    type="button"
                    disabled={selectedAnswer !== null}
                    onClick={() => setSelectedAnswer(index)}
                    aria-pressed={isSelected}
                    className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition disabled:cursor-default ${optionStyle}`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#DDE5DB] text-sm font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="pt-0.5 text-sm leading-6">{option}</span>
                  </button>
                );
              })}
            </div>

            {selectedAnswer !== null && (
              <div
                aria-live="polite"
                className="mt-5 rounded-2xl bg-[#F0F6F0] p-5"
              >
                <p className="font-bold text-[#176B50]">
                  {selectedAnswer === currentScenario.correct
                    ? "That's a thoughtful choice! 💚"
                    : "Let's think about a safer response. 🌱"}
                </p>
                <p className="mt-2 text-sm leading-7 text-[#52665A]">
                  {currentScenario.feedback}
                </p>
                <button
                  type="button"
                  onClick={nextScenario}
                  className="mt-4 rounded-full bg-[#176B50] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#10543E]"
                >
                  Try another scenario →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Kindness missions */}
      <section id="missions" className="scroll-mt-24 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#176B50]">
              Your daily dose of good
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Small acts. Big difference.
            </h2>
            <p className="mt-4 leading-7 text-[#65746C]">
              Kindness isn't about being perfect. It's about making thoughtful
              choices, one day at a time.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {missions.map((mission) => {
              const completed = completedMissions.includes(mission.id);

              return (
                <article
                  key={mission.id}
                  className={`rounded-3xl border p-6 transition ${
                    completed
                      ? "border-[#A9D3B7] bg-[#F0F8F1]"
                      : "border-[#EAEBE5] bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{mission.icon}</span>
                    <span className="rounded-full bg-[#F1F3ED] px-3 py-1.5 text-xs font-bold text-[#65746C]">
                      {mission.time}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold">{mission.title}</h3>
                  <p className="mt-3 min-h-14 leading-7 text-[#65746C]">
                    {mission.description}
                  </p>
                  <button
                    type="button"
                    disabled={!isLoaded}
                    onClick={() => toggleMission(mission.id)}
                    aria-pressed={completed}
                    className={`mt-5 w-full rounded-xl px-4 py-3 font-semibold transition disabled:opacity-50 ${
                      completed
                        ? "border border-[#B7D7BF] bg-white text-[#176B50]"
                        : "bg-[#E5F3E9] text-[#176B50] hover:bg-[#D5EBDD]"
                    }`}
                  >
                    {completed ? "✓ Completed — undo" : "Mark as completed"}
                  </button>
                </article>
              );
            })}
          </div>

          <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-[#E5E9E0] bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-bold">Your kindness progress</p>
                <p className="mt-1 text-sm text-[#65746C]">
                  {isLoaded ? completedMissionCount : "—"} of {missions.length}{" "}
                  missions completed
                </p>
              </div>
              <span className="text-2xl font-extrabold text-[#176B50]">
                {isLoaded ? missionPercentage : 0}%
              </span>
            </div>
            <div
              role="progressbar"
              aria-label="Kindness missions completed"
              aria-valuemin={0}
              aria-valuemax={missions.length}
              aria-valuenow={completedMissionCount}
              className="mt-4 h-3 overflow-hidden rounded-full bg-[#E8EDE6]"
            >
              <div
                className="h-full rounded-full bg-[#27845F] transition-all duration-300"
                style={{
                  width: `${isLoaded ? missionPercentage : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/dashboard"
              className="inline-flex rounded-full bg-[#176B50] px-6 py-3 font-semibold text-white transition hover:bg-[#10543E]"
            >
              Track your progress →
            </a>
          </div>
        </div>
      </section>

      {/* Help and safety */}
      <section
        id="help"
        className="scroll-mt-24 bg-[#203D32] py-20 text-white sm:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#A8DEC0]">
              You don't have to face it alone
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Everyone deserves to feel safe.
            </h2>
            <p className="mt-5 max-w-xl leading-8 text-[#D0DED5]">
              If bullying is happening to you or someone you know, you deserve
              support. You don't have to handle it alone or put yourself at risk
              to help.
            </p>
            <a
              href="/learn/if-it-happens"
              className="mt-7 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-[#203D32] transition hover:bg-[#E5F3E9]"
            >
              Learn how to get help →
            </a>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-bold">Talk to a trusted adult</h3>
              <p className="mt-2 text-sm leading-6 text-[#D0DED5]">
                A parent, teacher, school counselor, or another adult you trust
                can help you plan your next step.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-bold">If bullying happens online</h3>
              <p className="mt-2 text-sm leading-6 text-[#D0DED5]">
                Don't forward harmful content. Keep relevant evidence when safe,
                block or report the account, and tell a trusted adult.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-bold">Need more information?</h3>
              <p className="mt-2 text-sm leading-6 text-[#D0DED5]">
                Visit the official U.S. bullying prevention resource for
                information and guidance.
              </p>
              <a
                href="https://www.stopbullying.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex font-semibold text-[#A8DEC0] underline underline-offset-4 hover:text-white"
              >
                Explore StopBullying.gov ↗
              </a>
            </div>

            <p className="px-1 text-sm leading-6 text-[#D0DED5]">
              If someone is in immediate danger in the U.S., call 911.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E9E0] bg-[#FAFAF7]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
          <a href="/" className="text-xl font-extrabold">
            BeKind<span className="text-[#176B50]">.</span>
          </a>

          <div className="flex flex-wrap items-center gap-4 text-sm text-[#65746C]">
            <p>Be kind. Be brave. Be the difference.</p>
            <a
              href="/educators"
              className="font-semibold text-[#176B50] transition hover:underline"
            >
              Educator resources →
            </a>
          </div>

          <p className="text-xs text-[#8A968E]">
            A learning project built to make kindness matter.
          </p>
        </div>
      </footer>
    </main>
  );
}

function ProgressSummary({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-[#FAFAF7] p-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl">
        {icon}
      </span>
      <div>
        <p className="text-xl font-extrabold">{value}</p>
        <p className="mt-1 text-sm text-[#65746C]">{label}</p>
      </div>
    </div>
  );
}
