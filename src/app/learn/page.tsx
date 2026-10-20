
"use client";

import { useEffect, useState } from "react";

const lessons = [
  {
    number: "01",
    category: "THE BASICS",
    title: "What is bullying?",
    description:
      "Understand what bullying means, how to recognize it, and how it differs from everyday disagreements.",
    duration: "4 min read",
    icon: "📚",
    color: "bg-emerald-50",
    href: "/learn/what-is-bullying",
  },
  {
    number: "02",
    category: "ONLINE SAFETY",
    title: "Understanding cyberbullying",
    description:
      "Learn how bullying can happen through texts, group chats, social media, and online games.",
    duration: "5 min read",
    icon: "📱",
    color: "bg-violet-50",
    href: "/learn/cyberbullying",
  },
  {
    number: "03",
    category: "BE AN UPSTANDER",
    title: "How to help someone",
    description:
      "Explore safe ways to support someone experiencing bullying without putting yourself in danger.",
    duration: "4 min read",
    icon: "🤝",
    color: "bg-amber-50",
    href: "/learn/help-a-friend",
  },
  {
    number: "04",
    category: "SELF-CARE",
    title: "If bullying happens to you",
    description:
      "Explore practical next steps, how to find support, and why you are never to blame for being bullied.",
    duration: "5 min read",
    icon: "💚",
    color: "bg-rose-50",
    href: "/learn/if-it-happens",
  },
];

const STORAGE_KEY = "bekind-completed-lessons";

export default function LearnPage() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(STORAGE_KEY);

      if (savedProgress) {
        const parsedProgress: unknown = JSON.parse(savedProgress);

        if (
          Array.isArray(parsedProgress) &&
          parsedProgress.every((item) => typeof item === "string")
        ) {
          const validProgress = parsedProgress.filter((href) =>
            lessons.some((lesson) => lesson.href === href)
          );

          setCompletedLessons([...new Set(validProgress)]);
        }
      }
    } catch {
      console.error("Unable to load BeKind learning progress.");
    } finally {
      setIsLoaded(true);
    }
  }, []);

  function toggleLesson(lessonHref: string) {
    const updatedProgress = completedLessons.includes(lessonHref)
      ? completedLessons.filter((href) => href !== lessonHref)
      : [...completedLessons, lessonHref];

    setCompletedLessons(updatedProgress);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProgress));
    } catch {
      console.error("Unable to save BeKind learning progress.");
    }
  }

  const completedCount = completedLessons.length;
  const progressPercentage = Math.round(
    (completedCount / lessons.length) * 100
  );

  return (
    <main className="min-h-screen bg-[#FAFAF7] text-[#20352D]">
      <header className="border-b border-[#E8EAE3] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <a href="/" className="text-2xl font-extrabold tracking-tight">
            BeKind<span className="text-[#176B50]">.</span>
          </a>

          <a
            href="/"
            className="rounded-full border border-[#DDE3DA] px-5 py-2.5 text-sm font-semibold transition hover:bg-[#F0F5EF]"
          >
            ← Home
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#176B50]">
            THE BEKIND LEARNING HUB
          </p>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">
            Knowledge makes
            <span className="block text-[#176B50]">
              kindness stronger.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#65746C]">
            Learn how to recognize bullying, support your classmates, protect
            yourself online, and find help when you need it. Start wherever
            you feel comfortable.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-[#E7EAE3] bg-white p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Your learning progress</h2>
              <p className="mt-1 text-sm text-[#65746C]">
                {isLoaded
                  ? `${completedCount} of ${lessons.length} lessons completed`
                  : "Loading your progress..."}
              </p>
            </div>

            <span className="text-2xl font-extrabold text-[#176B50]">
              {isLoaded ? `${progressPercentage}%` : "—"}
            </span>
          </div>

          <div
            className="mt-5 h-3 overflow-hidden rounded-full bg-[#E8EDE6]"
            role="progressbar"
            aria-label="Learning progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={isLoaded ? progressPercentage : 0}
          >
            <div
              className="h-full rounded-full bg-[#176B50] transition-all duration-500"
              style={{
                width: `${isLoaded ? progressPercentage : 0}%`,
              }}
            />
          </div>

          {completedCount === lessons.length && isLoaded && (
            <p className="mt-4 font-semibold text-[#176B50]">
              🎉 You've completed all four lessons. Great work!
            </p>
          )}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {lessons.map((lesson) => {
            const isCompleted = completedLessons.includes(lesson.href);

            return (
              <article
                key={lesson.number}
                className="group rounded-3xl border border-[#E7EAE3] bg-white p-6 transition hover:-translate-y-1 hover:border-[#B8D7C1] hover:shadow-xl hover:shadow-[#294D3B]/5 sm:p-8"
              >
                <a href={lesson.href} className="block">
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
                    {lesson.category}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    {lesson.title}
                  </h2>

                  <p className="mt-3 leading-7 text-[#65746C]">
                    {lesson.description}
                  </p>

                  <p className="mt-5 text-sm text-[#7B887F]">
                    {lesson.duration}
                  </p>
                </a>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEF0EA] pt-5">
                  <a
                    href={lesson.href}
                    className="font-semibold text-[#176B50] hover:underline"
                  >
                    Read lesson →
                  </a>

                  <button
                    type="button"
                    onClick={() => toggleLesson(lesson.href)}
                    disabled={!isLoaded}
                    aria-pressed={isCompleted}
                    className={`rounded-full px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${
                      isCompleted
                        ? "border border-[#B8D7C1] bg-emerald-50 text-[#176B50] hover:bg-emerald-100"
                        : "bg-[#176B50] text-white hover:bg-[#12543F]"
                    }`}
                  >
                    {isCompleted ? "✓ Completed" : "Mark complete"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 rounded-3xl bg-[#203D32] p-7 text-white sm:p-10">
          <span className="text-3xl">🌱</span>

          <h2 className="mt-4 text-2xl font-bold">
            Learning is a form of courage.
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-[#D0DED5]">
            You don't have to know all the answers. Understanding a situation
            better can help you make safer decisions and support the people
            around you.
          </p>

          <a
            href="/#practice"
            className="mt-6 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-[#203D32] transition hover:bg-[#E5F3E9]"
          >
            Practice a scenario →
          </a>
        </div>
      </section>

      <footer className="border-t border-[#E5E9E0] bg-white">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
          <p className="text-sm leading-6 text-[#65746C]">
            Want additional guidance? Visit{" "}
            <a
              href="https://www.stopbullying.gov/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#176B50] underline underline-offset-4"
            >
              StopBullying.gov
            </a>{" "}
            for official U.S. bullying prevention information.
          </p>
        </div>
      </footer>
    </main>
  );
}
