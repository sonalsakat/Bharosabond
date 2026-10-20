# Bharosa Bond outcome checklist

Native project ToDo was not exposed by the available Webdev tools; this file is the project checklist. Original acceptance clauses are retained where still applicable, with later follow-up requirements taking precedence over the prior visible sample-data labelling request.

## [x] 1. Brand and established entry screens remain unchanged

> Colors: mostly white (about 80%). Primary purple #6D28D9 (deep #4C1D95) for buttons, headings and key icons. Pink #DB2777 (soft tint #FCE7F3) for small highlights, badges and the mentor's "same worry" tag. Lavender tint #F5F3FF only for section backgrounds. Text #1F2937. Use the pink-to-purple gradient only in the logo and on one hero element, nowhere else.
> Avoid the AI look: no emojis anywhere (use a consistent custom line-icon set, 2px stroke, slightly rounded), no glassmorphism, no glowing gradients on cards, no neon shadows, no identical grids of cards with an icon-title-text pattern, no "Welcome to the future of..." copy, no centered-everything layouts.
> Make it feel crafted: left-aligned text with confident, varied hierarchy; asymmetric layouts; generous but uneven whitespace; one hand-drawn-style illustration per major screen (flat, warm, Indian families, electricians, welders, a mother and son, village scenes) using the palette; thin dividers and subtle paper-like texture on the Family Decision Card; real-sounding microcopy in plain spoken language (as a neighbour would say it, not a brand); realistic names, villages, numbers and timestamps.
> Typography: Poppins or Plus Jakarta Sans for English, Noto Sans Devanagari for Marathi and Hindi. Large headings (28–32px), body at least 18px, strong weight contrast, no more than two weights per screen.
> Shape and motion: corner radius 14–20px, soft but restrained shadows, buttons at least 52px tall. Motion is gentle (ease-out, 200–300ms), with no bouncing or flashy effects.
> Low literacy design: one main action per screen, a speaker button on every screen that reads the text aloud, big microphone as the main input, minimal text, plain words.
> Language toggle at the top: मराठी | हिंदी | English.
> Pure white full-screen background with a very faint lavender radial glow behind the logo.
> Animated logo: the "B" mark is made of two interlocking rings, one purple and one pink. Animate in this sequence: the two rings draw themselves with a stroke animation (0–1s), slide together and link (1–1.6s), then pulse once softly with a subtle ripple. Finally the wordmark "Bharosa Bond" fades up letter by letter, and the tagline "From Doubt to Decision" fades in beneath it in small purple text.
> A thin progress line at the bottom fills from left to right in the pink-purple gradient.
> Add a small rotating line below the tagline in the chosen language, such as "आपल्या माणसांसोबत" (Marathi) or "अपनों के साथ" (Hindi), changing gently once.
> Smooth fade-out transition into the Welcome screen. Respect "reduce motion" by showing a static logo.
> Welcome: logo at the top left, an illustration of a family at a table, the heading "Apla nirnay, apalya manasansobat" (adapt per language), three large language buttons, then two choices: "I am a Parent" and "I am a Learner."

## [x] 2. Remove visible sample/demo status wording without changing unrelated UI

> IMPORTANT: Do NOT change the existing design system, colors, fonts, layout, illustrations, loading screen, copy on unrelated screens, language switcher, progress dots or the admin dashboard. Make ONLY the changes listed below. Reuse the existing components and styles for every new screen.
> Remove every visible mention of demo/sample status: "Sample data", "Demo only", "Nothing you enter is saved in this prototype", "A sample family story", "Sample transcript for the demo", "sample employer", and any similar badges, banners, footers or captions.
> Apply the cleanup across parent, learner and every Admin view in English, Marathi and Hindi, while retaining the underlying records and data.
> Keep the demo users and demo data in the code. The app should look like a clean, working product.
> Mentor employers should read like real local businesses (e.g., "Pune Solar Services") with no "sample" wording.
> No "demo" or "sample" wording appears anywhere on screen.
> Everything not mentioned above looks and behaves exactly as before.

## [x] 3. Real speech input, typed fallback, analysis JSON and explanation

> Use real speech recognition (Web Speech API) with the language set from the chosen language: mr-IN (Marathi), hi-IN (Hindi), en-IN (English). Show the live transcript word by word in the "We heard" box while the parent speaks. Tap the mic to start, tap again to stop, with the waveform animating only while listening.
> Add a typed-input fallback (a text box under the mic) for browsers or phones where speech recognition is unavailable or permission is denied, with a friendly message instead of an error.
> The chips on the right become an OPTIONAL shortcut. If the parent speaks or types, the spoken or typed text decides the concern, and the chips are pre-selected to match what was detected (the parent can change them). If nothing is spoken, the selected chip is used.
> Analyse the text with an LLM call (with a keyword-rule fallback if the call fails) that returns JSON:
> { primary_concern, secondary_concern, trade_mentioned, learner_gender_if_mentioned, sentiment, key_phrases, one_line_summary }
> Concern categories: Low pay, Safety, Respect, Degree is better, Girls' safety, Cost. It must understand Marathi, Hindi and English, including mixed speech.
> The "We understood you" screen must reflect the parent's own words. Example: "You are worried that your child may not get a good job after a degree" with the key phrases highlighted, and a "Yes, that's right / Not quite" choice. "Not quite" lets them re-speak or pick a chip.
> Matching must use ALL of: concern, trade mentioned, district from the profile, language, and learner gender. On the mentor screen, show a short line "Matched with you because: same district, same worry (Degree is better), speaks Marathi".
> Speaking into the microphone shows live words and changes the detected concern and the matched mentor.

