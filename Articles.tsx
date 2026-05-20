import { Link } from 'react-router-dom';
import { SEO } from './SEO';
import { Sparkles, Book, ArrowRight } from 'lucide-react';
import { site } from './toolsData';

const articles = [
  {
    title: 'Best Practices for Secure JWT Debugging',
    description: 'Learn how to inspect and validate tokens safely across development and staging environments.',
    href: '/articles#jwt-debugging',
  },
  {
    title: 'Faster API Workflows with JSON and SQL Tools',
    description: 'Combine formatters and query helpers to polish API responses and database scripts.',
    href: '/articles#api-sql-workflow',
  },
  {
    title: 'Regex Tips for Reliable Validation',
    description: 'Build regex patterns with confidence and avoid common pitfalls in form validation.',
    href: '/articles#regex-tips',
  },
  {
    title: 'AI-Assisted Debugging and Code Review',
    description: 'Use AI tools to explain, refactor, and fix code faster without leaving the browser.',
    href: '/articles#ai-debugging',
  },
];

export const Articles = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <SEO
        title="Developer Guides & Articles"
        description="Read practical developer guides for JWT debugging, JSON formatting, SQL cleanup, regex validation, and AI-assisted code review workflows."
        canonical={`${site.baseUrl}/articles`}
        image="/icon-512.png"
        keywords="developer guides, coding best practices, ai developer tools, json formatting guide, jwt debugging"
      />
      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-10 text-center">
        <div className="inline-flex items-center justify-center gap-3 mb-6 rounded-full bg-blue-500/10 px-4 py-2 text-blue-300 text-sm font-semibold">
          <Sparkles size={18} /> Guide center
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">Developer guides and workflow articles</h1>
        <p className="mt-4 text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Practical workflows and recommended ways to combine DevTools Hub AI utilities for faster debugging, safer tokens, cleaner payloads, and more reliable code reviews.
        </p>
      </div>

      <section className="grid gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.href}
            to={article.href}
            className="group rounded-[2rem] border border-slate-800 bg-slate-900 p-8 transition hover:border-blue-500/60 hover:bg-slate-800"
          >
            <div className="flex items-center gap-3 mb-4">
              <Book size={24} className="text-blue-400" />
              <span className="text-sm uppercase tracking-[0.3em] text-slate-300">Guide</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">{article.title}</h2>
            <p className="text-slate-400 leading-relaxed">{article.description}</p>
            <div className="mt-8 inline-flex items-center gap-2 text-blue-300 font-semibold">
              Read more
              <ArrowRight size={18} />
            </div>
          </Link>
        ))}
      </section>

      <section className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-10">
        <h2 className="text-3xl font-bold mb-4">Why these guides matter</h2>
        <p className="text-slate-400 leading-relaxed">
          These resources are designed to help you get more value from DevTools Hub AI by linking tool workflows, improving debug cycles, and making your front-end and backend developer experience smoother.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            'Use JWT decoding alongside API payload inspection.',
            'Format JSON before sharing responses or storing configs.',
            'Pair regex testing with AI-generated patterns for safer validation.',
            'Combine AI explainer and bug fixer workflows for faster reviews.',
          ].map((item) => (
            <li key={item} className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-300">{item}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-8">
        <article id="jwt-debugging" className="scroll-mt-28 rounded-[2rem] border border-slate-800 bg-slate-950/80 p-8">
          <h2 className="text-3xl font-bold">Best practices for secure JWT debugging</h2>
          <p className="mt-4 text-slate-400 leading-relaxed">
            JWTs are useful for authentication debugging, but they often contain identifiers, roles, expiry claims, and environment-specific metadata. Start by decoding the token locally with the <Link to="/tools/jwt" className="text-blue-400 hover:text-blue-300">JWT Decoder</Link>, then confirm the header, payload, issuer, audience, and expiration fields before changing backend logic.
          </p>
          <p className="mt-4 text-slate-400 leading-relaxed">
            Never paste production secrets or signing keys into a browser tool. If a token contains sensitive claims, redact values before sharing screenshots or bug reports. Pair JWT inspection with the <Link to="/tools/json" className="text-blue-400 hover:text-blue-300">JSON Formatter</Link> when reviewing nested claims from API responses.
          </p>
        </article>

        <article id="api-sql-workflow" className="scroll-mt-28 rounded-[2rem] border border-slate-800 bg-slate-950/80 p-8">
          <h2 className="text-3xl font-bold">Faster API workflows with JSON and SQL tools</h2>
          <p className="mt-4 text-slate-400 leading-relaxed">
            When an API response looks wrong, format the payload first. Clear indentation makes missing fields, null values, and unexpected arrays easier to spot. After reviewing the response, use the <Link to="/tools/sql" className="text-blue-400 hover:text-blue-300">SQL Formatter</Link> to clean related database queries before debugging filters, joins, and pagination.
          </p>
          <p className="mt-4 text-slate-400 leading-relaxed">
            This workflow reduces guesswork: inspect the JSON shape, compare it with the query, and use the <Link to="/tools/diff" className="text-blue-400 hover:text-blue-300">Diff Viewer</Link> to compare before-and-after payloads when validating a fix.
          </p>
        </article>

        <article id="regex-tips" className="scroll-mt-28 rounded-[2rem] border border-slate-800 bg-slate-950/80 p-8">
          <h2 className="text-3xl font-bold">Regex tips for reliable validation</h2>
          <p className="mt-4 text-slate-400 leading-relaxed">
            A reliable regex should be tested against both expected matches and intentional failures. Use the <Link to="/tools/regex" className="text-blue-400 hover:text-blue-300">Regex Tester</Link> with realistic examples, edge cases, empty values, and long strings before using a pattern in a form or parser.
          </p>
          <p className="mt-4 text-slate-400 leading-relaxed">
            If you start from a plain-language requirement, generate a first draft with the <Link to="/ai/regex-gen" className="text-blue-400 hover:text-blue-300">AI Regex Generator</Link>, then verify it manually. Treat generated regex as a starting point, not a final security control.
          </p>
        </article>

        <article id="ai-debugging" className="scroll-mt-28 rounded-[2rem] border border-slate-800 bg-slate-950/80 p-8">
          <h2 className="text-3xl font-bold">AI-assisted debugging and code review</h2>
          <p className="mt-4 text-slate-400 leading-relaxed">
            AI tools are most useful when the task is narrow. Ask the <Link to="/ai/explainer" className="text-blue-400 hover:text-blue-300">AI Code Explainer</Link> to summarize a function, then use the <Link to="/ai/bug-fixer" className="text-blue-400 hover:text-blue-300">AI Bug Fixer</Link> for a focused issue such as an exception, incorrect branch, or missed edge case.
          </p>
          <p className="mt-4 text-slate-400 leading-relaxed">
            Always run tests and review changes before shipping. AI output can accelerate understanding, but production code still needs human review, security checks, and project-specific validation.
          </p>
        </article>
      </section>
    </div>
  );
};
