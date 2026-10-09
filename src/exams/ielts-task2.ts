import type { Rubric } from "./types";

/**
 * IELTS Writing Task 2, in our own words (ADR 0002): observable checks per Band and what separates
 * adjacent Bands. Derived from docs/research/ielts-writing.md (Q1, D1, D2, D5); the official
 * descriptors are linked in `sources`, never copied.
 */
export const ieltsTask2: Rubric = {
  exam: "ielts",
  taskType: "ielts-task2",
  scale: { min: 0, max: 9 },
  sources: {
    WBD: "https://ielts.org/cdn/Guides/ielts-writing-band-descriptors.pdf",
    KAC: "https://ielts.org/cdn/Guides/ielts-writing-key-assessment-criteria.pdf",
    PREP: "https://ielts.org/take-a-test/preparation-resources/writing-test-resources",
    FMT: "https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-writing",
  },
  principles: [
    "Award the highest Band whose features are ALL present in the response; a single missing feature of Band N means the score is below N, even if some higher-Band features appear.",
    "Judge only against this Criterion. Ignore strengths and weaknesses that belong to other Criteria.",
    "Text copied from the prompt does not count as the candidate's language or ideas.",
    "Do not reward length beyond the minimum, density of linking words, or rare words used incorrectly.",
    "Do not judge whether the opinion is right; judge whether it is clear, developed and supported.",
    "Whole Bands only. When torn between two Bands, use the adjacent-Band distinction to decide.",
  ],
  criteria: [
    {
      key: "task",
      label: "Task Response",
      assesses:
        "How fully the response answers every part of the prompt, how clearly a position is set out and kept to the conclusion, and how well main ideas are extended and supported with relevant explanation or examples.",
      bands: {
        3: "No part of the prompt is adequately answered or it was misunderstood; no relevant position; few, undeveloped ideas.",
        4: "Engages with the prompt only minimally or answers a related but different question; the position is hard to find; main ideas are unclear, unsupported or repetitive; may be written as notes or a list.",
        5: "Misses or only partly covers a main part of the prompt; a position is stated but its development is unclear; few, under-developed main ideas; some irrelevant detail or repetition.",
        6: "Covers all main parts of the prompt, though some less fully; the position is relevant to the question, but the conclusion may be unclear, unjustified or merely repeated; main ideas are relevant but some are under-developed or weakly supported.",
        7: "Covers all main parts appropriately; a clear position is developed and held consistently through to the conclusion; each main idea is extended with explanation and supported with an example or evidence, though support may over-generalise or lack precision.",
        8: "Answers the prompt sufficiently; a well-developed position; ideas are relevant and well extended and supported; only occasional omissions or lapses.",
        9: "Explores the prompt in depth; a fully developed position that directly answers the question; ideas fully extended and well supported; lapses extremely rare.",
      },
      discriminators: {
        "5|6": "6 requires every main part of the prompt to be addressed and a position that directly answers it. If any main part is missing (e.g. only one view in a 'discuss both views' prompt, or one of two questions ignored), it stays at 5.",
        "6|7": "7 requires a clear position carried through to a logical conclusion and main ideas that are both extended and supported. An unclear, unjustified or repetitive conclusion, or several under-developed ideas, keeps it at 6.",
        "7|8": "8 requires the prompt to be addressed sufficiently, with ideas well extended and well supported. Over-generalised or imprecise support keeps it at 7.",
      },
    },
    {
      key: "coherence",
      label: "Coherence & Cohesion",
      assesses:
        "Logical organisation and progression of ideas, paragraphing with one central topic each, sequencing within and across paragraphs, flexible reference and substitution, and appropriate use of linking devices.",
      bands: {
        3: "No apparent logical organisation; ideas are hard to relate; minimal or misleading linking; unhelpful paragraphing.",
        4: "Ideas are present but not coherently arranged and there is no clear progression; relationships are unclear; only basic linkers (and, but, so), often repeated or wrong; pronoun reference absent or wrong; paragraphs may be missing or lack a main topic.",
        5: "Some organisation, but the order is not wholly logical; sentences are not fluently linked; linkers are limited, overused (e.g. 'Firstly, Moreover, Furthermore' at every sentence start) or misused; nouns repeated where reference would do; paragraphing inadequate or missing.",
        6: "Generally coherent with clear overall progression; linking works but is mechanical or sometimes faulty; reference and substitution sometimes unclear; paragraphs exist but some lack one clear central topic or are not logically ordered.",
        7: "Logically organised with clear progression throughout; a range of cohesive devices including reference and substitution (this, these, such, the former, pronouns, synonyms) used flexibly, with some over- or under-use; each paragraph has a central topic and a logical internal order.",
        8: "Sequenced so the text is followed with ease; cohesion is well managed, with devices rarely misused or overused; paragraphing is sufficient and appropriate.",
        9: "Followed effortlessly; cohesion rarely draws attention to itself; paragraphing skilfully managed.",
      },
      discriminators: {
        "5|6": "6 requires clear overall progression and linking that works, even if mechanical. If the order is not wholly logical, sentences are not fluently linked, or linkers are limited or overused, it stays at 5. Missing or inadequate paragraphing caps it at 5.",
        "6|7": "7 requires progression throughout plus a range of cohesive devices used flexibly, including reference and substitution, and a clear central topic per paragraph. Mechanical or faulty linking keeps it at 6.",
        "7|8": "8 requires logical sequencing with cohesion well managed (rare misuse or overuse) and fully appropriate paragraphing. Noticeable over- or under-use of linking devices keeps it at 7.",
      },
    },
    {
      key: "lexical",
      label: "Lexical Resource",
      assesses:
        "Range of vocabulary, precision and appropriacy of word choice, control of collocation, style and less common items, and how much spelling and word-formation errors affect communication.",
      bands: {
        3: "Inadequate vocabulary, possibly because the response is far too short or relies on prompt or memorised language; errors predominate and may severely impede meaning.",
        4: "Basic, repetitive vocabulary, possibly unrelated to the task; memorised or template phrases or wording from the prompt used inappropriately; word choice, word formation or spelling may impede meaning.",
        5: "Limited but minimally adequate vocabulary: mostly simple words used accurately but with little variation; frequent repetition or simplification; frequent inappropriate choices; spelling or word-formation errors are noticeable and may cause some difficulty.",
        6: "Adequate and appropriate for the task; meaning is generally clear despite a rather restricted range or imprecise choices; spelling or word-formation errors occur but do not impede communication. A wider, riskier vocabulary with more errors still fits here.",
        7: "Enough range for some flexibility and precision; some less common or idiomatic items (topic-specific terms, natural collocations); awareness of style and collocation, though some choices are inappropriate; only a few spelling or word-formation errors, none reducing clarity.",
        8: "A wide resource used fluently, flexibly and precisely; less common and idiomatic items used skilfully; occasional slips in word choice or collocation; rare spelling errors with minimal impact.",
        9: "Full flexibility and precision; wide range with very natural, sophisticated control; errors extremely rare.",
      },
      discriminators: {
        "5|6": "6 requires vocabulary adequate for the task and spelling/word-formation errors that never impede understanding. Minimally adequate range, frequent repetition, or errors that cause the reader difficulty keep it at 5.",
        "6|7": "7 requires some less common or idiomatic items used with awareness of style and collocation, and only a few errors. A restricted range or imprecise word choice keeps it at 6.",
        "7|8": "8 requires a wide resource used precisely, with skilful use of uncommon or idiomatic items and only occasional slips. Noticeable inappropriacies or collocation errors keep it at 7.",
      },
    },
    {
      key: "grammar",
      label: "Grammatical Range & Accuracy",
      assesses:
        "Range and appropriacy of sentence structures (simple, compound, complex), their accuracy, how often grammar and punctuation errors occur and whether they affect communication.",
      bands: {
        3: "Sentence forms attempted, but grammar and punctuation errors predominate outside memorised phrases, so most meaning is lost; may be too short to show control.",
        4: "Very limited range: mostly simple sentences, subordinate clauses rare; some accurate structures but frequent errors that may impede meaning; punctuation often faulty (run-ons, missing full stops).",
        5: "Limited, repetitive range; complex sentences attempted but usually faulty; accuracy mainly in simple sentences; frequent errors that may cause some difficulty; faulty punctuation.",
        6: "A mix of simple and complex sentences with limited flexibility; complex structures less accurate than simple ones; grammar and punctuation errors occur but rarely impede communication.",
        7: "A variety of complex structures (e.g. relative and conditional clauses, passives, modals, comparatives, complex noun phrases) used with some flexibility; error-free sentences are frequent; a few errors, none impeding.",
        8: "A wide range used flexibly and accurately; most sentences are error-free; remaining errors are occasional and non-systematic (no repeated pattern); punctuation well managed.",
        9: "Wide range with full flexibility and control; errors extremely rare.",
      },
      discriminators: {
        "5|6": "6 requires a real mix of simple and complex sentences with errors that rarely impede. If complex sentences are mostly faulty or errors are frequent and cause difficulty, it stays at 5.",
        "6|7": "7 requires a variety of complex structures and frequent error-free sentences (roughly half or more of the sentences). Limited flexibility or clearly weaker complex sentences keep it at 6.",
        "7|8": "8 requires a majority of error-free sentences and errors that are non-systematic. The same error type repeated (e.g. articles or agreement wrong three or more times) keeps it at 7.",
      },
    },
  ],
  caps: [
    { id: "prompt-part-missing", criterion: "task", max: 5, check: "model", source: "WBD", when: "A main part of the prompt is not addressed or only partly addressed." },
    { id: "not-connected-text", criterion: "task", max: 4, check: "model", source: "KAC", when: "Most of the response is notes, bullet points or a list rather than connected text." },
    { id: "list-in-places", criterion: "task", max: 5, check: "code", source: "KAC", when: "Bullet points or a numbered list appear in part of the response." },
    { id: "tangential", criterion: "task", max: 4, check: "model", source: "WBD", when: "The response answers a related but different question." },
    { id: "no-paragraphs", criterion: "coherence", max: 5, check: "code", source: "WBD", when: "Paragraphing is missing (the whole response is one block)." },
    { id: "off-topic", criterion: "coherence", max: 2, check: "model", source: "WBD", when: "The entire response is off-topic." },
    { id: "off-task-vocabulary", criterion: "lexical", max: 4, check: "model", source: "WBD", when: "The vocabulary is unrelated to the task." },
    { id: "spelling-causes-difficulty", criterion: "lexical", max: 5, check: "model", source: "PREP", when: "Spelling or word-formation errors are noticeable and make the text hard to read." },
    { id: "simple-sentences", criterion: "grammar", max: 4, check: "model", source: "WBD", when: "Subordinate clauses are rare and simple sentences predominate." },
    { id: "errors-cause-difficulty", criterion: "grammar", max: 5, check: "model", source: "PREP", when: "Grammar errors are frequent and cause the reader difficulty." },
  ],
};
