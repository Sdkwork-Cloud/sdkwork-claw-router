import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Terminal, BookOpen, Key, Zap, Code2, Cpu } from 'lucide-react';

const NODE_ENV_REFERENCE = 'process' + '.env';

export function Docs() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('introduction');

  // Simple scroll spy for the right sidebar
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['introduction', 'quickstart', 'authentication', 'models'];
      let current = sections[0];

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= element.offsetTop - 100) {
          current = section;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex w-full min-h-screen pt-[56px] mx-auto bg-white dark:bg-[#0a0a0a]">
      {/* Left Sidebar */}
      <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-white/10 hidden md:block overflow-y-auto sticky top-[56px] h-[calc(100vh-56px)] py-8 px-6 custom-scrollbar">
        <nav className="space-y-8">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">{t('docs.gettingStarted')}</h3>
            <ul className="space-y-1.5">
              <li><button onClick={() => scrollTo('introduction')} className={`text-[14px] w-full text-left px-2 py-1.5 rounded-md transition-colors ${activeSection === 'introduction' ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'}`}>{t('docs.introduction')}</button></li>
              <li><button onClick={() => scrollTo('quickstart')} className={`text-[14px] w-full text-left px-2 py-1.5 rounded-md transition-colors ${activeSection === 'quickstart' ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'}`}>{t('docs.quickstart')}</button></li>
              <li><button onClick={() => scrollTo('authentication')} className={`text-[14px] w-full text-left px-2 py-1.5 rounded-md transition-colors ${activeSection === 'authentication' ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'}`}>{t('docs.authentication')}</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">{t('docs.coreConcepts')}</h3>
            <ul className="space-y-1.5">
              <li><button onClick={() => scrollTo('models')} className={`text-[14px] w-full text-left px-2 py-1.5 rounded-md transition-colors ${activeSection === 'models' ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'}`}>{t('docs.models')}</button></li>
              <li><button className="text-[14px] w-full text-left px-2 py-1.5 rounded-md transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5">{t('docs.routing')}</button></li>
              <li><button className="text-[14px] w-full text-left px-2 py-1.5 rounded-md transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5">{t('docs.billing')}</button></li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex justify-center">
        <div className="w-full px-6 md:px-8 lg:px-12 py-12 pb-32">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <span>Documentation</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 dark:text-white font-medium">Getting Started</span>
          </div>

          <div id="introduction" className="mb-16 scroll-mt-24">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
              {t('docs.title')}
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
              The ClawRouter API provides a unified interface to access the world's most powerful AI models. Build intelligent applications faster with our robust, scalable infrastructure.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              <a href="#quickstart" onClick={(e) => { e.preventDefault(); scrollTo('quickstart'); }} className="group p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-blue-500 dark:hover:border-blue-500 transition-colors bg-white dark:bg-[#0a0a0a] shadow-sm hover:shadow-md">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Quickstart guide</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Learn how to make your first API request in minutes.</p>
              </a>
              <a href="/api-reference" className="group p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-teal-500 dark:hover:border-teal-500 transition-colors bg-white dark:bg-[#0a0a0a] shadow-sm hover:shadow-md">
                <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center mb-4 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">API Reference</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Explore our endpoints, request parameters, and responses.</p>
              </a>
            </div>
          </div>

          <div id="quickstart" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
              <Zap className="w-6 h-6 text-yellow-500" />
              Quickstart
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              To get started with the ClawRouter API, you'll need to install our official SDK. We provide libraries for Node.js, Python, and Go.
            </p>

            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm dark:border-white/10 dark:bg-[#0d1117] mb-8">
              <div className="flex items-center px-4 py-2.5 bg-slate-100 border-b border-slate-200 dark:bg-[#161b22] dark:border-white/5">
                <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400">Bash</span>
              </div>
              <div className="p-4 overflow-x-auto">
                <pre className="text-[13px] font-mono text-slate-700 dark:text-slate-300">
                  <code>npm install @clawrouter/sdk</code>
                </pre>
              </div>
            </div>

            <p className="text-base text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              Once installed, you can initialize the client with your API key and make your first request to generate a chat completion.
            </p>

            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm dark:border-white/10 dark:bg-[#0d1117] mb-8">
              <div className="flex items-center px-4 py-2.5 bg-slate-100 border-b border-slate-200 dark:bg-[#161b22] dark:border-white/5">
                <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400">TypeScript</span>
              </div>
              <div className="p-4 overflow-x-auto">
                <pre className="text-[13px] font-mono text-slate-700 dark:text-slate-300 leading-relaxed">
                  <code>{`import { ClawRouter } from '@clawrouter/sdk';

const client = new ClawRouter({
  apiKey: ${NODE_ENV_REFERENCE}.CLAW_API_KEY,
});

async function main() {
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: 'Say this is a test' }],
  });
  console.log(response.choices[0].message.content);
}

main();`}</code>
                </pre>
              </div>
            </div>
          </div>

          <div id="authentication" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
              <Key className="w-6 h-6 text-indigo-500" />
              Authentication
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              The ClawRouter API uses API keys for authentication. Visit your <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">API Keys page</a> to retrieve the API key you'll use in your requests.
            </p>

            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 mb-6">
              <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-2">Security Note</h4>
              <p className="text-sm text-blue-800 dark:text-blue-400/80 leading-relaxed">
                Remember that your API key is a secret! Do not share it with others or expose it in any client-side code (browsers, apps). Production requests must be routed through your own backend server where your API key can be securely loaded from an environment variable or key management service.
              </p>
            </div>

            <p className="text-base text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              All API requests should include your API key in an <code>Authorization</code> HTTP header as follows:
            </p>

            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm dark:border-white/10 dark:bg-[#0d1117]">
              <div className="p-4 overflow-x-auto">
                <pre className="text-[13px] font-mono text-slate-700 dark:text-slate-300">
                  <code>Authorization: Bearer CLAW_API_KEY</code>
                </pre>
              </div>
            </div>
          </div>

          <div id="models" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
              <Cpu className="w-6 h-6 text-purple-500" />
              Models
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              ClawRouter provides access to a diverse set of models from top providers globally. Each model is optimized for different tasks, balancing capability, speed, and cost.
            </p>

            <div className="overflow-x-auto border border-slate-200 dark:border-white/10 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                    <th className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white">Model Family</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-4 align-top">
                      <div className="font-medium text-slate-900 dark:text-white mb-1">GPT-4o</div>
                      <code className="text-xs text-slate-500">gpt-4o</code>
                    </td>
                    <td className="px-4 py-4 align-top text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Our high-intelligence flagship model for complex, multi-step tasks. Text and image input, text output.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-4 align-top">
                      <div className="font-medium text-slate-900 dark:text-white mb-1">Claude 3.5 Sonnet</div>
                      <code className="text-xs text-slate-500">claude-3-5-sonnet</code>
                    </td>
                    <td className="px-4 py-4 align-top text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Anthropic's most intelligent model, offering top-tier performance on complex tasks with high speed.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-4 align-top">
                      <div className="font-medium text-slate-900 dark:text-white mb-1">Gemini 1.5 Pro</div>
                      <code className="text-xs text-slate-500">gemini-1.5-pro</code>
                    </td>
                    <td className="px-4 py-4 align-top text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Google's highly capable model featuring a massive 2M token context window for deep analysis.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      {/* Right Sidebar (Table of Contents) */}
      <aside className="w-64 shrink-0 hidden xl:block overflow-y-auto sticky top-[56px] h-[calc(100vh-56px)] py-12 px-6">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">On this page</h4>
        <ul className="space-y-2.5 text-[13px]">
          <li>
            <button
              onClick={() => scrollTo('introduction')}
              className={`text-left transition-colors ${activeSection === 'introduction' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              {t('common.actions.introduction')}
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollTo('quickstart')}
              className={`text-left transition-colors ${activeSection === 'quickstart' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              {t('common.actions.quickstart')}
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollTo('authentication')}
              className={`text-left transition-colors ${activeSection === 'authentication' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              {t('common.actions.authorization')}
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollTo('models')}
              className={`text-left transition-colors ${activeSection === 'models' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              {t('common.actions.models')}
            </button>
          </li>
        </ul>
      </aside>
    </div>
  );
}
