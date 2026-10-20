
"use client";

import { useEffect, useState } from "react";
import { syncEarnedXP } from "@/lib/bekind-xp";

const COMPLETED_KEY = "bekind-completed-stories";

type Choice = {
  label: string;
  title: string;
  feedback: string;
  takeaway: string;
  safe: boolean;
};

type Story = {
  id: string;
  category: string;
  emoji: string;
  title: string;
  description: string;
  setting: string;
  situation: string;
  choices: Choice[];
};

const stories: Story[] = [
  {
    id: "lunch-table",
    category: "In person",
    emoji: "🫶",
    title: "The Empty Seat",
    description: "A student is being left out at lunch.",
    setting: "It's lunchtime at school.",
    situation:
      "You notice a student sitting alone. A nearby group laughs when the student asks if they can sit together. The student looks embarrassed and quietly walks away. You aren't sure what to do.",
    choices: [
      {
        label: "Invite them to sit with you.",
        title: "You helped them feel welcome.",
        feedback:
          "You offered connection without making a scene. A simple invitation can help someone feel less alone. You don't need to become their best friend to show kindness.",
        takeaway: "Small, welcoming actions can make a real difference.",
        safe: true,
      },
      {
        label: "Check in with them privately.",
        title: "You gave them space to talk.",
        feedback:
          'You could ask, "Hey, are you okay? Want to sit with me?" Checking in privately avoids putting them on the spot. Listen to what they want rather than assuming what they need.',
        takeaway:
          "Ask, listen, and respect the other person's choice.",
        safe: true,
      },
      {
        label: "Tell a trusted teacher what you saw.",
        title: "You involved someone who can help.",
        feedback:
          "Getting an adult involved is a reasonable choice, especially if this keeps happening or the student seems unsafe. Share what you observed without spreading rumors.",
        takeaway:
          "You can ask an adult for help even if you aren't the target.",
        safe: true,
      },
    ],
  },
  {
    id: "group-chat",
    category: "Online",
    emoji: "📱",
    title: "The Group Chat",
    description: "Someone posts a humiliating meme about a classmate.",
    setting: "You're chatting with classmates online.",
    situation:
      "Someone shares a cruel meme about a classmate. A few people react with laughing emojis, and others start forwarding it. You feel uncomfortable, but you're worried that speaking up could make you the next target.",
    choices: [
      {
        label: "Don't forward it, and report the post.",
        title: "You stopped the spread.",
        feedback:
          "Not forwarding humiliating content helps limit its reach. You can report it using the platform's tools. If the behavior continues, consider telling a trusted adult.",
        takeaway:
          "Pause before sharing, and use reporting tools when content causes harm.",
        safe: true,
      },
      {
        label: "Privately check in with the classmate.",
        title: "You offered support.",
        feedback:
          'A private message such as "I saw that post, and it wasn\'t okay" can help the person feel supported. Let them decide what they want to share. You can also offer to help them report it.',
        takeaway:
          "Support the person affected without pressuring them to respond.",
        safe: true,
      },
      {
        label: "Ask a trusted adult for help.",
        title: "You chose a safer way to respond.",
        feedback:
          "You don't have to confront a group or put yourself at risk. A trusted adult can help you work out what to do. If safe, preserve the relevant post or screenshots before reporting it.",
        takeaway:
          "You can seek help without handling the situation alone.",
        safe: true,
      },
    ],
  },
  {
    id: "hallway",
    category: "Being a bystander",
    emoji: "🏫",
    title: "The Hallway Incident",
    description: "You witness a classmate being mocked between classes.",
    setting: "You're walking to your next class.",
    situation:
      "A few students are mocking a classmate's appearance. The classmate looks upset. The group seems worked up, and you worry that confronting them could make things worse.",
    choices: [
      {
        label: "Get a teacher or another trusted adult.",
        title: "You prioritized everyone's safety.",
        feedback:
          "This is a strong choice when a situation feels unsafe or unpredictable. Tell an adult what you saw and where it happened. You don't need to physically intervene.",
        takeaway:
          "Safety comes before proving yourself to anyone.",
        safe: true,
      },
      {
        label: "Walk with the classmate to a safer place.",
        title: "You offered support without escalating.",
        feedback:
          "If you can do so safely, you might ask the classmate to walk with you toward a supervised area. Don't threaten or challenge the group. Get adult help if the behavior continues.",
        takeaway:
          "A calm, supportive action can help someone feel less isolated.",
        safe: true,
      },
      {
        label: "Check in afterward and offer to report it together.",
        title: "You made support available.",
        feedback:
          "Sometimes checking in afterward is the safest option. Listen to the classmate and ask what support they'd like. Offer to accompany them to a counselor or teacher.",
        takeaway:
          "Support can happen afterward, too. You don't have to solve everything alone.",
        safe: true,
      },
    ],
  },
];

