# Making LLM essay scoring accurate and calibrated (IELTS/TOEFL-style, per criterion)

Research date: 2026-10-07. Scope: general-purpose LLMs (OpenAI GPT, DeepSeek) called through OpenAI-compatible Chat Completions with JSON output, scoring essays per criterion (IELTS TR / CC / LR / GRA). Downloaded sources are in the session scratchpad (not committed).

Evidence labels used below:
- **[strong]**: large dataset, several models, or a pre-registered or replicated design.
- **[moderate]**: one solid study on a relevant dataset.
- **[weak]**: small n, older models (GPT-3.5, Llama-2, Mistral-7B), non-essay task, or a single unreviewed preprint.
- **UNVERIFIED**: I could not check the claim against the primary text.

Many 2025–2026 sources are arXiv preprints that have not been peer reviewed. Each one is marked where it is used.

---

## Summary

1. **Agreement varies a lot with the setup.** A PRISMA synthesis of 65 studies (2022–Aug 2025) found LLM–human QWK ranging from 0.00 to 0.97. Many values fall below the 0.70 operational bar. Some studies that used both a rubric and examples cleared it (Li et al., arXiv 2512.14561). For L2 essays, the best prompted results are about QWK 0.81: GPT-4 with at least one calibration essay per level, on Duolingo CEFR ratings, compared with a feature-based AWE baseline at 0.84 and human–human at 0.87 (Yancey et al., BEA 2023). For IELTS Task 2 specifically, the only public study used 55 official sample essays and found weighted κ 0.81 for the overall band only (Koraishi, LTRQ 2024). That is **[weak]**: the sample is small, the essays are public (so they may be in the model's training data), and there are no per-criterion scores.
2. **The largest systematic error is location and scale, not ranking.** LLMs are often harsher or more lenient than humans by a fixed amount, which differs by model and by trait. They also compress scores toward the middle: low essays are scored too high and top essays too low. Raw zero-shot QWK can be very low (GPT-4o on TOEFL11: 0.24) even when the ranking is reasonable. Methods that re-map scores onto the human scale recover a lot (LCES, MTS, RULERS). This is why **post-hoc calibration on a small labelled set is the most effective change found in this research** (RULERS ablation: QWK 0.73 → 0.26 without calibration; the pre-registered audit found 30–100 anchor essays recover most of the correctable error).
3. **Few-shot anchor essays help more than a long rubric.** One scored example per score level was enough for GPT-4 in Yancey et al. Two per level raised QWK by about 26% with GPT-5.1 on ASAP 2.0 (arXiv 2601.22386). Once examples were present, a detailed rubric and asking for a rationale added little (Yancey). A simplified rubric scored about as well as the full rubric for 3 of 4 models, but no rubric scored worse (Yoshida, AIED 2025). The selection and order of examples cause majority-label and recency biases, which are weaker in stronger models.
4. **Scoring each criterion in its own call reduces halo** (residual cross-criterion correlation fell from .31 to .16 in the audit, arXiv 2608.29517). It also raised QWK sharply in an older-model ablation (0.306 → 0.492, Llama-2-13B, MTS). **Writing the analysis before the score** helps modestly and consistently (Chiang & Lee, EMNLP 2023; Stahl et al., BEA 2024). With OpenAI Structured Outputs, the order of keys in the schema sets the order of generation.
5. **Repeated sampling and averaging make scores stable, not more accurate.** Temperature 0 removed 38–100% of the run-to-run variance in the audit. Ensembling 1–7 samples gave no significant gain in a 2026 scoring study. Pin the model version: a same-family upgrade shifted severity by up to 13% of the scale.
6. **Deterministic features remain strong.** ETS e-rater uses about 10 interpretable features combined linearly: error rates per word, organisation and development, word frequency and length, and prompt vocabulary. In ETS's own GPT-4 comparison, e-rater agreed with humans better than GPT-4 did. A composite of GPT-4 and e-rater correlated better with a second human than either alone (TOEFL, n=246, **[weak]**).

The top changes for engtype are a labelled evaluation set with per-criterion calibration, full-range per-criterion anchor essays, a separate evidence-then-score call per criterion, deterministic features fed in, and an overall band computed by rule. Details are in the Recommendations section below.

---

## Sources

| # | Source | Type | Setup (model · data · metric) | Strength |
|---|---|---|---|---|
| S1 | Yancey, LaFlair, Verardi, Burstein. *Rating Short L2 Essays on the CEFR Scale with GPT-4*. BEA 2023, [ACL 2023.bea-1.49](https://aclanthology.org/2023.bea-1.49) | peer-reviewed workshop | GPT-3.5/GPT-4 · Duolingo English Test short essays, CEFR 6 levels + 2 unscorable, n=1,175 vs rater 1 · QWK | moderate–strong (most relevant L2 study) |
| S2 | Koraishi. *Reliability of ChatGPT in Grading IELTS Writing Task 2*. Language Teaching Research Quarterly 43 (2024), [doi:10.32038/ltrq.2024.43.02](https://doi.org/10.32038/ltrq.2024.43.02) | journal | ChatGPT-4 (web UI) · 55 official public IELTS T2 samples · ICC, weighted κ | weak |
| S3 | Li et al. *Agreement Between LLMs and Human Raters in Essay Scoring: A Research Synthesis*. [arXiv 2512.14561](https://arxiv.org/abs/2512.14561) (book chapter 2026) | systematic review | 65 studies 2022–2025 | strong for "it varies"; no pooled estimate |
| S4 | Kucia, Chakraborty, Wróblewska. *LLM Essay Scoring Under Holistic and Analytic Rubrics: Prompt Effects and Bias*. [arXiv 2604.00259](https://arxiv.org/abs/2604.00259) | preprint | Llama-3.1 8B/70B/405B, GPT-OSS 20B/120B, T=0 · ASAP 2.0, ELLIPSE, DREsS · QWK, bias | moderate |
| S5 | Sunkavalli. *LLM Judges as Raters: A Pre-Registered Audit of Severity, Halo, Reliability, and Version Instability*. [arXiv 2608.29517](https://arxiv.org/abs/2608.29517) | preprint, single author, pre-registered | 12 judges (Claude Sonnet/Opus/Haiku 4–4.6, Nova, Llama 3.3/4, Qwen3) · ENEM (977) + ASAP (1,400) · MFRM, G-theory, 110k calls | moderate–strong on design; not reviewed |
| S6 | Hong et al. *RULERS: Locked Rubrics and Evidence-Anchored Scoring*. [arXiv 2601.08654](https://arxiv.org/abs/2601.08654) | preprint | GPT-4o, GPT-4o-mini, Llama-3.1 · ASAP 2.0, DREsS, SummHF · QWK | moderate |
| S7 | Lee, Cai, Meng, Wang, Wu. *Unleashing LLMs' Proficiency in Zero-shot Essay Scoring (MTS)*. [arXiv 2404.04941](https://arxiv.org/abs/2404.04941), EMNLP Findings 2024 | peer-reviewed | gpt-3.5-turbo-0613, Llama-2, Mistral-7B · ASAP, TOEFL11 · QWK | moderate (older models) |
| S8 | Shibata, Miyamura. *LCES: Zero-shot AES via Pairwise Comparisons*. [arXiv 2505.08498](https://arxiv.org/abs/2505.08498) | preprint | GPT-4o, GPT-4o-mini, Llama-3.x, Mistral · ASAP, TOEFL11 · QWK | moderate |
| S9 | Kim, Jo. *Is GPT-4 Alone Sufficient for AES? A Comparative Judgment Approach*. [arXiv 2407.05733](https://arxiv.org/abs/2407.05733) | preprint | GPT-3.5/GPT-4 · ASAP sets 7–8 (traits) · QWK | weak–moderate |
| S10 | Yoshida. *Do We Need a Detailed Rubric for AES using LLMs?* AIED 2025, [arXiv 2505.01035](https://arxiv.org/abs/2505.01035) | peer-reviewed | Claude 3.5 Haiku, Gemini 1.5 Flash, GPT-4o-mini, Llama 3 70B · TOEFL11 (3 levels) · QWK | moderate |
| S11 | Yoshida. *Impact of Example Selection in Few-Shot Prompting on AES Using GPT Models*. CCIS 2150 (2024), [arXiv 2411.18924](https://arxiv.org/abs/2411.18924) | peer-reviewed | GPT-3.5 and GPT-4 versions, 119 prompts · TOEFL11 · QWK + regression | moderate (older models) |
| S12 | Idowu, Almasoud. *Specialists or Generalists? Multi-Agent and Single-Agent LLMs for Essay Grading*. [arXiv 2601.22386](https://arxiv.org/abs/2601.22386) | preprint | GPT-5.1 · ASAP 2.0, 450 test essays, 12 calibration essays · QWK, exact | weak–moderate |
| S13 | Mathew, Taher, Kundu, Barbosa. *LLMs Do Not Grade Essays Like Humans*. [arXiv 2603.23714](https://arxiv.org/abs/2603.23714) | preprint | GPT-3.5/4/5-mini, Llama 2/3/4 · ASAP T1/T7, DREsS · QWK, r | moderate |
| S14 | Kundu, Barbosa. *Are LLMs Good Essay Graders?* [arXiv 2409.13120](https://arxiv.org/abs/2409.13120) | preprint | ChatGPT, Llama-2/3 · ASAP · r | weak (older models) |
| S15 | Mansour et al. *Can LLMs Automatically Score Proficiency of Written Essays?* LREC-COLING 2024, [arXiv 2403.06149](https://arxiv.org/abs/2403.06149) | peer-reviewed | ChatGPT (3.5), Llama-2 · ASAP · QWK | weak (older models) |
| S16 | Stahl, Biermann, Nehring, Wachsmuth. *Exploring LLM Prompting Strategies for Joint Essay Scoring and Feedback Generation*. BEA 2024, [arXiv 2404.15845](https://arxiv.org/abs/2404.15845) | peer-reviewed | Mistral-7B-Instruct · ASAP · QWK | weak (small model) |
| S17 | Chiang, Lee. *A Closer Look into Automatic Evaluation Using LLMs*. EMNLP Findings 2023, [arXiv 2310.05657](https://arxiv.org/abs/2310.05657) | peer-reviewed | ChatGPT · SummEval, Topical-Chat (not essays) · Pearson/Kendall | moderate (transfer to essays assumed) |
| S18 | Liu et al. *G-Eval*. [arXiv 2303.16634](https://arxiv.org/abs/2303.16634), EMNLP 2023 | peer-reviewed | GPT-4 · summarisation and dialogue · Spearman | moderate (not essays) |
| S19 | Xiao et al. *Human-AI Collaborative Essay Scoring*. [arXiv 2401.06431](https://arxiv.org/abs/2401.06431) | preprint (later published) | GPT-4 prompting vs fine-tuned GPT-3.5 · ASAP + 6,559 Chinese EFL essays · QWK | moderate |
| S20 | Casabianca, McCaffrey, Johnson, Alper, Zubenko (ETS). *Validity Arguments for CR Scoring Using Generative AI*. [arXiv 2501.02334](https://arxiv.org/abs/2501.02334) | ETS preprint | GPT-4-0311, T=0, zero-shot · GRE/Praxis/TOEFL essays, n=1,581 · QWK, partial r | moderate (TOEFL n=246) |
| S21 | Attali, Burstein. *Automated Essay Scoring With e-rater V.2*. JTLA 4(3), 2006, [link](https://ejournals.bc.edu/index.php/jtla/article/view/1650) | peer-reviewed | e-rater feature set and model | strong (describes the system) |
| S22 | Williamson, Xi, Breyer. *A Framework for Evaluation and Use of Automated Scoring*. EM:IP 31(1), 2012. Thresholds as quoted in Doewes & Pechenizkiy, [EDM 2021](https://educationaldatamining.org/EDM2021/virtual/static/pdf/EDM21_paper_243.pdf) | peer-reviewed | operational acceptance criteria | strong (standard practice) |
| S23 | Wang et al. *LLMs are not Fair Evaluators*. [arXiv 2305.17926](https://arxiv.org/abs/2305.17926), ACL 2024 | peer-reviewed | ChatGPT/GPT-4 · Vicuna bench · position bias | moderate (pairwise chat answers) |
| S24 | Zheng et al. *Judging LLM-as-a-Judge with MT-Bench*. [arXiv 2306.05685](https://arxiv.org/abs/2306.05685), NeurIPS 2023 | peer-reviewed | GPT-4, GPT-3.5, Claude-v1 · MT-bench · bias rates | moderate (not essays) |
| S25 | Liusie, Manakul, Gales. *LLM Comparative Assessment*. EACL 2024, [arXiv 2307.07889](https://arxiv.org/abs/2307.07889) | peer-reviewed | FlanT5, Llama-2 · NLG eval | weak for essays |
| S26 | Seßler et al. *Can AI grade your essays?* LAK 2025, [arXiv 2411.16337](https://arxiv.org/abs/2411.16337) | peer-reviewed | GPT-3.5/4, o1, Llama-3-70B, Mixtral · 20 German essays, 37 teachers | weak (n=20) |
| S27 | Hackl et al. *Is GPT-4 a reliable rater?* [arXiv 2308.02575](https://arxiv.org/abs/2308.02575), Frontiers in Education | peer-reviewed | GPT-4 · macroeconomics answers · ICC over repeats | weak–moderate |
| S28 | Frohn. *Impact of LLM Self-Consistency and Reasoning Effort on Automated Scoring*. [arXiv 2604.26954](https://arxiv.org/abs/2604.26954) | preprint | Gemini 3.1 Pro, GPT-5.4 Nano/Mini · 900 maths conversations | weak for essays |
| S29 | Gayed. *Investigating first-language bias in LLM-based AES*. [arXiv 2607.14605](https://arxiv.org/abs/2607.14605) | preprint | LoRA Gemma-3-27B on 480 essays · TOEFL11 12,100 essays · QWK | moderate |
| S30 | Mizumoto, Eguchi. *Exploring the potential of using an AI language model for AES*. RMAL 2(2) 100050, 2023, [doi](https://doi.org/10.1016/j.rmal.2023.100050) | peer-reviewed | text-davinci-003 · TOEFL11 12,100 · accuracy + features | weak (old model; abstract only) |
| S31 | Hou, Ciuba, Li. *Improving LLM-based AES with Linguistic Features*. [arXiv 2502.09497](https://arxiv.org/abs/2502.09497), PMLR 273 | workshop | LLM + features, in- and out-of-domain | weak (abstract only) |
| S32 | Rao, Callison-Burch. *Jev vs. LLMs as Rubric Judges*. [arXiv 2609.29769](https://arxiv.org/abs/2609.29769) | preprint | judges including deepseek-v4.1-flash · ELLIPSE and others | weak (numbers partly UNVERIFIED) |
| S33 | Bannò, Knill, Gales. *Towards Self-Referential Analytic Assessment*. [arXiv 2605.04298](https://arxiv.org/abs/2605.04298) | preprint | 3 LLMs · ICNALE GRA (up to 80 raters/essay) | weak (abstract only) |
| S34 | Gaggioli et al. *Reliability and Validity of LLMs for Assessment of Student Essays in Higher Education*. [arXiv 2508.02442](https://arxiv.org/abs/2508.02442) | preprint | Claude 3.5, DeepSeek v2, Gemini 2.5, GPT-4, Mistral · 67 Italian essays | weak |
| S35 | Xu, Kassim, Mahmud. *Enhancing IELTS writing automated scoring with M-LoRA fine-tuned LLaMA-3*. Sci Rep 16:10865 (2026), [doi](https://doi.org/10.1038/s41598-026-43318-w) | journal | LLaMA-3 multi-task LoRA · private 5,088 IELTS essays | weak (abstract only; numbers not checked) |
| D1 | OpenAI, Structured Outputs guide, [developers.openai.com](https://developers.openai.com/api/docs/guides/structured-outputs) | provider docs | key ordering | — |
| D2 | DeepSeek API docs: [JSON mode](https://api-docs.deepseek.com/guides/json_mode), [thinking mode](https://api-docs.deepseek.com/guides/thinking_mode) | provider docs | JSON and temperature behaviour | — |
| D3 | IELTS: [test statistics](https://ielts.org/researchers/our-research/test-statistics); [writing band score (IELTS Australia/IDP)](https://ielts.com.au/australia/results/ielts-band-scores/writing-band-score) | official | reliability 0.92 writing; criterion weighting | — |

---

## Q1. How well do LLMs agree with human raters?

### Metrics in use
- **QWK** (quadratic weighted kappa) is the standard in AES. The operational bar from Williamson, Xi & Breyer (2012) is **QWK ≥ .70**, machine–human agreement **no more than .10 below human–human**, and a **standardized mean difference ≤ .15** [S22]. Many LLM studies stop at QWK or Pearson r. ICC (S2, S26, S27) and Kendall's W (S34) also appear.
- **Exact and adjacent agreement** is common in L2 testing. **MAE/RMSE** and a **signed mean bias** show severity.
- Correlation-type metrics ignore offset and scale. In S5, judges with near-identical correlations (Pearson .47–.56) disagreed by up to 219/1000 points in severity. **Report bias and SD ratio alongside QWK** [S5].

### Holistic results (selected, with setup)
| Study | Model / setup | Data | Result |
|---|---|---|---|
| S1 | GPT-4, minimal rubric, **0** calibration examples | DET CEFR short essays | below the length-only baseline; ratings concentrated in B1–B2 |
| S1 | GPT-4, **1** example per category (8) | same | **QWK 0.81** (AWE baseline 0.84; human–human 0.87); +0.15 CEFR-level leniency |
| S1 | GPT-3.5, 2 per category | same | only just above the length-only baseline |
| S2 | ChatGPT-4, one-line "IELTS rubric" prompt | 55 official IELTS T2 samples | ICC 0.814 (95% CI .70–.89), weighted κ 0.811; means 6.03 vs 6.03; several outliers |
| S20 | GPT-4-0311, rubric, zero-shot, T=0 | TOEFL (n=246) / GRE (569) / Praxis (357) | QWK .55 / .76 / .67; e-rater .60 / .88 / .84 |
| S10 | GPT-4o-mini, Claude 3.5 Haiku, Gemini 1.5 Flash, Llama-3-70B | TOEFL11 (3 levels) | QWK ≈ 0.6 with rubric |
| S8 | GPT-4o "vanilla" direct score | TOEFL11 / ASAP | QWK **0.238** / 0.509; pairwise LCES 0.645 / 0.653 |
| S12 | GPT-5.1 single agent, rubric | ASAP 2.0 (1–6) | 0.566 zero-shot → **0.717** with 2 examples/level |
| S29 | LoRA-tuned Gemma-3-27B (480 training essays) | TOEFL11, 12,100 essays, unseen prompts | QWK 0.702, exact 77.8%, adjacent ~100% (3 levels) |
| S13 | GPT-3.5/4/5-mini, Llama 2/3/4 | ASAP T1/T7, DREsS | QWK < 0.30 on ASAP (human–human 0.72); DREsS peak 0.34 |

IELTS-specific evidence is thin. S2 is the only peer-reviewed IELTS agreement study I found. My interpretation (not tested in S2) is that its 55 official samples, with examiner comments, are published online and probably appear in model pre-training data. That could inflate agreement. The public Kaggle "IELTS Writing Scored Essays" set (787 essays, overall band only) has unverified provenance. The 2026 Sci Rep IELTS paper [S35] fine-tuned on a private 5,088-essay set. I could not access its per-criterion numbers (UNVERIFIED).

### Analytic (per-criterion) results
- **ELLIPSE** (ELL essays, 6 traits, 1–5) with Llama-3.1-70B, zero-shot, T=0 [S4]: cohesion QWK **0.566** (bias −0.12), syntax 0.414 (−0.48), grammar **0.203 (−1.04)**, conventions 0.219 (−1.05). On analytic ELLIPSE, short "keywords" trait definitions beat full guidelines (QWK 0.321 vs 0.235). For holistic ASAP 2.0, full guidelines won (0.601 vs 0.533). **Low-level language traits were scored much more harshly** than humans scored them. Model SDs were consistently lower than human SDs (compression).
- S32 (2026 preprint): all LLM judges, including deepseek-v4.1-flash, placed ELLIPSE essays lower than human raters, especially on grammar. A constant upward shift removed most of the gap. The paper's exact per-judge accuracy figures were inconsistent between sections when I extracted them, so treat them as UNVERIFIED and use only the direction.
- S9 (GPT-4, ASAP sets 7–8, rubric-based): trait QWK 0.27–0.56 on set 7 and 0.72–0.80 on set 8. Agreement depends heavily on the prompt and trait.
- S26 (20 German essays, 10 criteria, 37 teachers): o1 reached Spearman .74 with the teacher mean and ICC .80. GPT models were better on language criteria than content. Models tended to give **higher** scores.
- S33 (ICNALE, up to 80 raters per essay): LLMs were better than a single human at spotting a learner's relative weaknesses and worse at spotting relative strengths (abstract only).

**Bottom line for Q1.** With a strong model, anchor examples and a rubric, holistic L2 agreement of about 0.7–0.8 QWK is achievable [S1, S12]. Zero-shot raw scores are often far worse, mainly because of offset and compression [S4, S8, S13]. Per-criterion agreement is lower than holistic agreement and differs by trait. Grammar and mechanics are the hardest traits to calibrate [S4, S32].

---

## Q2. Known failure modes

| Failure mode | Evidence (setup) | Strength |
|---|---|---|
| **Severity offset (harsh or lenient), model-specific** | S4: grammar/conventions bias about −1.0 on a 1–5 scale (Llama-3.1-70B, ELLIPSE). S14: ChatGPT mean 1.9 vs human ~4.3 (ASAP, older models). S1: GPT-4 +0.15 CEFR level (lenient). S26: models lenient on German essays. S5: severity spread of 219/1000 points across 12 judges with the same rubric. | strong (direction varies by model and trait, so it must be measured, not assumed) |
| **Central tendency / range compression** | S13: "LLMs tend to avoid assigning extreme scores… higher scores than humans to low-scoring essays and lower scores than humans to high-scoring essays" (6 models, 3 datasets). S20: GPT-4 median one point above human at human scores 1–3 and one point below at 6 (GRE, Praxis). S1: zero-shot GPT-4 rated mostly B1–B2. S4: model SD < human SD. S12: 31% accuracy on score-5 essays even with few-shot (GPT-5.1). | strong |
| **Poor discrimination between adjacent high levels** | S1: GPT-4 "struggled to distinguish between adjacent CEFR levels…especially B2". S12: both architectures struggle with high-quality essays. | moderate |
| **Over-penalising surface errors at the top** | S13: top-scored ASAP essays still contain minor errors that LLMs penalise and humans overlook. | moderate |
| **Length** | Not a simple "longer is better" bias for essays. S4: LLM score–length r was *lower* than human r on ASAP 2.0 (0.47 vs 0.71) and higher on ELLIPSE (0.33 vs 0.18). S13: LLMs over-score short, readable but underdeveloped essays. Verbosity bias in chat judging: padded answers fooled GPT-3.5 and Claude-v1 in 91.3% of cases and GPT-4 in 8.7% [S24]. | moderate |
| **Prompt-wording sensitivity** | S15: per-prompt QWK swings of 0.05 → 0.55 for ChatGPT-3.5 across 4 prompt variants. S4: keywords vs guidelines flips the ranking between holistic and analytic. S10: Gemini 1.5 Flash got worse with a more detailed rubric. S5: severity orderings were prompt-robust in Portuguese but not in English. | strong for older models; moderate for current ones |
| **Example (anchor) selection and order** | S11: majority-label bias (scores pulled toward the most frequent example label) and recency bias (toward the last example's label). Strong in GPT-3.5, weaker in GPT-4; GPT-4 (Jun-23) was most robust. | moderate |
| **Position bias (pairwise)** | S23: reordering two answers let Vicuna-13B "beat" ChatGPT on 66/80 queries. S24: GPT-4 was consistent under swapped order only 65% of the time. | moderate (pairwise only) |
| **Run-to-run inconsistency** | S27: GPT-4 ICC 0.94–0.99 across repeats (macroeconomics answers). S5: φ ≥ .80 at k ≤ 2 replications; T=0 removes 38–100% of variance injected at T=0.7. S34: Kendall's W < .30 across replications on Italian university essays. | moderate; small for strong models at T=0 |
| **Halo across criteria** | S5: analytic sub-scores from a single call share a common impression, with residual correlation .31; separate calls gave .16. Whether this exceeds human halo was not confirmed. S33 makes the same point. | moderate |
| **Version drift** | S5: every one of 5 same-family upgrades shifted severity significantly, by up to 13% of the scale (sonnet-4.5 → 4.6: −133/1000). | moderate–strong |
| **Group bias** | S1: lower QWK for Telugu, Bengali and Mandarin L1 writers than for Spanish (0.66 vs 0.89 before correction). S29: systematic L1-linked offset, with European L1s scored higher than East-Asian L1s at the same band (fine-tuned Gemma). | moderate |

---

## Q3. Techniques with evidence

### 3.1 Rubric in prompt vs none; band descriptors per criterion
- **No rubric scores worse; a short rubric is usually enough.** On TOEFL11, 3 of 4 models had significantly higher QWK with a rubric than without. Full and simplified rubrics differed by < 0.01 QWK, and the full rubric doubled prompt tokens (533 → 1,077 for Claude 3.5 Haiku) [S10]. In MTS, removing per-trait scoring criteria cut average QWK from ~0.48 to ~0.25 (Llama-2) [S7].
- **When anchors are present, rubric detail matters less.** For GPT-4 with ≥ 1 calibration example per level, a detailed rubric gave "negligible benefit"; without examples, it helped substantially [S1].
- **Analytic, low-level traits may do better with concise descriptors** (ELLIPSE: keywords 0.321 vs guidelines 0.235, Llama-3.1-70B) [S4]. S32 argues the gap comes from conventions that raters learn in training (population norms) and that are absent from the criterion text. Anchors and calibration supply those norms; more rubric text does not.
- **For IELTS:** the official public band descriptors are short per criterion and per band. GPT-4 can reproduce a close version of them unprompted [S2]. Including the descriptor for the one criterion being scored costs about 400–700 tokens (my estimate) and is consistent with all of the above.

### 3.2 Few-shot anchor / exemplar essays
- **Count:** 1 per score level gave nearly all the gain for GPT-4; more examples were not significantly better [S1]. Two per level gave +26% QWK for GPT-5.1 on ASAP 2.0 [S12]. "Increasing k did not consistently yield better results" for GPT-4 on ASAP and Chinese EFL [S19]. With Mistral-7B, one-shot (0.540) ≈ few-shot (0.538) [S16], **[weak]**.
- **Which bands:** cover **every level of the scale**, including the extremes. Examples balanced across categories taught GPT-4 to use the full range. Without them it compressed to the middle [S1].
- **Order and balance:** avoid an unbalanced label mix and avoid ending on an extreme. Majority-label and recency effects are real, though weaker in GPT-4-class models [S11]. Randomise or fix a balanced order and evaluate it.
- **Rationales with examples:** S1 found that adding rationales to the examples did not help once examples were present (GPT-4). For per-criterion scoring, giving each anchor's **per-criterion** scores is needed, otherwise the model only sees overall bands. That is a design inference, not a tested result.

### 3.3 Per-criterion calls vs one joint call
- **Separate calls reduce halo:** residual correlation .31 → .16, with 5 of 6 judges reduced [S5]. Llama-2-13B on ASAP: all traits in one conversation 0.306 vs one trait per conversation 0.492, and 0.560 with a quote-retrieval step [S7], **[older models]**.
- **Counter-evidence on joint scoring and feedback:** S16 found that generating feedback *before* the score slightly improved QWK (0.533 vs 0.513, Mistral-7B). The best design is to score with evidence in the same call, then generate learner-facing feedback separately. That is an inference from the two results.
- **Multi-agent "chairman" designs** gave only +0.03 QWK over single-agent once both had few-shot examples (GPT-5.1). They helped on weak essays and hurt mid-range ones [S12].

### 3.4 Evidence/rationale before the score; chain-of-thought
- **Analyse first, then rate** gave the best correlation. ChatGPT on SummEval coherence: score-only r .450, rate-then-explain .557, analyse-then-rate .635. Rationale prompts were also more robust to temperature [S17], **[not essays]**.
- On essays, explanation or feedback before the score beat score-first (0.533 vs 0.513, Mistral-7B, ASAP) [S16]. Requiring a rationale helped GPT-4 without examples and added negligible benefit with examples [S1].
- Generic "auto-CoT" (G-Eval style) did not consistently help [S17].
- **Evidence-anchored quotes:** RULERS forces verbatim quotes and caps scores when evidence is missing. Removing evidence verification cost little on ASAP (0.73 → 0.69) and was "crucial" on EFL (DREsS) [S6]. MTS quote retrieval added +0.07 [S7].
- **Implementation note:** with OpenAI Structured Outputs, "outputs will be produced in the same order as the ordering of keys in the schema" [D1]. A schema `{score, comment}` therefore makes the model commit to the score first. Put `evidence` and `rationale` keys before `score`.
- **Reasoning models:** higher reasoning effort showed a significant positive linear trend in a 2026 scoring study (maths conversations) [S28]. o1 was the most aligned model in S26 (n=20). This is promising but **[weak]** for IELTS essays. DeepSeek thinking mode is on by default and ignores `temperature` [D2].

### 3.5 Multiple samples, averaging, median; temperature
- "Averaging repeated calls makes a judge's score stable but not more accurate: replication sharpens a biased number" [S5]. φ ≥ .80 is reached at k ≤ 2. T=0 removes most replication variance.
- Ensembles of j = 1–7 samples gave no significant gain; temperature sampling beat deterministic calls in that study [S28], **[weak; not essays]**. Chiang & Lee averaged 20 samples at T=1 [S17]. G-Eval used 20 samples, or token probabilities, to get a probability-weighted score, because "one digit usually dominates" and integer scores create ties [S18].
- **Practical reading:** use T=0 (or the lowest supported value) for a stable user-facing score. A probability-weighted expected score from logprobs (where the model exposes them) gives a continuous value to calibrate. Spend extra calls on calibration and anchors, not on replication.

### 3.6 Comparative / pairwise judgement
- Comparative judgement with a Bradley–Terry model beat rubric scoring for GPT-4 on ASAP traits (avg QWK 0.567 → 0.674 basic; 0.776 fine-grained) [S9]. LCES (pairwise + RankNet) beat direct scoring, e.g. GPT-4o TOEFL11 0.238 → 0.645 [S8]. Comparative assessment beat prompt scoring for mid-size open models [S25].
- **Caveats:** these methods rank a *batch* of essays and then map ranks onto the scale using the known score range or distribution. Part of the gain is that distribution mapping, which is effectively calibration. Pairwise comparison also brings position bias, so both orders must be run [S23, S24]. For a single learner essay, comparing it with fixed anchor essays of known band is plausible, but I found no study testing that setup. **Untested.**

### 3.7 Post-hoc calibration (offset / linear / isotonic)
- **RULERS** ablation, GPT-4o-mini on ASAP 2.0: removing the distribution-alignment calibration step dropped QWK from **0.73 to 0.26**, the largest effect of any component [S6].
- **Pre-registered audit** [S5], held-out RMSE on ENEM: uncalibrated 191; mean offset with 10/30/100 anchors 167/162/160; linear equating 154; equipercentile overfits (178). "30–100 anchor essays recover most of the recoverable error." Calibration removes the offset but not judge-specific disagreement.
- **MTS scaling ablation** (Llama-2-7B, ASAP): fixed scaling 0.254 → min-max scaling 0.477 → plus outlier clipping 0.484 [S7].
- S4 recommends a "bias-correction-first" deployment using small human-labelled sets. Detecting bias needs very few essays for low-level traits (median N_min 5 on ELLIPSE). Higher-level traits need far more (90th percentile ~175).
- Isotonic regression appears in the 2026 medical-scoring literature, but **I found no essay-specific study comparing isotonic and linear mapping**. Given S5 (equipercentile overfits at n ≤ 100), start with offset or linear mapping and switch to isotonic only with several hundred labelled essays per criterion. That is a recommendation, not a finding.

### 3.8 Fine-tuning vs prompting
- Fine-tuned GPT-3.5 reached QWK 0.61–0.86 on ASAP sets vs 0.26–0.78 for GPT-4 few-shot with rubric. On the Chinese EFL set, the fine-tuned ensemble scored 0.78 vs 0.67 [S19].
- LoRA Gemma-3-27B trained on only 480 essays reached QWK 0.70 on 12,100 TOEFL11 essays from unseen prompts, but showed an L1-linked offset [S29].
- An IELTS multi-task LoRA LLaMA-3 model was trained on 5,088 private essays [S35] (numbers UNVERIFIED).
- Hybrids help. Linguistic features plus an LLM beat the LLM alone in and out of domain [S31]. Features improved GPT accuracy on TOEFL11 [S30].
- **For engtype:** fine-tuning needs hundreds of labelled per-criterion essays and ties the app to one provider and model. Prompting plus calibration plus features is the realistic route now.

---

## Q4. e-rater and feature-based AES: what transfers

**How e-rater V.2 works** [S21]:
- **Grammar, usage, mechanics, style (4 features):** error counts per category, divided by word count with +1 smoothing, then log-transformed. Error rates, not error counts, so the features are not just proxies for length.
- **Organisation (1):** distance from a minimal intro + 3 body (main point + support) + conclusion structure. **Development (1):** average length of discourse elements.
- **Lexical complexity (2):** a word-frequency index (Breland Standardized Frequency Index) and average word length.
- **Prompt-specific vocabulary (2):** cosine similarity to the vocabulary of essays at each score point.
- **Combining:** "a weighted average of the standardized feature values, followed by applying a linear transformation" to the score scale. Weights come from regression or expert judgement, with constraints against wrong-sign weights. Separate systems flag anomalous or bad-faith essays.

**A modern feature-based AWE (Duolingo, 85 features, XGBoost)** reached QWK 0.84, above GPT-4 with examples (0.81) [S1]. Its features include cohesion overlap, dependency depth, the proportion of words at each CEFR level, 51 error-type rates (ERRANT categories), n-gram differential use, MTLD lexical diversity, length, and prompt relevance via IDF-weighted embeddings.

**What ETS found when comparing GPT-4 and e-rater** [S20]:
- e-rater agreed with humans better (QWK .88 vs .76 on GRE).
- The two engines carry partly independent information (semi-partial r: e-rater .38, GPT-4 .24 on TOEFL).
- The mean of GPT-4 and e-rater correlated .84 with a second human on TOEFL, versus .70 for human–human. Small n; **[weak]**.

**Deterministic checks that transfer to engtype** (most already exist in `src/lib/metrics.ts` or the inline pass):
1. **Word count vs task minimum.** It is a hard input to Task Response and should not be left for the LLM to notice. S13 shows LLMs over-score short essays.
2. **Error rate per 100 words** by category from the inline pass, log-smoothed as in e-rater, for GRA and LR.
3. **Lexical sophistication:** share of words above B2 on a CEFR word list (Duolingo AWE), the frequency index, average word length, and long-word share.
4. **Lexical diversity (MTLD)**, which is already computed.
5. **Paragraph count and linker density** for CC organisation.
6. **Prompt relevance** (embedding similarity) and **off-topic or memorised-text flags** before scoring. e-rater routes these away from normal scoring.

These can (a) go into the scoring prompt as facts, (b) feed a small linear calibration model alongside the LLM score per criterion (an e-rater-style weighted average), and (c) drive sanity bounds (for example, flag a GRA of 8 when the error rate is high).

---

## Recommendations for engtype

Context from the current code (`src/lib/analyze.ts`, `src/lib/feedback.ts`):
- One `reviewPass` call returns the overall band, all four criterion scores and all learner feedback together.
- In the schema, each criterion's `score` comes **before** its `comment`, and the overall `band` comes before `criteria`.
- The prompt has no IELTS band descriptors.
- Anchors are three overall-band essays (about 5, 6.5 and 8), truncated to 1,200 characters and always in ascending order (so the last one is high). They carry no per-criterion scores.
- The prompt tells the model to focus on meaning rather than spelling and grammar slips, yet the same call scores LR and GRA.
- Criteria are scored in 0.5 steps. The IELTS band descriptors define whole bands per criterion. My understanding (UNVERIFIED) is that examiners award whole bands per criterion and that each criterion is weighted 25% [D3].
- There is no labelled evaluation set and no calibration.

### Ranked changes

| Rank | Change | Expected impact | Cost | Evidence |
|---|---|---|---|---|
| **1** | **Build a labelled set and calibrate per criterion and per model.** Collect ≥ 100 essays with per-criterion bands (≥ 30 to start). Fit an offset or linear map (raw → human) per criterion per model version, with cross-fitting. Pin model snapshots and re-fit when the model changes. Keep a 20-essay canary set and re-score it on a schedule. | **Large.** It fixes the biggest error source (severity offset and compression). Ablations show QWK collapsing without it (0.73 → 0.26). | 0 runtime tokens; one-off labelling effort | S5, S6, S7, S4, S32 |
| **2** | **Full-range, per-criterion anchors.** One full-length anchor essay per band from about 4 to 8.5 or 9 (at least 5–6 essays), each with TR/CC/LR/GRA scores and a 1–2 line justification per criterion. Do not truncate them, and use a fixed, balanced or shuffled order that does not end on an extreme. | **Large** when starting from 0–3 overall anchors (GPT-4: QWK to 0.81 with 1/level; GPT-5.1: +26% with 2/level) | +3–6k input tokens per call; prompt caching cuts the cost of a fixed prefix (pricing UNVERIFIED) | S1, S12, S11, S19 |
| **3** | **A dedicated scoring call per criterion, separate from feedback.** Four parallel calls, each with that criterion's band descriptor, the anchors' scores for that criterion, and an `evidence[]` (verbatim quotes) → `rationale` → `band` key order. Generate learner feedback in a separate call that receives the scores. | **Medium.** It halves halo, removes the score-first ordering, and removes interference from the long feedback task. | 4 short calls instead of 1 long one. Roughly +4× the anchor input (or one call with all four criteria when cost matters). +150–300 output tokens per criterion. | S5, S7, S17, S16, D1 |
| **4** | **Feed deterministic features into scoring.** Pass word count vs minimum, error rate per 100 words by category (from `inlinePass`, run first), MTLD, CEFR-level word shares, and paragraph and linker counts as facts. Also use them as extra predictors in the calibration model from Rank 1. Remove the "do not focus on spelling/grammar" instruction from LR/GRA scoring. | **Medium**, strongest on LR/GRA and on under-length TR (LLMs over-score short essays and are mis-severe on grammar) | ~100 input tokens. The inline pass must finish before scoring (adds latency). | S21, S1, S20, S30, S31, S13, S4 |
| **5** | **Compute the overall band by rule** (mean of the four criteria; the official rounding rule for a single Writing task band is not published, so it is UNVERIFIED, and round-down to the nearest half band is the common assumption) instead of asking the model for it. Score criteria as whole bands, or as a continuous expected value from logprobs (OpenAI non-reasoning models) and then calibrate. | **Small–medium.** Removes an inconsistent free parameter and gives a calibratable continuous score. | 0 tokens (logprobs are free on supported models) | D3, S18 |
| **6** | **Stabilise decoding.** Use T=0 where supported. Pin a dated model snapshot. Do not average multiple samples for accuracy; use 3 samples only to show a confidence range or to flag disagreement for review. For DeepSeek thinking mode, temperature is ignored, so rely on calibration. | **Small** effect on accuracy, **large** effect on visible score jitter between re-runs | 0, or ×3 calls if sampling | S5, S28, S27, D2 |
| **7** | **Optional: pairwise check against anchors** for the top bands (7–9), where compression is worst. Ask "is this essay better or worse than the band-7.5 anchor on LR?" in both orders. | Unknown for a single essay. Batch comparative judgement gains were +0.1 QWK or more. | +2 calls per comparison | S8, S9, S23 (**untested in this form**) |
| **8** | **Later: fine-tune** (or train a small regressor on LLM sub-scores plus features) once there are several hundred labelled essays. | Large in the literature, but needs data | Training plus vendor lock-in | S19, S29, S35 |

If only one thing is done, do **#1 plus the evaluation harness below**. Without it, the effect of #2–#7 cannot be measured on IELTS data, and the literature shows effects that vary by model (S10, S11, S15).

### How to evaluate

**Data**
- Aim for essays with **per-criterion** bands from trained IELTS examiners, double-marked where possible (needed for the human–human baseline).
- Stratify across bands 4–8.5. Do not let them cluster at 6–7: restricted range depresses QWK and hides compression at the extremes.
- Treat official public sample essays with suspicion (possible training-data contamination; my inference from S2's source list).
- Hold out the calibration data. Use cross-fitting (k-fold) to report post-calibration numbers.

**Metrics** (per criterion and overall, per model and prompt version)
- QWK on the band grid (map half-bands to integers), with a 95% bootstrap CI.
- Exact, within-0.5 and within-1 band agreement. MAE.
- **Signed mean bias** and **SMD** (target ≤ .15).
- **SD ratio** (model SD / human SD; < 1 means compression).
- Conditional bias by human band: the table or confusion matrix that exposes central tendency.
- Cross-criterion correlation compared with human cross-criterion correlation (halo).
- Run-to-run SD on a re-score of 20 essays.
- Operational bars from Williamson et al.: QWK ≥ .70, no more than .10 below human–human, SMD ≤ .15 [S22]. IELTS reports 0.92 inter-rater reliability for Writing under its own re-marking methodology [D3]. That is not directly comparable to a single-examiner QWK.

**Minimal sample size**
- Severity (bias) detection needs only a handful of essays for low-level language traits. Higher-level traits like task response need far more, with a 90th-percentile N_min of ~175 on ASAP and DREsS [S4]. Calibration saturates at about 30–100 anchors [S5].
- QWK precision, from my own simulation (not from a paper): IELTS-like bands, human noise SD 0.35 and model noise SD 0.5 bands, giving a true QWK of about 0.83. The 95% interval is about **±0.12 at n=30, ±0.09 at n=50, ±0.06 at n=100, ±0.045 at n=200**. The script is `scratchpad/scripts/qwk_sim.py` in this session.
- Practical minimum: **~50 essays to detect gross problems; ~100 to compare prompt variants (paired bootstrap on the same essays); ~200+ before trusting per-criterion QWK to ±0.05** or fitting isotonic maps.
- Model-version monitoring: a paired 20-essay canary detected 4 of 5 real version shifts [S5].

**Reporting**
- For each run, record model ID and snapshot, prompt hash, temperature, anchor set ID, n, the band distribution of the sample, and every metric above with CIs, both before and after calibration.
- Never mix scores across model versions without re-calibrating [S5].

---

## Open questions

1. **No public IELTS per-criterion benchmark with examiner double-marking exists** that I could find. All IELTS-specific claims here rest on S2 (n=55, overall band only, contamination risk) or a private dataset (S35). engtype's own labelled set will be the main evidence.
2. **Whether criterion descriptors or concise keywords work better for the IELTS LR and GRA criteria** with current GPT and DeepSeek models. S4 (Llama, ELLIPSE) and S10 (TOEFL11, holistic) point in different directions.
3. **Reasoning models (GPT-5.x reasoning, DeepSeek thinking mode)** for essay scoring: there is little direct evidence (S26 with n=20, S28 on maths). They may reduce the need for an explicit rationale field but remove temperature control.
4. **Pairwise comparison against fixed anchors for a single essay** is untested. The published gains come from batch ranking plus distribution mapping.
5. **Isotonic vs linear calibration for essay bands** has no essay-specific comparison. At n ≤ 100, linear or offset mapping looked safer (S5).
6. **L1 fairness:** offsets linked to the learner's first language appeared in two studies (S1, S29). engtype could check this if it records learners' L1 (with consent).
7. **DeepSeek V4.x behaviour**: only S32 tested it, briefly, and it was harsh on ELLIPSE like the other judges. Severity for engtype's prompts is unknown until measured.
8. A few 2026 preprints cited here (S5, S6, S12, S32) are not peer reviewed. S5's practical claims (30–100 anchors, halo halving, version shifts) are the most load-bearing and should be re-checked against engtype data.
