from unittest import result

from flask import Blueprint, render_template, request, jsonify
import os
import cv2
import numpy as np
from tensorflow.keras.models import load_model
from werkzeug.utils import secure_filename

from disease_info import DISEASE_INFO
from history_service import save_prediction

bp = Blueprint("cattle", __name__)

# Config - keeping consistent with server.py
MODEL_PATH = os.path.join("cattle", "model", "best_densenet_cattle.keras")
IMG_SIZE = 224

# CHANGE this order EXACTLY as training
DISEASE_TYPES = [
    "Foot and Mouth Disease",
    "Healthy",
    "Lumpy Skin Disease"
]

print(f"Loading Cattle Disease Model from {MODEL_PATH}...")
try:
    model = load_model(MODEL_PATH)
    print("✅ Cattle Model loaded successfully")
except Exception as e:
    print(f"❌ Error loading Cattle Model: {e}")
    model = None

UPLOAD_FOLDER = os.path.join("cattle", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def preprocess_image(filepath):
    # Read image using cv2
    img = cv2.imread(filepath)
    if img is None:
        raise ValueError("Invalid image or image not found")

    # Convert BGR to RGB (standard for most models trained with Keras/TF unless specified otherwise)
    # server.py did cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # Resize
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    
    # Normalize
    img = img / 255.0
    
    # Expand dimensions
    img = np.expand_dims(img, axis=0)
    
    return img

@bp.route("/")
def index():
    return render_template("cattle/index.html")

@bp.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    try:
        img = preprocess_image(filepath)
        preds = model.predict(img)
        class_id = int(np.argmax(preds))
        confidence = float(np.max(preds))

        result = DISEASE_TYPES[class_id]

        info = DISEASE_INFO.get("cattle", {}).get(result, {
            "causes": ["Unknown"],
            "precautions": ["Consult a veterinarian"],
            "medications": ["N/A"],
            "foodItems": ["Balanced diet"]
        })

        # Get user id from frontend
        user_id = request.form.get("user_id")

        # Save prediction to MongoDB
        if user_id:
            save_prediction(
                user_id=user_id,
                animal="cattle",
                disease=result,
                confidence=confidence,
                image_name=filename
            )

        return jsonify({
            "prediction": result,
            "confidence": round(confidence * 100, 2),
            "causes": info["causes"],
            "precautions": info["precautions"],
            "medications": info["medications"],
            "foodItems": info["foodItems"]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500