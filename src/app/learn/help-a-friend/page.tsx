
"use client";

import { useEffect, useState } from "react";

const LESSON_ID = "help-a-friend";
const LESSONS_KEY = "bekind-completed-lessons";

export default function HelpAFriendPage() {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const savedLessons: string[] = JSON.parse(
      localStorage.getItem(LESSONS_KEY) || "[]"
    );

    setCompleted(savedLessons.includes(LESSON_ID));
  }, []);

  function completeLesson() {
    const savedLessons: string[] = JSON.parse(
      localStorage.getItem(LESSONS_KEY) || "[]"
    );

    if (!savedLessons.includes(LESSON_ID)) {
      savedLessons.push(LESSON_ID);
      localStorage.setItem(LESSONS_KEY, JSON.stringify(savedLessons));
    }

    setCompleted(true);
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
          LESSON 03 · BE AN UPSTANDER
        </p>

        <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">
          How to help someone
        </h1>

        <p className="mt-5 text-lg leading-8 text-[#65746C]">
          You don't have to be a superhero to make a difference. Small,
          thoughtful actions can help someone feel less alone.
        </p>

        <section className="mt-8 rounded-3xl bg-amber-50 p-6">
          <h2 className="text-xl font-bold">Be an upstander, safely</h2>
          <p className="mt-3 leading-7 text-[#52675B]">
            An upstander takes a safe, positive step when they see someone
            being mistreated. You can help without confronting anyone directly.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-2xl font-bold">Four ways to help</h2>

          <div className="rounded-2xl border border-[#E7EAE3] bg-white p-5">
            <h3 className="font-bold">💚 Check in privately</h3>
            <p className="mt-2 leading-7 text-[#65746C]">
              Ask, "Are you okay? Would you like some company?" Let them decide
              how much they want to share.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E7EAE3] bg-white p-5">
            <h3 className="font-bold">🧑‍🏫 Tell a trusted adult</h3>
            <p className="mt-2 leading-7 text-[#65746C]">
              A teacher, counselor, coach, or family member may be able to help.
              If one adult doesn't listen, try another.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E7EAE3] bg-white p-5">
            <h3 className="font-bold">🫶 Include them</h3>
            <p className="mt-2 leading-7 text-[#65746C]">
              Invite them to join your group, sit with you, or participate in
              an activity.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E7EAE3] bg-white p-5">
            <h3 className="font-bold">🛑 Don't join the harm</h3>
            <p className="mt-2 leading-7 text-[#65746C]">
              Don't laugh along, forward humiliating posts, or spread rumors.
              Get help if the situation feels unsafe.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-3xl bg-[#F0F1E9] p-6">
          <h2 className="text-xl font-bold">Try saying this</h2>
          <p className="mt-3 text-lg leading-8 text-[#52675B]">
            "I saw what happened, and I don't think it was okay. You don't
            deserve to be treated that way. Would you like help talking to
            someone?"
          </p>
        </section>

        <a
          href="https://www.stopbullying.gov/prevention/bystanders-to-bullying"
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-block rounded-full bg-[#176B50] px-6 py-3 font-semibold text-white"
        >
          Official resources ↗
        </a>

        <section className="mt-10 rounded-3xl border border-[#E7EAE3] bg-white p-6">
          {completed ? (
            <>
              <p className="font-bold text-[#176B50]">
                ✓ Lesson 3 completed!
              </p>
              <p className="mt-2 text-[#65746C]">
                Great work learning how to support others safely.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold">Finished this lesson?</h2>
              <p className="mt-2 text-[#65746C]">
                Mark it complete to update your BeKind learning progress.
              </p>
              <button
                onClick={completeLesson}
                className="mt-5 rounded-full bg-[#176B50] px-6 py-3 font-semibold text-white transition hover:bg-[#12563F]"
              >
                Mark lesson complete ✓
              </button>
            </>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/learn/if-it-happens"
              className="rounded-full bg-[#20352D] px-6 py-3 font-semibold text-white transition hover:bg-[#344C41]"
            >
              Continue to Lesson 4 →
            </a>
            <a
              href="/dashboard"
              className="rounded-full border border-[#DCE3DA] px-6 py-3 font-semibold text-[#20352D] transition hover:bg-[#FAFAF7]"
            >
              View dashboard
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

  
