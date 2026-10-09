# IELTS Writing assessment: official standards (research notes for AI scoring)

Researched 2026-10-07. Scope: IELTS Academic and General Training (GT) Writing, Task 1 and Task 2.
Method: official PDFs and pages were downloaded and read directly (PDF text extracted with `pdftotext`; bold runs
extracted with `pdftohtml -xml` so we know which descriptor phrases are the "bolded negative features").
Prep/blog sites were used only to locate primary sources and are never cited as evidence.

Conventions:

- **[verbatim]** = short exact quote. **[paraphrase]** = our wording of the source.
- Source keys (e.g. `[WBD p.4]`) refer to the Sources table. For the band-descriptor PDF, `p.N` is the
  physical PDF page (the PDF also prints its own "Page 1–3" per task; both are given where it matters).
- **UNVERIFIED** = we could not find it in a primary source. **CONFLICT** = primary sources disagree.
- The descriptors are copyrighted by the IELTS partners. Band content below is paraphrased; only short anchor
  phrases are quoted.

---

## Summary

- The **current public Writing band descriptors are the version "Updated May 2023"** (PDF created 2023-05-03,
  last modified 2023-10-18), still the version linked from ielts.org on 2026-10-07. The revision came out of a
  2019–2023 review; it was "introduced operationally from May 2023" and most changes hit TA/TR, the top bands
  (8/9) and the wording about "key features". [WBD p.1], [REVIEW p.1–2, p.10]
- Each Writing task gets four **equally weighted** criteria: Task Achievement (Task 1) or Task Response (Task 2),
  Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy. The task score is the average of the
  four. **Task 2 counts twice as much as Task 1** (Task 1 is one third, Task 2 two thirds). [SCORE], [FMT-AC], [PREP]
- **How the per-task averages and the Writing band are rounded is not published.** The overall-band rounding
  rule is published: average of the 4 skills to the nearest half band, with .25 rounding up to .5 and .75
  rounding up to the next whole band. [SCORE]
- Two descriptor rules matter most for scoring logic: (1) a script **"must fully fit the positive features"** of a
  band to get it, and (2) **"Bolded text indicates negative features that will limit a rating"**. Bolded caps
  include: T2 "incompletely addressed" (B5), T2 "Paragraphing may be inadequate or missing" (B5), T1 "There may be
  no data to support the description" (B5), GT "Not all bullet points are presented" (B4), format/tone
  inappropriate (B4), "Subordinate clauses are rare and simple sentences predominate" (B4). [WBD p.3–9]
- Hard length rules that are actually published: at least 150 / 250 words; **responses of 20 words or fewer are
  rated Band 1** on every criterion; **copied rubric (prompt text) is discounted**; an answer that is too short
  "may not" give enough evidence for higher bands. **No public fixed penalty per missing word exists in the 2023
  materials.** [WBD p.5, p.9], [FMT-AC], [FMT-GT]
- Off-topic writing, notes or bullet points, and plagiarism are penalised (plagiarism "severely"). Proof that a
  whole answer was memorised gives **Band 0**. Memorised or formulaic chunks and language lifted from the input
  are band 3–4 features in LR and GRA. [FMT-AC], [FMT-GT], [KAC p.1], [WBD p.5, p.9]
- Academic Task 1 is judged on choosing key features, giving an **overview** (a clear one is needed for Band 7+),
  and backing it with **data**. GT Task 1 is judged on covering **all three bullet points**, a **clear purpose**
  and a **consistent, appropriate tone**. [WBD p.3–5], [KAC p.2], [PREP]
- The official CEFR alignment, which applies to **overall** band scores only: B1 ≈ 4.0–5.0, B2 ≈ 5.5–6.5,
  C1 ≈ 7.0–8.0, C2 ≈ 8.5+. Band 5 and Band 8 are borderline, and the C1 threshold lies between 6.5 and 7. ielts.org
  maps nothing below 4.0. **CONFLICT:** an IDP page gives A1/A2 mappings. [CEFR-ORG], [CEFR-NEWS]

---

## Sources

| Key | Title | URL | Version / date | Covers |
|---|---|---|---|---|
| WBD | IELTS Writing Band Descriptors (Task 1 + Task 2, AC + GT), 9-page PDF | https://ielts.org/cdn/Guides/ielts-writing-band-descriptors.pdf (identical file, md5 `6275761d…`, at https://ielts.org/cdn/ielts-guides/ielts-writing-band-descriptors.pdf) | Cover: "Updated May 2023". PDF metadata: created 2023-05-03, modified 2023-10-18. Linked as current from ielts.org on 2026-10-07 | All band descriptors 0–9 for all criteria. Physical pp.3–5 = Task 1 (printed "Page 1–3"); pp.7–9 = Task 2 (printed "Page 1–3") |
| KAC | IELTS Writing Key Assessment Criteria, 4-page PDF | https://ielts.org/cdn/Guides/ielts-writing-key-assessment-criteria.pdf | PDF created 2023-05-03, modified 2023-10-18 | What each criterion assesses; AC vs GT Task 1; plagiarism/notes rule |
| SCORE | IELTS scoring in detail (ielts.org) | https://ielts.org/take-a-test/your-results/ielts-scoring-in-detail | Accessed 2026-10-07 (no page date) | Overall band averaging and rounding, Writing criteria weighting, general band descriptions |
| FMT-AC | IELTS Academic: Writing test format | https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-writing | Accessed 2026-10-07 | Task specs, timings, min words, penalties, style |
| FMT-GT | IELTS General Training: Writing test format | https://ielts.org/take-a-test/test-types/ielts-general-training-test/ielts-general-training-format-writing | Accessed 2026-10-07 | Same for GT; letter styles; 3 bullet points |
| PREP | Writing test preparation resources (official video transcripts) | https://ielts.org/take-a-test/preparation-resources/writing-test-resources | Accessed 2026-10-07 | Official explanations of band thresholds: overview for B7, bullets for B6, "limited to Band 5" rules, systematic vs non-systematic errors, paragraphing expectations |
| NEWS-2023 | "IELTS Writing band descriptors and key assessment criteria" (news) | https://ielts.org/news-and-insights/ielts-writing-band-descriptors-and-key-assessment-criteria | Published 03 May 2023 | Release of the full examiner scales |
| REVIEW | IELTS Writing Scales Review and Update – summary overview (Clark et al.) | https://ielts.org/cdn/Research/ielts-writing-scales-review-and-update-summary-overview-clark-et-al-2023.pdf | November 2023 (PDF dated 2023-11-14) | Why and how the descriptors were revised; operational from May 2023 |
| CEFR-ORG | IELTS and the CEFR (for organisations) + chart image | https://ielts.org/organisations/ielts-for-organisations/compare-ielts/ielts-and-the-cefr ; chart: https://ielts.org/cdn/ielts-ui-and-design/ielts-illustrations/cefr-to-ielts-band-score-comparison-chart.webp | Accessed 2026-10-07 | Official IELTS↔CEFR chart + FAQ (borderlines, C2) |
| CEFR-NEWS | Everything you need to know about IELTS and the CEFR | https://ielts.org/news-and-insights/everything-you-need-to-know-about-ielts-and-the-cefr | Published 17 Nov 2023 | Quick-guide mapping B2/C1 |
| IDP-TIPS | 10 tips to improve your Writing band score (IDP IELTS) | https://ielts.idp.com/prepare/article-10-tips-improve-your-ielts-writing-band-score | Accessed 2026-10-07 | Confirms one-third / two-thirds weighting |
| IDP-CEFR | IELTS and CEFR levels (IDP IELTS Canada) | https://ielts.idp.com/canada/prepare/article-ielts-and-cefr-levels | Accessed 2026-10-07 | Contains A1/A2 mappings that conflict with ielts.org (see CONFLICT) |
| BC-WBD (mirror) | British Council copy of the band descriptors | https://takeielts.britishcouncil.org/sites/default/files/[downloads]/ielts_writing_band_descriptors.pdf | Search-index title "Updated May 2023". Download timed out, so not byte-compared | Mirror of WBD |

