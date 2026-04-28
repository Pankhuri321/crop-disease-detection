from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# =========================
# PATH SETUP
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "Crop_project_model.h5")

# =========================
# LOAD MODEL
# =========================
model = load_model(MODEL_PATH)

# =========================
# CLASS NAMES (STATIC - IMPORTANT)
# =========================
class_names = [
    "Pepper__bell___Bacterial_spot",
    "Pepper__bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy"
]

print("✅ Model Loaded Successfully")

# =========================
# HOME ROUTE
# =========================
@app.route("/")
def home():
    return "✅ Backend is running!"

# =========================
# PREDICT ROUTE
# =========================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"})

        file = request.files["file"]

        if file.filename == "":
            return jsonify({"error": "Empty file name"})

        # Save temp file
        temp_path = os.path.join(BASE_DIR, "temp.jpg")
        file.save(temp_path)

        # Preprocess
        img = image.load_img(temp_path, target_size=(224, 224))
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Predict
        prediction = model.predict(img_array)

        class_index = int(np.argmax(prediction))
        confidence = float(np.max(prediction)) * 100

        return jsonify({
            "label": class_names[class_index],
            "confidence": round(confidence, 2)
        })

    except Exception as e:
        return jsonify({"error": str(e)})

# =========================
# RUN SERVER (PRODUCTION SAFE)
# =========================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
