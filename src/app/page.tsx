import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { currentUser } from "@/lib/auth";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const TITLE = "engtype — тренажёр Writing для подготовки к IELTS и TOEFL";
const DESCRIPTION =
  "Пишите эссе и письма в формате IELTS и TOEFL iBT® и получайте разбор по критериям экзамена: оценка по каждому критерию с цитатами из текста, подсветка ошибок, рекомендации и статистика прогресса.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  keywords: ["IELTS Writing", "TOEFL Writing", "IELTS Task 2", "подготовка к IELTS", "эссе на английском", "проверка эссе", "band score"],
  openGraph: { type: "website", url: "/", siteName: SITE_NAME, title: TITLE, description: DESCRIPTION, locale: "ru_RU" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FORMATS = [
  { exam: "IELTS", name: "Task 2 — эссе", time: "40 мин", words: "от 250 слов", scale: "Band 0–9 по 4 критериям" },
  { exam: "IELTS GT", name: "Task 1 — письмо", time: "20 мин", words: "от 150 слов", scale: "Band 0–9 по 4 критериям" },
  { exam: "TOEFL iBT®", name: "Write an Email", time: "7 мин", words: "без минимума", scale: "0–5" },
  { exam: "TOEFL iBT®", name: "Academic Discussion", time: "10 мин", words: "от 100 слов", scale: "0–5" },
];

const FEATURES = [
  {
    title: "Задания в формате экзамена",
    text: "Типы вопросов, время и минимальный объём как на настоящем экзамене. Уровень сложности — от A1 до C2: можно тренироваться задолго до экзамена.",
  },
  {
    title: "Оценка по критериям, а не «на глаз»",
    text: "Каждый критерий оценивается отдельно, с цитатами из вашего текста и объяснением, чего не хватает до следующего балла. Итог считается по правилам экзамена.",
  },
  {
    title: "Два уровня разбора",
    text: "В тексте подсвечены ошибки — вплоть до неверных букв в слове. Отдельно — проблемы смысла и структуры: логика, аргументы, абзацы, ответ на вопрос задания.",
  },
  {
    title: "Прогресс как на GitHub",
    text: "Карта активности, серии дней, динамика баллов и самые частые ошибки. Публичный профиль — по желанию.",
  },
];

const FAQ = [
  {
    q: "Насколько оценка похожа на настоящую?",
    a: "Мы опираемся на опубликованные критерии IELTS и TOEFL, пересказанные своими словами, и применяем официальные правила подсчёта: например, ответ короче 20 слов получает Band 1, а без абзацев Coherence не выше 5. Но это оценка для тренировки, а не официальный результат: реальный балл может отличаться.",
  },
  {
    q: "Это официальный сайт IELTS или TOEFL?",
    a: "Нет. engtype — независимый тренажёр, он не связан с British Council, IDP, Cambridge University Press & Assessment или ETS.",
  },
  {
    q: "Подойдёт ли, если мой уровень ниже B2?",
    a: "Да. Для уровней A1–B1 есть короткие форматы: сообщения, письма, мнения. А разбор показывает, какие ошибки мешают перейти на следующий уровень.",
  },
  {
    q: "Можно ли задать вопрос по своей работе?",
    a: "Да, у каждой работы есть чат с тьютором. Он отвечает только на вопросы о вашем тексте и английском письме.",
  },
];

/** A static example of the inline feedback, built with the same marks the app uses. */
function Demo() {
  return (
    <div className="rounded-2xl bg-sub-alt p-6 font-mono text-[15px] leading-[2.2] text-text shadow-sm sm:p-8">
      <div className="mb-4 flex justify-between font-mono text-[11px] text-sub">
        <span>ielts task 2 · discuss both views</span>
        <span>band · estimate 6.0</span>
      </div>
      <p>
        Many <span className="mark-error">peoples</span> believe that living in a city is{" "}
        <span className="mark-improve">very good</span> because there are more jobs. However, the countryside offers a quieter life
        and <span className="mark-error">a</span> cleaner air, which is important for families. In my opinion, the best choice
        depends on age, <span>bec</span>
        <span className="mark-letter">ua</span>
        <span>se</span> young people usually need opportunities more than silence.
      </p>
      <div className="mt-5 grid gap-3 border-t border-sub/20 pt-4 font-sans text-sm sm:grid-cols-2">
        <p>
          <span className="font-mono text-[11px] text-sub">grammar · </span>
          <span className="text-sub line-through">peoples</span> → <b className="font-medium">people</b>: «people» уже множественное число.
        </p>
        <p>
          <span className="font-mono text-[11px] text-sub">coherence · 6 → 7: </span>
          связки работают, но механически; нужна ясная мысль в каждом абзаце.
        </p>
      </div>
    </div>
  );
}

export default async function Landing() {
  const user = await currentUser();
  const cta = user ? { href: "/write", label: "Продолжить писать" } : { href: "/register", label: "Начать" };

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: SITE_NAME,
      url: SITE_URL,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      inLanguage: ["ru", "en"],
      description: DESCRIPTION,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <div lang="ru" className="flex flex-col gap-24 pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* hero */}
      <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="animate-rise mb-4 font-mono text-xs text-sub">IELTS · TOEFL iBT® · A1–C2</p>
          <h1 className="animate-rise font-display text-5xl leading-[1.05] text-text [--d:80ms] sm:text-6xl">
            Тренажёр письменной части <span className="italic">IELTS и TOEFL</span>
          </h1>
          <p className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-text/80 [--d:160ms]">
            Пишите эссе и письма в формате экзамена и получайте разбор по его критериям: балл за каждый критерий с цитатами из
            вашего текста, подсветку ошибок и понятный план, что улучшить.
          </p>
          <div className="animate-rise mt-8 flex flex-wrap items-center gap-4 [--d:240ms]">
            <Link
              href={cta.href}
              className="group flex items-center gap-2 rounded-full bg-text px-6 py-3 font-mono text-sm text-background transition-transform active:scale-95"
            >
              {cta.label}
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            {!user && (
              <Link href="/login" className="font-mono text-sm text-sub underline-offset-4 hover:text-text hover:underline">
                уже есть аккаунт
              </Link>
            )}
          </div>
        </div>
        <div className="animate-rise [--d:320ms]">
          <Demo />
        </div>
      </section>

      {/* features */}
      <section aria-labelledby="features">
        <h2 id="features" className="mb-10 font-display text-4xl text-text">
          Что внутри
        </h2>
        <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="animate-rise" style={{ "--d": `${i * 80}ms` } as React.CSSProperties}>
              <p className="mb-2 font-mono text-xs text-sub">0{i + 1}</p>
              <h3 className="mb-2 font-display text-2xl text-text">{f.title}</h3>
              <p className="leading-relaxed text-text/75">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* formats */}
      <section aria-labelledby="formats">
        <h2 id="formats" className="mb-3 font-display text-4xl text-text">
          Форматы заданий
        </h2>
        <p className="mb-8 max-w-2xl text-text/70">
          Время, объём и шкала — по официальным спецификациям экзаменов. Устаревшие форматы (например, TOEFL Independent Writing,
          убранный ETS в 2023 году) не используются.
        </p>
        <div className="overflow-x-auto rounded-2xl bg-sub-alt">
          <table className="w-full min-w-[560px] text-left">
            <thead className="font-mono text-[11px] text-sub">
              <tr>
                <th className="px-5 py-4 font-normal">экзамен</th>
                <th className="px-5 py-4 font-normal">задание</th>
                <th className="px-5 py-4 font-normal">время</th>
                <th className="px-5 py-4 font-normal">объём</th>
                <th className="px-5 py-4 font-normal">шкала</th>
              </tr>
            </thead>
            <tbody>
              {FORMATS.map((f) => (
                <tr key={f.name} className="border-t border-background">
                  <td className="px-5 py-4 font-mono text-sm text-sub">{f.exam}</td>
                  <td className="px-5 py-4 text-text">{f.name}</td>
                  <td className="px-5 py-4 font-mono text-sm">{f.time}</td>
                  <td className="px-5 py-4 font-mono text-sm">{f.words}</td>
                  <td className="px-5 py-4 font-mono text-sm text-text/80">{f.scale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* how scoring works */}
      <section aria-labelledby="scoring" className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <h2 id="scoring" className="font-display text-4xl text-text">
          Как считается балл
        </h2>
        <ol className="space-y-6">
          {[
            "Сначала проверки по правилам экзамена: объём, абзацы, списки вместо текста, фразы, скопированные из задания.",
            "Затем каждый критерий оценивается отдельно: сначала цитаты-доказательства из вашего текста, потом балл и что нужно для следующего.",
            "Если в тексте есть признак, который по критериям ограничивает балл (например, не раскрыта часть вопроса), балл не поднимется выше этого предела.",
            "Итог считается формулой экзамена, а не «на глаз», и честно помечен как оценка.",
          ].map((t, i) => (
            <li key={i} className="flex gap-5">
              <span className="font-display text-4xl leading-none italic text-main">{i + 1}</span>
              <p className="pt-1 leading-relaxed text-text/80">{t}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* faq */}
      <section aria-labelledby="faq">
        <h2 id="faq" className="mb-8 font-display text-4xl text-text">
          Вопросы
        </h2>
        <div className="divide-y divide-sub/20 border-y border-sub/20">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg text-text">
                {f.q}
                <span className="font-mono text-sub transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-3xl leading-relaxed text-text/75">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* final cta */}
      <section className="flex flex-col items-center gap-6 rounded-2xl bg-sub-alt px-6 py-14 text-center">
        <h2 className="font-display text-4xl text-text sm:text-5xl">
          Первое эссе — <span className="italic">за 40 минут</span>
        </h2>
        <p className="max-w-lg text-text/75">Выберите уровень и формат, напишите ответ и посмотрите, что мешает получить балл выше.</p>
        <Link
          href={cta.href}
          className="group flex items-center gap-2 rounded-full bg-text px-6 py-3 font-mono text-sm text-background transition-transform active:scale-95"
        >
          {cta.label}
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </section>
    </div>
  );
}
