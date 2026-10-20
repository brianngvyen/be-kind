
"use client";

import { useEffect, useState } from "react";
import XpProgress from "@/components/XpProgress";
import { getXPInfo, syncEarnedXP } from "@/lib/bekind-xp";

const LESSONS_KEY = "bekind-completed-lessons";
const MISSIONS_KEY = "bekind-completed-missions";
const STORIES_KEY = "bekind-completed-stories";

const lessons = [
  {
    id: "what-is-bullying",
    title: "Understand bullying",
    description: "Recognize bullying and learn why it happens.",
    href: "/learn/what-is-bullying",
    icon: "📚",
    color: "bg-emerald-50",
  },
  {
    id: "cyberbullying",
    title: "Understand cyberbullying",
    description: "Learn how to stay safer online.",
    href: "/learn/cyberbullying",
    icon: "💬",
    color: "bg-violet-50",
  },
  {
    id: "help-a-friend",
    title: "Be there for someone",
    description: "Find safe ways to support a friend.",
    href: "/learn/help-a-friend",
    icon: "🤝",
    color: "bg-amber-50",
  },
  {
    id: "if-it-happens",
    title: "If bullying happens to you",
    description: "Discover how to seek support and get help.",
    href: "/learn/if-it-happens",
    icon: "🛡️",
    color: "bg-sky-50",
  },
];

const stories = [
  {
    id: "lunch-table",
    title: "The Empty Seat",
    description: "Help someone who is being left out.",
    icon: "🫶",
  },
  {
    id: "group-chat",
    title: "The Group Chat",
    description: "Respond to cyberbullying thoughtfully.",
    icon: "📱",
  },
  {
    id: "hallway",
    title: "The Hallway Incident",
    description: "Explore how to respond to bullying.",
    icon: "🏫",
  },
];

const missions = [
  {
    id: "give-compliment",
    title: "Give a genuine compliment",
    description: "Recognize something positive about someone.",
    icon: "💚",
  },
  {
    id: "include-someone",
    title: "Make room for someone",
    description: "Invite someone to join an activity.",
    icon: "🫶",
  },
  {
    id: "learn-how-to-help",
    title: "Learn how to help",
    description: "Practice a safe response to bullying.",
    icon: "🛡️",
  },
];

function readProgress(key: string): string[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(key) || "[]");

    if (Array.isArray(saved)) {
      return saved.filter(
        (item): item is string => typeof item === "string"
      );
    }
  } catch {
    // Invalid saved data starts as empty progress.
  }

  return [];
}

function ProgressBar({
  value,
  color = "bg-[#27845F]",
}: {
  value: number;
  color?: string;
}) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div
      role="progressbar"
      aria-label="Learning progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeValue}
      className="h-2.5 overflow-hidden rounded-full bg-[#E8EDE6]"
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

