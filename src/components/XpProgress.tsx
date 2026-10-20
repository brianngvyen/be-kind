
"use client";

import { useEffect, useState } from "react";
import { getXPInfo } from "@/lib/bekind-xp";

export default function XpProgress() {
  const [info, setInfo] = useState<ReturnType<typeof getXPInfo> | null>(
    null
  );

  useEffect(() => {
    function refreshXP() {
      setInfo(getXPInfo());
    }

    refreshXP();

    window.addEventListener("bekind-xp-updated", refreshXP);
    window.addEventListener("storage", refreshXP);

    return () => {
      window.removeEventListener("bekind-xp-updated", refreshXP);
      window.removeEventListener("storage", refreshXP);
    };
  }, []);

  if (!info) {
    return (
      <div className="rounded-3xl border border-[#E5E9E0] bg-white p-6">
        Loading your XP...
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-[#D8E9DD] bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-[#176B50]">
            Your BeKind journey
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-[#20352D]">
            {info.levelName}
          </h2>

          <p className="mt-2 text-sm text-[#65746C]">
            Level {info.level} of 5
          </p>
        </div>

        <div className="rounded-2xl bg-[#E5F3E9] px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#176B50]">
            Total XP
          </p>
          <p className="mt-1 text-3xl font-extrabold text-[#176B50]">
            {info.xp} <span className="text-base">XP</span>
          </p>
        </div>
      </div>

      <div className="mt-7">
        <div className="mb-3 flex items-center justify-between gap-3 text-sm">
          <span className="font-semibold text-[#20352D]">
            {info.level === 5
              ? "Maximum level reached!"
              : "Progress to next level"}
          </span>

          <span className="font-bold text-[#176B50]">
            {info.level === 5
              ? "500 / 500 XP"
              : `${info.xpIntoLevel} / ${info.xpNeededForNextLevel} XP`}
          </span>
        </div>

        <div
          role="progressbar"
          aria-label="Progress to next BeKind level"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={info.progressPercent}
          className="h-3 overflow-hidden rounded-full bg-[#E8EDE6]"
        >
          <div
            className="h-full rounded-full bg-[#27845F] transition-all duration-500"
            style={{ width: `${info.progressPercent}%` }}
          />
        </div>

        <p className="mt-3 text-sm leading-6 text-[#65746C]">
          {info.level === 5
            ? "You've reached Kindness Champion. Keep learning and helping others!"
            : `${info.nextLevelXP - info.xp} more XP until your next level. Keep going!`}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-[#E8EDE6] pt-5">
        <div>
          <p className="text-xl font-extrabold text-[#20352D]">
            {info.earnedActivities}
          </p>
          <p className="mt-1 text-xs text-[#65746C]">
            Activities rewarded
          </p>
        </div>

        <div>
          <p className="text-xl font-extrabold text-[#20352D]">
            {info.level}
          </p>
          <p className="mt-1 text-xs text-[#65746C]">
            Current level
          </p>
        </div>

        <div>
          <p className="text-xl font-extrabold text-[#20352D]">
            {500 - info.xp}
          </p>
          <p className="mt-1 text-xs text-[#65746C]">
            XP to maximum
          </p>
        </div>
      </div>
    </section>
  );
}

