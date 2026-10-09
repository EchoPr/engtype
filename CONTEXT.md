# engtype

Writing trainer for international English exams (IELTS, TOEFL): learners write responses to exam-style tasks and get feedback that follows the exam's official assessment standards.

## Exams and tasks

**Exam**:
An international English test whose writing section we model, e.g. IELTS Academic, IELTS General Training, TOEFL iBT.
_Avoid_: test, certificate

**Task Type**:
One official writing task format within an Exam, with its own requirements and rubric, e.g. IELTS Academic Task 1, IELTS Task 2, TOEFL Academic Discussion. General-English formats (short message, story) are Task Types without an Exam.
_Avoid_: format, task kind

**Prompt**:
The text of a writing question, either from the Exam Bank or generated, independent of who answers it.
_Avoid_: question, topic

**Exam Bank**:
The curated collection of Prompts that ships with the app.
_Avoid_: dataset, prompt database

**Task**:
A Prompt assigned to one learner at a chosen Level, with its word target and time limit.
_Avoid_: assignment, exercise

**Response**:
The text a learner submits for a Task.
_Avoid_: essay (not every Task Type is an essay), answer, submission

**Draft**:
An unsubmitted, autosaved Response.

## Assessment

**Rubric**:
The full official assessment standard for one Task Type: its Criteria, Scale and the Descriptors for every point on it.
_Avoid_: marking scheme, scoring guide

**Criterion**:
One dimension a Rubric scores separately, e.g. Lexical Resource.
_Avoid_: category, aspect, metric

**Descriptor**:
The official description of what a Response shows at one point of the Scale for one Criterion.
_Avoid_: band description, level text

**Scale**:
The set of values an Exam reports for a Criterion or Task Type; each Exam keeps its own.
_Avoid_: grading system

**Band**:
A point on the IELTS Scale (0–9 in half steps). Only IELTS has Bands.
_Avoid_: using "band" for TOEFL or general-English Task Types

**Score**:
A point on a non-IELTS Exam's Scale, e.g. a TOEFL task score.
_Avoid_: band, mark, grade

**Level**:
A CEFR level (A1–C2): the difficulty a Task targets, or the proficiency a Response demonstrates.
_Avoid_: grade, band

**Assessment**:
The holistic judgement of a Response against its Rubric: a Band or Score per Criterion and overall, with evidence.
_Avoid_: review, feedback (feedback is the whole result shown to the learner), evaluation

**Inline Issue**:
A local language problem anchored to an exact span of the Response (spelling, grammar, punctuation, word choice, collocation, style, register), marked as either a mistake or a possible improvement.
_Avoid_: error, mark

**Meaning Issue**:
A problem with content, logic or organisation of the Response (relevance, development, coherence, task fulfilment), optionally tied to a quoted fragment.
_Avoid_: semantic error, structure error

**Anchor Response**:
A Response with a trusted human Band or Score, used to calibrate or evaluate Assessments.
_Avoid_: calibration essay, example, sample

## Access

**Plan**:
What a Learner's account is entitled to: Free or Pro. Pro is switched on by hand until payments exist.
_Avoid_: tier, subscription, tariff

**Full Review**:
The complete feedback on a Response: Inline Issues, the rubric-based Assessment, Meaning Issues, recommendations and the follow-up chat.
_Avoid_: analysis, check

**Quick Check**:
A cheap estimate of a Response: its Level and overall Band or Score, without Inline Issues, per-Criterion detail or chat. Given when no Full Review is left.
_Avoid_: lite review, free review

**Quota**:
How many Full Reviews, Quick Checks, generated Tasks and chat questions a Plan allows within a rolling 24 hours (chat: per Response). A Response whose analysis failed gets two free retries; further retries spend a review.
_Avoid_: limit (too generic), credits

## Learners

**Learner**:
A person who writes Responses; has a private and a public profile.
_Avoid_: user (reserve for auth/accounts), student

**Target Level**:
The Level a Learner is aiming for, used as the default for new Tasks.
