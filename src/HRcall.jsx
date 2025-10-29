import { useState } from "react";
import axios from "axios";

const BACKEND_URL = "https://ivr-calling-1nyf.onrender.com/make_call";

export default function HRcall() {
  const [from, setFrom] = useState("917943446565");   // default FROM
  const [to, setTo] = useState("");                  // user fills TO
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const payload = {
        from,
        to,
        // file_name stays the default (FILE_KEY_1) unless you want a dropdown
      };

      const { data } = await axios.post(BACKEND_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });

      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 space-y-6">
      <h1 className="text-3xl font-bold text-center text-indigo-700">
        HR IVR Call
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* FROM (read-only, can be hidden) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            From Number
          </label>
          <input
            type="text"
            value={from}
            readOnly
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
          />
        </div>

        {/* TO */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            To Number <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="tel"
            placeholder="919876543210"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-md text-white font-semibold transition ${
            loading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Calling…" : "Make Call"}
        </button>
      </form>

      {/* RESULT */}
      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <pre className="text-xs text-green-800 overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}