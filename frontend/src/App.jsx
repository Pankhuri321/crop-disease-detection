import { useState } from "react";
import Navbar from "./components/Navbar";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [crop, setCrop] = useState("Tomato");

  const handleUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePredict = async () => {
    if (!image) {
      setResult("⚠️ Please upload an image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        setResult("❌ " + data.error);
      } else {
        setResult(data.label);
        setConfidence(data.confidence);
      }
    } catch (error) {
      setResult("❌ Cannot connect to backend");
    }
  };

  return (
    <div className="app">

      <Navbar />

      {/* DASHBOARD */}
      <div className="dashboard">

        {/* LEFT PANEL */}
        <div className="panel left">

          <h1>🌿 Crop AI Dashboard</h1>
          <p className="subtext">
            Upload leaf image and detect disease instantly
          </p>

          {/* CROP SELECTOR */}
          <div className="radio-group">
            <label>
              <input type="radio" value="Tomato"
                checked={crop === "Tomato"}
                onChange={(e) => setCrop(e.target.value)}
              />
              🍅 Tomato
            </label>

            <label>
              <input type="radio" value="Potato"
                checked={crop === "Potato"}
                onChange={(e) => setCrop(e.target.value)}
              />
              🥔 Potato
            </label>

            <label>
              <input type="radio" value="Pepper"
                checked={crop === "Pepper"}
                onChange={(e) => setCrop(e.target.value)}
              />
              🌶️ Pepper
            </label>
          </div>

          {/* UPLOAD */}
          <input type="file" onChange={handleUpload} />

          <button onClick={handlePredict}>
            🚀 Detect Disease
          </button>

        </div>

        {/* RIGHT PANEL */}
        <div className="panel right">

          {/* IMAGE PREVIEW */}
          {preview && (
            <div className="image-box">
              <img src={preview} alt="preview" />
            </div>
          )}

          {/* RESULT */}
          {result && (
            <div className="result-card">

              <h2>🧠 Prediction</h2>

              <div className="badge">
                {result}
              </div>

              {/* CONFIDENCE BAR */}
              <div className="confidence">
                <p>Confidence: {confidence}%</p>

                <div className="bar">
                  <div
                    className="fill"
                    style={{ width: `${confidence}%` }}
                  ></div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default App;
