"use client";

import { useState } from "react";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { BRAND } from "@/config/brand";

export interface SelectOption { value: string; label: string }

export interface Field {
  name: string;
  label: string;
  type?: "text" | "email" | "url" | "textarea" | "select";
  required?: boolean;
  placeholder?: string;
  options?: Array<string | SelectOption>;
  full?: boolean;
  autoComplete?: string;
}

type FormStatus = "idle" | "submitting" | "ok" | "error";

export function LeadForm({
  leadType,
  leadTypeField,
  fields,
  initialValues = {},
  submitLabel = "Submit",
  successTitle = "Got it — thank you.",
  successBody = "We’ll be in touch shortly.",
  compact = false,
}: {
  leadType: string;
  leadTypeField?: string;
  fields: Field[];
  initialValues?: Record<string, string>;
  submitLabel?: string;
  successTitle?: string;
  successBody?: string;
  compact?: boolean;
}) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  function set(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    if (status === "error") {
      setStatus("idle");
      setError(null);
    }
  }

  function validate(): string | null {
    for (const field of fields) {
      const value = values[field.name]?.trim() ?? "";
      if (field.required && !value) return `Please fill in “${field.label}”.`;
      if (value.length > 5000) return `“${field.label}” is too long.`;
      if (field.type === "email" && value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) return "Please enter a valid email.";
      if (field.type === "url" && value) {
        try { new URL(value); } catch { return "Please enter a complete URL, including https://."; }
      }
    }
    return null;
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) {
      setStatus("error");
      setError(validationError);
      return;
    }

    setStatus("submitting");
    const resolvedLeadType = leadTypeField && values[leadTypeField] ? values[leadTypeField] : leadType;
    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 12000);
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadType: resolvedLeadType, fields: values, hp: honeypot }),
        signal: controller.signal,
      });
      window.clearTimeout(timeout);
      const body = await response.json().catch(() => ({})) as { ok?: boolean; error?: string };
      if (!response.ok || body.ok !== true) throw new Error(body.error || "capture_failed");
      setStatus("ok");
    } catch {
      setStatus("error");
      setError("We couldn’t send this safely. Your answers have not been cleared—try again, or email us directly.");
    }
  }

  if (status === "ok") {
    return (
      <div role="status" className="rounded-2xl border border-loop/35 bg-loop/[0.07] p-6">
        <div className="flex items-center gap-2 text-loop"><Check className="h-5 w-5" /><span className="font-semibold">{successTitle}</span></div>
        <p className="mt-2 text-sm text-white/70">{successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`} noValidate>
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${leadType}-company-site`}>Company website</label>
        <input id={`${leadType}-company-site`} name="company-site" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
      </div>

      {fields.map((field) => {
        const id = `${leadType}-${field.name}`;
        const value = values[field.name] ?? "";
        const commonClass = "w-full rounded-xl border border-line bg-black/35 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/28 hover:border-white/20 focus:border-loop";
        return (
          <div key={field.name} className={field.full || field.type === "textarea" || compact ? "sm:col-span-2" : ""}>
            <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-white/62">
              {field.label}{field.required && <span className="text-signal"> *</span>}
            </label>
            {field.type === "textarea" ? (
              <textarea id={id} name={field.name} rows={5} required={field.required} placeholder={field.placeholder} value={value} onChange={(event) => set(field.name, event.target.value)} className={commonClass} />
            ) : field.type === "select" ? (
              <select id={id} name={field.name} required={field.required} value={value} onChange={(event) => set(field.name, event.target.value)} className={commonClass}>
                <option value="">Select…</option>
                {field.options?.map((option) => {
                  const normalized = typeof option === "string" ? { value: option, label: option } : option;
                  return <option key={normalized.value} value={normalized.value}>{normalized.label}</option>;
                })}
              </select>
            ) : (
              <input id={id} name={field.name} type={field.type ?? "text"} required={field.required} autoComplete={field.autoComplete} placeholder={field.placeholder} value={value} onChange={(event) => set(field.name, event.target.value)} className={commonClass} />
            )}
          </div>
        );
      })}

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-signal/25 bg-signal/[0.06] p-3 text-sm text-white/72 sm:col-span-2">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
          <p>{error} <a className="font-medium text-loop underline decoration-loop/40 underline-offset-2" href={`mailto:${BRAND.email}`}>{BRAND.email}</a></p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <button type="submit" disabled={status === "submitting"} className="inline-flex items-center gap-2 rounded-full bg-loop px-6 py-3 text-sm font-semibold text-ink transition hover:bg-loop/90 disabled:cursor-wait disabled:opacity-60">
          {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
          {status === "submitting" ? "Sending…" : status === "error" ? "Try again" : submitLabel}
        </button>
        <p className="text-xs text-white/35">No sales sequence. We reply personally.</p>
      </div>
    </form>
  );
}
