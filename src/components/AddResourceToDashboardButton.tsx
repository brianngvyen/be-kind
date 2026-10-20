
"use client";

import { useState } from "react";

type EducatorResource = {
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

type ClassroomTask = {
  id: number;
  title: string;
  category: string;
  date: string;
  completed: boolean;
  resourceId?: string;
};

const TASKS_KEY = "bekind-educator-tasks";

export default function AddResourceToDashboardButton({
  resource,
}: {
  resource: EducatorResource;
}) {
  const [message, setMessage] = useState("");
  const [added, setAdded] = useState(false);

  function addToDashboard() {
    try {
      const saved = localStorage.getItem(TASKS_KEY);
      const tasks: ClassroomTask[] = saved ? JSON.parse(saved) : [];

      // Prevent adding the same resource more than once.
      const alreadyAdded = tasks.some(
        (task) =>
          task.resourceId === resource.id ||
          (!task.resourceId && task.title === resource.title)
      );

      if (alreadyAdded) {
        setAdded(true);
        setMessage("This resource is already on your planning board.");
        return;
      }

      const newTask: ClassroomTask = {
        id: Date.now(),
        title: resource.title,
        category: resource.category,
        date: "",
        completed: false,
        resourceId: resource.id,
      };

      localStorage.setItem(
        TASKS_KEY,
        JSON.stringify([...tasks, newTask])
      );

      window.dispatchEvent(
        new CustomEvent("bekind-educator-tasks-updated")
      );

      setAdded(true);
      setMessage("Added to your planning board!");

    } catch {
      setMessage("Unable to save this activity. Please try again.");
    }
  }

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={addToDashboard}
        disabled={added}
        className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
          added
            ? "cursor-default bg-green-100 text-green-800"
            : "bg-[#315c43] text-white hover:bg-[#244832]"
        }`}
      >
        {added ? "✓ Added to planning board" : "+ Add to planning board"}
      </button>

      {message && (
        <p
          role="status"
          className="mt-2 text-sm text-[#315c43]"
        >
          {message}
        </p>
      )}

      {added && (
        <a
          href="/educators/dashboard"
          className="mt-2 inline-block text-sm font-semibold text-[#315c43] underline underline-offset-4"
        >
          Open educator dashboard →
        </a>
      )}
    </div>
  );
}
