
"use client";

import { useEffect, useState } from "react";
import { syncEarnedXP } from "@/lib/bekind-xp";

const LESSON_ID = "if-it-happens";
const LESSONS_KEY = "bekind-completed-lessons";

const scenarios = [
  {
    title: "Repeated teasing at lunch",
    situation:
      "A group of students repeatedly makes fun of a classmate at lunch. The classmate looks upset.",
    question: "What is a safer way to respond?",
    options: [
      "Laugh along so the group does not target me.",
      "Check on the classmate or get a trusted adult to help.",
      "Post a video of the incident online.",
    ],
    answer: 1,
    explanation:
      "Checking on the student and asking a trusted adult for help can make a difference. Only intervene directly if it is safe. You do not need to confront the group.",
  },
  {
    title: "Hurtful group chat messages",
    situation:
      "Someone repeatedly sends hurtful messages about you in a group chat.",
    question: "What should you consider doing?",
    options: [
      "Send threats back to show you are not afraid.",
      "Forward the messages to everyone at school.",
      "Save relevant evidence if safe, block or report the sender, and tell a trusted adult.",
    ],
    answer: 2,
    explanation:
      "You do not have to reply. If safe, preserve relevant messages, use the platform's reporting tools, and ask a trusted adult to help you decide what to do next.",
  },
  {
    title: "The first adult does not help",
    situation:
      "You tell an adult that bullying has been happening, but it continues.",
    question: "What is a good next step?",
    options: [
      "Give up because nothing will change.",
      "Tell another trusted adult and explain that the behavior is continuing.",
      "Try to get revenge on the person.",
    ],
    answer: 1,
    explanation:
      "You deserve to be taken seriously. Reach out to another trusted adult, such as a school counselor or administrator, and explain what has happened and what support you need.",
  },
  {
    title: "A friend is being excluded",
    situation:
      "You notice a friend is repeatedly left out and mocked by a group of classmates.",
    question: "How could you support your friend?",
    options: [
      "Privately check in, include them, and seek adult help if needed.",
      "Tell them they need to learn to handle it alone.",
      "Start a rumor about the students responsible.",
    ],
    answer: 0,
    explanation:
      "Listening, including your friend, and helping them reach a trusted adult are supportive steps. Do not spread rumors or put yourself in danger.",
  },
];

