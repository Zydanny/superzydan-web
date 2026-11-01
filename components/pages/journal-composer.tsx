"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { cn } from "cn";
import { NeonButton } from "@/components/neon-button";
import {
  cleanJournalText,
  draftXPost,
  JOURNAL_MAX_LENGTH,
  JOURNAL_MOODS,
  JOURNAL_TYPES,
  X_LIMIT,
  xIntentUrl,
  xLength,
  type JournalMood,
  type JournalType,
} from "@/lib/journal-shared";

const PASSWORD_KEY = "journal-password";
const DRAFT_KEY = "journal-draft";

function load(key: string) {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function save(key: string, value: string) {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    // Private browsing or blocked storage: the composer still works, it just forgets.
  }
}

type Published = { url: string; branch: string; xText: string | null };

/*
 * My phone composer for public journal entries. Publish sends the entry to
 * /api/journal, which commits it to GitHub; the site rebuilds and it shows up
 * on /journal. The X post is a draft: "Post to X" opens X with it filled in,
 * and nothing goes out until I tap Post there. The unsent entry is kept on
 * this device so a closed tab doesn't lose it.
 */
export function JournalComposer() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [type, setType] = useState<JournalType>("thought");
  const [mood, setMood] = useState<JournalMood | null>(null);
  const [text, setText] = useState("");
  const [xEnabled, setXEnabled] = useState(true);
  const [xText, setXText] = useState("");
  const [xEdited, setXEdited] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [published, setPublished] = useState<Published | null>(null);

  // Read saved values after mounting, so the server render and the first client render match.
  useEffect(() => {
    const saved = load(PASSWORD_KEY);
    const draft = load(DRAFT_KEY);
    /* eslint-disable react-hooks/set-state-in-effect -- one-time restore from this device's storage */
    if (saved) {
      setPassword(saved);
      setRemember(true);
    }
    if (draft) setText(draft);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const xDraft = xEdited ? xText : draftXPost(text);
  const xCount = xLength(xDraft);
  const xOver = xCount > X_LIMIT;
  // The entry didn't fit, so the draft is only part of it.
  const xTrimmed = !xEdited && xLength(cleanJournalText(text).replace(/\s*\n+\s*/g, " ")) > X_LIMIT;

  function onTextChange(value: string) {
    setText(value);
    save(DRAFT_KEY, value);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError("");
    if (!text.trim()) return setError("Write something first.");
    if (!password) return setError("Type your journal password.");
    if (xEnabled && xOver) return setError(`Trim the X post to ${X_LIMIT} characters, or turn it off.`);

    setBusy(true);
    try {
      const response = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, type, mood, text }),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string; url?: string; branch?: string };
      if (!response.ok || !result.url) {
        setError(result.error ?? "That didn't publish. Try again.");
        return;
      }
      save(PASSWORD_KEY, remember ? password : "");
      save(DRAFT_KEY, "");
      setPublished({ url: result.url, branch: result.branch ?? "master", xText: xEnabled && xDraft ? xDraft : null });
    } catch {
      setError("Couldn't reach the site. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  function startOver() {
    setPublished(null);
    setText("");
    setMood(null);
    setXText("");
    setXEdited(false);
  }

  if (published) {
    return (
      <div className="grid gap-6 border-2 border-neon-cyan/60 bg-night p-5 sm:p-8">
        <div>
          <p className="text-xl font-extrabold text-white">Published.</p>
          <p className="mt-2 text-haze">
            {published.branch === "master"
              ? "It shows on your journal page in a few minutes, once the site finishes rebuilding."
              : `Saved to the ${published.branch} branch, so it only shows on that branch's test site.`}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {published.xText ? (
            <NeonButton href={xIntentUrl(published.xText)} external>
              Post to X
            </NeonButton>
          ) : null}
          <NeonButton variant="outline" onClick={startOver}>
            Write another
          </NeonButton>
        </div>
        {published.xText ? (
          <p className="text-sm text-haze">
            X opens with the post filled in. Nothing goes out until you tap Post there.
          </p>
        ) : null}
      </div>
    );
  }

  const control =
    "mt-2 w-full border-2 border-neon-violet/50 bg-night px-4 py-3 text-base text-white transition-colors duration-150 outline-none placeholder:text-haze/70 hover:border-neon-violet focus:border-neon-cyan focus-visible:outline-none";
  const chip = (active: boolean) =>
    cn(
      "inline-flex min-h-11 items-center border-2 px-4 text-sm font-bold tracking-wide uppercase transition-colors",
      active ? "border-neon-cyan bg-[#0b1a22] text-white" : "border-neon-violet/50 text-haze hover:border-neon-violet",
    );

  return (
    <div className="chamfer bg-neon-violet/45 p-[2px] [--cut:16px]">
      <form
        ref={formRef}
        onSubmit={onSubmit}
        onKeyDown={(event) => {
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) event.currentTarget.requestSubmit();
        }}
        className="chamfer grid gap-7 bg-night-raised p-5 [--cut:15px] sm:p-8"
      >
        <fieldset>
          <legend className="font-bold text-white">What kind of entry</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(JOURNAL_TYPES).map(([key, entry]) => (
              <button
                key={key}
                type="button"
                aria-pressed={type === key}
                onClick={() => setType(key as JournalType)}
                className={chip(type === key)}
              >
                {entry.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor={`${id}-text`} className="font-bold text-white">
            Entry
          </label>
          <textarea
            id={`${id}-text`}
            value={text}
            onChange={(event) => onTextChange(event.target.value)}
            maxLength={JOURNAL_MAX_LENGTH}
            rows={7}
            placeholder="What's going on?"
            className={cn(control, "min-h-40 resize-y leading-relaxed")}
          />
          <p className="mt-1 text-sm text-haze">Public. Anything private goes in your private journal instead.</p>
        </div>

        <fieldset>
          <legend className="font-bold text-white">
            Mood <span className="font-normal text-haze">(optional)</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {JOURNAL_MOODS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={mood === option}
                onClick={() => setMood(mood === option ? null : option)}
                className={chip(mood === option)}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label className="flex min-h-11 items-center gap-3 font-bold text-white">
            <input
              type="checkbox"
              checked={xEnabled}
              onChange={(event) => setXEnabled(event.target.checked)}
              className="size-5 accent-neon-cyan"
            />
            Draft an X post too
          </label>
          {xEnabled ? (
            <>
              <textarea
                id={`${id}-x`}
                aria-label="X post"
                aria-describedby={`${id}-x-count`}
                value={xDraft}
                onChange={(event) => {
                  setXEdited(true);
                  setXText(event.target.value);
                }}
                rows={4}
                placeholder="Your X post fills in from the entry."
                className={cn(control, "resize-y leading-relaxed")}
              />
              <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-sm">
                <span id={`${id}-x-count`} className={cn("tabular-nums", xOver ? "font-bold text-neon-magenta" : "text-haze")}>
                  {xCount} / {X_LIMIT}
                  {xOver ? " (too long for X)" : ""}
                </span>
                {xEdited ? (
                  <button
                    type="button"
                    onClick={() => {
                      setXEdited(false);
                      setXText("");
                    }}
                    className="inline-flex min-h-11 items-center font-semibold text-neon-cyan hover:text-white"
                  >
                    Refill from the entry
                  </button>
                ) : null}
              </div>
              {xTrimmed ? (
                <p className="mt-1 text-sm text-haze">
                  Your entry is too long for X, so this keeps the opening sentences. Edit it to use a different line.
                </p>
              ) : null}
            </>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${id}-password`} className="font-bold text-white">
            Journal password
          </label>
          <input
            id={`${id}-password`}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={control}
          />
          <label className="mt-2 flex min-h-11 items-center gap-3 text-haze">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="size-5 accent-neon-cyan"
            />
            Remember it on this device
          </label>
        </div>

        {error ? (
          <p role="alert" className="border-2 border-neon-magenta/70 bg-night px-4 py-3 font-semibold text-white">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-4">
          <NeonButton onClick={() => formRef.current?.requestSubmit()}>
            {busy ? "Publishing..." : "Publish"}
          </NeonButton>
          <span className="text-sm text-haze">Ctrl or Cmd + Enter works too.</span>
        </div>
      </form>
    </div>
  );
}
