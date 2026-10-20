# Bharosa Bond — implementation and design plan

## Product scope

Continue the existing **Bharosa Bond — From Doubt to Decision** web prototype in `/home/ubuntu/bharosab`. The follow-up explicitly preserves the current design system, colours, fonts, page layout, illustrations, loading animation, existing copy on unrelated screens, language switcher, progress dots, and admin dashboard structure. Make only the named changes: remove visible sample/demo disclosures from all three interface languages; make parent voice and typed concern input functional and analyzable; introduce eight distinct matching parent stories and a full narration player; gate mentor contact behind consent and a required contact form; and make the learner option a separate six-step counselling flow with a pre-filled family invitation.

Keep all existing demo users and dashboard numbers in source. Do not add sample/demo/prototype labels to the UI. This is still a local Preview implementation rather than a published counselling service; real-world communication is not configured. The learner/parent contact form retains entered details only in page state, makes no server submission, and does not persist them. `src/mentorContacts.ts` will hold deliberately non-routable placeholder phone values that the team must replace with authorised test numbers before testing telephony. A confirmation is only a UI state. The concern text submitted for classification is sent server-side to the project’s managed Manus LLM service, is size-limited, and is not stored or logged by this app; the browser never receives the service credential.

## Implementation and serving

- Preserve the initialized Vite + React + TypeScript app and its existing `public/manus-routes.json` routes `/` and `/admin`. Reuse current controls and styling for the new screens; only append narrowly scoped CSS for player, contact form, story matching explanation, and learner screens. Do not redesign the admin dashboard; only replace sample/demo copy in existing labels/captions/footnotes.
- Parent concern input uses Web Speech API with the selected locale (`mr-IN`, `hi-IN`, `en-IN`), interim word-by-word transcript, start/stop, and friendly typed-input fallback for unsupported or denied microphone access. Chips remain optional editable shortcuts. A same-origin Vite server-only `POST /api/concern-analysis` endpoint calls the live catalog-confirmed `gpt-5-mini` model using the injected `BUILT_IN_FORGE_API_*` credentials and strict JSON-schema output; validate the request/output, cap input and tokens, and use a bounded multilingual keyword-rule classifier whenever the LLM request or output fails. No key or transcript is written into frontend assets, a database, or logs. The LLM endpoint is available in the current Vite Preview process; this follow-up does not enable server/deployment features or publish the site.
- Eight typed mentor fixtures cover the requested concern/trade/gender/district combinations. A deterministic ranking uses concern, trade, district, locale and learner gender, keeps all eight available, and never repeats the same mentor on “Not yet.” Each story has its own narrative, caption sequence, duration and generated illustration. A 4–6-scene browser player speaks captions through Speech Synthesis, supports play/pause/replay/captions, tracks elapsed time and ends with “Did this help?”; an optional `videoUrl` uses the native video player instead. Localized match explanations state “same district” only for an actual district match; otherwise they name the different district without claiming proximity. Concern, trade and language reasons are shown only when those values match, and learner gender is mentioned only when explicitly supplied and matching.
- The “Yes” contact branch becomes a consent-first form with name, validated ten-digit Indian mobile number, chosen time and language, and a required explicit consent checkbox. Only after consent can a local confirmation screen display that mentor’s configured placeholder `tel:` and `wa.me` links. “Not now” returns to the Family Decision Card. The existing card remains intact; its counsellor option reuses this form.
- The learner role branches into its own six-step flow: profile and interests, voice/tappable interests and 5-question icon quiz, three explainable trade recommendations, localized parent talking points, parent invitation link/WhatsApp message with learner name/trade/district/concern prefilled into the parent flow, and a distinct one-page learner path card with next steps and the shared contact form. Quiz scores update as answers are selected; fit percentages reflect the learner’s current interests, subjects and quiz answers, and localized copy explains that they do not predict a job or income. Learner screens show no parent mentor videos. Training duration, cost/stipend, earnings range and district providers are data fixtures backed by verified official/provider and government sources; source links/date are shown. Where a current fee or district course offering cannot be verified, state that limitation rather than inventing figures.
- Keep parent/admin as separate React modules and shared app chrome. Keep copy in the current English/Marathi/Hindi dictionary. Preserve the progress-dot control and use it for new six-step learner screens.

## Project structure

