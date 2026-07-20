import { PageHeader } from "@/components/PageHeader";
import { QaChecklist } from "@/components/tools/QaChecklist";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI App QA Checklist — pre-launch checklist | TasteLoop",
  description: "An interactive pre-launch QA checklist across UX, mobile, auth, data, payments, states, accessibility, performance, security, analytics, SEO, and launch readiness. Export to Markdown.",
};

export default function QaChecklistPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-32">
      <PageHeader eyebrow="Free tool" title="AI App QA Checklist" intro="The pre-launch sweep that turns a working demo into a product users trust. Check off as you go; copy or export the result as Markdown for your repo." />
      <div className="mt-12">
        <QaChecklist />
      </div>
    </div>
  );
}