Local copies (outside the repo) are in the session scratchpad: `research-ielts/`.

---

## Q1. The four criteria, band by band

### General rules printed on every descriptor page

- [verbatim] "A script must fully fit the positive features of the descriptor at a particular level." [WBD p.3–5, p.7–9, header]
- [verbatim] "Bolded text indicates negative features that will limit a rating." [WBD same header]
- Bolded phrases, extracted from the PDF font runs:
  - Task 1: B5 TA "There may be no data to support the description." B4 TA "(General Training) Not all bullet points
    are presented.", "The tone may be inappropriate.", "The format may be inappropriate." B4 LR "unrelated to the
    task". B4 GRA "Subordinate clauses are rare and simple sentences predominate." B3 GRA "Length may be insufficient
    to provide evidence of control of sentence forms." B2 CC "the entire response may be off-topic." B1 (all criteria)
    "Responses of 20 words or fewer are rated at Band 1."; TA "The content is wholly unrelated to the task." B0 "where
    there is proof that a candidate's answer has been totally memorised." [WBD p.3–5]
  - Task 2: B5 TR "incompletely addressed". B5 CC "Paragraphing may be inadequate or missing." B4 TR "The format may be
    inappropriate." B4 LR "unrelated to the task". B4 GRA "Subordinate clauses are rare and simple sentences
    predominate." B3 GRA "Length may be insufficient…". B2 CC "entire response may be off-topic." B1 "Responses of 20
    words or fewer…" and "The content is wholly unrelated to the prompt." B0 the same memorisation clause. [WBD p.7–9]
- What each criterion assesses [paraphrase, KAC p.1–4]:
  - **TA (T1):** how fully, appropriately, accurately and relevantly the response meets the task, using at least 150 words.
  - **TR (T2):** how fully the candidate responds; how well main ideas are extended and supported; relevance; how
    clearly the candidate opens the discourse, sets out a position and draws conclusions; format.
  - **CC:** logical organisation and progression, paragraphing for topic organisation, sequencing within and across
    paragraphs, flexible reference and substitution, appropriate discourse markers.
  - **LR:** range (synonyms to avoid repetition), adequacy and appropriacy (topic items, markers of attitude),
    precision, control of collocation/idiom/sophisticated phrasing, density and effect of spelling and word-formation
    errors.
  - **GRA:** range and appropriacy of structures (simple, compound, complex), their accuracy, density and effect of
    grammar errors, punctuation.

### 1a. Task Achievement (Task 1) — [WBD p.3–5]

| Band | Key observable features [paraphrase] | Anchor [verbatim] |
|---|---|---|
| 9 | All task requirements met fully and appropriately. Lapses in content are extremely rare. | "fully and appropriately satisfied" |
| 8 | Covers all requirements appropriately, relevantly and sufficiently. **AC:** key features skilfully selected, then clearly presented, highlighted and illustrated. **GT:** every bullet clearly presented and appropriately illustrated or extended. Occasional omissions or lapses. | "Key features are skilfully selected" |
| 7 | Covers the requirements. Content relevant and accurate, with a few omissions or lapses. Format appropriate. **AC:** selected key features covered and clearly highlighted, but could be illustrated or extended more fully. A clear overview; data appropriately grouped; main trends or differences identified. **GT:** all bullets covered and clearly highlighted, but could be extended more; a clear purpose; tone consistent and appropriate; minimal lapses. | "It presents a clear overview" |
| 6 | Focuses on the requirements; format appropriate. **AC:** selected key features covered and adequately highlighted; an overview is attempted; information appropriately selected and supported with figures/data. **GT:** all bullets covered and adequately highlighted; purpose generally clear; minor slips in tone. Some irrelevant, inappropriate or inaccurate detail. Some details missing or excessive; more extension needed. | "A relevant overview is attempted." |
| 5 | Generally addresses the task; format may be inappropriate in places. **AC:** selected key features not adequately covered; detail recounted mechanically; **possibly no supporting data (bold)**. **GT:** all bullets presented, but one or more not adequately covered; purpose sometimes unclear; tone variable and sometimes inappropriate. Tends to focus on details without the bigger picture. Irrelevant or inaccurate material in key areas. Limited detail when extending points. | "The recounting of detail is mainly mechanical." |
| 4 | An attempt to address the task. **AC:** few key features selected. **GT:** **not all bullets presented (bold)**; purpose not clearly explained or confused; **tone may be inappropriate (bold)**. **Format may be inappropriate (bold).** Key features or bullets may be irrelevant, repetitive, inaccurate or inappropriate. | "Few key features have been selected." |
| 3 | Does not address the requirements, possibly because the data, diagram or situation was misunderstood. Key features or bullets largely irrelevant. Limited information, used repetitively. | "does not address the requirements of the task" |
| 2 | Content barely relates to the task. | "barely relates to the task" |
| 1 | ≤20 words, **or** content wholly unrelated. Any copied rubric is discounted. | "Responses of 20 words or fewer are rated at Band 1." |
| 0 | Did not attend or attempt; non-English throughout; or proof the answer was totally memorised. | "proof that a candidate's answer has been totally memorised" |

Note: in WBD the B5 line "tendency to focus on details (without referring to the bigger picture)" carries no
AC/GT label, so it applies to both. [WBD p.4]

### 1b. Task Response (Task 2) — [WBD p.7–9]