```text
/home/ubuntu/bharosab/
├── README.md
├── plan.md / TODO.md
├── app.config.ts
├── index.html
├── package.json / pnpm-lock.yaml
├── vite.config.ts                    # Vite setup plus server-only Preview analysis middleware
├── public/manus-routes.json          # / and /admin page route manifest
├── public/branding/
│   ├── logo-mark.png
│   ├── family-at-table.webp
│   ├── mentor-family.webp
│   └── story-{asha,ramesh,sunita,dattatray,meena,prakash,lata,santosh}.webp
├── public/data/maharashtra-districts.geojson
└── src/
    ├── main.tsx / App.tsx            # document setup, shared chrome and parent/learner/admin route choice
    ├── styles.css                   # retain existing design system; add scoped new-flow styles only
    ├── components.tsx               # shared brand, language, reader, progress and back controls
    ├── ParentFlow.tsx               # parent journey, voice, confirmation, ranked story and card
    ├── StoryPlayer.tsx               # timed scenes, captions, narration and optional real video
    ├── LearnerFlow.tsx               # separate six-step counselling and share-invite flow
    ├── contactForm.tsx               # consent, validation, confirmation and configured contact links
    ├── concernAnalysis.ts            # client types and local fallback rules
    ├── mentorStories.ts              # eight story/matching fixtures and localized scene narration
    ├── mentorContacts.ts             # replaceable, explicitly non-routable phone placeholders
    ├── trainingData.ts               # sourced wages, course details and district providers
    ├── data.ts                       # existing district, admin and proof records
    ├── AdminDashboard.tsx            # same dashboard; sample/demo display labels removed only
    ├── i18n.ts                       # English, Marathi and Hindi strings
    └── vite-env.d.ts
```

## Design direction — preserve the approved style

- **Design movement:** editorial Indian fintech/education product design with hand-drawn, locally grounded illustration; closer to a neighbourhood service booklet than a generic startup template.
- **Core principles:** neighbourly reassurance; one clear next step at a time; credible local evidence; graceful dignity for parents and learners.
- **Color philosophy:** white remains the breathing room and default canvas; deep purple (#4C1D95) and purple (#6D28D9) signal guidance and action; pink (#DB2777 / #FCE7F3) is a small human highlight; pale lavender (#F5F3FF) remains reserved for section backgrounds. The pink-to-purple gradient remains limited to the logo/progress treatment and the existing hero motif.
- **Layout paradigm:** retain the existing left-aligned editorial composition, uneven whitespace and offset illustration; keep the dashboard’s slim purple rail and open data canvas unchanged.
- **Signature elements:** the existing two-ring “B”; small pink concern highlights; subtle paper grain and fine rules on the Family Decision Card. Story art matches the current warm, hand-painted rural Maharashtra illustrations.
- **Interaction philosophy:** large touch targets, one primary action per screen, plain spoken labels, existing progress dots, existing language/speaker controls, and brief reversible transitions. Make voice, story, filters and forms visibly operable.
- **Animation:** preserve the existing three-second loading sequence and all unrelated motion. New state transitions use the established gentle ease-out timing; respect `prefers-reduced-motion`.
- **Typography system:** preserve Plus Jakarta Sans and Noto Sans Devanagari, existing 28–32px headings, readable body type, and current weights.
- **Brand essence:** a trusted bridge between a family's doubt and an informed local decision; **grounded, warm, dependable**.
- **Brand voice:** direct, spoken and specific, never promotional. Examples: “Aai, let’s hear from a family nearby.” / “We’ll call you in Marathi.”
- **Wordmark & logo:** retain the two interlocking outlined rings forming the existing B mark and Bharosa Bond wordmark.
- **Signature brand color:** Bharosa Purple `#6D28D9`.

## Constraints and assumptions

- The current Preview is a local prototype; the LLM API exists only as server-side Vite Preview middleware and is excluded from static output. Do not publish, configure production server/deployment, create a database, or persist personal details in this follow-up.
- User speech uses browser speech recognition when supported; when permission/recognition fails, typed input and the local rules remain available. A failed/unavailable LLM returns a validated local classification rather than blocking the flow.
- All eight contacts are placeholders and their `tel:`/`wa.me` links are not real destinations. The local “request call”/confirmation state is not delivered to a mentor or counsellor.
- The family invitation is encoded into a share URL for the explicit parent handoff. It contains only learner profile, selected trade, district, preferred language and the parents’ likely concern; no mobile number is included or persisted.
- The ordinary `/admin` layout and interactions remain unchanged; only prohibited demo/sample status wording is removed or replaced with neutral product copy.
