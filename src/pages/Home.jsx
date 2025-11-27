import { useState } from "react";
import RadialChart from "../components/RadialChart";
import useTypewriter from "../hooks/useTypewriter";
const GitHubIcon = () => (
  <svg
    height="32"
    width="32"
    viewBox="0 0 16 16"
    fill="white"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 
      5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49 
      -2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
      -.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 
      2.33.66.07-.52.28-.87.51-1.07-1.78-.2
      -3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
      -.08-.2-.36-1.02.08-2.12 
      0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27 
      c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 
      2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 
      1.27.82 2.15 0 3.07-1.87 3.75-3.65 
      3.95.29.25.54.73.54 1.48 0 1.07-.01 
      1.93-.01 2.2 0 .21.15.46.55.38A8.013 
      8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
  </svg>
);


// Words you don't want in top list (common English words)
const STOPWORDS = new Set([
  "the","a","an","and","or","but","if","is","are","was","were","i","you","he","she",
  "it","we","they","to","of","in","on","for","with","as","at","by","that","this","be",
  "have","has","had","not","do","does","did","so","from","my","your","me","our","their",
  "its","about","up","out","what","who","which","when","where","how","all","can","will"
]);

export default function Home() {
  const [text, setText] = useState("");
  const [results, setResults] = useState(null);


  const title = useTypewriter("Lyric Analyzer 💜", 70);


  const downloadCSV = () => {
  if (!results || !results.topWords) return;

  let csv = "word,count\n";

  results.topWords.forEach((item) => {
    // Use a template literal (backticks) here
    csv += `${item.word},${item.count}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "lyric-analysis.csv";
  a.click();
  URL.revokeObjectURL(url);
};

  
  

  // Clean text: lowercase, remove symbols, keep only letters/numbers/apostrophes
  const sanitize = (input) => {
    return input
      .toLowerCase()
      .replace(/[\u2018\u2019\u201C\u201D]/g, "'")
      .replace(/[^a-z0-9'\s]/g, " ")
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
      const word = w.replace(/^'+|'+$/g, ""); // remove leading/trailing '
      if (!word) return;
      totalLength += word.length;
      freq[word] = (freq[word] || 0) + 1;

      
    });

    const freqArray = Object.entries(freq)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count);

    // Filter stopwords → top 10
    const topWords = freqArray
      .filter(item => !STOPWORDS.has(item.word))
      .slice(0, 10);

    // Set result object
    setResults({
      totalWords,
      uniqueWords: Object.keys(freq).length,
      avgWordLength: (totalLength / totalWords).toFixed(2),
      topWords
    });
    
  };

  const clearAll = () => {
    setText("");
    setResults(null);
  };
  
  

  return (
    
    <div className="min-h-screen p-6">
      <div className="absolute top-4 right-6">
      <a
        href="https://github.com/Hazelnut46/Trap-Stats"
        target="_blank"
        rel="noopener noreferrer"
        className="opacity-80 hover:opacity-100 transition"
      >
        <GitHubIcon />
      </a>
    </div>

    {/* The rest of your code continues here */}
    <div className="max-w-3xl mx-auto text-center mt-12"></div>
      
      <div className="max-w-3xl mx-auto text-center mt-12">
        
        
        <h1 className="text-5xl font-bold text-neonPurple mb-6">
  {title}
</h1>

<div className="flex gap-3 justify-center mt-4">
  <button onClick={analyze} className="px-6 py-3 bg-neonPurple text-black font-bold rounded-xl hover:bg-purple-400 transition">
    Analyze
  </button>

  <button onClick={clearAll} className="px-5 py-3 bg-transparent border border-gray-600 text-white rounded-xl hover:bg-white/5 transition">
    Clear
  </button>

  <button
    onClick={downloadCSV}
    className="px-6 py-3 bg-purple-800 text-white font-bold rounded-xl hover:bg-purple-700 transition"
  >
    Download CSV
  </button>
</div>

        {/* TEXTAREA */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste lyrics here..."
          className="w-full h-60 p-4 bg-black/40 border border-neonPurple rounded-xl text-white focus:outline-none"
        />

        {/* BUTTONS */}


        {/* RESULTS SECTION */} 
        <div className="mt-8 text-left">

          {!results && (
            <p className="text-sm text-gray-300">
              Paste lyrics and press Analyze to see stats.
            </p>
          )}

          {/* Error Box */}
          {results?.error && (
            <div className="mt-4 p-3 bg-red-700/30 border border-red-600 text-red-100 rounded">
              {results.error}
            </div>
          )}

          {/* IF VALID RESULTS */}
          {results && !results.error && (
            <>
              {/* GRID: STATS + TOP WORDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* LEFT BOX: STATS */}
                <div className="p-4 bg-white/5 rounded">
                  <h3 className="font-bold text-sm text-gray-300">Total words</h3>
                  <p className="text-2xl font-semibold">{results.totalWords}</p>

                  <h3 className="font-bold text-sm text-gray-300 mt-3">Unique words</h3>
                  <p className="text-xl">{results.uniqueWords}</p>

                  <h3 className="font-bold text-sm text-gray-300 mt-3">Avg word length</h3>
                  <p className="text-xl">{results.avgWordLength}</p>
                </div>

                {/* RIGHT BOX: TOP WORDS */}
                <div className="p-4 bg-white/5 rounded md:col-span-2">
                  <h3 className="font-bold text-sm text-gray-300">
                    Top words (no stopwords)
                  </h3>

                  <div className="mt-3 space-y-2">
                    {results.topWords.length === 0 && (
                      <p className="text-gray-400">
                        No meaningful top words (try longer lyrics)
                      </p>
                    )}

                    {results.topWords.map((item, idx) => {
                      const max = results.topWords[0]?.count || 1;
                      const width = Math.round((item.count / max) * 100);

                      return (
                        <div key={item.word} className="flex items-center gap-3">
                          <div className="w-28 text-sm text-gray-300">
                            {idx + 1}. {item.word}
                          </div>

                          <div className="flex-1 bg-white/5 rounded h-6 relative">
                            <div
                              className="absolute left-0 top-0 bottom-0 rounded"
                              style={{
                                width: `${width}%`,
                                background: "linear-gradient(90deg,#B026FF,#7B1FFF)"
                              }}
                            />

                            <div className="absolute right-3 top-0 bottom-0 flex items-center text-xs text-white/90">
                              {item.count}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
              

              {/* ⭐ RADIAL CHART BELOW GRID ⭐ */}
              {results.topWords && results.topWords.length > 0 && (
                <RadialChart
                  words={results.topWords.map(item => item.word)}
                  counts={results.topWords.map(item => item.count)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