| Band | Key observable features [paraphrase] | Anchor [verbatim] |
|---|---|---|
| 9 | Prompt appropriately addressed and explored in depth. A clear, fully developed position directly answers the question(s). Ideas relevant, fully extended, well supported. Lapses extremely rare. | "explored in depth" |
| 8 | Prompt appropriately and sufficiently addressed. Clear, well-developed position. Ideas relevant, well extended and supported. Occasional omissions or lapses. | "appropriately and sufficiently addressed" |
| 7 | **Main parts** of the prompt appropriately addressed. Clear and developed position. Main ideas extended and supported, but may over-generalise or lack focus and precision in support. | "tendency to over-generalise" |
| 6 | Main parts addressed, some more fully than others. Appropriate format. A position directly relevant to the prompt, but conclusions may be unclear, unjustified or repetitive. Main ideas relevant, but some under-developed or unclear; some support less relevant or inadequate. | "conclusions drawn may be unclear, unjustified or repetitive" |
| 5 | Main parts **incompletely addressed (bold)**. Format may be inappropriate in places. A position is expressed, but its development is not always clear. A few limited, under-developed main ideas and/or irrelevant detail. Some repetition. | "incompletely addressed" |
| 4 | Prompt tackled minimally, or the answer is tangential (possibly a misunderstanding). **Format may be inappropriate (bold).** The position is discernible only by reading carefully. Main ideas hard to identify; they may lack relevance, clarity or support. Large parts repetitive. | "the reader has to read carefully to find it" |
| 3 | No part adequately addressed, or the prompt misunderstood. No relevant position, and/or little direct response. Few ideas; may be irrelevant or undeveloped. | "No relevant position can be identified" |
| 2 | Content barely related to the prompt. No position. Glimpses of one or two ideas, undeveloped. | "No position can be identified." |
| 1 | ≤20 words, or wholly unrelated. Copied rubric discounted. | "wholly unrelated to the prompt" |
| 0 | As Task 1. | — |

### 1c. Coherence & Cohesion (Task 1 and Task 2) — [WBD p.3–5, p.7–9]

| Band | Key observable features [paraphrase] (differences between tasks noted) | Anchor [verbatim] |
|---|---|---|
| 9 | Followed effortlessly. Cohesion very rarely draws attention. Minimal lapses. Paragraphing skilfully managed. | "very rarely attracts attention" |
| 8 | Followed with ease. Logically sequenced; cohesion well managed. Occasional lapses. Paragraphing used sufficiently and appropriately. | "followed with ease" |
| 7 | Logically organised, with clear progression throughout (a few minor lapses). A range of cohesive devices, including reference and substitution, used flexibly, with some inaccuracies or some over/under-use. **T2 only:** paragraphing generally supports coherence, and the order of ideas within paragraphs is generally logical. | "clear progression throughout" |
| 6 | Generally coherent, with clear **overall** progression. Cohesive devices used to some good effect, but cohesion within or between sentences may be faulty or mechanical (misuse, overuse, omission). Reference/substitution may lack flexibility or clarity, causing repetition or error. **T2 only:** paragraphing not always logical, and/or the central topic not always clear. | "faulty or mechanical" |
| 5 | Organisation evident but not wholly logical; overall progression may be missing; some underlying coherence. Ideas can be followed, but sentences are not fluently linked. Cohesive devices limited or overused, with some inaccuracy. Repetitive because reference/substitution is weak. **T2 only: paragraphing inadequate or missing (bold).** | "not fluently linked to each other" |
| 4 | Ideas present but not coherently arranged; no clear progression. Relationships unclear or poorly marked. Basic cohesive devices, possibly inaccurate or repetitive. Substitution/referencing inaccurate or absent. **T2 only:** possibly no paragraphing and/or no clear main topic per paragraph. | "no clear progression within the response" |
| 3 | No apparent logical organisation; ideas hard to relate to each other. Minimal sequencers or cohesive devices, which may not show logical relations. Referencing hard to identify. **T2 only:** paragraphing attempts unhelpful. | "no apparent logical organisation" |
| 2 | Little relevant message, **or the entire response may be off-topic (bold)**. Little control of organisational features. | "entire response may be off-topic" |
| 1 | ≤20 words. Fails to communicate any message; a virtual non-writer. | "virtual non-writer" |
| 0 | As above. | — |

Paragraphing differs by task: in Task 1 descriptors it appears only at Bands 8–9; in Task 2 it appears at Bands 3–9.
[WBD p.3 vs p.7–9] The official video confirms this: [verbatim] "In Task 1, as the response is short, using paragraphs is
only important for Bands 8 and 9." and "For Task 2, however, paragraphs are expected at Band 6 and above." [PREP, CC video]

### 1d. Lexical Resource (Task 1 and Task 2) — [WBD p.3–5, p.7–9]

| Band | Key observable features [paraphrase] | Anchor [verbatim] |
|---|---|---|
| 9 | Full flexibility and precise use (T1: "within the scope of the task"; T2: "widely evident"). Wide range, used accurately and appropriately with very natural, sophisticated control. Minor spelling or word-formation errors extremely rare. | "very natural and sophisticated control of lexical features" |
| 8 | Wide resource used fluently and flexibly for precise meaning. Skilful use of uncommon or idiomatic items when appropriate, with occasional slips in word choice or collocation. Occasional spelling or word-formation errors with minimal impact. | "skilful use of uncommon and/or idiomatic items" |
| 7 | Enough range for some flexibility and precision. Some less common or idiomatic items. Awareness of style and collocation, though inappropriacies occur. A few spelling or word-formation errors that do not reduce clarity. | "An awareness of style and collocation is evident" |
| 6 | Generally adequate and appropriate. Meaning generally clear despite a rather restricted range or imprecise word choice. Risk-takers show a wider range but more errors. Some spelling or word-formation errors that do not impede communication. | "generally adequate and appropriate for the task" |
| 5 | Limited but minimally adequate. Simple vocabulary may be accurate, but range allows little variation. Frequent lapses in appropriacy; frequent simplification or repetition. Spelling or word-formation errors noticeable and may cause some difficulty. | "limited but minimally adequate" |
| 4 | Limited and inadequate for, **or unrelated to, the task (bold)**. Basic, repetitive vocabulary. Possibly inappropriate lexical chunks (memorised phrases, formulaic language, language from the input). Word choice, word formation or spelling may impede meaning. | "memorised phrases, formulaic language and/or language from the input material" |
| 3 | Inadequate, possibly because the response is significantly under-length. Possibly over-dependent on input material or memorised language. Very limited control; errors predominate and may severely impede meaning. | "significantly underlength" |
| 2 | Extremely limited; few recognisable strings apart from memorised phrases. No apparent control of word formation or spelling. | "few recognisable strings" |
| 1 | ≤20 words. Only a few isolated words. | "a few isolated words" |
| 0 | As above. | — |

### 1e. Grammatical Range & Accuracy (Task 1 and Task 2) — [WBD p.3–5, p.7–9]

