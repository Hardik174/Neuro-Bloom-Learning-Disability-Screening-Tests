"use client"

import useScoreStore from '../store/scoreStore';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from "next/navigation";

const ResultsPage: React.FC = () => {
  const scores = useScoreStore((state) => state.scores);
  const resetScores = useScoreStore((state) => state.resetScores);
  const router = useRouter();

  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [pendingDiagnosis, setPendingDiagnosis] = useState(false);

  const totalScore = Object.values(scores).reduce((sum, entry) => {
    return sum + (entry?.score ?? 0);
  }, 0);

  useEffect(() => {
    if (Object.keys(scores).length === 0) {
      router.push('/');
    }
  }, [scores, router]);

  const formatDiagnosis = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Markdown bold
      .replace(/\n/g, '<br />'); // Line breaks
  };

  const handleDiagnosis = async () => {
    setLoading(true);
    setError(null);
    setDiagnosis(null);
    try {
      const age = typeof window !== "undefined" ? localStorage.getItem("user-age") : "";
      const scoresArr = Object.entries(scores).map(([game, data]: any) => ({
        game,
        correct: data?.score ?? 0,
        total: data?.totalQuestions ?? 10,
      }));

      const res = await fetch("https://dyscalculia-screening-game-gemini.onrender.com/askmath", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age, scores: scoresArr }),
      });

      if (!res.ok) throw new Error("Failed to get diagnosis");

      const data = await res.json();
      setDiagnosis(data.reply);
    } catch (err: any) {
      setError("Could not get diagnosis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for button click to show modal first
  const handleDiagnosisClick = () => {
    setShowModal(true);
    setPendingDiagnosis(true);
  };

  // Handler for closing modal and proceeding
  const handleModalClose = () => {
    setShowModal(false);
    if (pendingDiagnosis) {
      setPendingDiagnosis(false);
      handleDiagnosis();
    }
  };

  return (
    <>
      <Head>
        <title>Assessment Results</title>
      </Head>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <h3 className="text-lg font-bold mb-4 text-indigo-700">Please Note</h3>
            <p className="mb-6 text-gray-700">
              Please note that our website backend is hosted on a free tier server (Render). Due to this, the server may go into sleep mode after a period of inactivity. When a new request is made, the server takes some time to restart, which may result in a noticeable delay in receiving your result.<br /><br />
              We appreciate your patience and understanding!
            </p>
            <button
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
              onClick={handleModalClose}
              autoFocus
            >
              OK, Continue
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto p-6 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-indigo-700">🧠 Assessment Results</h1>

        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 space-y-4 border border-indigo-100">
          <h2 className="text-2xl font-semibold text-indigo-800">🎮 Game Scores</h2>
          <ul className="divide-y divide-gray-200">
            {Object.entries(scores).map(([game, data]) => (
              <li key={game} className="py-2 flex justify-between">
                <span className="capitalize font-medium text-gray-800">{game.replace(/-/g, ' ')}:</span>
                <span className="text-gray-700 font-semibold">
                  {data?.score ?? 0}
                  {data?.totalQuestions ? ` / ${data.totalQuestions}` : "/10"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl shadow p-6 mb-6 text-center">
          <h2 className="text-xl font-semibold text-indigo-900 mb-2">⭐ Total Score</h2>
          <p className="text-5xl font-extrabold text-indigo-700">
            {totalScore}/{Object.keys(scores).length * 5}
          </p>
        </div>

        {Object.keys(scores).length >= 2 && (
          <>
            <button
              onClick={handleDiagnosisClick}
              className={`mb-4 px-6 py-3 rounded-xl w-full text-white font-semibold shadow transition-all duration-200 ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
              disabled={loading}
            >
              {loading ? "Analyzing Results..." : "🔍 Get Diagnosis"}
            </button>

            {error && <div className="text-red-600 font-medium text-center">{error}</div>}

            {diagnosis && (
              <div
                className="bg-white border-l-8 border-indigo-500 shadow-lg rounded-xl p-6 mt-4 text-gray-800 space-y-2 leading-relaxed diagnosis-box [&_strong]:font-bold [&_strong]:text-indigo-800"
                dangerouslySetInnerHTML={{ __html: formatDiagnosis(diagnosis) }}
              />
            )}
          </>
        )}

        <button 
          onClick={() => {
            resetScores();
            router.push('/');
          }}
          className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition-all w-full"
        >
          🔁 Start New Assessment
        </button>
      </div>
    </>
  );
};

export default ResultsPage;
