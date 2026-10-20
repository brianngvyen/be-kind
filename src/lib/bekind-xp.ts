
export const LESSONS_KEY = "bekind-completed-lessons";
export const MISSIONS_KEY = "bekind-completed-missions";
export const STORIES_KEY = "bekind-completed-stories";
export const XP_KEY = "bekind-earned-activities";

export const XP_REWARDS = {
  lesson: 50,
  story: 75,
  mission: 25,
} as const;

export const LEVELS = [
  { level: 1, name: "Kindness Rookie", minXP: 0 },
  { level: 2, name: "Kindness Explorer", minXP: 100 },
  { level: 3, name: "Kindness Builder", minXP: 200 },
  { level: 4, name: "Kindness Hero", minXP: 300 },
  { level: 5, name: "Kindness Champion", minXP: 400 },
] as const;

const lessonIds = [
  "what-is-bullying",
  "cyberbullying",
  "help-a-friend",
  "if-it-happens",
];

const storyIds = ["lunch-table", "group-chat", "hallway"];

const missionIds = [
  "give-compliment",
  "include-someone",
  "learn-how-to-help",
];

function readArray(key: string): string[] {
  try {
    const saved: unknown = JSON.parse(
      localStorage.getItem(key) || "[]"
    );

    if (Array.isArray(saved)) {
      return saved.filter(
        (item): item is string => typeof item === "string"
      );
    }
  } catch {
    // Ignore invalid saved data.
  }

  return [];
}

function getCurrentCompletions(): string[] {
  const completedLessons = readArray(LESSONS_KEY);
  const completedStories = readArray(STORIES_KEY);
  const completedMissions = readArray(MISSIONS_KEY);

  const lessonActivities = lessonIds
    .filter((id) =>
      completedLessons.some(
        (saved) =>
          saved === id || saved === `/learn/${id}`
      )
    )
    .map((id) => `lesson:${id}`);

  const storyActivities = storyIds
    .filter((id) => completedStories.includes(id))
    .map((id) => `story:${id}`);

  const missionActivities = missionIds
    .filter((id) => completedMissions.includes(id))
    .map((id) => `mission:${id}`);

  return [
    ...lessonActivities,
    ...storyActivities,
    ...missionActivities,
  ];
}

export function syncEarnedXP(): void {
  if (typeof window === "undefined") return;

  const currentCompletions = getCurrentCompletions();
  const previouslyEarned = readArray(XP_KEY);

  // Preserve existing rewards and award new activities only once.
  const updated = [...new Set([
    ...previouslyEarned,
    ...currentCompletions,
  ])];

  const changed =
    updated.length !== previouslyEarned.length ||
    updated.some((id) => !previouslyEarned.includes(id));

  if (!changed) return;

  try {
    localStorage.setItem(XP_KEY, JSON.stringify(updated));

    // Notify XP displays in the current tab.
    window.dispatchEvent(new Event("bekind-xp-updated"));
  } catch {
    console.error("Unable to save BeKind XP.");
  }
}

export function getXPInfo() {
  const earnedActivities = readArray(XP_KEY);

  const xp = earnedActivities.reduce((total, activity) => {
    if (activity.startsWith("lesson:")) {
      return total + XP_REWARDS.lesson;
    }

    if (activity.startsWith("story:")) {
      return total + XP_REWARDS.story;
    }

    if (activity.startsWith("mission:")) {
      return total + XP_REWARDS.mission;
    }

    return total;
  }, 0);

  const safeXP = Math.min(xp, 500);

  const currentLevel = [...LEVELS]
    .reverse()
    .find((level) => safeXP >= level.minXP) ?? LEVELS[0];

  const nextLevel = LEVELS.find(
    (level) => level.level === currentLevel.level + 1
  );

  const xpIntoLevel = nextLevel
    ? safeXP - currentLevel.minXP
    : safeXP - currentLevel.minXP;

  const xpNeededForNextLevel = nextLevel
    ? nextLevel.minXP - currentLevel.minXP
    : 0;

  return {
    xp: safeXP,
    level: currentLevel.level,
    levelName: currentLevel.name,
    nextLevelXP: nextLevel?.minXP ?? 500,
    xpIntoLevel,
    xpNeededForNextLevel,
    progressPercent: nextLevel
      ? Math.min(
          100,
          Math.round((xpIntoLevel / xpNeededForNextLevel) * 100)
        )
      : 100,
    maxXP: 500,
    earnedActivities: earnedActivities.length,
  };
}
