from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io

# -----------------------------
# Configuration
# -----------------------------
MODEL_PATH = "goats/model/best_goat_disease_model.h5"
IMG_SIZE = (224, 224)

CLASS_NAMES = [
    "Flea_Allergy",
    "Health",
    "Ringworm",
    "Scabies"
]

# -----------------------------
# Load model
# -----------------------------
model = tf.keras.models.load_model(MODEL_PATH)
print("✅ Model loaded successfully")

# -----------------------------
# Flask app
# -----------------------------
app = Flask(__name__)

# -----------------------------
# Image preprocessing
# -----------------------------
def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize(IMG_SIZE)
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    return image

# -----------------------------
# Routes
# -----------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "Cat Disease Detection API running"
    })

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files["image"]
    image_bytes = file.read()

    processed_image = preprocess_image(image_bytes)

    predictions = model.predict(processed_image)[0]
    predicted_index = int(np.argmax(predictions))
    confidence = float(predictions[predicted_index])

    response = {
        "predicted_disease": CLASS_NAMES[predicted_index],
        "confidence": round(confidence * 100, 2),
        "all_probabilities": {
            CLASS_NAMES[i]: round(float(predictions[i]) * 100, 2)
            for i in range(len(CLASS_NAMES))
        }
    }

    return jsonify(response)

# -----------------------------
# Run server
# -----------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
