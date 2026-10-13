'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Terminal, 
  Key, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  Cpu,
  ArrowRight,
  DownloadCloud,
  CheckCircle2
} from 'lucide-react';

export default function StitchBridgePage() {
  const [token, setToken] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copiedCmd, setCopiedCmd] = useState('');

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(''), 2000);
  };

  const handleTestToken = async (e) => {
    e.preventDefault();
    if (!token.trim()) return;

    setTesting(true);
    setTestResult(null);

    try {
      // Connect to Stitch MCP initialize
      const res = await fetch('https://stitch.googleapis.com/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.trim()}`
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'get_screen',
            arguments: {
              name: 'projects/3907361547178343444/screens/202f54c330664e909b5dbe1e6a9722e3'
            }
          }
        })
      });

      const data = await res.json();
      setTestResult({
        success: !data.error && !data.result?.isError,
        data
      });
    } catch (err) {
      setTestResult({
        success: false,
        error: err.message
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-4">
          <Layers className="w-3.5 h-3.5" />
          GOOGLE STITCH MODEL CONTEXT PROTOCOL (MCP)
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How to Connect Stitch MCP
        </h1>
        <p className="mt-2 text-base text-auralis-textMuted max-w-2xl leading-relaxed">
          Google Stitch provides an MCP endpoint at <code className="text-cyan-300 font-mono">https://stitch.googleapis.com/mcp</code>. Below are the 3 ways to connect it to your workspace or coding agent.
        </p>
      </div>

      {/* Target Project Card */}
      <div className="p-6 rounded-3xl bg-auralis-card border border-auralis-border shadow-card space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" /> Target Project & Screen
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-xs text-auralis-textMuted font-mono">Project Name & ID</span>
            <div className="text-white font-semibold text-sm">Auralis Saas Landing Page</div>
            <div className="text-xs font-mono text-cyan-400">3907361547178343444</div>
          </div>
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-xs text-auralis-textMuted font-mono">Screen Name & ID</span>
            <div className="text-white font-semibold text-sm">Auralis | Enterprise AI Voice Infrastructure</div>
            <div className="text-xs font-mono text-indigo-400">202f54c330664e909b5dbe1e6a9722e3</div>
          </div>
        </div>
      </div>

      {/* Method 1: Google Cloud CLI / Token */}
      <div className="p-6 sm:p-8 rounded-3xl bg-auralis-card border border-auralis-border space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Generate Access Token via Google Cloud CLI</h3>
            <p className="text-xs text-auralis-textMuted">Works with all Stitch MCP tools and direct CLI download</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-auralis-textLight/90">
            Run the following commands in your terminal to authenticate and generate a valid access token:
          </p>

          <div className="relative p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-cyan-300">
            <button
              onClick={() => copyToClipboard('gcloud auth login\ngcloud auth print-access-token', 'gcloud')}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-auralis-textMuted hover:text-white"
            >
              {copiedCmd === 'gcloud' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <pre>
{`gcloud auth login
gcloud auth application-default login
gcloud auth print-access-token`}
            </pre>
          </div>

          <p className="text-xs text-auralis-textMuted">
            Once you have the token, you can run our included helper script in this workspace:
          </p>

          <div className="relative p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-indigo-300">
            <button
              onClick={() => copyToClipboard('node fetch-stitch.mjs <YOUR_ACCESS_TOKEN>', 'fetch')}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-auralis-textMuted hover:text-white"
            >
              {copiedCmd === 'fetch' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <pre>node fetch-stitch.mjs &lt;YOUR_ACCESS_TOKEN&gt;</pre>
          </div>
        </div>
      </div>

      {/* Method 2: Configure Stitch MCP Proxy */}
      <div className="p-6 sm:p-8 rounded-3xl bg-auralis-card border border-auralis-border space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Stitch MCP Stdio Proxy</h3>
            <p className="text-xs text-auralis-textMuted">Setup the official @_davideast/stitch-mcp server in your IDE</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-auralis-textLight/90">
            Run the interactive initialization wizard from your terminal:
          </p>

          <div className="relative p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-emerald-300">
            <button
              onClick={() => copyToClipboard('npx @_davideast/stitch-mcp init', 'mcp-init')}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-auralis-textMuted hover:text-white"
            >
              {copiedCmd === 'mcp-init' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <pre>npx @_davideast/stitch-mcp init</pre>
          </div>

          <p className="text-xs text-auralis-textMuted">
            Or add this configuration to your MCP configuration file:
          </p>

          <div className="relative p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-cyan-300">
            <pre>
{`{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["-y", "@_davideast/stitch-mcp", "proxy"]
    }
  }
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Method 3: Direct Web Export (Instant) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-auralis-card border border-auralis-border space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Direct Web UI Export (Fastest - No CLI Needed)</h3>
            <p className="text-xs text-auralis-textMuted">Zero installation required</p>
          </div>
        </div>

        <ol className="list-decimal pl-6 space-y-2 text-sm text-auralis-textLight/90">
          <li>Visit <a href="https://stitch.withgoogle.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline inline-flex items-center gap-1">stitch.withgoogle.com <ExternalLink className="w-3 h-3" /></a> in your browser.</li>
          <li>Open your project: <strong className="text-white">Auralis Saas Landing Page</strong>.</li>
          <li>Select the screen: <strong className="text-white">Auralis | Enterprise AI Voice Infrastructure</strong>.</li>
          <li>Click the <strong className="text-white">Code / Export</strong> button in the upper toolbar to copy HTML or download the zip package.</li>
        </ol>
      </div>

      {/* Live Interactive Token Tester */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-auralis-card to-cyan-950/40 border border-cyan-500/30 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-cyan-400" /> Live Interactive Stitch MCP Tester
        </h3>
        <p className="text-xs text-auralis-textMuted">
          Paste your Google OAuth Access Token here to immediately test communication with <code className="text-cyan-300">https://stitch.googleapis.com/mcp</code> and fetch your screen:
        </p>

        <form onSubmit={handleTestToken} className="space-y-3">
          <input
            type="password"
            placeholder="Paste ya29... Google OAuth token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white font-mono placeholder-auralis-textMuted/50 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={testing || !token.trim()}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-glow-indigo transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {testing ? 'Testing Endpoint...' : 'Test MCP Live Connection'}
          </button>
        </form>

        {testResult && (
          <div className="mt-4 p-4 rounded-xl bg-black/80 border border-white/10 text-xs font-mono overflow-x-auto max-h-60">
            {testResult.success ? (
              <div className="text-emerald-400 mb-2 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Connection Successful! Screen retrieved.
              </div>
            ) : (
              <div className="text-rose-400 mb-2 font-bold">
                Connection Failed
              </div>
            )}
            <pre className="text-auralis-textMuted">
              {JSON.stringify(testResult.data || testResult.error, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
