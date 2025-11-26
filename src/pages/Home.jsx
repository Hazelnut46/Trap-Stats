import { useState } from "react";

/**
 * Simple stopwords list — common words we don't want to count in "top words".
 * You can expand this later.
 */
const STOPWORDS = new Set([
  "the","a","an","and","or","but","if","is","are","was","were","i","you","he","she",
  "it","we","they","to","of","in","on","for","with","as","at","by","that","this","be",
  "have","has","had","not","do","does","did","so","from","my","your","me","our","their",
  "its","about","up","out","what","who","which","when","where","how","all","can","will"
]);

export default function Home() {
  const [text, setText] = useState("");
  const [results, setResults] = useState(null);

  // Utility: sanitize text -> lower case, remove punctuation (keep apostrophes if you want)
  const sanitize = (input) => {
    // Replace non-word characters except whitespace with space
    // \p{L} covers letters in many languages; fallback to \w for simplicity
    return input
      .toLowerCase()
      .replace(/[\u2018\u2019\u201C\u201D]/g, "'") // normalize fancy quotes
      .replace(/[^a-z0-9'\s]/g, " ") // remove punctuation but keep apostrophes and numbers
      .replace(/\s+/g, " ")
      .trim();
  };

  // Main analyze function
  const analyze = () => {
    if (!text.trim()) {
      setResults({ error: "Paste some lyrics first 🙏" });
      return;
    }

    const clean = sanitize(text);
    const tokens = clean.split(" ").filter(Boolean);

    const totalWords = tokens.length;
    let totalLength = 0;
    const freq = {};

    tokens.forEach((w) => {
      // Optional: strip leading/trailing apostrophes (e.g., "'cause")
      const word = w.replace(/^'+|'+$/g, "");
      if (!word) return;
      totalLength += word.length;
      freq[word] = (freq[word] || 0) + 1;
    });

    // Build array from freq and sort by count
    const freqArray = Object.entries(freq)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));

    // Filter stopwords, then top 10 "meaningful" words
    const topWords = freqArray.filter((item) => !STOPWORDS.has(item.word)).slice(0, 10);

    // Basic sentiment-ish heuristic (very simple): count sad words vs happy words (customize later)
    const sad = ["hate","sad","cry","lonely","pain","die","lost","dark","toxic","tear"];
    const happy = ["love","love","smile","happy","joy","lit","party","bless","shine"];
    const sadCount = tokens.reduce((acc, w) => acc + (sad.includes(w) ? 1 : 0), 0);
    const happyCount = tokens.reduce((acc, w) => acc + (happy.includes(w) ? 1 : 0), 0);
    let vibe = "Neutral";
    if (sadCount > happyCount) vibe = "Sad / Dark";
    else if (happyCount > sadCount) vibe = "Happy / Hype";

    setResults({
      totalWords,
      uniqueWords: Object.keys(freq).length,
      avgWordLength: totalWords ? (totalLength / totalWords).toFixed(2) : 0,
      topWords,
      freqArray,
      vibe,
    });
  };

  // Quick clear
  const clearAll = () => {
    setText("");
    setResults(null);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto text-center mt-12">
        <h1 className="text-5xl font-bold text-neonPurple mb-6">Lyric Analyzer 💜</h1>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste lyrics here... (try some lines from Uzi / Future)"
          className="w-full h-60 p-4 bg-black/40 border border-neonPurple rounded-xl text-white focus:outline-none"
        />

        <div className="flex gap-3 justify-center mt-4">
          <button
            onClick={analyze}
            className="px-6 py-3 bg-neonPurple text-black font-bold rounded-xl hover:bg-purple-400 transition"
          >
            Analyze
          </button>

          <button
            onClick={clearAll}
            className="px-5 py-3 bg-transparent border border-gray-600 text-white rounded-xl hover:bg-white/5 transition"
          >
            Clear
          </button>
        </div>

        {/* RESULTS */}
        <div className="mt-8 text-left">
          {!results && (
            <p className="text-sm text-gray-300">Paste lyrics and press Analyze to see stats.</p>
          )}

          {results?.error && (
            <div className="mt-4 p-3 bg-red-700/30 border border-red-600 text-red-100 rounded">
              {results.error}
            </div>
          )}

          {results && !results.error && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 rounded">
                <h3 className="font-bold text-sm text-gray-300">Total words</h3>
                <p className="text-2xl font-semibold">{results.totalWords}</p>
                <h3 className="font-bold text-sm text-gray-300 mt-3">Unique words</h3>
                <p className="text-xl">{results.uniqueWords}</p>
                <h3 className="font-bold text-sm text-gray-300 mt-3">Avg word length</h3>
                <p className="text-xl">{results.avgWordLength}</p>
              </div>

              <div className="p-4 bg-white/5 rounded md:col-span-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-gray-300">Top words (no stopwords)</h3>
                  <div className="text-sm text-gray-400">Vibe: <span className="font-semibold text-white">{results.vibe}</span></div>
                </div>

                <div className="mt-3 space-y-2">
                  {results.topWords.length === 0 && (
                    <p className="text-gray-400">No meaningful top words (try longer lyrics)</p>
                  )}

                  {results.topWords.map((item, idx) => {
                    // Simple inline bar width calculation for visual
                    const max = results.topWords[0]?.count || 1;
                    const width = Math.round((item.count / max) * 100);
                    return (
                      <div key={item.word} className="flex items-center gap-3">
                        <div className="w-28 text-sm text-gray-300">{idx + 1}. {item.word}</div>
                        <div className="flex-1 bg-white/5 rounded h-6 relative">
                          <div
                            className="absolute left-0 top-0 bottom-0 rounded"
                            style={{ width: `${width}%`, background: "linear-gradient(90deg,#B026FF,#7B1FFF)" }}
                          />
                          <div className="absolute right-3 top-0 bottom-0 flex items-center text-xs text-white/90 justify-end pr-2">
                            {item.count}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* If you want full frequency list uncomment below for debugging */}
                {/* <pre className="mt-4 text-xs text-gray-400">{JSON.stringify(results.freqArray.slice(0,50),null,2)}</pre> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