export default function DashboardPage() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [completedStories, setCompletedStories] = useState<string[]>([]);
  const [xpInfo, setXpInfo] = useState<ReturnType<typeof getXPInfo> | null>(
    null
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    function refreshXP() {
      setXpInfo(getXPInfo());
    }

    const savedLessons = readProgress(LESSONS_KEY);
    const savedMissions = readProgress(MISSIONS_KEY);
    const savedStories = readProgress(STORIES_KEY);

    setCompletedLessons(
      lessons
        .filter(
          (lesson) =>
            savedLessons.includes(lesson.id) ||
            savedLessons.includes(lesson.href)
        )
        .map((lesson) => lesson.id)
    );

    setCompletedMissions(
      missions
        .filter((mission) => savedMissions.includes(mission.id))
        .map((mission) => mission.id)
    );

    setCompletedStories(
      stories
        .filter((story) => savedStories.includes(story.id))
        .map((story) => story.id)
    );

    // Synchronize existing completions with the XP ledger.
    syncEarnedXP();
    refreshXP();

    window.addEventListener("bekind-xp-updated", refreshXP);
    window.addEventListener("storage", refreshXP);

    setIsLoaded(true);

    return () => {
      window.removeEventListener("bekind-xp-updated", refreshXP);
      window.removeEventListener("storage", refreshXP);
    };
  }, []);

  function toggleMission(missionId: string) {
    const updated = completedMissions.includes(missionId)
      ? completedMissions.filter((id) => id !== missionId)
      : [...completedMissions, missionId];

    setCompletedMissions(updated);

    try {
      localStorage.setItem(MISSIONS_KEY, JSON.stringify(updated));

      // Only newly earned activities receive XP.
      syncEarnedXP();
      setXpInfo(getXPInfo());
    } catch {
      console.error("Unable to save mission progress.");
    }
  }

  const lessonCount = completedLessons.length;
  const storyCount = completedStories.length;
  const missionCount = completedMissions.length;

  const totalActivities =
    lessons.length + stories.length + missions.length;

  const completedActivities =
    lessonCount + storyCount + missionCount;

  const overallProgress = Math.round(
    (completedActivities / totalActivities) * 100
  );

  const nextLesson = lessons.find(
    (lesson) => !completedLessons.includes(lesson.id)
  );

  const nextStory = stories.find(
    (story) => !completedStories.includes(story.id)
  );

  const allLessonsComplete = lessonCount === lessons.length;
  const allStoriesComplete = storyCount === stories.length;
  const allMissionsComplete = missionCount === missions.length;

  const achievements = [
    {
      title: "First Steps",
      description: "Complete your first lesson.",
      icon: "🌱",
      unlocked: lessonCount >= 1,
    },
    {
      title: "Knowledge Builder",
      description: "Complete all four lessons.",
      icon: "📚",
      unlocked: allLessonsComplete,
    },
    {
      title: "Story Explorer",
      description: "Complete all three stories.",
      icon: "🧭",
      unlocked: allStoriesComplete,
    },
    {
      title: "Empathy in Action",
      description: "Complete all three kindness missions.",
      icon: "💚",
      unlocked: allMissionsComplete,
    },
    {
      title: "Kindness Champion",
      description: "Reach level 5 in your BeKind journey.",
      icon: "🏆",
      unlocked: xpInfo?.level === 5,
    },
  ];

  const unlockedAchievements = achievements.filter(
    (achievement) => achievement.unlocked
  ).length;

  return (
    <main className="min-h-screen bg-[#FAFAF7] text-[#20352D]">
      {/* Navigation */}
      <header className="border-b border-[#E5E9E0] bg-white">
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
            aria-label="Dashboard navigation"
            className="flex items-center gap-3 sm:gap-6"
          >
            <a
              href="/learn"
              className="hidden text-sm font-semibold text-[#65746C] transition hover:text-[#176B50] sm:inline"
            >
              Learn
            </a>
            <a
              href="/stories"
              className="hidden text-sm font-semibold text-[#65746C] transition hover:text-[#176B50] sm:inline"
            >
              Stories
            </a>
            <a
              href="/"
              className="rounded-full bg-[#176B50] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#10543E]"
            >
              Home →
            </a>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Welcome */}
        <section className="relative overflow-hidden rounded-[2rem] bg-[#203D32] p-7 text-white sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#4D8E69]/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 right-1/4 h-64 w-64 rounded-full bg-[#A8DEC0]/10 blur-3xl" />

          <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold tracking-wide text-[#C4E9D0]">
                <span>✦</span>
                YOUR PERSONAL LEARNING SPACE
              </div>

              <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-5xl">
                Every step counts.
              </h1>

              <p className="mt-4 max-w-xl leading-7 text-[#D0DED5]">
                Welcome to your BeKind dashboard. Keep learning, practice
                thoughtful choices, and celebrate the progress you make along
                the way.
              </p>

              <a
                href={
                  nextLesson
                    ? nextLesson.href
                    : !allStoriesComplete
                      ? "/stories"
                      : "/learn"
                }
                className="mt-7 inline-flex rounded-full bg-white px-6 py-3.5 font-bold text-[#203D32] transition hover:-translate-y-0.5 hover:bg-[#E5F3E9]"
              >
                {nextLesson
                  ? "Continue learning →"
                  : !allStoriesComplete
                    ? "Explore a story →"
                    : "Review your lessons →"}
              </a>
            </div>

            <div className="mx-auto flex h-40 w-40 flex-col items-center justify-center rounded-full border border-white/15 bg-white/10 text-center sm:h-48 sm:w-48">
              <span className="text-5xl">🌱</span>
              <span className="mt-2 text-3xl font-extrabold">
                {isLoaded ? `${overallProgress}%` : "—"}
              </span>
              <span className="mt-1 text-xs font-medium text-[#D0DED5]">
                OVERALL PROGRESS
              </span>
            </div>
          </div>
        </section>

        {/* XP and leveling */}
        <section className="mt-7">
          <XpProgress />
        </section>

        {/* Progress statistics */}
        <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon="📚"
            label="Lessons"
            value={isLoaded ? `${lessonCount}/${lessons.length}` : "—"}
            detail="Learning progress"
          />
          <StatCard
            icon="📖"
            label="Stories"
            value={isLoaded ? `${storyCount}/${stories.length}` : "—"}
            detail="Scenarios explored"
          />
          <StatCard
            icon="💚"
            label="Kindness missions"
            value={isLoaded ? `${missionCount}/${missions.length}` : "—"}
            detail="Positive actions"
          />
          <StatCard
            icon="🏆"
            label="Achievements"
            value={
              isLoaded
                ? `${unlockedAchievements}/${achievements.length}`
                : "—"
            }
            detail="Milestones unlocked"
          />
        </section>

        {/* Learning overview */}
        <section className="mt-12 grid gap-7 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-[#E5E9E0] bg-white p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-[#176B50]">
                  Your learning journey
                </p>
                <h2 className="mt-2 text-2xl font-extrabold">
                  Keep your momentum.
                </h2>
              </div>
              <span className="text-3xl">🎯</span>
            </div>

            <p className="mt-3 text-sm leading-6 text-[#65746C]">
              Every lesson gives you more tools to recognize bullying and
              support others safely.
            </p>

            <div className="mt-7 space-y-6">
              <LearningProgress
                icon="📚"
                title="Lessons"
                count={lessonCount}
                total={lessons.length}
                color="bg-[#27845F]"
              />
              <LearningProgress
                icon="📖"
                title="Interactive stories"
                count={storyCount}
                total={stories.length}
                color="bg-violet-500"
              />
              <LearningProgress
                icon="💚"
                title="Kindness missions"
                count={missionCount}
                total={missions.length}
                color="bg-amber-500"
              />
            </div>

            {isLoaded && overallProgress === 100 && (
              <div className="mt-7 rounded-2xl bg-[#E5F3E9] p-4">
                <p className="font-bold text-[#176B50]">
                  Amazing work! You've completed every activity. 🎉
                </p>
                <p className="mt-1 text-sm leading-6 text-[#52665A]">
                  Keep practicing kindness and revisit activities whenever you
                  want.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-[#E5E9E0] bg-white p-6 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-wider text-[#176B50]">
              Your next step
            </p>
            <h2 className="mt-2 text-2xl font-extrabold">
              One thing at a time.
            </h2>

            <div className="mt-6 rounded-2xl bg-[#F4F7F1] p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl">
                {nextLesson ? nextLesson.icon : nextStory ? "📖" : "🌻"}
              </div>

              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#176B50]">
                RECOMMENDED FOR YOU
              </p>

              <h3 className="mt-2 text-xl font-bold">
                {nextLesson
                  ? nextLesson.title
                  : nextStory
                    ? nextStory.title
                    : "Keep spreading kindness"}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#65746C]">
                {nextLesson
                  ? nextLesson.description
                  : nextStory
                    ? nextStory.description
                    : "Revisit a lesson or story and put what you've learned into practice."}
              </p>

              <a
                href={
                  nextLesson
                    ? nextLesson.href
                    : nextStory
                      ? "/stories"
                      : "/"
                }
                className="mt-5 inline-flex rounded-full bg-[#176B50] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#10543E]"
              >
                {nextLesson
                  ? "Start lesson →"
                  : nextStory
                    ? "Explore stories →"
                    : "Back to BeKind →"}
              </a>
            </div>

            <a
              href="/learn"
              className="mt-5 inline-flex font-semibold text-[#176B50] hover:underline"
            >
              Browse all lessons →
            </a>
          </div>
        </section>

        {/* Lessons */}
        <section className="mt-14">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-[#176B50]">
                Learn at your own pace
              </p>
              <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                Your lessons
              </h2>
            </div>
            <a
              href="/learn"
              className="font-semibold text-[#176B50] hover:underline"
            >
              View lesson library →
            </a>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {lessons.map((lesson) => {
              const completed = completedLessons.includes(lesson.id);

              return (
                <article
                  key={lesson.id}
                  className="flex flex-col rounded-2xl border border-[#E5E9E0] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#294D3B]/5"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${lesson.color}`}
                    >
                      {lesson.icon}
                    </span>
                    {completed && (
                      <span className="text-sm font-bold text-[#176B50]">
                        ✓ Done
                      </span>
                    )}
                  </div>

                  <h3 className="mt-5 font-bold">{lesson.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-[#65746C]">
                    {lesson.description}
                  </p>

                  <a
                    href={lesson.href}
                    className="mt-5 font-semibold text-[#176B50] hover:underline"
                  >
                    {completed ? "Review lesson →" : "Start lesson →"}
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        {/* Stories */}
        <section className="mt-14">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-[#176B50]">
                Learn by making choices
              </p>
              <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                BeKind Stories
              </h2>
            </div>
            <a
              href="/stories"
              className="font-semibold text-[#176B50] hover:underline"
            >
              Open story library →
            </a>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {stories.map((story) => {
              const completed = completedStories.includes(story.id);

              return (
                <article
                  key={story.id}
                  className="rounded-2xl border border-[#E5E9E0] bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-3xl">{story.icon}</span>
                    {completed && (
                      <span className="rounded-full bg-[#E5F3E9] px-3 py-1 text-xs font-bold text-[#176B50]">
                        Completed
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 font-bold">{story.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#65746C]">
                    {story.description}
                  </p>
                  <a
                    href="/stories"
                    className="mt-4 inline-flex font-semibold text-[#176B50] hover:underline"
                  >
                    {completed ? "Play again →" : "Explore story →"}
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        {/* Kindness missions */}
        <section className="mt-14">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-[#176B50]">
              Turn learning into action
            </p>
            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
              Kindness missions
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-[#65746C]">
              Mark a mission complete when you've done it or practiced the idea.
              Your progress is saved in this browser. Each mission earns XP
              only the first time you complete it.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {missions.map((mission) => {
              const completed = completedMissions.includes(mission.id);

              return (
                <article
                  key={mission.id}
                  className={`rounded-2xl border p-5 transition ${
                    completed
                      ? "border-[#B8D9C0] bg-[#F0F8F1]"
                      : "border-[#E5E9E0] bg-white"
                  }`}
                >
                  <span className="text-3xl">{mission.icon}</span>
                  <h3 className="mt-4 font-bold">{mission.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#65746C]">
                    {mission.description}
                  </p>
                  <button
                    type="button"
                    disabled={!isLoaded}
                    aria-pressed={completed}
                    onClick={() => toggleMission(mission.id)}
                    className={`mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold transition disabled:opacity-50 ${
                      completed
                        ? "border border-[#B8D9C0] bg-white text-[#176B50]"
                        : "bg-[#E5F3E9] text-[#176B50] hover:bg-[#D5EBDD]"
                    }`}
                  >
                    {completed ? "✓ Completed — undo" : "Mark as completed"}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        {/* Achievements */}
        <section className="mt-14 rounded-3xl border border-[#E5E9E0] bg-white p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-[#176B50]">
                Celebrate your growth
              </p>
              <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                Your achievements
              </h2>
            </div>
            <p className="text-sm font-semibold text-[#65746C]">
              {isLoaded
                ? `${unlockedAchievements}/${achievements.length} unlocked`
                : "Loading…"}
            </p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.title}
                className={`rounded-2xl border p-5 ${
                  achievement.unlocked
                    ? "border-[#C8E2CF] bg-[#F0F8F1]"
                    : "border-[#EAEBE5] bg-[#FAFAF7]"
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${
                    achievement.unlocked
                      ? "bg-white"
                      : "bg-[#F0F0EA] grayscale"
                  }`}
                >
                  {achievement.icon}
                </div>
                <h3 className="mt-4 font-bold">{achievement.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#65746C]">
                  {achievement.description}
                </p>
                <p
                  className={`mt-4 text-xs font-bold uppercase tracking-wider ${
                    achievement.unlocked
                      ? "text-[#176B50]"
                      : "text-[#8A968E]"
                  }`}
                >
                  {achievement.unlocked
                    ? "✓ Unlocked"
                    : "🔒 Not yet unlocked"}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Encouragement */}
        <section className="mt-10 rounded-3xl bg-[#E5F3E9] p-7 sm:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🌻</span>
              <div>
                <h2 className="text-xl font-extrabold">
                  Progress, not perfection.
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-[#52665A]">
                  You don't need to do everything today. Keep learning, ask for
                  help when you need it, and remember that kindness includes
                  being kind to yourself.
                </p>
              </div>
            </div>
            <a
              href="/"
              className="inline-flex w-fit shrink-0 rounded-full bg-[#176B50] px-6 py-3 font-semibold text-white transition hover:bg-[#10543E]"
            >
              Keep growing →
            </a>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E5E9E0] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-sm text-[#65746C] sm:px-8 md:flex-row md:items-center md:justify-between">
          <a href="/" className="text-lg font-extrabold text-[#20352D]">
            BeKind<span className="text-[#176B50]">.</span>
          </a>
          <p>Be kind. Be brave. Be the difference.</p>
          <a href="/learn/if-it-happens" className="hover:text-[#176B50]">
            Need help? Start here.
          </a>
        </div>
      </footer>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: string;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E5E9E0] bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-[#65746C]">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-extrabold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-[#8A968E]">{detail}</p>
    </div>
  );
}

function LearningProgress({
  icon,
  title,
  count,
  total,
  color,
}: {
  icon: string;
  title: string;
  count: number;
  total: number;
  color: string;
}) {
  const percentage =
    total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{icon}</span>
          <span className="text-sm font-semibold">{title}</span>
        </div>
        <span className="text-sm font-bold text-[#65746C]">
          {count}/{total}
        </span>
      </div>
      <ProgressBar value={percentage} color={color} />
    </div>
  );
}