export default function StoriesPage() {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [completedStories, setCompletedStories] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(
        localStorage.getItem(COMPLETED_KEY) || "[]"
      );

      if (Array.isArray(saved)) {
        const validStories = saved.filter(
          (id): id is string =>
            typeof id === "string" &&
            stories.some((story) => story.id === id)
        );

        setCompletedStories(validStories);
        syncEarnedXP();
      }
    } catch {
      setCompletedStories([]);
    }

    setLoaded(true);
  }, []);

  function startStory(story: Story) {
    setActiveStory(story);
    setSelectedChoice(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function finishStory() {
    if (!activeStory) return;

    try {
      const saved: unknown = JSON.parse(
        localStorage.getItem(COMPLETED_KEY) || "[]"
      );

      const validSaved = Array.isArray(saved)
        ? saved.filter(
            (id): id is string =>
              typeof id === "string" &&
              stories.some((story) => story.id === id)
          )
        : [];

      const updated = validSaved.includes(activeStory.id)
        ? validSaved
        : [...validSaved, activeStory.id];

      localStorage.setItem(COMPLETED_KEY, JSON.stringify(updated));
      setCompletedStories(updated);

      // Synchronize story completions with the XP ledger.
      // Previously earned story IDs are not rewarded a second time.
      syncEarnedXP();

      setActiveStory(null);
      setSelectedChoice(null);
    } catch {
      alert("We couldn't save your story progress. Please try again.");
    }
  }

  function returnToStories() {
    setActiveStory(null);
    setSelectedChoice(null);
  }

  return (
    <main className="min-h-screen bg-[#FAFAF7] px-5 py-10 text-[#20352D] sm:py-14">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <a href="/" className="text-3xl font-extrabold">
            BeKind<span className="text-[#176B50]">.</span>
          </a>

          <div className="flex flex-wrap gap-3">
            <a
              href="/learn"
              className="rounded-full border border-[#DDE3DA] px-5 py-3 text-sm font-semibold hover:bg-white"
            >
              Lessons
            </a>
            <a
              href="/dashboard"
              className="rounded-full border border-[#DDE3DA] px-5 py-3 text-sm font-semibold hover:bg-white"
            >
              Dashboard
            </a>
          </div>
        </header>

        {!loaded ? (
          <p className="mt-12 text-[#65746C]">Loading your stories...</p>
        ) : activeStory ? (
          <section className="mx-auto mt-10 max-w-3xl">
            <button
              type="button"
              onClick={returnToStories}
              className="font-semibold text-[#176B50] hover:underline"
            >
              ← All stories
            </button>

            <div className="mt-8 rounded-3xl bg-[#EAF1E8] p-6 sm:p-9">
              <p className="text-sm font-bold uppercase tracking-widest text-[#176B50]">
                BEKIND STORIES · {activeStory.category}
              </p>

              <div className="mt-5 text-5xl" aria-hidden="true">
                {activeStory.emoji}
              </div>

              <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                {activeStory.title}
              </h1>

              <p className="mt-3 leading-7 text-[#52675B]">
                {activeStory.setting}
              </p>

              <div className="mt-6 rounded-2xl bg-white p-5 sm:p-6">
                <p className="leading-8">{activeStory.situation}</p>
              </div>
            </div>

            {!selectedChoice ? (
              <section className="mt-8">
                <h2 className="text-2xl font-extrabold">
                  What would you do?
                </h2>

                <p className="mt-2 leading-7 text-[#65746C]">
                  Choose the response you think would be helpful and safe.
                  There's no need to put yourself in danger.
                </p>

                <div className="mt-5 space-y-3">
                  {activeStory.choices.map((choice, index) => (
                    <button
                      key={choice.label}
                      type="button"
                      onClick={() => setSelectedChoice(choice)}
                      className="flex w-full items-center gap-4 rounded-2xl border border-[#E7EAE3] bg-white p-5 text-left transition hover:border-[#176B50] hover:bg-[#F3F7F1]"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF1E8] font-bold text-[#176B50]">
                        {String.fromCharCode(65 + index)}
                      </span>

                      <span className="flex-1 font-semibold leading-7">
                        {choice.label}
                      </span>

                      <span className="text-[#176B50]" aria-hidden="true">
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            ) : (
              <section
                className="mt-8 rounded-3xl border border-[#E7EAE3] bg-white p-6 sm:p-8"
                aria-live="polite"
              >
                <p className="text-sm font-bold uppercase tracking-widest text-[#176B50]">
                  YOUR STORY OUTCOME
                </p>

                <h2 className="mt-3 text-2xl font-extrabold">
                  {selectedChoice.title}
                </h2>

                <p className="mt-4 leading-8 text-[#52675B]">
                  {selectedChoice.feedback}
                </p>

                <div className="mt-6 rounded-2xl bg-[#F0F1E9] p-5">
                  <p className="text-sm font-bold uppercase tracking-widest text-[#176B50]">
                    WHAT TO REMEMBER
                  </p>
                  <p className="mt-2 leading-7">{selectedChoice.takeaway}</p>
                </div>

                <p className="mt-5 text-sm leading-6 text-[#65746C]">
                  There isn't always one perfect response. Context matters.
                  If someone is in danger, get help from a trusted adult or
                  emergency services. You are not responsible for fixing
                  bullying on your own.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedChoice(null)}
                    className="rounded-full border border-[#DDE3DA] px-6 py-3 font-semibold hover:bg-[#FAFAF7]"
                  >
                    Try another choice
                  </button>

                  <button
                    type="button"
                    onClick={finishStory}
                    className="rounded-full bg-[#176B50] px-6 py-3 font-semibold text-white hover:bg-[#12563F]"
                  >
                    Finish story ✓
                  </button>
                </div>
              </section>
            )}
          </section>
        ) : (
          <>
            <section className="mt-12 rounded-3xl bg-[#EAF1E8] p-7 sm:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#176B50]">
                LEARN BY CHOOSING
              </p>

              <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">
                Every choice tells a story.
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#52675B]">
                Step into everyday situations, explore different responses,
                and practice supporting others safely. Learn at your own pace.
              </p>

              <div className="mt-6 inline-flex rounded-full bg-white px-5 py-3 font-semibold">
                {completedStories.length} of {stories.length} stories completed
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-2xl font-extrabold">Choose your story</h2>
              <p className="mt-2 text-[#65746C]">
                Pick any situation to begin. You can replay stories and explore
                other choices whenever you like.
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-3">
                {stories.map((story) => {
                  const isCompleted = completedStories.includes(story.id);

                  return (
                    <article
                      key={story.id}
                      className="flex flex-col rounded-3xl border border-[#E7EAE3] bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-4xl" aria-hidden="true">
                          {story.emoji}
                        </span>

                        {isCompleted && (
                          <span className="rounded-full bg-[#EAF1E8] px-3 py-1 text-xs font-bold text-[#176B50]">
                            ✓ Completed
                          </span>
                        )}
                      </div>

                      <p className="mt-5 text-xs font-bold uppercase tracking-widest text-[#176B50]">
                        {story.category}
                      </p>

                      <h3 className="mt-2 text-xl font-extrabold">
                        {story.title}
                      </h3>

                      <p className="mt-3 flex-1 leading-7 text-[#65746C]">
                        {story.description}
                      </p>

                      <button
                        type="button"
                        onClick={() => startStory(story)}
                        className="mt-6 rounded-full bg-[#176B50] px-5 py-3 font-semibold text-white transition hover:bg-[#12563F]"
                      >
                        {isCompleted ? "Play again ↻" : "Start story →"}
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="mt-10 rounded-3xl bg-[#F0F1E9] p-6 sm:p-8">
              <h2 className="text-xl font-extrabold">
                A reminder before you begin
              </h2>
              <p className="mt-3 leading-7 text-[#52675B]">
                These stories are practice, not a test. You don't have to
                confront anyone, disclose personal experiences, or handle
                bullying alone. Asking a trusted adult for help is a valid
                response.
              </p>
            </section>
          </>
        )}

        <footer className="mt-14 border-t border-[#E7EAE3] pt-6 text-sm text-[#65746C]">
          BeKind helps students practice kindness and safer responses.
          Story progress is saved in this browser.
        </footer>
      </div>
    </main>
  );
}
