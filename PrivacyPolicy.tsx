import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { SEO } from './SEO';
import { site } from './toolsData';

const updatedAt = 'May 17, 2026';
const description =
  'Privacy Policy for Zyphoric, covering local browser processing, AI requests, limited service logs, and user choices.';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'PrivacyPolicy',
  name: 'Privacy Policy',
  description,
  url: `${site.baseUrl}/privacy`,
  dateModified: '2026-05-17',
  publisher: {
    '@type': 'Organization',
    name: site.name,
    url: site.baseUrl,
  },
};

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80 sm:p-8">
    <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">{title}</h2>
    <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">{children}</div>
  </section>
);

export const PrivacyPolicy = () => {
  return (
    <article className="mx-auto max-w-4xl space-y-8">
      <SEO
        title="Privacy Policy"
        description={description}
        canonical={`${site.baseUrl}/privacy`}
        schema={schema}
        keywords="privacy policy, developer tool privacy, browser-based tools, AI tool privacy"
      />

      <header className="space-y-5 border-b border-slate-200 pb-8 dark:border-slate-800">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">Legal</p>
        <h1 className="text-4xl font-bold text-slate-950 dark:text-white md:text-5xl">Privacy Policy</h1>
        <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">{description}</p>
        <p className="text-sm text-slate-500 dark:text-slate-500">Last updated: {updatedAt}</p>
      </header>

      <Section title="Overview">
        <p>
          Zyphoric is designed as a privacy-minded developer workspace. Standard tools such as{' '}
          <Link to="/tools/json" className="text-blue-500 hover:underline">JSON Formatter</Link>,{' '}
          <Link to="/tools/jwt" className="text-blue-500 hover:underline">JWT Decoder</Link>, and{' '}
          <Link to="/tools/base64" className="text-blue-500 hover:underline">Base64 Converter</Link> process your input in your browser.
        </p>
        <p>
          AI tools require a request to our AI service endpoint when you submit code or prompts. You should avoid submitting passwords, private keys, production secrets, or sensitive personal data.
        </p>
      </Section>

      <Section title="Information we process">
        <ul className="list-disc space-y-3 pl-5">
          <li>Tool inputs you intentionally paste into the app, processed locally for standard utilities.</li>
          <li>AI prompts and code snippets you submit to AI features, transmitted to provide the requested result.</li>
          <li>Basic technical data such as browser type, device information, request timestamps, and error logs needed to operate and protect the service.</li>
          <li>Preferences stored locally in your browser, such as theme, recent tools, and favorite tools.</li>
        </ul>
      </Section>

      <Section title="Cookies and third-party services">
        <p>
          We may use cookies, local storage, or similar technologies to remember preferences, keep the interface usable, and measure service reliability.
        </p>
        <p>
          AI features send submitted prompts to the configured AI provider only when you choose to run an AI action. Standard utilities are designed to run locally in your browser when possible.
        </p>
      </Section>

      <Section title="How information is used">
        <ul className="list-disc space-y-3 pl-5">
          <li>Provide formatting, decoding, conversion, comparison, and AI-assisted developer features.</li>
          <li>Improve performance, reliability, abuse prevention, and product quality.</li>
          <li>Maintain security controls for AI endpoints and rate limits.</li>
          <li>Comply with legal and service policy obligations.</li>
        </ul>
      </Section>

      <Section title="Data retention and security">
        <p>
          Standard tool inputs are not intentionally stored by Zyphoric servers. AI requests may be temporarily processed by infrastructure providers to return results, enforce abuse controls, or diagnose service reliability.
        </p>
        <p>
          We use reasonable technical safeguards, but no internet service can guarantee absolute security. Review outputs before using them in production systems.
        </p>
      </Section>

      <Section title="Your choices">
        <p>
          You can clear local preferences through your browser storage settings. You can avoid AI processing by using only local tools. You can also opt out of personalized advertising using the links above where available.
        </p>
        <p>
          For privacy questions, visit the <Link to="/contact" className="text-blue-500 hover:underline">Contact page</Link>.
        </p>
      </Section>

      <Section title="Children and policy updates">
        <p>
          Zyphoric is intended for developers and is not directed to children under 13. We may update this policy to reflect product, legal, or advertising changes. Material updates will be posted on this page.
        </p>
      </Section>
    </article>
  );
};