| Band | Key observable features [paraphrase] | Anchor [verbatim] |
|---|---|---|
| 9 | Wide range of structures (T1: "within the scope of the task") with full flexibility and control. Grammar and punctuation appropriate throughout. Minor errors extremely rare. | "full flexibility and control" |
| 8 | Wide range used flexibly and accurately. **Most sentences error-free**; punctuation well managed. Occasional **non-systematic** errors or inappropriacies with minimal impact. | "The majority of sentences are error-free" |
| 7 | A variety of complex structures, used with some flexibility and accuracy. Grammar and punctuation generally well controlled; **error-free sentences are frequent**. A few persistent errors that do not impede communication. | "error-free sentences are frequent" |
| 6 | A mix of simple and complex sentence forms; limited flexibility. Complex structures less accurate than simple ones. Grammar and punctuation errors occur but rarely impede communication. | "A mix of simple and complex sentence forms" |
| 5 | Limited, rather repetitive range. Complex sentences attempted but tend to be faulty; simple sentences are the most accurate. Grammar errors may be frequent and cause some difficulty; punctuation may be faulty. | "greatest accuracy is achieved on simple sentences" |
| 4 | Very limited range. **Subordinate clauses rare; simple sentences predominate (bold).** Some accurate structures, but frequent errors that may impede meaning. Punctuation often faulty or inadequate. | "Subordinate clauses are rare" |
| 3 | Sentence forms attempted, but grammar and punctuation errors predominate (except in memorised or input-copied phrases), so most meaning is lost. **Length may be too short to show control (bold).** | "errors in grammar and punctuation predominate" |
| 2 | Little or no evidence of sentence forms, except memorised phrases. | "little or no evidence of sentence forms" |
| 1 | ≤20 words. No rateable language. | "No rateable language is evident." |
| 0 | As above. | — |

Official clarifications of GRA [PREP, GRA video]:
- [paraphrase] Band 6+ needs a range of sentence forms (simple and complex). Band 7+ also needs "complex structures":
  [verbatim] "passive forms, modal verbs, comparative structures or complex noun phrases".
- [verbatim] "If errors are frequent and cause some difficulty for the reader, then the score for this criterion may be limited to Band 5."
- [paraphrase] Systematic errors are repeated errors with one grammar area (e.g. articles generally wrong).
  Non-systematic errors are occasional slips. The distinction [verbatim] "is not important for Band 7, but it is
  important for Band 8". Band 8 needs most sentences error-free, and its occasional errors must be non-systematic.

Official clarifications of LR [PREP, LR video]:
- [verbatim] "If errors in spelling and/or word formation are noticeable and cause some difficulty for the reader, then the score for Lexical Resource will be limited to Band 5."
- [paraphrase] "Minimally adequate" range = Band 5. Band 6 needs more range than that. Error *frequency* and error
  *impact on communication* both count.

---

## Q2. Academic Task 1 vs General Training Task 1

### Task requirements

| | Academic Task 1 | General Training Task 1 |
|---|---|---|
| Input | One or more graphs, charts or tables, or a diagram of an object, device, process or event [paraphrase, FMT-AC]. Also maps or plans [paraphrase, PREP; KAC p.2 lists "map"] | A situation; the reply is a letter. The task lists what to include as **three bullet points** [paraphrase, FMT-GT] |
| What to write | Describe the visual information "in your own words"; include the most important points; minor details may be left out [verbatim/paraphrase, FMT-AC] | Ask for or give information, explain a situation, state needs/likes, express opinions or complaints [paraphrase, FMT-GT] |
| Style | [verbatim] "academic or semi-formal/neutral style" [FMT-AC]; "formal or neutral" [PREP] | Personal, semi-formal or formal, depending on the reader and purpose [paraphrase, FMT-GT] |
| Scope | [verbatim] "information-transfer task". It concerns the factual content of the visual, "not to speculative explanations that lie outside the given data" [KAC p.2] | The task sets the context, purpose and functions to cover [paraphrase, KAC p.2] |
| Format | Written in full: no sub-headings, no bullet points, **no greeting at the start or name at the end**, no diagrams or tables [paraphrase, PREP] | Opening greeting and a clear sign-off; no sub-headings or bullets [paraphrase, PREP]. [verbatim] "You do not need to write any addresses at the top of your letter." [FMT-GT] |

### How TA is judged differently

