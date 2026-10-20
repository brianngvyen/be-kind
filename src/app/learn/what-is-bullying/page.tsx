
"use client";

import { useEffect, useState } from "react";
import { syncEarnedXP } from "@/lib/bekind-xp";

const LESSON_ID = "what-is-bullying";
const NEXT_LESSON = "/learn/cyberbullying";
const STORAGE_KEY = "bekind-completed-lessons";

export default function WhatIsBullyingPage() {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const lessons: string[] = saved ? JSON.parse(saved) : [];

      setCompleted(lessons.includes(LESSON_ID));
      syncEarnedXP();
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

      // Sync XP after saving the lesson completion.
      syncEarnedXP();
      setCompleted(true);
    } catch {
      alert("We couldn't save your progress. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAF7] text-[#20352D]">
      <header className="border-b border-[#E8EAE3] bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-5">
          <a href="/" className="text-2xl font-extrabold tracking-tight">
            BeKind<span className="text-[#176B50]">.</span>
          </a>
          <a
            href="/learn"
            className="rounded-full border border-[#DDE3DA] px-5 py-2.5 text-sm font-semibold hover:bg-[#F0F5EF]"
          >
            ← All lessons
          </a>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#176B50]">
          LESSON 01 · THE BASICS
        </p>

        <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
          What is bullying?
        </h1>

        <p className="mt-5 text-lg leading-8 text-[#65746C]">
          Understanding bullying is the first step toward helping create a
          school environment where everyone feels safe, respected, and included.
        </p>

        <div className="my-8 rounded-3xl bg-emerald-50 p-6 sm:p-8">
          <p className="text-lg font-bold">The big idea</p>
          <p className="mt-3 leading-7 text-[#52675B]">
            Bullying is unwanted, aggressive behavior that involves a real or
            perceived power imbalance and is repeated, or has the potential to
            be repeated, over time.
          </p>
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">What can bullying look like?</h2>
          <p className="mt-3 leading-7 text-[#65746C]">
            Bullying isn't always physical. It can happen in person, through
            messages, or in online spaces.
          </p>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-[#E7EAE3] bg-white p-5">
              <h3 className="font-bold">🗣️ Verbal bullying</h3>
              <p className="mt-2 leading-7 text-[#65746C]">
                Repeated insults, threatening comments, or hurtful name-calling.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E7EAE3] bg-white p-5">
              <h3 className="font-bold">🤝 Social bullying</h3>
              <p className="mt-2 leading-7 text-[#65746C]">
                Repeatedly trying to embarrass someone, spread rumors, or
                deliberately damage their friendships or reputation.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E7EAE3] bg-white p-5">
              <h3 className="font-bold">🛑 Physical bullying</h3>
              <p className="mt-2 leading-7 text-[#65746C]">
                Hitting, pushing, or damaging someone's belongings as part of
                aggressive behavior.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E7EAE3] bg-white p-5">
              <h3 className="font-bold">📱 Cyberbullying</h3>
              <p className="mt-2 leading-7 text-[#65746C]">
                Using texts, social media, group chats, or online games to
                harass, threaten, humiliate, or target someone.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">
            Is every disagreement bullying?
          </h2>
          <p className="mt-3 leading-7 text-[#65746C]">
            No. Friends can disagree, and people can accidentally hurt each
            other's feelings. Bullying usually involves a power imbalance and
            repeated or potentially repeated aggressive behavior. Even when a
            situation doesn't meet that definition, hurtful behavior still
            deserves attention and can be addressed.
          </p>
        </section>

        <section className="mt-12 rounded-3xl bg-[#F0F1E9] p-6 sm:p-8">
          <h2 className="text-2xl font-bold">What can you do?</h2>
          <ul className="mt-4 space-y-3 leading-7 text-[#52675B]">
            <li>• Tell a trusted adult, teacher, or school counselor.</li>
            <li>
              • If it's happening online, save relevant messages or screenshots
              when safe.
            </li>
            <li>
              • Support the person being targeted without escalating the
              situation.
            </li>
            <li>
              • If someone is in immediate danger, get help from an adult or
              emergency services.
            </li>
          </ul>
          <p className="mt-4 text-sm leading-6 text-[#65746C]">
            You don't have to handle bullying alone, whether it's happening to
            you or someone else.
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

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="/learn"
            className="rounded-full border border-[#DDE3DA] px-6 py-3 text-center font-semibold hover:bg-white"
          >
            ← Back to lessons
          </a>
          <a
            href="https://www.stopbullying.gov/bullying/what-is-bullying"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#176B50] px-6 py-3 text-center font-semibold text-white hover:bg-[#12543F]"
          >
            Explore official resources ↗
          </a>
        </div>
      </article>

      <footer className="border-t border-[#E5E9E0] bg-white px-5 py-8 text-center text-sm text-[#65746C]">
        BeKind · Small actions can make a difference.
      </footer>
    </main>
  );
}

