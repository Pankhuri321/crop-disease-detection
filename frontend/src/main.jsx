import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState("home");

  const handleFile = (e) => {
    const selected = e.target.files[0];
    setFile(selected);

    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleDetect = async () => {
    if (!file) {
      alert("Upload image first");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Backend not connected");
    }

    setLoading(false);
  };

  const reset = () => {
    setResult(null);
    setPreview(null);
    setFile(null);
  };

  return (
    <div className="app">

      {/* ===== NAVBAR ===== */}
      <nav className="navbar">
        <h2>🌿 Crop AI</h2>

        <div className="nav-links">
          <button className={page === "home" ? "active" : ""} onClick={() => setPage("home")}>Home</button>
          <button className={page === "detect" ? "active" : ""} onClick={() => setPage("detect")}>Detect</button>
          <button className={page === "about" ? "active" : ""} onClick={() => setPage("about")}>About</button>
        </div>
      </nav>

      {/* ===== HOME ===== */}
      {page === "home" && (
        <div className="home">
          <h1>🌿 Smart Crop Disease Detection</h1>
          <p>Upload leaf images and detect diseases using AI.</p>
          <button className="primary-btn" onClick={() => setPage("detect")}>
            🚀 Start Detection
          </button>
        </div>
      )}

      {/* ===== DETECT ===== */}
      {page === "detect" && (
        <div className={`dashboard ${result ? "result-mode" : ""}`}>

          {/* LEFT PANEL */}
          <div className="upload-card">
            <h2>📤 Upload Leaf Image</h2>

            <input type="file" accept="image/*" onChange={handleFile} />

            {preview && (
              <img src={preview} alt="preview" className="preview-img" />
            )}

            <button onClick={handleDetect} disabled={loading}>
              {loading ? "Analyzing..." : "🚀 Detect Disease"}
            </button>
          </div>

          {/* RIGHT PANEL */}
          <div className="result-card">
            <h2>📊 Prediction Result</h2>

            {!result && <p>No result yet</p>}

            {result && (
              <>
                <div className="badge">{result.label}</div>

                {preview && (
                  <img src={preview} alt="leaf" className="result-image" />
                )}

                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{ width: `${result.confidence}%` }}
                  ></div>
                </div>

                <p className="confidence">
                  Confidence: {result.confidence}%
                </p>

                <button className="reset-btn" onClick={reset}>
                  🔄 Try Another Image
                </button>
              </>
            )}
          </div>

        </div>
      )}

      {/* ===== ABOUT ===== */}
      {page === "about" && (
        <div className="about">
          <h1>📘 About Project</h1>

          <div className="about-card">
            <p>
              This AI system detects crop diseases using deep learning
              models trained on plant leaf images.
            </p>

            <ul>
              <li>✔ React Frontend</li>
              <li>✔ Flask Backend</li>
              <li>✔ CNN Model (.h5)</li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