## [x] 4. Eight distinct matching stories and a complete accessible story player

> Create at least 8 demo mentor parents (keep Asha from Bhor) covering a mix of concerns, trades, districts and genders, for example:
> 1. Asha, Bhor (Pune): Low pay, Electrician (son)
> 2. Ramesh, Sinnar (Nashik): Safety, Welder (son)
> 3. Sunita, Wai (Satara): Girls' safety, Electrician (daughter)
> 4. Dattatray, Ausa (Latur): Degree is better, Plumber (son who left a BA)
> 5. Meena, Katol (Nagpur): Respect, Welder (daughter)
> 6. Prakash, Baramati (Pune): Cost, Electrician (son, stipend and scholarship)
> 7. Lata, Igatpuri (Nashik): Degree is better, Architecture degree holder who switched to a diploma and now works (matches "job with an architecture degree" type worries)
> 8. Santosh, Karad (Satara): Respect, Plumber (son)
> Each mentor has their own story, own captions, own duration and own illustration scene from the existing art style, so each case visibly shows a different story.
> Stories must play COMPLETELY, from start to finish. Build each story as a full-length player: a sequence of scenes (4 to 6) with captions and narration read aloud in the story's language through speech synthesis. The progress bar and timer advance in real time and the story ends with a closing screen ("Did this help?" Yes / Not yet). Include pause, replay and a captions toggle. If a real video file URL is added to a mentor's data (videoUrl), play that file instead.
> "Not yet" must show the NEXT best-matching mentor, never the same one, and keep going until the list is exhausted.
> Test cases that must work:
> a) "My son wants to be a welder but it is not respectable" -> Respect + Welder mentor
> b) "Mazi mulgi electrician honar, suraksha chi bhiti vatte" -> Girls' safety + Electrician mentor (daughter)
> c) "Degree sodun diploma ghene yogya aahe ka" -> Degree is better mentor
> Each must produce a different mentor and a different story.
> Three different spoken inputs give three different mentors and stories, each playable to the end.
> "Not yet" shows a different mentor each time.

## [x] 5. Consent-first contact, validated details and local configured contact links

> After the parent taps "Yes" on "Did this help?", show a new screen "Want to talk to {mentor name}?" with a short form in the existing style:
> - Parent's name
> - Mobile number (validate 10 digits starting 6 to 9)
> - Preferred call time (3 slot options: Morning, Afternoon, Evening)
> - Preferred language
> - A consent checkbox: "I agree to share my name and number with {mentor name} so she/he can call me."
> - Button: "Request a call"
> Then show a confirmation screen: "{Mentor name} will call you {slot}" plus the mentor's contact card with working "Call" (tel:) and "WhatsApp" (wa.me) buttons and the note "Shared with the mentor's consent". Store mentor numbers in one config file as placeholders that the team can replace with its own test numbers. Do not use real-looking personal numbers.
> Offer a secondary "Not now" link that skips to the Family Decision Card.
> The "Yes" path asks for name, mobile, time slot and consent before showing contact details, and the call and WhatsApp buttons work.

## [x] 6. Separate six-step learner counselling and family invitation

> Step 1, About you: name, class or qualification (8th, 10th, 12th, ITI, graduate), district, subjects they like or are good at (tappable cards).
> Step 2, What do you enjoy? Voice or tap: the learner can speak ("I like fixing things and bikes") with the same live speech recognition as the parent flow, plus tappable interest cards (fixing things, electricity, building, vehicles, computers, helping people, outdoors, design) and a quick 5-question icon quiz.
> Step 3, Your best-fit trades: show the top 3 matches with a fit indicator and a short "why this fits you" based on their answers. Each trade shows: what the job is, a day in the life, training duration, cost or stipend, starting earnings range with source and date, nearby verified training providers, and the NSQF ladder (Course -> Level 4 -> Diploma -> Degree).
> Step 4, "Will my parents agree?": the learner can say or choose what their parents worry about. Show 2 or 3 simple talking points they can use at home in their language.
> Step 5, "Invite my parents": a button that creates a WhatsApp message and a shareable link. When the parent opens that link, the Parent flow starts with the learner's name, chosen trade and the parents' likely concern already filled in, so the family journey is joint.
> Step 6, "My Path" summary: a one-page learner card (a different design from the Family Decision Card) with top trades, next steps and a "Talk to a counsellor" call-back option that uses the same contact form as item 5.
> The Learner flow must not show mentor-parent videos by default. Parents see those.
> The Learner and Parent flows are clearly different.

## [x] 7. Existing dashboard remains intact except the prohibited status labels

> Do NOT change the existing design system, colors, fonts, layout, illustrations, loading screen, copy on unrelated screens, language switcher, progress dots or the admin dashboard. Make ONLY the changes listed below.
> Remove every visible mention of demo/sample status, including similar badges, banners, footers and captions, from the dashboard as well.
> Everything not mentioned above looks and behaves exactly as before.


## [x] 8. Honest localized mentor reasons and live learner fit scores

> “Localize honest district/gender match reasons and expose live answer-based learner fit scores without changing the existing page design.”
> Parent match reasons must state the same district only when the mentor district equals the family district; otherwise name the different district without claiming proximity. Mention concern, trade and language only when the selected mentor matches those values, and mention learner gender only when it was explicitly supplied and matches the mentor’s learner gender.
> In the learner’s five-question quiz, show all three trade scores updating as answers change. Percentages reflect the current selected interests, subjects and answers; localized copy explains that scores do not predict a job or income. Preserve the existing page design.
