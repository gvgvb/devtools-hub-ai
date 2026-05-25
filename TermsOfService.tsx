import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { SEO } from './SEO';
import { site } from './toolsData';

const updatedAt = 'May 17, 2026';
const description =
  'Terms of Service for Zyphoric, including acceptable use, AI output review, service limits, advertising, and liability terms.';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Terms of Service',
  description,
  url: `${site.baseUrl}/terms`,
  dateModified: '2026-05-17',
  isPartOf: {
    '@type': 'WebSite',
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

export const TermsOfService = () => {
  return (
    <article className="mx-auto max-w-4xl space-y-8">
      <SEO
        title="Terms of Service"
        description={description}
        canonical={`${site.baseUrl}/terms`}
        schema={schema}
        keywords="terms of service, acceptable use policy, developer tools terms, AI tools terms"
      />

      <header className="space-y-5 border-b border-slate-200 pb-8 dark:border-slate-800">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">Legal</p>
        <h1 className="text-4xl font-bold text-slate-950 dark:text-white md:text-5xl">Terms of Service</h1>
        <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">{description}</p>
        <p className="text-sm text-slate-500 dark:text-slate-500">Last updated: {updatedAt}</p>
      </header>

      <Section title="Acceptance of terms">
        <p>
          By using Zyphoric, you agree to these terms and the <Link to="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>. If you do not agree, do not use the website or its tools.
        </p>
      </Section>

      <Section title="Permitted use">
        <p>
          You may use the tools for lawful development, debugging, education, testing, and productivity workflows. You are responsible for the inputs you provide and the outputs you use.
        </p>
        <p>
          You may not use the service to attack systems, bypass security, distribute malware, harvest credentials, infringe intellectual property, or violate applicable laws or third-party rights.
        </p>
      </Section>

      <Section title="AI-assisted features">
        <p>
          AI features can generate helpful explanations, conversions, and suggestions, but outputs may be incomplete or inaccurate. You must review and test AI-generated content before relying on it in production.
        </p>
        <p>
          Do not submit confidential source code, private keys, passwords, regulated data, or personal information unless you have the right to do so and accept the processing involved.
        </p>
      </Section>

      <Section title="Accounts, availability, and changes">
        <p>
          Most tools do not require an account. We may update, limit, suspend, or discontinue parts of the service to improve reliability, prevent abuse, or comply with policy requirements.
        </p>
        <p>
          We do not guarantee uninterrupted availability, permanent storage, or compatibility with every browser, device, framework, or workflow.
        </p>
      </Section>

      <Section title="Advertising and third-party links">
        <p>
          The site may display advertising or link to third-party resources. Ads and external links do not imply endorsement. Advertising placements must not be treated as navigation, downloads, or tool actions.
        </p>
        <p>
          Third-party services are governed by their own terms and privacy policies.
        </p>
      </Section>

      <Section title="Intellectual property">
        <p>
          Zyphoric branding, interface content, and site materials are owned by Zyphoric or its licensors. Your own inputs remain yours, subject to the rights needed to process them and return results.
        </p>
      </Section>

      <Section title="No warranties and limitation of liability">
        <p>
          The service is provided as is and as available. To the fullest extent permitted by law, Zyphoric disclaims warranties and is not liable for indirect damages, lost data, security incidents caused by user misuse, or production issues caused by unverified outputs.
        </p>
      </Section>

      <Section title="Questions">
        <p>
          For support or legal questions, visit the <Link to="/contact" className="text-blue-500 hover:underline">Contact page</Link>.
        </p>
      </Section>
    </article>
  );
};
