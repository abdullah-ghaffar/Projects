import { useState, useEffect } from 'react';

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "typescript", label: "TypeScript" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" }
];

function App() {
  const [selectedLang, setSelectedLang] = useState("");
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto fetch jab language select ho
  const fetchRandomRepo = async (lang) => {
    if (!lang) return;

    setLoading(true);
    setError("");
    setRepo(null);

    try {
      const url = `https://api.github.com/search/repositories?q=language:${lang}&sort=stars&order=desc&per_page=50`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.items || data.items.length === 0) {
        throw new Error("No repositories found for this language");
      }

      // Random repository
      const randomRepo = data.items[Math.floor(Math.random() * data.items.length)];
      setRepo(randomRepo);
    } catch (err) {
      setError("Failed to fetch repositories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Language change hone par auto fetch
  useEffect(() => {
    if (selectedLang) {
      fetchRandomRepo(selectedLang);
    }
  }, [selectedLang]);

  const handleRefresh = () => {
    if (selectedLang) {
      fetchRandomRepo(selectedLang);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>GitHub Repository Finder</h1>
      </div>

      <div className="card">
        {/* Language Selector */}
        <select 
          className="select"
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
        >
          <option value="">Select a Language</option>
          {languages.map(lang => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>

        {/* Empty State */}
        {!selectedLang && !repo && !loading && (
          <div className="empty">
            <p>Please select a language</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading">
            <p>Loading, please wait...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error">
            <p>{error}</p>
            <button className="retry-btn" onClick={handleRefresh}>
              Click to retry
            </button>
          </div>
        )}

        {/* Success State */}
        {repo && !loading && (
          <div className="repo-card">
            <div className="repo-name">
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
            </div>
            <p className="description">
              {repo.description || "No description available"}
            </p>

            <div className="stats">
              <div className="stat">⭐ <strong>{repo.stargazers_count}</strong></div>
              <div className="stat">🍴 <strong>{repo.forks_count}</strong></div>
              <div className="stat">⚠️ <strong>{repo.open_issues_count}</strong></div>
              {repo.language && <div className="stat">• {repo.language}</div>}
            </div>

            <button className="refresh-btn" onClick={handleRefresh}>
              Refresh (Get Another Repo)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;