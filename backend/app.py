from flask import Flask, request
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image, ImageOps

app = Flask(__name__)

# Allow React frontend to communicate with Flask
CORS(app)


# Load trained digit recognition model
MODEL_PATH = "digit_model.keras"
model = tf.keras.models.load_model(MODEL_PATH)

print("AI digit model loaded successfully!")


@app.route("/")
def home():
    return {
        "success": True,
        "message": "AI Handwritten Digit Recognizer Backend is running!"
    }


@app.route("/api/test")
def test():
    return {
        "success": True,
        "message": "Backend API is working!"
    }


# Actual digit prediction API
@app.route("/api/predict", methods=["POST"])
def predict():

    # Check image
    if "image" not in request.files:
        return {
            "success": False,
            "error": "No image received."
        }, 400

    image_file = request.files["image"]

    if image_file.filename == "":
        return {
            "success": False,
            "error": "No image selected."
        }, 400

    # Get recognition mode
    mode = request.form.get("mode", "digit")

    # Currently AI model supports digits
    if mode != "digit":
        return {
            "success": False,
            "error": "Currently only digit recognition is supported."
        }, 400

    try:
        # Open image
        image = Image.open(image_file).convert("L")

        # Resize image to MNIST size
        image = image.resize((28, 28))

        # Convert to NumPy array
        image_array = np.array(image)

        # Invert image if background is white
        if image_array.mean() > 127:
            image_array = 255 - image_array

        # Normalize pixel values
        image_array = image_array.astype("float32") / 255.0

        # Add model dimensions
        image_array = image_array.reshape(1, 28, 28, 1)

        # Make prediction
        predictions = model.predict(image_array, verbose=0)

        predicted_digit = int(np.argmax(predictions[0]))
        confidence = float(np.max(predictions[0]) * 100)

        return {
            "success": True,
            "digit": predicted_digit,
            "confidence": round(confidence, 2),
            "mode": mode
        }

    except Exception as error:
        return {
            "success": False,
            "error": str(error)
        }, 500


if __name__ == "__main__":
    app.run(
    host="0.0.0.0",
    port=5000,
    debug=True
)