"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [goal, setGoal] = useState("");
  const [users, setUsers] = useState("");
  const [constraints, setConstraints] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [timeframe, setTimeframe] = useState("");

  const [result, setResult] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [status, setStatus] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // ---------------- API ----------------
  function looksLikeGibberish(text: string) {
  if (text.length < 5) return true;
  if (!/[a-zA-Z]/.test(text)) return true;
  return false;
}
function clearInputs() {
  setGoal("");
  setUsers("");
  setConstraints("");
  setTeamSize("");
  setTimeframe("");
}

  async function generate() {
    setError("");
      if (
    looksLikeGibberish(goal) ||
    looksLikeGibberish(users) ||
    looksLikeGibberish(constraints)
  ) {
    setError("Please enter meaningful text (not random characters).");
    return;
  }

    if (!goal || !users || !constraints || !teamSize || !timeframe) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal, users, constraints, teamSize, timeframe }),
    });

    if (!res.ok) {
      setError("Failed to generate tasks.");
      setLoading(false);
      return;
    }

    const data = await res.json();
    setResult(data.stories);
    clearInputs();     //
    loadHistory();
    setLoading(false);
  }

  async function loadHistory() {
    const res = await fetch("/api/history");
    setHistory(await res.json());
  }

  async function loadStatus() {
    const res = await fetch("/api/status");
    setStatus(await res.json());
  }

  // ---------------- Export ----------------
  function copy() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function download() {
    const blob = new Blob([result], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearForm() {
    setGoal("");
    setUsers("");
    setConstraints("");
    setTeamSize("");
    setTimeframe("");
    setResult("");
    setError("");
  }

  useEffect(() => {
    loadHistory();
    loadStatus();
  }, []);

  // ---------------- UI ----------------
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* STATUS CORNER - Outside the container for proper fixed positioning */}
      {status && (
        <div className="fixed top-6 right-6 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-4 text-xs space-y-2 z-50 transition-all hover:shadow-xl min-w-35">
          <div className="font-semibold text-gray-700 mb-2">System Status</div>
          <StatusIndicator label="Backend" status={status.backend} />
          <StatusIndicator label="Database" status={status.database} />
          <StatusIndicator label="LLM" status={status.llm} />
        </div>
      )}

      <div className="relative max-w-5xl mx-auto p-6 md:p-10 space-y-8">

        {/* HEADER */}
        <header className="text-center space-y-4 pt-8">
          <div className="inline-block">
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-4 shadow-lg">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-linear-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
            Tasks Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your feature ideas into structured user stories and actionable engineering tasks
          </p>
        </header>

        {/* FORM */}
        <section className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
          <div className="space-y-5">
            <InputField
              icon="🎯"
              label="Goal"
              placeholder="What are you building? (e.g., A task management dashboard with real-time updates)"
              value={goal}
              onChange={setGoal}
            />
            <InputField
              icon="👥"
              label="Users"
              placeholder="Who is this for? (e.g., Project managers and team leads)"
              value={users}
              onChange={setUsers}
            />
            <InputField
              icon="⚙️"
              label="Constraints"
              placeholder="Tech stack, timeline, budget, etc. (e.g., React, 2 week sprint, PostgreSQL)"
              value={constraints}
              onChange={setConstraints}
            />
            
            {/* Two-column layout for Team Size and Timeframe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <span className="text-lg">👨‍💻</span>
                  Team Size
                </label>
                <select
                  className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-4 w-full rounded-xl transition-all outline-none bg-gray-50 focus:bg-white"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                >
                  <option value="">Select team size</option>
                  <option value="solo">Solo (1 person)</option>
                  <option value="small">Small (2-4 people)</option>
                  <option value="medium">Medium (5-10 people)</option>
                  <option value="large">Large (10+ people)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <span className="text-lg">⏱️</span>
                  Timeframe
                </label>
                <select
                  className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-4 w-full rounded-xl transition-all outline-none bg-gray-50 focus:bg-white"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                >
                  <option value="">Select timeframe</option>
                  <option value="urgent">Urgent (1-3 days)</option>
                  <option value="1week">1 Week Sprint</option>
                  <option value="2weeks">2 Week Sprint</option>
                  <option value="1month">1 Month</option>
                  <option value="3months">3 Months (Quarter)</option>
                  <option value="6months">6 Months</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-shake">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={generate}
              disabled={loading}
              className="flex-1 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3.5 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner />
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Generate Tasks
                </>
              )}
            </button>
            <button
              onClick={clearForm}
              className="px-6 py-3.5 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-semibold transition-all hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </section>

        {/* RESULT */}
        {result && (
          <section className="space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Generated Plan
              </h2>
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-2 bg-white border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-all text-sm"
                  onClick={copy}
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
                <button
                  className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg text-sm"
                  onClick={download}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download
                </button>
              </div>
            </div>

            <textarea
              className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl p-5 h-125 font-mono text-sm bg-white shadow-inner transition-all resize-none"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder="Your generated tasks will appear here..."
            />
          </section>
        )}

        {/* HISTORY */}
        {history.length > 0 && (
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-xl">📚</span>
              Recent Specifications
            </h2>
            <div className="grid gap-3">
              {history.slice(0, 5).map((h, idx) => (
                <div
                  key={h.id}
                  className="flex items-start gap-3 p-4 bg-linear-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 hover:shadow-md transition-all group"
                >
                  <div className="shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{h.goal}</p>
                    {h.timestamp && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(h.timestamp).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

// ---------------- COMPONENTS ----------------

function StatusIndicator({ label, status }: { label: string; status: string }) {
  const isOk = status === "OK";
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-gray-600">{label}</span>
      <div className="flex items-center gap-1.5">
        <div
          className={`w-2 h-2 rounded-full ${
            isOk ? "bg-green-500 animate-pulse" : "bg-red-500"
          }`}
        />
        <span className={isOk ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
          {status}
        </span>
      </div>
    </div>
  );
}

function InputField({
  icon,
  label,
  placeholder,
  value,
  onChange,
}: {
  icon: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <span className="text-lg">{icon}</span>
        {label}
      </label>
      <input
        className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-4 w-full rounded-xl transition-all outline-none bg-gray-50 focus:bg-white"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}