export default function IfItHappensPage() {
  const [completed, setCompleted] = useState(false);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [finishedPractice, setFinishedPractice] = useState(false);

  useEffect(() => {
    try {
      const savedLessons: string[] = JSON.parse(
        localStorage.getItem(LESSONS_KEY) || "[]"
      );

      setCompleted(savedLessons.includes(LESSON_ID));
      syncEarnedXP();
    } catch {
      setCompleted(false);
    }
  }, []);

  function completeLesson() {
    try {
      const savedLessons: string[] = JSON.parse(
        localStorage.getItem(LESSONS_KEY) || "[]"
      );

      if (!savedLessons.includes(LESSON_ID)) {
        savedLessons.push(LESSON_ID);
        localStorage.setItem(LESSONS_KEY, JSON.stringify(savedLessons));
      }

      syncEarnedXP();
      setCompleted(true);
    } catch {
      alert("We couldn't save your progress. Please try again.");
    }
  }

  function chooseAnswer(index: number) {
    setSelectedAnswer(index);
    setShowAnswer(true);
  }

  function nextScenario() {
    if (scenarioIndex === scenarios.length - 1) {
      setFinishedPractice(true);
      return;
    }

    setScenarioIndex((current) => current + 1);
    setSelectedAnswer(null);
    setShowAnswer(false);
  }

  function restartPractice() {
    setScenarioIndex(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setFinishedPractice(false);
  }

  const scenario = scenarios[scenarioIndex];

  return (
    <main className="min-h-screen bg-[#FAFAF7] text-[#20352D]">
      <header className="border-b border-[#E8EAE3] bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-5">
          <a href="/" className="text-2xl font-extrabold">
            BeKind<span className="text-[#176B50]">.</span>
          </a>
          <a
            href="/learn"
            className="rounded-full border border-[#DDE3DA] px-5 py-2.5 text-sm font-semibold"
          >
            ← All lessons
          </a>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#176B50]">
          LESSON 04 · SELF-CARE
        </p>

        <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">
          If bullying happens to you
        </h1>

        <p className="mt-5 text-lg leading-8 text-[#65746C]">
          Being targeted can leave you feeling angry, embarrassed, anxious, or
          alone. Whatever you're feeling, you deserve support and to be treated
          with respect.
        </p>

        <section className="mt-9 rounded-3xl bg-rose-50 p-6 sm:p-8">
          <h2 className="text-xl font-bold">First, remember this</h2>
          <p className="mt-3 leading-7 text-[#52675B]">
            Bullying is not your fault. You don't have to change who you are or
            handle the situation by yourself to deserve safety and respect.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">Steps you can take</h2>
          <ol className="mt-5 list-decimal space-y-4 pl-6 leading-7 text-[#65746C]">
            <li>
              <strong className="text-[#20352D]">Find a safe person.</strong>{" "}
              Talk to a trusted adult, family member, teacher, school counselor,
              or coach. If the first person doesn't take you seriously, try
              another.
            </li>
            <li>
              <strong className="text-[#20352D]">
                Write down what happened.
              </strong>{" "}
              If it's safe, note dates, places, and what occurred. For online
              bullying, save relevant messages or screenshots.
            </li>
            <li>
              <strong className="text-[#20352D]">Make a safety plan.</strong>{" "}
              Ask an adult to help you identify safe places and people to go to
              if the behavior happens again.
            </li>
            <li>
              <strong className="text-[#20352D]">Use reporting tools.</strong>{" "}
              Report harmful content to the platform or school. You don't need
              to reply to hurtful messages.
            </li>
            <li>
              <strong className="text-[#20352D]">Take care of yourself.</strong>{" "}
              Spend time with supportive people and do things that help you feel
              grounded. You deserve time to recover.
            </li>
          </ol>
        </section>

        {/* Interactive practice scenarios */}
        <section
          id="practice"
          className="mt-12 scroll-mt-8 rounded-3xl border border-[#E7EAE3] bg-white p-6 sm:p-8"
        >
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#176B50]">
            INTERACTIVE PRACTICE
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            What would you do?
          </h2>

          <p className="mt-3 leading-7 text-[#65746C]">
            Explore realistic situations and choose a response. These are
            practice activities, not tests. Real situations may need help from
            a trusted adult.
          </p>

          {!finishedPractice ? (
            <>
              <div className="mt-6 flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#F0F1E9] px-3 py-1.5 text-sm font-semibold text-[#176B50]">
                  Scenario {scenarioIndex + 1} of {scenarios.length}
                </span>

                <span className="text-sm text-[#65746C]">
                  {Math.round(
                    ((scenarioIndex + (showAnswer ? 1 : 0)) /
                      scenarios.length) *
                      100
                  )}
                  % explored
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E8EAE3]">
                <div
                  className="h-full rounded-full bg-[#176B50] transition-all"
                  style={{
                    width: `${
                      ((scenarioIndex + (showAnswer ? 1 : 0)) /
                        scenarios.length) *
                      100
                    }%`,
                  }}
                />
              </div>

              <div className="mt-6 rounded-2xl bg-[#FAFAF7] p-5">
                <h3 className="text-lg font-bold">{scenario.title}</h3>
                <p className="mt-3 leading-7 text-[#52675B]">
                  {scenario.situation}
                </p>
                <p className="mt-5 font-semibold">{scenario.question}</p>
              </div>

              <div className="mt-5 space-y-3">
                {scenario.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isSafeAnswer = scenario.answer === index;

                  let style =
                    "border-[#DDE3DA] bg-white hover:border-[#9CAF98]";

                  if (showAnswer && isSafeAnswer) {
                    style = "border-[#9CAF98] bg-[#EDF3E9]";
                  } else if (showAnswer && isSelected) {
                    style = "border-[#D6A28D] bg-[#FBF0EB]";
                  }

                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={showAnswer}
                      onClick={() => chooseAnswer(index)}
                      className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left leading-6 transition ${style} disabled:cursor-default`}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current text-sm font-bold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {showAnswer && isSafeAnswer && (
                        <span className="font-bold text-[#176B50]">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {showAnswer && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mt-5 rounded-2xl bg-[#F0F1E9] p-5"
                >
                  <h3 className="font-bold text-[#20352D]">
                    {selectedAnswer === scenario.answer
                      ? "Good choice!"
                      : "Let's consider a safer response."}
                  </h3>

                  <p className="mt-2 leading-7 text-[#52675B]">
                    {scenario.explanation}
                  </p>

                  <button
                    type="button"
                    onClick={nextScenario}
                    className="mt-5 rounded-full bg-[#176B50] px-6 py-3 font-semibold text-white transition hover:bg-[#12563F]"
                  >
                    {scenarioIndex === scenarios.length - 1
                      ? "Finish practice"
                      : "Next scenario →"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="mt-6 rounded-2xl bg-[#F0F1E9] p-6">
              <div className="text-3xl" aria-hidden="true">
                💚
              </div>
              <h3 className="mt-3 text-xl font-bold">
                You've explored all four scenarios!
              </h3>
              <p className="mt-3 leading-7 text-[#52675B]">
                Remember: look for safe ways to help, support people who are
                being targeted, and involve a trusted adult when needed.
                You do not have to handle bullying alone.
              </p>
              <button
                type="button"
                onClick={restartPractice}
                className="mt-5 rounded-full border border-[#DDE3DA] bg-white px-6 py-3 font-semibold transition hover:bg-[#FAFAF7]"
              >
                Practice again ↻
              </button>
            </div>
          )}
        </section>

        <section className="mt-10 rounded-3xl bg-[#F0F1E9] p-6 sm:p-8">
          <h2 className="text-xl font-bold">Need help right now?</h2>
          <p className="mt-3 leading-7 text-[#52675B]">
            If you're in immediate danger, move to a safer place if possible
            and contact a trusted adult or emergency services. In the United
            States, call 911 for an emergency. If one adult doesn't listen,
            keep reaching out to another trusted adult.
          </p>
          <a
            href="https://www.stopbullying.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex rounded-full bg-[#176B50] px-6 py-3 font-semibold text-white transition hover:bg-[#12563F]"
          >
            Visit StopBullying.gov ↗
          </a>
          <a
            href="/learn/help-a-friend"
            className="ml-0 mt-3 inline-flex rounded-full border border-[#DDE3DA] bg-white px-6 py-3 font-semibold transition hover:bg-[#FAFAF7] sm:ml-3"
          >
            Learn how to help a friend →
          </a>
        </section>

        <section className="mt-10 rounded-3xl border border-[#E7EAE3] bg-white p-6">
          {completed ? (
            <>
              <p className="font-bold text-[#176B50]">
                ✓ Lesson 4 completed!
              </p>
              <p className="mt-2 text-[#65746C]">
                Great work completing this lesson! Keep building your
                knowledge and practicing kindness.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold">Finished this lesson?</h2>
              <p className="mt-2 text-[#65746C]">
                Mark this lesson complete to update your learning progress.
                You can explore the scenarios whether or not you mark it
                complete.
              </p>
              <button
                type="button"
                onClick={completeLesson}
                className="mt-5 rounded-full bg-[#176B50] px-6 py-3 font-semibold text-white transition hover:bg-[#12563F]"
              >
                Mark lesson complete ✓
              </button>
            </>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/dashboard"
              className="rounded-full bg-[#176B50] px-6 py-3 font-semibold text-white transition hover:bg-[#12563F]"
            >
              View my dashboard →
            </a>
            <a
              href="/learn"
              className="rounded-full border border-[#DDE3DA] px-6 py-3 font-semibold transition hover:bg-[#FAFAF7]"
            >
              Review all lessons
            </a>
          </div>
        </section>
      </article>
    </main>
  );
}
