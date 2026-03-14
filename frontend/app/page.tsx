"use client";

import { useState } from "react";
import VoiceInput from "../src/components/VoiceInput";

export default function Home() {

  const [mode, setMode] = useState<"compare" | "detect">("compare");

  const [voice1, setVoice1] = useState<File | null>(null);
  const [voice2, setVoice2] = useState<File | null>(null);

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runAI = async () => {

    if (!voice1 || !voice2) {
      alert("Upload or record both voices");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("voice1", voice1);
    formData.append("voice2", voice2);

    const endpoint =
      mode === "compare"
        ? "http://127.0.0.1:8000/compare-voices"
        : "http://127.0.0.1:8000/detect-speaker";

    const res = await fetch(endpoint, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  const percent =
    result && result.similarity
      ? (result.similarity * 100).toFixed(2)
      : 0;

  return (

    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex items-center justify-center text-white">

      <div className="w-[800px] bg-white/10 backdrop-blur-lg rounded-2xl p-10 shadow-2xl border border-white/20">

        <h1 className="text-4xl font-bold text-center mb-6">
          🎤 Voice Authentication AI
        </h1>

        {/* Mode Switch */}

        <div className="flex justify-center gap-4 mb-8">

          <button
            onClick={() => {
              setMode("compare");
              setResult(null);
            }}
            className={`px-4 py-2 rounded-lg ${
              mode === "compare"
                ? "bg-indigo-500"
                : "bg-gray-700"
            }`}
          >
            Compare Voices
          </button>

          <button
            onClick={() => {
              setMode("detect");
              setResult(null);
            }}
            className={`px-4 py-2 rounded-lg ${
              mode === "detect"
                ? "bg-purple-500"
                : "bg-gray-700"
            }`}
          >
            Detect Speaker
          </button>

        </div>

        {/* Inputs */}

        <div className="grid grid-cols-2 gap-8 mb-10">

          <VoiceInput
            label={
              mode === "compare"
                ? "Voice 1 (Reference)"
                : "Target Speaker"
            }
            onChange={setVoice1}
          />

          <VoiceInput
            label={
              mode === "compare"
                ? "Voice 2 (Compare)"
                : "Conversation Audio"
            }
            onChange={setVoice2}
          />

        </div>

        {/* Run AI */}

        <button
          onClick={runAI}
          className="w-full bg-indigo-500 hover:bg-indigo-600 py-3 rounded-xl text-lg font-semibold"
        >
          {loading ? "Analyzing..." : "Run AI"}
        </button>

        {/* Compare Result */}

        {mode === "compare" && result && (

          <div className="mt-10">

            <h3 className="text-lg mb-2">Similarity Score</h3>

            <div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden">

              <div
                className={`h-6 flex items-center justify-center text-sm font-semibold ${
                  result.same_person
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${percent}%` }}
              >
                {percent}%
              </div>

            </div>

            <div className="mt-4 text-center text-xl">

              {result.same_person ? (
                <span className="text-green-400">
                  ✅ Same Person
                </span>
              ) : (
                <span className="text-red-400">
                  ❌ Different Person
                </span>
              )}

            </div>

          </div>

        )}

        {/* Detect Speaker Result */}

        {mode === "detect" && result && (

          <div className="mt-10">

            <h3 className="text-xl mb-4">
              Speaker Detection Result
            </h3>

            <div className="text-lg mb-4">

              {result.detected ? (
                <span className="text-green-400">
                  ✅ Speaker Detected
                </span>
              ) : (
                <span className="text-red-400">
                  ❌ Speaker Not Found
                </span>
              )}

            </div>

            {/* Best Match */}

            {result.best_match && (

              <div className="bg-black/30 p-4 rounded-lg mb-4">

                <p>
                  ⏱ Start: {result.best_match.start}s
                </p>

                <p>
                  ⏱ End: {result.best_match.end}s
                </p>

                <p>
                  🎯 Similarity:{" "}
                  {(result.best_match.similarity * 100).toFixed(2)}%
                </p>

              </div>

            )}

            {/* Segments */}

            <div className="max-h-40 overflow-y-auto bg-black/30 p-4 rounded-lg">

              {result.segments?.map((seg: any, i: number) => (

                <div
                  key={i}
                  className="flex justify-between border-b border-gray-700 py-1 text-sm"
                >

                  <span>
                    {seg.start}s → {seg.end}s
                  </span>

                  <span>
                    {(seg.similarity * 100).toFixed(1)}%
                  </span>

                </div>

              ))}

            </div>

          </div>

        )}

      </div>

    </main>
  );
}