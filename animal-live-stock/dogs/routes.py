from flask import Blueprint, render_template, request, jsonify
import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from werkzeug.utils import secure_filename

from disease_info import DISEASE_INFO
from history_service import save_prediction

bp = Blueprint("dogs", __name__)

# Load the trained model once
MODEL_PATH = os.path.join("dogs", "model", "dog_skin_disease_model.h5")
model = load_model(MODEL_PATH)

UPLOAD_FOLDER = os.path.join("dogs", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

CLASS_LABELS = [
    "Dermatitis",
    "Fungal Infections",
    "Healthy",
    "Hypersensitivity",
    "Demodicosis",
    "Ringworm",
]

@bp.route("/", methods=["GET"]) 
def index():
    return render_template("dogs/index.html")

@bp.route("/predict", methods=["POST"]) 
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, secure_filename(file.filename))
    file.save(filepath)

    img = image.load_img(filepath, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0

    predictions = model.predict(img_array)
    class_index = int(np.argmax(predictions))
    confidence = float(np.max(predictions))
    result = CLASS_LABELS[class_index]

    info = DISEASE_INFO.get("dogs", {}).get(result, {
        "causes": ["Unknown"],
        "precautions": ["Consult a veterinarian"],
        "medications": ["N/A"],
        "foodItems": ["Balanced diet"]
    })

    # Get user id
    user_id = request.form.get("user_id")

    # Save prediction history
    if user_id:
        save_prediction(
            user_id=user_id,
            animal="dog",
            disease=result,
            confidence=confidence,
            image_name=file.filename
        )

    return jsonify({
        "prediction": result,
        "confidence": round(confidence * 100, 2),
        "causes": info["causes"],
        "precautions": info["precautions"],
        "medications": info["medications"],
        "foodItems": info["foodItems"]
    })
