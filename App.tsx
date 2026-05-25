import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { MainLayout } from './MainLayout';

const Home = lazy(() => import('./Home').then(m => ({ default: m.Home })));
const JSONFormatter = lazy(() => import('./JSONFormatter').then(m => ({ default: m.JSONFormatter })));
const JWTDecoder = lazy(() => import('./JWTDecoder').then(m => ({ default: m.JWTDecoder })));
const Base64Tool = lazy(() => import('./Base64Tool').then(m => ({ default: m.Base64Tool })));
const RegexTester = lazy(() => import('./RegexTester').then(m => ({ default: m.RegexTester })));
const SQLFormatter = lazy(() => import('./SQLFormatter').then(m => ({ default: m.SQLFormatter })));
const CodeExplainer = lazy(() => import('./CodeExplainer').then(m => ({ default: m.CodeExplainer })));
const BugFixer = lazy(() => import('./BugFixer').then(m => ({ default: m.BugFixer })));
const RegexGenerator = lazy(() => import('./RegexGenerator').then(m => ({ default: m.RegexGenerator })));
const CodeConverter = lazy(() => import('./CodeConverter').then(m => ({ default: m.CodeConverter })));
const NotFound = lazy(() => import('./NotFound').then(m => ({ default: m.NotFound })));
const Articles = lazy(() => import('./Articles').then(m => ({ default: m.Articles })));
const DiffViewer = lazy(() => import('./DiffViewer').then(m => ({ default: m.DiffViewer })));
const UnitConverter = lazy(() => import('./UnitConverter').then(m => ({ default: m.UnitConverter })));
const PasswordGenerator = lazy(() => import('./PasswordGenerator').then(m => ({ default: m.PasswordGenerator })));
const URLTool = lazy(() => import('./URLTool').then(m => ({ default: m.URLTool })));
const CronParser = lazy(() => import('./CronParser').then(m => ({ default: m.CronParser })));
const About = lazy(() => import('./About').then(m => ({ default: m.About })));
const Contact = lazy(() => import('./Contact').then(m => ({ default: m.Contact })));
const PrivacyPolicy = lazy(() => import('./PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./TermsOfService').then(m => ({ default: m.TermsOfService })));

function App() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center" role="status" aria-live="polite">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="sr-only">Loading application</span>
      </div>
    }>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="tools/json" element={<JSONFormatter />} />
          <Route path="tools/jwt" element={<JWTDecoder />} />
          <Route path="tools/base64" element={<Base64Tool />} />
          <Route path="tools/regex" element={<RegexTester />} />
          <Route path="tools/sql" element={<SQLFormatter />} />
          <Route path="tools/diff" element={<DiffViewer />} />
          <Route path="tools/unit-converter" element={<UnitConverter />} />
          <Route path="tools/password-gen" element={<PasswordGenerator />} />
          <Route path="tools/url" element={<URLTool />} />
          <Route path="tools/cron" element={<CronParser />} />
          <Route path="ai/explainer" element={<CodeExplainer />} />
          <Route path="ai/bug-fixer" element={<BugFixer />} />
          <Route path="ai/regex-gen" element={<RegexGenerator />} />
          <Route path="ai/converter" element={<CodeConverter />} />
          <Route path="articles" element={<Articles />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
