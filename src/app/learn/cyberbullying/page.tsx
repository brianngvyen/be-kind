
"use client";

import { useEffect, useState } from "react";

const LESSON_ID = "cyberbullying";
const NEXT_LESSON = "/learn/help-a-friend";
const STORAGE_KEY = "bekind-completed-lessons";

export default function CyberbullyingPage() {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const lessons: string[] = saved ? JSON.parse(saved) : [];
      setCompleted(lessons.includes(LESSON_ID));
    } catch {
      setCompleted(false);
    }
  }, []);

  function markLessonComplete() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const lessons: string[] = saved ? JSON.parse(saved) : [];

      if (!lessons.includes(LESSON_ID)) {
        lessons.push(LESSON_ID);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons));
      }

      setCompleted(true);
    } catch {
      alert("We couldn't save your progress. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAF7] px-5 py-12 text-[#20352D]">
      <div className="mx-auto max-w-3xl">
        <a
          href="/learn"
          className="font-semibold text-[#176B50] hover:underline"
        >
          ← Back to all lessons
        </a>

        <p className="mt-10 text-sm font-bold uppercase tracking-widest text-[#176B50]">
          LESSON 02 · ONLINE SAFETY
        </p>

        <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">
          Understanding cyberbullying
        </h1>

        <p className="mt-5 text-lg leading-8 text-[#65746C]">
          Cyberbullying is bullying that takes place through digital devices
          and platforms, such as messaging apps, social media, online games,
          and group chats.
        </p>

        <section className="mt-8 rounded-3xl bg-violet-50 p-6">
          <h2 className="text-xl font-bold">What can it look like?</h2>
          <ul className="mt-4 list-disc space-y-3 pl-5 leading-7">
            <li>Repeatedly sending cruel or threatening messages.</li>
            <li>Sharing private information to embarrass someone.</li>
            <li>Using group chats to mock or isolate a classmate.</li>
            <li>Harassing someone through games or social media.</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold">What can you do?</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 leading-7 text-[#65746C]">
            <li>Don't retaliate or escalate the situation.</li>
            <li>Save relevant messages or screenshots if it is safe.</li>
            <li>Block or report the account using the platform's tools.</li>
            <li>Talk to a trusted adult, teacher, or school counselor.</li>
          </ol>
        </section>

        <section className="mt-8 rounded-3xl bg-[#F0F1E9] p-6">
          <h2 className="text-xl font-bold">Remember</h2>
          <p className="mt-3 leading-7 text-[#52675B]">
            You don't have to handle cyberbullying alone. Asking for help is
            a smart and courageous step.
          </p>
        </section>

        <section className="mt-10 rounded-3xl border border-[#DDE3DA] bg-white p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-wider text-[#176B50]">
            YOUR PROGRESS
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {completed ? "Lesson completed! 🎉" : "Finished learning?"}
          </h2>

          <p className="mt-2 leading-7 text-[#65746C]">
            {completed
              ? "Great work! Your progress has been saved on this device."
              : "Mark this lesson complete to update your BeKind dashboard."}
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={markLessonComplete}
              disabled={completed}
              className="rounded-full bg-[#176B50] px-6 py-3 font-semibold text-white hover:bg-[#12543F] disabled:cursor-default disabled:opacity-70"
            >
              {completed ? "✓ Lesson completed" : "Mark lesson complete"}
            </button>

            {completed && (
              <a
                href={NEXT_LESSON}
                className="rounded-full border border-[#DDE3DA] px-6 py-3 text-center font-semibold hover:bg-[#F0F5EF]"
              >
                Next lesson →
              </a>
            )}

            <a
              href="/dashboard"
              className="rounded-full border border-[#DDE3DA] px-6 py-3 text-center font-semibold hover:bg-[#F0F5EF]"
            >
              View dashboard
            </a>
          </div>
        </section>

        <a
          href="https://www.stopbullying.gov/cyberbullying/what-is-it"
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-block rounded-full bg-[#176B50] px-6 py-3 font-semibold text-white"
        >
          Official resources ↗
        </a>
      </div>
    </main>
  );
}