- **Academic** [paraphrase, KAC p.2]: select key features; give enough detail to illustrate them; report figures and
  trends accurately; compare and contrast by highlighting trends, main changes or differences ("rather than
  mechanical description reporting detail"); use an appropriate format.
  - **Overview:** Band 7 needs [verbatim] "a clear overview" and Band 6 needs "A relevant overview is attempted"
    [WBD p.3–4]. The official video defines an overview as the part that summarises the main trends, changes or
    number of steps. It adds: [verbatim] "A clear overview is important for Band 7 or higher." A text that does not
    summarise the main points is [verbatim] "not adequate enough to achieve Band 6". An introduction is not an
    overview [paraphrase]. [PREP, TA Academic video]
  - **Key features** are trends over time, steps in a process, or major changes in maps or plans. Support them with
    figures or locations [paraphrase, PREP].
  - **Data:** Band 6 supports the information "using figures/data". At Band 5, "There may be no data to support the
    description" is bolded, so it caps the score [WBD p.4].
- **General Training** [paraphrase, KAC p.2]: explain the letter's purpose clearly; fully address all three
  bullets; extend each one appropriately and relevantly; use an appropriate letter format; keep a suitable tone
  throughout.
  - **Bullets:** B6 = all covered and adequately highlighted. B5 = all presented, but one or more inadequately covered.
    B4 = **not all presented (bold)** [WBD p.3–4]. The official video says: [verbatim] "For Band 6 or higher, you
    need to cover each bullet point." Plural or two-part bullets ("suggestions", "problems… and why") need every
    part covered [paraphrase, PREP].
  - **Purpose:** B7 "clear purpose"; B6 "generally clear"; B5 "may be unclear at times"; B4 "not clearly explained
    and may be confused" [WBD]. The video advises stating the purpose in the opening paragraph for Band 7+
    [paraphrase, PREP].
  - **Tone:** B7 "consistent and appropriate"; B6 "minor inconsistencies"; B5 "variable and sometimes
    inappropriate"; B4 "may be inappropriate" (bold) [WBD]. Minimal tone lapses still allow Band 7 [paraphrase, PREP].
  - **Format:** [verbatim] "For Band 6 or higher, the format you use must be appropriate." [PREP]

---

## Q3. Official task specs and edge cases

| Topic | Official position | Source |
|---|---|---|
| Total time | 60 minutes, 2 tasks, both compulsory | [verbatim] "There are two Writing tasks and BOTH must be completed." [FMT-AC], [FMT-GT] |
| Task 1 | At least 150 words, about 20 minutes ("no more than 20 minutes") | [FMT-AC], [FMT-GT] |
| Task 2 | At least 250 words, about 40 minutes | [FMT-AC], [FMT-GT] |
| Weighting | [verbatim] "Task 2 contributes twice as much as Task 1 to the Writing score." | [FMT-AC], [FMT-GT] |
| Under-length (general) | [verbatim] "If your answer is too short, there may not be enough evidence of the language features needed in order to award higher bands." | [FMT-AC], [FMT-GT] |
| Under-length (descriptors) | LR B3: resource inadequate, possibly because the response is "significantly underlength". GRA B3: "Length may be insufficient to provide evidence of control of sentence forms" (bold) | [WBD p.5, p.9] |
| Very short | [verbatim] "Responses of 20 words or fewer are rated at Band 1." (all four criteria, both tasks) | [WBD p.5, p.9] |
| Over-length | Not penalised, but costs time; in Task 2 some ideas may drift off the question [paraphrase] | [FMT-AC], [FMT-GT] |
| Word-count basis | TA and TR assess coverage "using a minimum of 150 words" (T1) and "250 words" (T2) [verbatim] | [KAC p.1–2], [FMT-AC] |
| Off-topic / irrelevant | [verbatim] "you will be penalised if what you write is not related to the topic". Descriptors: T1 B1 "wholly unrelated"; B2 "barely relates"; CC B2 "entire response may be off-topic" (bold); LR B4 "unrelated to the task" (bold); T2 B4 "tangential" | [FMT-AC], [FMT-GT], [WBD] |
| Notes / bullet points | [verbatim] "You must not write your answers as notes or bullet points." Penalised if not "a whole piece of connected text". KAC: scripts may be penalised if "not written as full, connected text (e.g. using bullet points in any part of the response, or note form…)" | [FMT-AC], [FMT-GT], [KAC p.1] |
| Plagiarism | [verbatim] "You will be severely penalised if your writing is plagiarised" (copied from another source). KAC: "partly or wholly plagiarised" | [FMT-AC], [FMT-GT], [KAC p.1] |
| Memorised language | B0 only with proof the whole answer is "totally memorised" (bold). LR B4: inappropriate memorised or formulaic chunks. LR B3: "over-dependence on input material or memorised language". GRA B3/B2: accuracy only in memorised phrases | [WBD p.5, p.9] |
| Copied from the prompt | [verbatim] "Any copied rubric must be discounted." (printed in the TA/TR column, Band 1 row). LR B4 and GRA B3 also treat "language from the input material" as a low-band feature | [WBD p.5, p.9] |
| Non-English | Band 0 if a language other than English is used "throughout" | [WBD p.5, p.9] |
| No paragraphs | T2: B5 "Paragraphing may be inadequate or missing" (bold); B4 "may be no paragraphing"; B6 "may not always be logical". T1: paragraphing is mentioned only at B8–9 | [WBD p.3, p.8–9], [PREP] |
| Format | "Format may be inappropriate in places" at B5; "may be inappropriate" (bold) at B4 (TA and TR) | [WBD p.4–5, p.8–9] |
| Spelling variety | British or American English both accepted [paraphrase] (IDP article; not confirmed on ielts.org) | https://ielts.idp.com/prepare/article-myths-about-the-ielts-writing-test-to-dispel |

**UNVERIFIED:** how examiners count words (hyphenated words, contractions, numbers, symbols, letter salutations,
titles), any fixed deduction per missing word, and whether a copied rubric is removed from the word count (vs only
from the rating). These rules circulate on prep sites but we found no ielts.org, British Council, IDP or Cambridge
source for them. They are presumably in the confidential Instructions to Examiners (ITE). The REVIEW report confirms
the ITE covers "how to rate under-length responses", without giving details [REVIEW p.8–9].

---

## Q4. How the Writing band is computed

Official:
- [verbatim] "Each task is assessed independently. The criteria are weighted equally and the score on the task is the average. The assessment of Task 2 carries more weight in marking than Task 1." [SCORE, Writing section], [PREP]
- [verbatim] "Task 1 is worth a third of your overall mark for Writing. Task 2 is worth two thirds." [PREP, intro video transcript]. IDP says the same [IDP-TIPS].
- Descriptors exist only for whole bands 0–9, so criterion scores are presumably whole bands. [paraphrase, inferred from WBD; **not stated explicitly** → UNVERIFIED as a rule]
- Writing can be reported in half bands. The worked example in [SCORE] gives a Writing score of 5.5 (Test taker C).
  Unlike Listening and Reading, [SCORE] does not say "whole and half bands" for Writing.
- Overall band: [verbatim] "The overall band score is the average of the four section band scores rounded to the
  nearest half band." [verbatim] "If the average of the four sections ends in .25, the overall band score is rounded
  up to the next half band, and if it ends in .75, the overall band score is rounded up to the next whole band."
  Worked examples: 6.25→6.5; 3.875→4.0; 6.125→6.0 [SCORE]. This equals
  `overall = floor(2*mean + 0.5) / 2` (nearest half, ties rounding up).

**Not officially published (UNVERIFIED):**
- How the four criterion scores are averaged and rounded into a task score (e.g. round down vs nearest half).
- The exact formula combining the two task scores, and how it is rounded to the reported Writing band. `(T1 + 2·T2)/3`
  is the natural reading of "a third / two thirds", but no primary source states the formula or its rounding.

---

## Q5. IELTS ↔ CEFR (official)

From the official ielts.org chart [CEFR-ORG chart image], read visually, and the FAQ on the same page:

| CEFR | IELTS band (overall) | Notes |
|---|---|---|
| C2 | 8.5–9 | [verbatim] "Band scores of 8.5 and higher are recognised as C2. Band 8 is borderline." [CEFR-ORG FAQ 4] |
| C1 | 7.0–8.0 | [verbatim] "IELTS 7–8 correspond to CEFR level C1" [CEFR-NEWS]. The C1 threshold [verbatim] "would fall between the 6.5 and 7 bands" [CEFR-ORG FAQ 3] |
| B2 | 5.5–6.5 | [verbatim] "an IELTS score of 5.5–6.5, this is equivalent to CEFR level B2" [CEFR-NEWS] |
| B1 | 4.0–5.0 | From the chart. Band 5 named as borderline B1/B2 [paraphrase, CEFR-ORG FAQ 3] |
| A2, A1 | not mapped | The chart's IELTS bar stops at 4 [CEFR-ORG chart] |

Caveats [verbatim, CEFR-ORG]: the figure shows "overall band scores, not the individual band scores for Listening,
Reading, Writing, and Speaking". It should not be read as "strong claims about exact equivalence". So no official
CEFR mapping exists for the Writing band alone. Any per-skill CEFR label in our app is our own extrapolation.

**CONFLICT:** [IDP-CEFR] (IDP, a co-owner of IELTS) gives A2 = 3.0–3.5 and A1 = 2.0–3.0 (2.0–2.5 in some search
snippets). ielts.org maps nothing below 4.0. Within IDP's own table, 3.0 falls in both A1 and A2.
**Minor CONFLICT:** [CEFR-NEWS] says C2 "corresponds approximately to IELTS band 9", while [CEFR-ORG] says 8.5+ is C2.

---

## Scoring guide for AI (derived)

> **This section is OUR INTERPRETATION, not official IELTS text.** Each point cites the official items it is derived
> from. Use it to build prompts and code. Do not present it to users as an official IELTS rule.

### D0. Global scoring procedure (derived)

1. **Pre-checks in code** (see D5) run before any LLM judgement. Hard outcomes: ≤20 words → all criteria = 1;
   no English → 0. [WBD p.5, p.9]
2. **Score each criterion separately with whole bands 0–9.** [WBD; SCORE "criteria are weighted equally"]
3. **Floor rule ("must fully fit"):** award the highest band whose *positive* features are **all** present. A
   feature missing at band N means the score cannot be N, even if higher-band features show up elsewhere.
   [WBD header "must fully fit the positive features"]
4. **Ceiling rule (bold caps):** if a bolded negative feature of band N is present, the criterion is capped at N.
   This reading is ours: the official text only says such features "will limit a rating". [WBD header + bold runs]
5. **Explicit caps from official explanations:** T2 main part of prompt not discussed → TR ≤5. Spelling/word-formation
   errors noticeable and causing difficulty → LR ≤5. Frequent grammar errors causing difficulty → GRA ≤5 (official
   wording: "may be limited"). Academic T1 with no real overview → TA ≤5. GT bullet missing → TA ≤4. [PREP; WBD p.4–5]
6. **Task score** = mean of 4 criteria. **Writing** = (T1 + 2·T2)/3. Rounding is unpublished. Proposed app
   convention: round each to the nearest 0.5 with ties going **down**, so we never over-promise. Label it as an
   estimate. [SCORE, PREP; rounding UNVERIFIED]
7. **Overall** (only if we ever combine skills): `floor(2*mean + 0.5)/2`. [SCORE]
8. **Evidence requirement for the LLM:** for each criterion, quote 1–3 spans from the essay as evidence for the band
   and name the adjacent-band discriminator (D2) that decided it. This mirrors the "fully fit" logic and makes the
   output auditable. (Pure design choice.)

### D1. Per-criterion checklists (focus Bands 4–8)

Each item is meant to be checkable against the text. Δ = what is new compared with the band below.

**TA — Academic Task 1** [WBD p.3–5; KAC p.2; PREP TA-AC]
- B4: few key features chosen; content may be inaccurate or repetitive; may use bullets or notes (format bold cap).
- B5: describes, but key features under-covered; mechanical detail ("A was X, B was Y…") with little grouping or
  comparison; may have **no numbers at all** (cap 5); no overview, or only an introduction that paraphrases the prompt.
- B6 Δ: an **overview sentence attempts** to summarise the main trend, change or stage count. Key features covered
  and backed by figures from the input. Detail may be missing, excessive or slightly inaccurate.
- B7 Δ: a **clear overview** naming the main trends or differences. Data **grouped** (categories compared rather
  than listed). Figures accurate; all main features present. Illustration could still be fuller.
- B8 Δ: key features **skilfully** chosen. Every main feature highlighted **and** illustrated with apt figures.
  Only occasional omissions. No speculation beyond the data (KAC).

**TA — General Training Task 1** [WBD p.3–5; KAC p.2; PREP TA-GT]
- B4: at least one bullet **not presented** (cap 4); purpose confused; tone wrong for the reader (cap 4); format not a letter.
- B5: all bullets present, but ≥1 thin or partly answered (e.g. one suggestion when "suggestions" was asked);
  purpose unclear at times; tone shifts between registers.
- B6 Δ: every bullet **covered** (all parts of multi-part bullets); purpose generally clear; tone mostly
  appropriate, minor slips; letter format (greeting, sign-off).
- B7 Δ: purpose **clear**, ideally stated in the opening paragraph; tone **consistent**; every bullet clearly
  highlighted (often one paragraph each), though extension could be fuller.
- B8 Δ: every bullet **appropriately illustrated or extended** with relevant detail; only occasional lapses.

**TR — Task 2** [WBD p.7–9; KAC p.2–3; PREP TR]
- B4: answers a related but different question (tangential), or engages minimally; the position is hard to find;
  ideas unclear or unsupported; long repetitive stretches; may be in note form (cap 4).
- B5: misses a main part of the prompt (e.g. discusses "children" but not "families"; one view of a "discuss both
  views" prompt) → **cap 5**; position stated but development unclear; few under-developed ideas; irrelevant detail.
- B6 Δ: **all main parts** addressed, even if unevenly. A relevant position, but the conclusion may be unclear,
  unjustified or just restated. Ideas relevant; some under-developed or weakly supported.
- B7 Δ: position **clear and developed**, consistent from opening to conclusion. Each main idea **extended**
  (explanation) **and supported** (example or evidence). Weaknesses limited to over-generalising or imprecise support.
- B8 Δ: prompt addressed **sufficiently**. Position **well-developed**. Ideas **well** extended and supported, with
  almost no generalisation gaps. Only occasional lapses.

**CC — both tasks** [WBD; KAC p.3; PREP CC]
- B4: no clear progression; relations between ideas unclear; only basic connectors (and/but/so) used repetitively
  or wrongly; pronoun reference absent or wrong; T2 may have no paragraphs or no topic per paragraph.
- B5: some organisation, but the order is partly illogical; sentences joined abruptly; connectors overused
  ("Firstly… Secondly… Moreover… Furthermore…" at every sentence start) or misused; repetition of nouns where
  pronouns would do; **T2 without paragraphs → cap 5**.
- B6 Δ: clear **overall** progression. Connectors work but feel **mechanical** or are sometimes misused. Some
  reference errors. T2 paragraphs exist, but some lack one clear central topic.
- B7 Δ: clear progression **throughout**. A **range** of cohesive devices, including **reference and substitution**
  (this/these/such/the former, pronouns, synonyms). Some over- or under-use allowed. T2: each paragraph has a central
  topic, with logical order inside it.
- B8 Δ: ideas **sequenced** so the text reads with ease. Cohesion **well managed** (devices rarely misused, not
  overused). Paragraphing sufficient and appropriate (this is also when it starts to matter for T1).

**LR — both tasks** [WBD; KAC p.4; PREP LR]
- B4: basic, repetitive vocabulary; prompt wording or memorised template phrases reused inappropriately; word
  choice or spelling errors obscure meaning; off-topic vocabulary (cap 4).
- B5: vocabulary **minimally adequate**, mostly simple and accurate but little variation. Frequent repetition of
  the same words. Frequent inappropriate word choices. Spelling errors noticeable, sometimes hard to read → **cap 5**.
- B6 Δ: **adequate** range; meaning generally clear despite imprecision. Spelling or word-formation errors present
  but never block understanding. A wider, riskier vocabulary with more errors still fits 6.
- B7 Δ: **some less common items** (topic-specific terms, collocations, idiomatic phrasing) **plus awareness of
  style and collocation**. Some inappropriacies allowed. Only **a few** spelling or word-formation errors.
- B8 Δ: **wide** resource, used fluently and **precisely**. Uncommon or idiomatic items used **skilfully** where
  appropriate. Collocation slips only occasional.

**GRA — both tasks** [WBD; KAC p.4; PREP GRA]
- B4: mostly simple sentences; subordinate clauses rare (cap 4). Frequent errors that sometimes block meaning.
  Punctuation often wrong (run-ons, missing full stops).
- B5: complex sentences attempted but usually faulty. Accuracy mainly in simple sentences. Errors frequent and
  sometimes hard to follow → **cap 5**. Faulty punctuation.
- B6 Δ: a **mix** of simple and complex sentences. Complex ones are less accurate. Errors common but **rarely
  impede** understanding.
- B7 Δ: a **variety of complex structures** (passives, modals, comparatives, complex noun phrases, relative and
  conditional clauses). **Error-free sentences are frequent.** A few errors, none impeding.
- B8 Δ: **most sentences error-free.** Remaining errors are occasional and **non-systematic** (no repeated pattern,
  e.g. articles wrong only once or twice, not throughout). Punctuation well managed.

### D2. Discriminating features between adjacent bands (the key part)

| Criterion | 5 vs 6 | 6 vs 7 | 7 vs 8 |
|---|---|---|---|
| **TA (Academic)** | 6 needs an overview **attempted** that summarises main points (an introduction alone stays at 5) and key features supported with **figures**. No data or purely mechanical listing → 5. [WBD p.4; PREP] | 7 needs a **clear** overview of main trends or differences **and** data **grouped** or compared. An attempted or vague overview stays at 6. [WBD p.3–4; PREP "A clear overview is important for Band 7"] | 8 needs key features **skilfully selected and illustrated** (each backed by apt data), with only occasional omissions. 7 covers and highlights but could illustrate more fully. [WBD p.3] |
| **TA (GT)** | 6 needs **every** bullet (and every part of each bullet) covered **adequately**. ≥1 thinly covered → 5. Tone: minor slips are 6, variable tone is 5. [WBD p.3–4; PREP] | 7 needs a **clear** purpose (stated early) and **consistent**, appropriate tone. Bullets clearly highlighted. "Generally clear" purpose with minor tone slips stays at 6. [WBD p.3–4; PREP] | 8 needs every bullet **appropriately illustrated or extended**. 7 covers them but could extend more. [WBD p.3] |
| **TR (T2)** | 6 needs **all main parts** of the prompt addressed and a position **directly relevant** to the prompt. A missed part → 5 ("incompletely addressed", bold). [WBD p.8; PREP "limited to Band 5"] | 7 needs a **clear, developed** position followed through to a logical conclusion, and main ideas **extended and supported**. 6 allows unclear, unjustified or repetitive conclusions and some under-developed ideas. [WBD p.7–8; PREP] | 8 needs the prompt addressed **sufficiently**, a **well-developed** position and ideas **well** extended and supported. 7 is limited by over-generalisation or imprecise support. [WBD p.7] |
| **CC** | 6 needs clear **overall** progression and cohesion that works, even if mechanical. 5 = organisation not wholly logical, sentences not fluently linked, connectors limited or overused. T2 with inadequate or missing paragraphs → 5. [WBD p.4, p.8] | 7 needs progression **throughout** plus a **range** of cohesive devices used **flexibly**, including **reference and substitution**. T2 paragraphs each have a clear central topic. Mechanical or faulty linking stays at 6. [WBD p.3, p.7–8; PREP] | 8 needs logical **sequencing** with cohesion **well managed** (rare misuse or overuse) and sufficient, appropriate paragraphing (also for T1). Some over/under-use of devices stays at 7. [WBD p.3, p.7] |
| **LR** | 6 needs range **adequate** for the task, with spelling or word-formation errors that **do not impede**. Minimally adequate range, frequent simplification or repetition, or spelling that causes difficulty → 5. [WBD p.4, p.8; PREP] | 7 needs **some less common or idiomatic items** plus **awareness of style and collocation**, and only **a few** spelling errors. A restricted range or imprecise word choice stays at 6. [WBD p.3–4, p.7–8; PREP] | 8 needs a **wide** resource used **precisely**, with **skilful** uncommon or idiomatic items and only occasional slips. Noticeable inappropriacies stay at 7. [WBD p.3, p.7] |
| **GRA** | 6 needs a **mix** of simple and complex sentences, with errors that **rarely impede**. Complex sentences mostly faulty, or frequent errors that cause difficulty → 5. [WBD p.4, p.8; PREP] | 7 needs a **variety of complex structures** and **frequent error-free sentences**; errors do not impede. Limited flexibility, or complex structures clearly less accurate, stays at 6. [WBD p.3–4, p.7–8; PREP] | 8 needs a **majority of error-free sentences** and errors that are **non-systematic**. A recurring error pattern (e.g. articles, agreement) holds the score at 7. [WBD p.3, p.7; PREP] |

Operational heuristics for the LLM. These are our proxies, not official thresholds:
- "Error-free sentences frequent" (B7) vs "majority error-free" (B8). Have the LLM count sentences with zero
  grammar/punctuation errors. Proxy: ≥~40–50% → consider 7; >50% plus no repeated error type → consider 8. (Our
  numbers. WBD gives no percentages. [WBD p.3, p.7])
- "Systematic": the same error type appears ≥3 times (our threshold) → treat as systematic, so not 8. [PREP GRA]
- "Overview" (Academic): one or two sentences that make a whole-chart generalisation **without specific numbers**.
  Check it exists and that it is more than a restatement of the prompt. [PREP TA-AC]

### D3. Task-specific notes for prompts (derived)

- Give the LLM the **task prompt** and the **task type** (AC-T1, GT-T1, T2). TA/TR cannot be judged without them,
  e.g. bullet coverage, "main parts of the prompt", or the key features of the input. [KAC p.1–3]
- For Academic T1 the LLM needs the **data** (table values or a figure description) to check accuracy and key
  features. Without it, report TA as low-confidence. [KAC p.2 "reporting the information, figures and trends accurately"]
- Penalise speculation or causes not in the Academic T1 data under TA. [KAC p.2]
- For Task 1, do not penalise missing paragraphs below Band 8 in CC. For Task 2, missing paragraphs caps CC at 5.
  [WBD p.3, p.8; PREP]
- Prompt text copied into the answer is ignored when judging content and language. Language mostly taken from the
  input or from templates belongs at LR ≤4 and GRA ≤3. [WBD p.5, p.9]

### D4. Things the LLM must not do (derived)

- Do not reward length past the minimum. Over-length is not credited. [FMT-AC/GT]
- Do not reward connector density: overuse is named at B5/B6. [WBD p.4, p.8; KAC p.3]
- Do not reward rare words used wrongly. A "risk-taker" with more errors stays at 6, and B7 needs awareness of
  collocation and style. [WBD p.4, p.8]
- Do not judge the opinion itself. TR assesses whether the position is clear, developed and supported, not
  whether it is "correct". [KAC p.2–3]

### D5. Deterministic (code) vs judgement (LLM) rules

| Rule | Type | Implementation idea | Source |
|---|---|---|---|
| Word count ≤20 → all criteria Band 1 | **Code** | Simple whitespace tokenisation. Exact IELTS counting conventions are UNVERIFIED | [WBD p.5, p.9] |
| Under minimum (<150 / <250) | **Code flag**, then LLM | Flag and pass to the LLM as "possibly insufficient evidence". No fixed deduction (none published). Below ~50% of the minimum, mention "significantly underlength" (LR ≤3, GRA ≤3 territory) — that threshold is our assumption | [FMT-AC/GT], [WBD p.5, p.9] |
| Copied rubric | **Code** (n-gram overlap with prompt) | Mark sentences with high overlap with the prompt; exclude them from word count and evidence. Whether IELTS excludes them from the count is UNVERIFIED | [WBD p.5, p.9] |
| Paragraph count (T2) | **Code** | 0–1 paragraphs → pass "paragraphing missing" (CC cap 5) to the LLM | [WBD p.8] |
| Bullet/numbered lists, headings | **Code** (regex `^\s*([-*•]|\d+[.)])`, markdown headings) | Flag "not connected text / inappropriate format" → TA/TR ≤5 if in places, ≤4 if dominant (our mapping) | [KAC p.1], [WBD p.4–5, p.8–9], [PREP] |
| Non-English | **Code** (language detection) | Mostly or entirely non-English → 0 or exclude | [WBD p.5, p.9] |
| Template/memorised text | **Code** heuristic + LLM | Compare against a list of known templates; flag high similarity for the LLM | [WBD p.5, p.9] |
| GT letter greeting/sign-off present | **Code** heuristic | Regex for `Dear …` / sign-off; feed into the TA format judgement | [PREP TA-GT] |
| Academic T1 contains numbers | **Code** | No digits or number words → flag "no data" (TA cap 5) | [WBD p.4 bold] |
| Spelling error density | **Code-assisted** (spell checker) + LLM | Rate per 100 words as evidence; the LLM decides whether errors "impede" or "cause difficulty" | [WBD; PREP LR] |
| Sentence-type mix (simple vs complex) | **Code-assisted** (parser) + LLM | Share of sentences with a subordinate clause; very low → GRA B4 signal | [WBD p.5, p.9 bold] |
| Overview present / clear | LLM | — | [WBD p.3–4; PREP] |
| Bullets covered / purpose / tone | LLM | Ask for a per-bullet coverage table | [WBD; KAC p.2] |
| All main parts of T2 prompt addressed | LLM | Parse the prompt into its parts first, then check coverage per part | [WBD p.8; PREP] |
| Position clarity, idea development | LLM | — | [WBD p.7–9] |
| Progression, cohesion quality, reference | LLM | — | [WBD; KAC p.3] |
| Lexical sophistication, collocation | LLM | — | [WBD; KAC p.4] |
| Error-free sentence ratio, systematic errors | LLM (with sentence-level annotation) | — | [WBD; PREP] |
| Task / Writing / overall aggregation | **Code** | See D0 steps 6–7 | [SCORE; PREP] |

---

## Open questions / UNVERIFIED / CONFLICT

1. **UNVERIFIED** — Rounding of the four criterion scores into a task score, and of `(T1 + 2·T2)/3` into the
   reported Writing band. Not published. Only "average", "weighted equally", "twice as much" and "a third / two
   thirds" are official. [SCORE, PREP]
2. **UNVERIFIED** — That criterion scores are always whole bands. Inferred from the descriptors having only whole
   bands; never stated.
3. **UNVERIFIED** — Word-counting conventions (hyphens, contractions, numbers/symbols, salutations, titles) and
   whether a copied rubric is removed from the word count. Found only on prep sites. Likely in the confidential ITE
   [REVIEW p.8–9].
4. **UNVERIFIED** — Any fixed penalty for under-length scripts (e.g. a set band deduction below 150/250). Current
   public material only says short answers may lack evidence for higher bands, plus LR/GRA Band 3 wording.
5. **UNVERIFIED** — What "proof that a candidate's answer has been totally memorised" requires in practice.
6. **UNVERIFIED** — The British Council mirror PDF was not downloaded (connection timed out). Its "Updated May 2023"
   title comes from a search index only.
7. **UNVERIFIED** — The IDP claim that Writing is "marked by between 2 and 4 examiners"
   (https://ielts.idp.com/results/scores/writing). Not found on ielts.org; not needed for scoring.
8. **CONFLICT** — CEFR below 4.0: ielts.org maps nothing below band 4. [IDP-CEFR] maps A2 = 3.0–3.5 and
   A1 = 2.0–3.0, with 3.0 in both. Follow ielts.org.
9. **CONFLICT (minor)** — C2: [CEFR-NEWS] "corresponds approximately to IELTS band 9" vs [CEFR-ORG] "8.5 and higher
   are recognised as C2". The chart also leaves Band 5 (B1/B2) and Band 8 (C1/C2) borderline.
10. **CONFLICT (minor)** — Register: IDP-TIPS says Academic Task 1 "must be written in a formal style" and Task 2 is
    a "formal essay". ielts.org says "academic or semi-formal/neutral style" [FMT-AC]. Follow ielts.org.
11. **Open** — No official CEFR mapping exists for the Writing band alone; the chart covers overall scores only
    [CEFR-ORG]. Any per-skill CEFR label in the app must be shown as an approximation.
12. **Open** — All numeric thresholds in D2 (error-free sentence %, "systematic" = 3+ repeats, "significantly
    underlength" = <50%) are our own and should be calibrated against official sample scripts. Candidate source: the
    British Council sample scripts with examiner comments,
    https://takeielts.britishcouncil.org/sites/default/files/academic-writing-sample-candidate-responses-and-examiner-comments_0.pdf
    (not fetched; timed out).
