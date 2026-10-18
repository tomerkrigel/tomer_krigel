import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Layout from "./components/Layout";
import Home from "./pages/home/Home";
import { PrivacyPolicy, TermsOfUse, AccessibilityStatement } from "./pages/LegalPages";

// The home page brings its own header and footer; the inner pages share the Layout shell.
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />
        <Route path="/terms" element={<Layout><TermsOfUse /></Layout>} />
        <Route path="/accessibility" element={<Layout><AccessibilityStatement /></Layout>} />
        <Route path="*" element={<Home />} />
      </Routes>
      {/* Vercel Web Analytics: page views, sources, devices (cookieless). Needs "Enable" once in the Vercel dashboard. */}
      <Analytics />
    </Router>
  );
}
