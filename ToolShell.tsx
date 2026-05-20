import type { ComponentType, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from './SEO';
import { Breadcrumbs } from './Breadcrumbs';
import { RelatedTools } from './RelatedTools';
import { ToolWrapper } from './ToolWrapper';
import { relatedTools, toolByPath, pageSchema, site, tools } from './toolsData';
import type { ToolEntry } from './toolsData';

interface ToolShellProps {
  title: string;
  description: string;
  path: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  iconColor: string;
  children: ReactNode;
}

const getToolContent = (tool: ToolEntry) => {
  if (!tool) return null;

  const getUseCases = (): string[] => {
    if (tool.useCases) return tool.useCases;
    switch (tool.path) {
      case '/tools/json':
        return [
          'Pretty-print API responses for debugging.',
          'Validate configuration payloads before deployment.',
          'Minify JSON for faster network transfer.',
        ];
      case '/tools/jwt':
        return [
          'Inspect authentication tokens securely.',
          'Review token expiration and issued claims.',
          'Debug JWT-based login and session flows.',
        ];
      case '/ai/explainer':
        return [
          'Understand third-party code quickly.',
          'Translate complex logic into plain language.',
          'Review code during debugging and pull request checks.',
        ];
      case '/ai/bug-fixer':
        return [
          'Find syntax and logic issues faster.',
          'Improve readability while preserving behavior.',
          'Use during code review or holiday refactors.',
        ];
      case '/ai/converter':
        return [
          'Turn JavaScript into Python examples.',
          'Port utility scripts across languages.',
          'Generate starter code for new projects.',
        ];
      case '/ai/regex-gen':
        return [
          'Create email and URL matchers from plain language.',
          'Build validation patterns for forms.',
          'Avoid common regex mistakes with AI guidance.',
        ];
      case '/tools/regex':
        return [
          'Validate capture groups in real time.',
          'Test edge cases for text parsing.',
          'Refine regular expressions for form validation.',
        ];
      case '/tools/sql':
        return [
          'Format SQL before reviewing queries.',
          'Clean up complex join statements.',
          'Prepare database scripts for sharing.',
        ];
      case '/tools/diff':
        return [
          'Compare config changes side by side.',
          'Review code revisions before merging.',
          'Spot text differences in documentation updates.',
        ];
      case '/tools/cron':
        return [
          'Confirm scheduled job behavior.',
          'Translate cron syntax into plain English.',
          'Validate cron expressions for deployments.',
        ];
      case '/tools/base64':
        return [
          'Decode token payloads safely.',
          'Encode API keys and small binary values.',
          'Convert text for safe URL transport.',
        ];
      case '/tools/unit-converter':
        return [
          'Convert design spacing between px and rem.',
          'Match CSS units across frameworks.',
          'Verify visual consistency in responsive interfaces.',
        ];
      case '/tools/password-gen':
        return [
          'Generate secure passwords for accounts.',
          'Create random keys for API environments.',
          'Build memorization-friendly passphrases.',
        ];
      case '/tools/url':
        return [
          'Encode query strings safely.',
          'Decode URL parts for debugging.',
          'Verify redirect destinations before sharing links.',
        ];
      default:
        return ['Use this tool to improve your developer workflow.', 'Save time on repetitive formatting tasks.', 'Link related tasks across other DevTools Hub AI utilities.'];
    }
  };

  const getExamples = (): string[] => {
    if (tool.examples) return tool.examples;
    switch (tool.path) {
      case '/tools/json':
        return [
          'Paste raw API output and click Beautify to inspect fields clearly.',
          'Use Minify before copying a payload into production code.',
        ];
      case '/tools/jwt':
        return [
          'Paste an authorization header to view header and payload details.',
          'Inspect claim values to confirm user role and expiry.',
        ];
      case '/ai/explainer':
        return [
          'Explain a React component tree or Python function.',
          'Summarize the behavior of a loop or conditional block.',
        ];
      case '/ai/bug-fixer':
        return [
          'Paste a failing function and get a corrected version.',
          'Ask the AI to improve error handling in your snippet.',
        ];
      case '/ai/converter':
        return [
          'Convert JavaScript utilities into Python code.',
          'Translate a SQL query into a descriptive pseudo query.',
        ];
      case '/ai/regex-gen':
        return [
          'Describe a date pattern and receive a matching regex.',
          'Generate a validator for email or phone input.',
        ];
      case '/tools/regex':
        return [
          'Test a regex with sample text and see matched groups instantly.',
          'Check match coverage for URLs, dates, or identifiers.',
        ];
      case '/tools/sql':
        return [
          'Format a query before reviewing SQL performance.',
          'Normalize indentation across nested SELECTs and JOINs.',
        ];
      case '/tools/diff':
        return [
          'Compare two versions of a README or JSON file.',
          'Review code changes before committing or sharing.',
        ];
      case '/tools/cron':
        return [
          'Enter a cron expression to learn the exact schedule.',
          'Validate job timing for deployment and CI pipelines.',
        ];
      case '/tools/base64':
        return [
          'Decode an encoded token into readable text.',
          'Encode credentials for safe storage in configuration.',
        ];
      case '/tools/unit-converter':
        return [
          'Convert 16px to 1rem for consistent typography.',
          'Translate hex colors to RGB values when needed.',
        ];
      case '/tools/password-gen':
        return [
          'Generate a strong 16-character password for new accounts.',
          'Create a random passphrase for secure team access.',
        ];
      case '/tools/url':
        return [
          'Encode a long query string safely for browser use.',
          'Decode a redirect URL before clicking it.',
        ];
      default:
        return ['Use the tool with your own input to explore its behavior.', 'Pair it with related utilities for faster workflows.'];
    }
  };

  const relatedToolLinks = relatedTools(tool.path, 3).map((other) => ({ label: other.name, href: other.path }));

  return (
    <section className="mt-16 space-y-12">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-8">
        <h2 className="text-3xl font-bold mb-4">What is {tool.name}?</h2>
        <p className="text-slate-400 leading-relaxed">
          {tool.desc} {tool.category === 'AI' ? 'This AI-powered utility is designed to improve your code workflow with intelligent suggestions and instant results.' : 'It is built for developers who need fast, private transformations without sending data to a server.'}
        </p>
        <p className="text-slate-400 leading-relaxed mt-4">
          Use it together with <Link to="/tools/json" className="text-blue-400 hover:text-blue-300 transition">JSON Formatter</Link> or <Link to="/tools/regex" className="text-blue-400 hover:text-blue-300 transition">Regex Tester</Link> to speed up debugging and code reviews.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-8">
          <h2 className="text-3xl font-bold mb-4">How to use {tool.name}</h2>
          <ol className="list-decimal list-inside space-y-3 text-slate-400 leading-relaxed">
            <li>Paste your input or code into the editor area.</li>
            <li>Choose the action that fits your task—format, decode, explain, or compare.</li>
            <li>Review the result and copy it, share it, or apply it directly in your workflow.</li>
          </ol>
          <p className="text-slate-400 leading-relaxed mt-4">
            For advanced workflows, visit our <Link to="/articles" className="text-blue-400 hover:text-blue-300 transition">developer guides</Link> for best practices on using DevTools Hub AI across projects.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-8">
          <h2 className="text-3xl font-bold mb-4">Common use cases</h2>
          <ul className="list-disc list-inside space-y-3 text-slate-400 leading-relaxed">
            {getUseCases().map((useCase) => (
              <li key={useCase}>{useCase}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-8">
          <h2 className="text-3xl font-bold mb-4">Examples</h2>
          <ul className="space-y-3 text-slate-400 leading-relaxed">
            {getExamples().map((example) => (
              <li key={example} className="rounded-2xl bg-slate-900 p-4 border border-slate-800">{example}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-8">
          <h2 className="text-3xl font-bold mb-4">Helpful resources</h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            These related guides and tools help you make the most of {tool.name} as part of a faster developer workflow.
          </p>
          <div className="space-y-3">
            {relatedToolLinks.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-blue-300 hover:bg-slate-800 transition"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/articles"
              className="block rounded-2xl border border-blue-500 bg-blue-500/10 px-4 py-3 text-blue-200 hover:bg-blue-500/20 transition"
            >
              Browse developer guides
            </Link>
          </div>
        </div>
      </div>

      {tool.faqs?.length ? (
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-8">
          <h2 className="text-3xl font-bold mb-6">Frequently asked questions</h2>
          <div className="space-y-5">
            {tool.faqs.map((faq: { q: string; a: string }) => (
              <div key={faq.q} className="rounded-2xl bg-slate-900 p-6 border border-slate-800">
                <h3 className="text-xl font-semibold text-white">{faq.q}</h3>
                <p className="text-slate-400 mt-3 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export const ToolShell = ({ title, description, path, icon, iconColor, children }: ToolShellProps) => {
  const tool = toolByPath(path);
  const seoTitle = tool?.seoTitle ?? title;
  const seoDescription = tool?.seoDescription ?? description;
  const schema = pageSchema(seoTitle, seoDescription, path, tool);

  return (
    <div className="max-w-6xl mx-auto">
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={`${site.baseUrl}${path}`}
        schema={schema}
        image={tool?.image ?? '/icon-512.png'}
        keywords={tool?.keywords}
      />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: title, to: path }]} />
      <ToolWrapper title={title} description={description} icon={icon} iconColor={iconColor}>
        {children}
      </ToolWrapper>
      {tool && getToolContent(tool)}
      <RelatedTools currentPath={path} />
    </div>
  );
};
