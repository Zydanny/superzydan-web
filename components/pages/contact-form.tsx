"use client";

import { useState, type FormEvent } from "react";
import { contactPage } from "@/lib/pages";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = encodeURIComponent(`Site message from ${name || "a visitor"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:${contactPage.email}?subject=${subject}&body=${body}`;
  }

  const field =
    "w-full rounded-xl border border-border bg-card/50 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50";

  return (
    <form onSubmit={onSubmit} className="glass space-y-4 rounded-2xl p-6 md:p-8">
      <div>
        <label htmlFor="contact-name" className="text-eyebrow text-muted-foreground">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={`mt-2 ${field}`}
          required
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="text-eyebrow text-muted-foreground">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={`mt-2 ${field}`}
          required
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="text-eyebrow text-muted-foreground">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className={`mt-2 resize-y ${field}`}
          required
        />
      </div>
      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_0_28px_-8px_var(--glow-emerald)] transition-shadow hover:shadow-[0_0_40px_-4px_var(--glow-emerald)]"
      >
        Open email draft
      </button>
    </form>
  );
}
