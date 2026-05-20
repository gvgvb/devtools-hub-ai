import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { SEO } from './SEO';
import { site } from './toolsData';

const updatedAt = 'May 17, 2026';
const description =
  'Privacy Policy for DevTools Hub AI, covering local browser processing, AI requests, analytics, cookies, Google advertising disclosures, and user choices.';

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
        keywords="privacy policy, Google AdSense privacy, developer tool privacy, browser-based tools"
      />

      <header className="space-y-5 border-b border-slate-200 pb-8 dark:border-slate-800">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">Legal</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-950 dark:text-white md:text-5xl">Privacy Policy</h1>
        <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">{description}</p>
        <p className="text-sm text-slate-500 dark:text-slate-500">Last updated: {updatedAt}</p>
      </header>

      <Section title="Overview">
        <p>
          DevTools Hub AI is designed as a privacy-minded developer toolkit. Standard tools such as{' '}
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
          <li>Basic technical data such as browser type, device information, error logs, and approximate usage events if analytics or monitoring are enabled.</li>
          <li>Preferences stored locally in your browser, such as theme, recent tools, and favorite tools.</li>
        </ul>
      </Section>

      <Section title="Cookies, ads, and third-party services">
        <p>
          We may use cookies, local storage, or similar technologies to remember preferences, measure site reliability, and support advertising if Google AdSense or another ad provider is enabled.
        </p>
        <p>
          Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites. Google's use of advertising cookies enables Google and its partners to serve ads based on visits to this site and other sites on the internet.
        </p>
        <p>
          Users may opt out of personalized advertising through{' '}
          <a href="https://adssettings.google.com/" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Google Ads Settings</a>. Users may also learn more about advertising cookies at{' '}
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Google Ads Privacy</a> or opt out of some third-party personalized advertising through{' '}
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">aboutads.info</a>.
        </p>
      </Section>

      <Section title="How information is used">
        <ul className="list-disc space-y-3 pl-5">
          <li>Provide formatting, decoding, conversion, comparison, and AI-assisted developer features.</li>
          <li>Improve performance, reliability, abuse prevention, and product quality.</li>
          <li>Maintain security controls for AI endpoints and rate limits.</li>
          <li>Comply with legal, policy, and advertising platform obligations.</li>
        </ul>
      </Section>

      <Section title="Data retention and security">
        <p>
          Standard tool inputs are not intentionally stored by DevTools Hub AI servers. AI requests may be temporarily processed by infrastructure providers to return results, enforce abuse controls, or diagnose service reliability.
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
          DevTools Hub AI is intended for developers and is not directed to children under 13. We may update this policy to reflect product, legal, or advertising changes. Material updates will be posted on this page.
        </p>
      </Section>
    </article>
  );
};
