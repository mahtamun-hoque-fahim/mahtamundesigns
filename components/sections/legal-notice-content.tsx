"use client";

import { useState } from "react";
import {
  Zap,
  FileText,
  Shield,
  AlertTriangle,
  Ban,
  Scale,
  Landmark,
  MapPin,
  BookOpen,
  Lock,
} from "lucide-react";

type Mode = "legal" | "plain";

type Card = {
  id: string;
  label: string;
  icon: React.ElementType;
  title: { legal: string; plain: string };
  body: { legal: React.ReactNode; plain: React.ReactNode };
  fullWidth?: boolean;
  warning?: boolean;
};

const CARDS: Card[] = [
  {
    id: "ownership",
    label: "01",
    icon: Shield,
    title: {
      legal: "Ownership & Authorship",
      plain: "It's mine.",
    },
    body: {
      legal: (
        <>
          All creative works, designs, visual compositions, brand identities,
          typographic arrangements, illustrations, and any other original content
          appearing on this website are the sole intellectual property of{" "}
          <strong className="text-white">Mahtamun Hoque Fahim</strong>{" "}
          (&ldquo;the Author&rdquo;), operating under the brand name
          &ldquo;Mahtamun.&rdquo;
          <br />
          <br />
          These works are protected from the moment of their creation under the{" "}
          <strong className="text-white">
            Copyright Act, 2000 (Act No. 28 of 2000)
          </strong>{" "}
          of the People&rsquo;s Republic of Bangladesh, without any requirement
          for formal registration.
        </>
      ),
      plain: (
        <>
          Every design, logo, graphic, and visual on this site was made by me —
          Mahtamun Hoque Fahim. I own all of it, in full, without exception.
          <br />
          <br />
          Bangladeshi copyright law backs that up from the second I created it.
          No registration needed. It&rsquo;s mine automatically.
        </>
      ),
    },
  },
  {
    id: "protected-works",
    label: "02",
    icon: BookOpen,
    title: {
      legal: "Scope of Protected Works",
      plain: "This covers everything you can see here.",
    },
    body: {
      legal: (
        <>
          The following categories of original work are protected under this
          notice:
          <ul className="mt-3 space-y-1.5 text-white/60">
            <li className="flex gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
              Graphic designs, brand identity systems, and logo designs
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
              Typographic layouts and color compositions
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
              Digital illustrations and UI/UX designs
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
              Social media creatives and print media designs
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
              YouTube thumbnail designs and visual content
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
              Any other creative output, whether published on this site or
              elsewhere
            </li>
          </ul>
        </>
      ),
      plain: (
        <>
          Every logo. Every brand kit. Every social graphic. Every thumbnail.
          Every layout. Every illustration. Every piece of UI.
          <br />
          <br />
          Whether it&rsquo;s posted here or just shown as a sample — it&rsquo;s
          all protected. The full catalogue, not just the featured ones.
        </>
      ),
    },
  },
  {
    id: "prohibited",
    label: "03",
    icon: Ban,
    title: {
      legal: "Strictly Prohibited Acts",
      plain: "You can't use any of this. Full stop.",
    },
    fullWidth: true,
    warning: true,
    body: {
      legal: (
        <>
          The following acts are{" "}
          <strong className="text-white">strictly prohibited</strong> without
          prior written permission from the Author:
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "Reproduction, copying, or duplication of any protected work in any medium or format",
              "Distribution, publication, or public display of any protected work",
              "Creation of derivative works, adaptations, or works substantially similar in look, feel, or visual composition",
              "Commercial or non-commercial use of any protected work for any purpose",
              "Use with or without attribution — crediting the Author does not constitute permission",
              "Scraping, downloading, or automated collection of any content, assets, or code from this site",
              "Incorporating any protected work into AI training datasets, generative models, or machine learning systems",
              "Sublicensing, transferring, or granting rights to any protected work to a third party",
            ].map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-none border border-red-500/20 bg-red-950/10 p-3"
              >
                <Ban
                  className="mt-0.5 h-4 w-4 shrink-0 text-red-400"
                  strokeWidth={2}
                />
                <span className="text-sm text-white/70">{item}</span>
              </div>
            ))}
          </div>
        </>
      ),
      plain: (
        <>
          Here is the complete list of things you cannot do with my work:
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "Copy it",
              "Print it",
              "Post it online",
              "Share it anywhere",
              "Build something that looks like it",
              "Use it commercially",
              "Use it for free",
              "Download it and use it privately",
              "Run it through an AI model",
              "Hand it to someone else to use",
            ].map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-none border border-red-500/20 bg-red-950/10 p-3"
              >
                <Ban
                  className="mt-0.5 h-4 w-4 shrink-0 text-red-400"
                  strokeWidth={2}
                />
                <span className="text-sm text-white/70">{item}</span>
              </div>
            ))}
          </div>
        </>
      ),
    },
  },
  {
    id: "attribution",
    label: "04",
    icon: AlertTriangle,
    title: {
      legal: "No Attribution Exception",
      plain: '"But I\'ll give you credit" — still no.',
    },
    body: {
      legal: (
        <>
          Under{" "}
          <strong className="text-white">
            Section 14 of the Copyright Act, 2000
          </strong>
          , the Author holds exclusive rights of reproduction, distribution,
          public display, and the creation of derivative works.
          <br />
          <br />
          Attribution and permission are{" "}
          <strong className="text-white">legally distinct</strong> concepts.
          Crediting or attributing a work to the Author does not, in any way,
          grant a license to use, reproduce, adapt, or distribute that work.
          <br />
          <br />
          No use is permitted regardless of whether credit is given, whether the
          Author is tagged, or whether the source is disclosed.
        </>
      ),
      plain: (
        <>
          Tagging me on Instagram is not permission. Writing &ldquo;Design by
          Mahtamun&rdquo; in the caption is not permission. Linking back to this
          site is not permission.
          <br />
          <br />
          Credit and permission are two completely different things under the
          law. You need permission. Credit is just a social convention.
          <br />
          <br />
          &ldquo;I tagged you&rdquo; is not a legal defense. &ldquo;I gave you
          credit&rdquo; is not a legal defense. You still cannot use it.
        </>
      ),
    },
  },
  {
    id: "law",
    label: "05",
    icon: Scale,
    title: {
      legal: "Applicable Legal Provisions",
      plain: "The law backing this up.",
    },
    body: {
      legal: (
        <div className="space-y-4">
          <div>
            <p className="mb-1 font-mono text-xs text-accent">
              Copyright Act, 2000
            </p>
            <p className="text-white/60">
              Act No. 28 of 2000, People&rsquo;s Republic of Bangladesh.
              Sections 14 (exclusive rights), 58 (infringement as an offense),
              78 (civil remedies), and 82 (criminal penalties).
            </p>
          </div>
          <div className="h-px bg-line" />
          <div>
            <p className="mb-1 font-mono text-xs text-accent">
              Cyber Security Act, 2023
            </p>
            <p className="text-white/60">
              Governs unauthorized access, digital reproduction, and online
              infringement of protected content. Replaces the Digital Security
              Act, 2018.
            </p>
          </div>
          <div className="h-px bg-line" />
          <div>
            <p className="mb-1 font-mono text-xs text-accent">
              Code of Civil Procedure, 1908
            </p>
            <p className="text-white/60">
              Provides the procedural basis for civil suits, injunctions, and
              claims for damages arising from infringement.
            </p>
          </div>
        </div>
      ),
      plain: (
        <div className="space-y-3">
          {[
            {
              name: "Copyright Act, 2000",
              note: "The main one. Covers everything.",
            },
            {
              name: "Cyber Security Act, 2023",
              note: "Covers copying my work online specifically.",
            },
            {
              name: "Code of Civil Procedure, 1908",
              note: "How I take you to court.",
            },
          ].map((law) => (
            <div
              key={law.name}
              className="flex items-start gap-3 border-l-2 border-accent/40 pl-3"
            >
              <div>
                <p className="font-mono text-sm text-white">{law.name}</p>
                <p className="font-mono text-xs text-white/50">{law.note}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  },
  {
    id: "penalties",
    label: "06",
    icon: Landmark,
    title: {
      legal: "Penalties for Infringement",
      plain: "What happens if you ignore this.",
    },
    fullWidth: true,
    warning: true,
    body: {
      legal: (
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-none border border-red-500/30 bg-red-950/15 p-5">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-red-400">
              Criminal Penalties
            </p>
            <p className="mb-3 font-mono text-xs text-white/40">
              Section 82 — Copyright Act, 2000
            </p>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex gap-2">
                <span className="text-red-400">—</span>
                Imprisonment of up to{" "}
                <strong className="text-white">four (4) years</strong> for a
                first offense
              </li>
              <li className="flex gap-2">
                <span className="text-red-400">—</span>
                Fine of up to{" "}
                <strong className="text-white">
                  Taka Two Lakh (Tk. 2,00,000)
                </strong>{" "}
                for a first offense
              </li>
              <li className="flex gap-2">
                <span className="text-red-400">—</span>
                Enhanced penalties for repeat offenses: higher imprisonment
                term and increased fine
              </li>
              <li className="flex gap-2">
                <span className="text-red-400">—</span>
                Criminal complaint may be filed at the nearest competent court
              </li>
            </ul>
          </div>
          <div className="rounded-none border border-accent/20 bg-accent/5 p-5">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Civil Remedies
            </p>
            <p className="mb-3 font-mono text-xs text-white/40">
              Section 78 — Copyright Act, 2000
            </p>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex gap-2">
                <span className="text-accent">—</span>
                Injunctive relief to immediately stop the infringing activity
              </li>
              <li className="flex gap-2">
                <span className="text-accent">—</span>
                Monetary damages for losses caused by the infringement
              </li>
              <li className="flex gap-2">
                <span className="text-accent">—</span>
                Account of profits — recovery of any profit made using the work
              </li>
              <li className="flex gap-2">
                <span className="text-accent">—</span>
                Delivery up and destruction of all infringing copies
              </li>
            </ul>
          </div>
        </div>
      ),
      plain: (
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-none border border-red-500/30 bg-red-950/15 p-5">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-red-400">
              Criminal
            </p>
            <p className="text-sm leading-relaxed text-white/70">
              Up to <strong className="text-white">4 years in prison</strong>{" "}
              and a fine of up to{" "}
              <strong className="text-white">Tk. 2,00,000</strong> — for your
              first offense. If you do it again, the punishment goes up.
            </p>
          </div>
          <div className="rounded-none border border-accent/20 bg-accent/5 p-5">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Civil
            </p>
            <p className="text-sm leading-relaxed text-white/70">
              I can get a court order forcing you to{" "}
              <strong className="text-white">stop immediately</strong>, sue you
              for the full value of damages, take back every profit you made
              from my work, and have every infringing copy destroyed.
            </p>
          </div>
        </div>
      ),
    },
  },
  {
    id: "jurisdiction",
    label: "07",
    icon: MapPin,
    title: {
      legal: "Jurisdiction",
      plain: "Where this gets enforced.",
    },
    body: {
      legal: (
        <>
          Any and all disputes, claims, or legal proceedings arising from
          infringement of the rights described in this notice shall be subject
          to the exclusive jurisdiction of the competent courts of the{" "}
          <strong className="text-white">
            People&rsquo;s Republic of Bangladesh
          </strong>
          .
          <br />
          <br />
          This notice constitutes a formal legal assertion of rights under
          Bangladeshi law. The Author reserves the right to pursue legal action
          in any jurisdiction where infringement has occurred or had effect.
        </>
      ),
      plain: (
        <>
          Bangladesh courts. That&rsquo;s where this is enforced.
          <br />
          <br />
          And if the infringement happens elsewhere — if you&rsquo;re in another
          country using my work without permission — I still reserve the right
          to pursue action wherever the infringement took place or had any
          effect.
        </>
      ),
    },
  },
  {
    id: "no-licensing",
    label: "08",
    icon: Lock,
    title: {
      legal: "No Licensing Available",
      plain: "No, you can\u2019t license it either.",
    },
    body: {
      legal: (
        <>
          The Author does{" "}
          <strong className="text-white">not offer any licensing</strong>,
          sublicensing, or permissions for the use of any protected works
          described in this notice. No commercial licensing, creative commons
          licensing, or any other form of permission is available.
          <br />
          <br />
          Inquiries for licensing will not be entertained. There is no
          application process, contact form, or negotiation channel for the use
          of these works.
        </>
      ),
      plain: (
        <>
          There is no licensing option. You cannot pay for it. You cannot ask
          for permission. There is no form to fill in, no email to send, no
          deal to be made.
          <br />
          <br />
          The answer is no. It was always going to be no. Don&rsquo;t ask.
        </>
      ),
    },
  },
];

export function LegalNoticeContent() {
  const [mode, setMode] = useState<Mode>("legal");

  return (
    <section id="legal-content" className="bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        {/* Toggle button + effective date row */}
        <div className="mb-12 flex flex-col gap-4 border-b border-line pb-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-muted">
            Effective:{" "}
            <span className="text-white/60">
              2016 &mdash; present &middot; Last revised: July 2026
            </span>
          </p>

          <button
            onClick={() => setMode(mode === "legal" ? "plain" : "legal")}
            className="group flex items-center gap-2 rounded-none border border-white bg-white px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-black transition-all duration-200 hover:bg-white/90"
          >
            {mode === "legal" ? (
              <>
                <Zap className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
                Summarize this
              </>
            ) : (
              <>
                <FileText className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
                Show full legal text
              </>
            )}
          </button>
        </div>

        {/* Mode label */}
        <div
          className="mb-8 flex items-center gap-3 transition-all duration-300"
          key={mode}
          style={{ animation: "fadeIn 0.3s ease-out both" }}
        >
          <div
            className={`h-1.5 w-1.5 rounded-full ${mode === "legal" ? "bg-accent" : "bg-green-400"}`}
          />
          <p className="font-mono text-xs text-muted">
            {mode === "legal"
              ? "Formal legal text — all citations and provisions included"
              : "Plain language summary — not legal advice, but you get the idea"}
          </p>
        </div>

        {/* Cards grid */}
        <div
          className="grid grid-cols-1 gap-px bg-line md:grid-cols-2"
          key={`grid-${mode}`}
          style={{ animation: "fadeIn 0.35s ease-out both" }}
        >
          {CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className={`group relative bg-bg p-7 transition-colors duration-200 hover:bg-surface ${
                  card.fullWidth ? "md:col-span-2" : ""
                }`}
              >
                {/* Top row */}
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-accent/60">
                      {card.label}
                    </span>
                    <div
                      className={`flex h-7 w-7 items-center justify-center border ${
                        card.warning
                          ? "border-red-500/30 bg-red-950/20"
                          : "border-line bg-surface"
                      }`}
                    >
                      <Icon
                        className={`h-3.5 w-3.5 ${card.warning ? "text-red-400" : "text-accent"}`}
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h2
                  className={`mb-4 font-display text-lg font-semibold leading-tight text-white ${
                    card.fullWidth ? "md:text-xl" : ""
                  }`}
                >
                  {mode === "legal" ? card.title.legal : card.title.plain}
                </h2>

                {/* Body */}
                <div className="font-mono text-sm leading-relaxed text-white/60">
                  {mode === "legal" ? card.body.legal : card.body.plain}
                </div>

                {/* Bottom accent line on hover */}
                <div className="absolute bottom-0 left-0 h-px w-0 bg-accent/40 transition-all duration-300 group-hover:w-full" />
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-12 border-t border-line pt-8">
          <p className="font-mono text-xs leading-relaxed text-muted">
            This legal notice was prepared with reference to the Copyright Act,
            2000 (Act No. 28 of 2000), the Cyber Security Act, 2023, and the
            Code of Civil Procedure, 1908, of the People&rsquo;s Republic of
            Bangladesh. This notice does not constitute legal advice. For legal
            counsel, consult a qualified attorney in your jurisdiction.
          </p>
        </div>
      </div>
    </section>
  );
}
