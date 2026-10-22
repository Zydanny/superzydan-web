"use client";

import { useId, useState, type FormEvent } from "react";
import { CheckIcon, ChevronDownIcon, CopyIcon, SendIcon } from "lucide-react";
import { cn } from "cn";
import { site } from "@/lib/site";

type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "textarea" | "select";
  autoComplete?: string;
  required?: boolean;
  options?: readonly string[];
  hint?: string;
};

/*
 * A form that writes an email: no form service in the middle, so the message
 * goes from the sender's own inbox to mine. Pressing send opens their email
 * app with everything filled in. Because a computer without a mail app does
 * nothing on a mailto link, the form then says what should have happened and
 * offers the address to copy, with the message still there.
 */
export function ContactForm({
  fields,
  subject,
  submitLabel = "Write the email",
}: {
  fields: readonly Field[];
  /** The email subject. {field} is replaced by that field's value, e.g. "Collab inquiry from {company}". */
  subject: string;
  submitLabel?: string;
}) {
  const id = useId();
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = Object.fromEntries(fields.map((field) => [field.name, String(data.get(field.name) ?? "").trim()]));
    const body = fields
      .filter((field) => values[field.name])
      .map((field) => (field.type === "textarea" ? `\n${values[field.name]}\n` : `${field.label}: ${values[field.name]}`))
      .join("\n");
    const filledSubject = subject.replace(/\{(\w+)\}/g, (_, name: string) => values[name] || "a visitor");
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(filledSubject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const control =
    "mt-2 w-full border-2 border-neon-violet/50 bg-night px-4 py-3 text-base text-white transition-colors duration-150 outline-none placeholder:text-haze/70 hover:border-neon-violet focus:border-neon-cyan focus-visible:outline-none";

  return (
    <div className="chamfer bg-neon-violet/45 p-[2px] [--cut:16px]">
      <form onSubmit={onSubmit} className="chamfer grid gap-5 bg-night-raised p-5 [--cut:15px] sm:p-8">
        {fields.map((field) => {
          const fieldId = `${id}-${field.name}`;
          const hintId = field.hint ? `${fieldId}-hint` : undefined;
          return (
            <div key={field.name}>
              <label htmlFor={fieldId} className="font-bold text-white">
                {field.label}
                {field.required ? null : <span className="font-normal text-haze"> (optional)</span>}
              </label>
              {field.hint ? (
                <p id={hintId} className="mt-1 text-sm text-haze">
                  {field.hint}
                </p>
              ) : null}
              {field.type === "textarea" ? (
                <textarea
                  id={fieldId}
                  name={field.name}
                  rows={6}
                  required={field.required}
                  aria-describedby={hintId}
                  className={cn(control, "resize-y")}
                />
              ) : field.type === "select" ? (
                <div className="relative">
                  <select
                    id={fieldId}
                    name={field.name}
                    required={field.required}
                    aria-describedby={hintId}
                    defaultValue=""
                    className={cn(control, "min-h-12 cursor-pointer appearance-none pr-12")}
                  >
                    <option value="" disabled>
                      Pick one
                    </option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 right-4 size-5 translate-y-[calc(-50%+0.25rem)] text-neon-cyan"
                  />
                </div>
              ) : (
                <input
                  id={fieldId}
                  name={field.name}
                  type={field.type ?? "text"}
                  autoComplete={field.autoComplete}
                  required={field.required}
                  aria-describedby={hintId}
                  className={cn(control, "min-h-12")}
                />
              )}
            </div>
          );
        })}

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            className="group/send relative isolate inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 px-6 font-extrabold tracking-wide text-primary-foreground uppercase transition-transform duration-150 ease-(--ease-out) active:scale-[0.97] [--cut:10px]"
          >
            <span
              aria-hidden
              className="chamfer absolute inset-0 -z-10 bg-neon-magenta transition-[filter] duration-200 group-hover/send:brightness-110"
            />
            <SendIcon className="size-4" />
            {submitLabel}
          </button>
          <p className="text-sm text-haze">Opens your email app with this filled in.</p>
        </div>

        <div aria-live="polite">
          {sent ? (
            <div className="border-2 border-neon-cyan/60 bg-night px-4 py-4">
              <p className="font-bold text-white">Your email app should be open with the message ready to send.</p>
              <p className="mt-1 text-pretty text-haze">
                Nothing opened? Send it from wherever you do email to{" "}
                <span className="font-semibold text-white">{site.email}</span>. Your message is still in the form above.
              </p>
              <button
                type="button"
                onClick={copyAddress}
                className="mt-3 inline-flex min-h-11 cursor-pointer items-center gap-2 font-semibold text-neon-cyan transition-colors hover:text-white"
              >
                {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
                {copied ? "Copied" : "Copy the address"}
              </button>
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
}
