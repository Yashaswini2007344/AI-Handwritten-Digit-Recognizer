from database import create_table, save_history, get_history, clear_history
from flask import Flask, request
from flask_cors import CORS
import os

os.environ["TF_NUM_INTRAOP_THREADS"] = "1"
os.environ["TF_NUM_INTEROP_THREADS"] = "1"
os.environ["OMP_NUM_THREADS"] = "1"

import tensorflow as tf
import numpy as np
import cv2
from PIL import Image

app = Flask(__name__)
create_table()
@app.route("/")
def home():
    return {
        "success": True,
        "message": "AI Handwritten Digit Recognition Backend is running!"
    }


@app.route("/api/test")
def test():
    return {
        "success": True,
        "message": "Backend API is working!"
    }

# =================================================
# CORS
# =================================================

CORS(app)


# =================================================
# LOAD AI MODELS
# =================================================

# -------------------------------------------------
# Digit Model
# -------------------------------------------------

DIGIT_MODEL_PATH = "digit_model.keras"
digit_model = tf.keras.models.load_model(
    DIGIT_MODEL_PATH,
    compile=False
)


print("AI digit model loaded successfully!")


    # =================================================
# DATABASE HISTORY API
# =================================================

@app.route("/api/history", methods=["GET"])
def api_get_history():
    try:
        history = get_history()

        return {
            "success": True,
            "history": [
                {
                    **item,
                    "date": item["created_at"]
                }
                for item in history
            ]
        }

    except Exception as error:
        print("Get history error:", str(error))
        return {
            "success": False,
            "error": "Could not load history."
        }, 500


@app.route("/api/history", methods=["DELETE"])
def api_clear_history():
    try:
        clear_history()

        return {
            "success": True,
            "message": "History cleared successfully."
        }

    except Exception as error:
        print("Clear history error:", str(error))
        return {
            "success": False,
            "error": "Could not clear history."
        }, 500


# =================================================
# HANDWRITING TO SPEECH
# TEXT PROCESSING API
# =================================================

@app.route(
    "/api/process-text",
    methods=["POST"]
)
def process_text():

    try:

        # Get JSON data from frontend
        data = request.get_json()

        if not data:

            return {
                "success": False,
                "error": "No text data received."
            }, 400

        # Get typed text
        text = data.get(
            "text",
            ""
        )

        # Check empty text
        if not isinstance(text, str):

            return {
                "success": False,
                "error": "Invalid text received."
            }, 400

        if not text.strip():

            return {
                "success": False,
                "error": "Please enter some text."
            }, 400

        # Remove extra spaces
        processed_text = " ".join(
            text.split()
        )

        print(
            "Original text:",
            text
        )

        print(
            "Processed text:",
            processed_text
        )

        # Send processed text to frontend
        return {
            "success": True,
            "text": processed_text
        }

    except Exception as error:

        print(
            "Text processing error:",
            str(error)
        )

        return {
            "success": False,
            "error": str(error)
        }, 500


# =================================================
# DIGIT PREPROCESSING
# DRAW + CAMERA + PNG/JPG UPLOAD
# =================================================

def preprocess_digit(img):

    print("Original image size:", img.shape[:2])


    # =================================================
    # CASE 1: DRAW CANVAS IMAGE
    # =================================================

    if img.shape[0] == 28 and img.shape[1] == 28:

        print("28x28 Draw image detected.")

        gray = cv2.cvtColor(
            img,
            cv2.COLOR_BGR2GRAY
        )

        if gray.mean() > 127:

            gray = 255 - gray

        final_image = gray.astype(
            np.uint8
        )

        cv2.imwrite(
            "debug_digit.png",
            final_image
        )

        print(
            "Draw image preprocessing successful."
        )

        print(
            "Debug digit image saved as debug_digit.png"
        )

        return final_image


    # =================================================
    # CASE 2: CAMERA / PNG / JPG LARGE IMAGE
    # =================================================

    gray = cv2.cvtColor(
        img,
        cv2.COLOR_BGR2GRAY
    )

    print(
        "Camera / uploaded image detected."
    )


    # =================================================
    # RESIZE VERY LARGE IMAGE
    # =================================================

    h, w = gray.shape

    max_dimension = 1000

    if max(h, w) > max_dimension:

        scale = max_dimension / max(h, w)

        new_w = int(w * scale)
        new_h = int(h * scale)

        gray = cv2.resize(
            gray,
            (new_w, new_h),
            interpolation=cv2.INTER_AREA
        )

        print(
            "Large image resized to:",
            new_w,
            new_h
        )


    # =================================================
    # CONTRAST IMPROVEMENT
    # =================================================

    gray = cv2.equalizeHist(
        gray
    )


    # =================================================
    # GAUSSIAN BLUR
    # =================================================

    blurred = cv2.GaussianBlur(
        gray,
        (5, 5),
        0
    )


    # =================================================
    # CREATE BOTH THRESHOLD VERSIONS
    # =================================================

    _, binary_normal = cv2.threshold(
        blurred,
        0,
        255,
        cv2.THRESH_BINARY +
        cv2.THRESH_OTSU
    )


    _, binary_inverse = cv2.threshold(
        blurred,
        0,
        255,
        cv2.THRESH_BINARY_INV +
        cv2.THRESH_OTSU
    )


    # =================================================
    # CHECK FOREGROUND RATIO
    # =================================================

    def foreground_ratio(binary):

        return (
            np.count_nonzero(binary)
            /
            binary.size
        )


    ratio_normal = foreground_ratio(
        binary_normal
    )

    ratio_inverse = foreground_ratio(
        binary_inverse
    )

    print(
        "Normal foreground ratio:",
        round(ratio_normal, 4)
    )

    print(
        "Inverse foreground ratio:",
        round(ratio_inverse, 4)
    )


    # =================================================
    # SELECT BETTER THRESHOLD
    # =================================================

    if (
        0.01 <= ratio_normal <= 0.40
        and
        (
            ratio_normal < ratio_inverse
            or
            ratio_inverse > 0.45
        )
    ):

        thresh = binary_normal

        print(
            "Using normal threshold."
        )

    else:

        thresh = binary_inverse

        print(
            "Using inverse threshold."
        )


    # =================================================
    # MORPHOLOGY
    # =================================================

    kernel = np.ones(
        (3, 3),
        dtype=np.uint8
    )


    thresh = cv2.morphologyEx(
        thresh,
        cv2.MORPH_OPEN,
        kernel
    )


    thresh = cv2.morphologyEx(
        thresh,
        cv2.MORPH_CLOSE,
        kernel
    )


    # =================================================
    # FIND CONTOURS
    # =================================================

    contours, _ = cv2.findContours(
        thresh,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE
    )

    image_h, image_w = thresh.shape

    candidates = []


    # =================================================
    # FIND VALID DIGIT CANDIDATES
    # =================================================

    for contour in contours:

        x, y, cw, ch = cv2.boundingRect(
            contour
        )

        area = cv2.contourArea(
            contour
        )

        if area < 15:
            continue

        if cw < 5 or ch < 5:
            continue

        if (
            cw > image_w * 0.95
            and
            ch > image_h * 0.95
        ):
            continue

        if cw > image_w * 0.90:
            continue

        if ch > image_h * 0.90:
            continue

        candidates.append(
            (
                area,
                x,
                y,
                cw,
                ch
            )
        )


    # =================================================
    # FALLBACK IF CONTOUR NOT FOUND
    # =================================================

    if not candidates:

        print(
            "Contour not found. Using fallback detection."
        )

        coords = cv2.findNonZero(
            thresh
        )

        if coords is None:

            raise ValueError(
                "No handwritten digit detected. "
                "Please write a clear digit on a plain background."
            )

        x, y, cw, ch = cv2.boundingRect(
            coords
        )

        if cw < 5 or ch < 5:

            raise ValueError(
                "No handwritten digit detected. "
                "Please write a clear digit on a plain background."
            )

        if (
            cw > image_w * 0.95
            and
            ch > image_h * 0.95
        ):

            raise ValueError(
                "No handwritten digit detected. "
                "Please write a clear digit on a plain background."
            )

        print(
            "Fallback bounding box:",
            x,
            y,
            cw,
            ch
        )

        digit = thresh[
            y:y + ch,
            x:x + cw
        ]

    else:

        # =================================================
        # SELECT LARGEST VALID DIGIT
        # =================================================

        candidates.sort(
            key=lambda item: item[0],
            reverse=True
        )

        area, x, y, cw, ch = candidates[0]

        print(
            "Digit bounding box:",
            x,
            y,
            cw,
            ch
        )

        digit = thresh[
            y:y + ch,
            x:x + cw
        ]


    # =================================================
    # CHECK CROPPED IMAGE
    # =================================================

    if digit.size == 0:

        raise ValueError(
            "Unable to crop the digit."
        )


    # =================================================
    # ADD PADDING
    # =================================================

    padding = 20

    padded_w = (
        digit.shape[1]
        +
        padding * 2
    )

    padded_h = (
        digit.shape[0]
        +
        padding * 2
    )

    size = max(
        padded_w,
        padded_h
    )

    square = np.zeros(
        (size, size),
        dtype=np.uint8
    )


    # =================================================
    # CENTER DIGIT INSIDE SQUARE
    # =================================================

    offset_x = (
        size -
        digit.shape[1]
    ) // 2

    offset_y = (
        size -
        digit.shape[0]
    ) // 2

    square[
        offset_y:
        offset_y + digit.shape[0],

        offset_x:
        offset_x + digit.shape[1]
    ] = digit


    # =================================================
    # RESIZE TO 20x20
    # =================================================

    resized = cv2.resize(
        square,
        (20, 20),
        interpolation=cv2.INTER_AREA
    )


    # =================================================
    # CREATE 28x28 MNIST STYLE CANVAS
    # =================================================

    canvas = np.zeros(
        (28, 28),
        dtype=np.uint8
    )

    canvas[
        4:24,
        4:24
    ] = resized


    # =================================================
    # CENTER DIGIT USING MOMENTS
    # =================================================

    moments = cv2.moments(
        canvas
    )

    if moments["m00"] != 0:

        cx = (
            moments["m10"]
            /
            moments["m00"]
        )

        cy = (
            moments["m01"]
            /
            moments["m00"]
        )

        shift_x = int(
            round(
                13.5 - cx
            )
        )

        shift_y = int(
            round(
                13.5 - cy
            )
        )

        M = np.float32([
            [1, 0, shift_x],
            [0, 1, shift_y]
        ])

        canvas = cv2.warpAffine(
            canvas,
            M,
            (28, 28)
        )


    # =================================================
    # SAVE DEBUG IMAGE
    # =================================================

    cv2.imwrite(
        "debug_digit.png",
        canvas
    )

    print(
        "Digit preprocessing successful."
    )

    print(
        "Debug digit image saved as debug_digit.png"
    )

    return canvas


# =================================================
# DIGIT PREDICTION API
# =================================================

@app.route(
    "/api/predict",
    methods=["POST"]
)
def predict():

    # =================================================
    # CHECK IMAGE
    # =================================================

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


    
    # =================================================
    # CHECK MODE
    # =================================================
    mode = request.form.get("mode", "digit")

    if mode == "multi_digit":
        return predict_multi_digit()

    if mode != "digit":
        return {
            "success": False,
            "error": "Unsupported recognition mode."
        }, 400

    try:

        # =================================================
        # LOAD IMAGE
        # =================================================

        original_image = Image.open(
            image_file
        ).convert("RGB")

        original_array = np.array(
            original_image
        )


        # =================================================
        # RGB → BGR
        # =================================================

        original_array = cv2.cvtColor(
            original_array,
            cv2.COLOR_RGB2BGR
        )


        # =================================================
        # PREPROCESS IMAGE
        # =================================================

        final_image = preprocess_digit(
            original_array
        )

        if final_image is None:

            return {
                "success": False,
                "error": "No digit detected."
            }, 400


        # =================================================
        # NORMALIZATION
        # =================================================

        image_array = final_image.astype(
            "float32"
        )

        image_array = (
            image_array /
            255.0
        )


        # =================================================
        # MODEL INPUT
        # =================================================

        image_array = image_array.reshape(
            1,
            28,
            28,
            1
        )


        # =================================================
        # PREDICTION
        # =================================================

       predictions = digit_model(
           image_array,
           training=False
        ).numpy()[0]


        # =================================================
        # TOP 3 PREDICTIONS
        # =================================================

        top_indices = np.argsort(
            predictions
        )[-3:][::-1]


        print(
            "\n================================"
        )

        print(
            "DIGIT AI ANALYSIS"
        )

        print(
            "================================"
        )


        for rank, index in enumerate(
            top_indices,
            start=1
        ):

            score = float(
                predictions[index] *
                100
            )

            print(
                f"Top {rank}: "
                f"{int(index)} "
                f"({score:.2f}%)"
            )


        print(
            "--------------------------------"
        )


        # =================================================
        # FINAL PREDICTION
        # =================================================

        predicted_digit = int(
            top_indices[0]
        )

        confidence = float(
            predictions[
                predicted_digit
            ] *
            100
        )


        print(
            f"FINAL DIGIT: "
            f"{predicted_digit}"
        )

        print(
            f"CONFIDENCE: "
            f"{confidence:.2f}%"
        )

        print(
            "================================\n"
        )


        # =================================================
# SEND RESPONSE TO FRONTEND
# =================================================


# SAVE RESULT TO DATABASE
        save_history(
            prediction=predicted_digit,
            confidence=round(confidence, 2),
            mode="Draw"
        )

        # SEND RESPONSE TO FRONTEND
        return {
            "success": True,
            "digit": predicted_digit,
            "confidence": round(confidence, 2),
            "mode": "digit"
        }


    except Exception as error:

        print(
            "Digit prediction error:",
            str(error)
        )

        return {
            "success": False,
            "error": str(error)
        }, 500


        
# =================================================
# MULTI-DIGIT NUMBER RECOGNITION API
# Add this BEFORE: if __name__ == "__main__":
# =================================================

def preprocess_one_number_digit(gray, x, y, w, h):
    """Convert a segmented digit into a 28x28 model image."""

    crop = gray[y:y + h, x:x + w]

    _, binary = cv2.threshold(
        crop,
        0,
        255,
        cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU
    )

    height, width = binary.shape
    side = max(height, width) + 12

    square = np.zeros((side, side), dtype=np.uint8)

    offset_x = (side - width) // 2
    offset_y = (side - height) // 2

    square[
        offset_y:offset_y + height,
        offset_x:offset_x + width
    ] = binary

    resized = cv2.resize(
        square,
        (20, 20),
        interpolation=cv2.INTER_AREA
    )

    canvas = np.zeros((28, 28), dtype=np.uint8)
    canvas[4:24, 4:24] = resized

    return canvas


@app.route("/api/predict-multi-digit", methods=["POST"])
def predict_multi_digit():

    if "image" not in request.files:
        return {
            "success": False,
            "error": "No image received."
        }, 400

    image_file = request.files["image"]

    if not image_file.filename:
        return {
            "success": False,
            "error": "No image selected."
        }, 400

    try:
        original = Image.open(image_file).convert("RGB")
        rgb = np.array(original)
        gray = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)

        print("Received image size:", gray.shape)


        # Resize oversized images while preserving proportions.
        height, width = gray.shape
        max_dimension = 1600

        if max(height, width) > max_dimension:
            scale = max_dimension / max(height, width)
            gray = cv2.resize(
                gray,
                (int(width * scale), int(height * scale)),
                interpolation=cv2.INTER_AREA
            )

        # Detect dark handwriting on a light background.
        blurred = cv2.GaussianBlur(gray, (3, 3), 0)

        _, binary = cv2.threshold(
            blurred,
            0,
            255,
            cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU
        )

        contours, _ = cv2.findContours(
            binary,
            cv2.RETR_EXTERNAL,
            cv2.CHAIN_APPROX_SIMPLE
        )

        boxes = []

        for contour in contours:
            x, y, w, h = cv2.boundingRect(contour)
            area = cv2.contourArea(contour)

            if area < 8 or w < 2 or h < 5:
                continue

            # Ignore a component that covers almost the whole image.
            if (
                w > gray.shape[1] * 0.95
                and h > gray.shape[0] * 0.95
            ):
                continue

            boxes.append((x, y, w, h))

        if not boxes:
            return {
                "success": False,
                "error": (
                    "No digits detected. Write dark digits "
                    "on a plain, light background."
                )
            }, 400

        # Read the detected components from left to right.
        boxes.sort(key=lambda box: box[0])
        print("Detected digit boxes:", boxes)

        digit_results = []

        for x, y, w, h in boxes:
            digit_image = preprocess_one_number_digit(
                gray, x, y, w, h
            )

            model_input = (
                digit_image.astype("float32") / 255.0
            ).reshape(1, 28, 28, 1)

            scores = digit_model.predict(
                model_input,
                verbose=0
            )[0]

            digit = int(np.argmax(scores))
            confidence = float(scores[digit] * 100)

            digit_results.append({
                "digit": str(digit),
                "confidence": round(confidence, 2)
            })

        number = "".join(
            item["digit"] for item in digit_results
        )

        average_confidence = sum(
            item["confidence"] for item in digit_results
        ) / len(digit_results)

        save_history(
    prediction=str(number),
    confidence=round(float(average_confidence), 2),
    mode="Multi-Digit"
)

        return {
            "success": True,
            "number": number,
            "prediction": number,
            "confidence": round(average_confidence, 2),
            "digits": digit_results,
            "mode": "multi_digit"
        }

    except Exception as error:
        print("Multi-digit prediction error:", str(error))

        return {
            "success": False,
            "error": str(error)
        }, 500



# =================================================
# AUTOMATIC NUMBER EXTRACTION FROM PAPER PHOTO
# NEW FEATURE - KEEPS EXISTING ROUTES SEPARATE
# =================================================

@app.route("/api/extract-number-image", methods=["POST"])
def extract_number_image():

    if "image" not in request.files:
        return {
            "success": False,
            "error": "Please upload a paper photo."
        }, 400

    image_file = request.files["image"]

    if not image_file.filename:
        return {
            "success": False,
            "error": "Please select an image."
        }, 400

    try:
        # Read the uploaded photo
        original = Image.open(image_file).convert("RGB")
        rgb = np.array(original)
        gray = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)

        # Resize large photos
        height, width = gray.shape
        max_dimension = 1600

        if max(height, width) > max_dimension:
            scale = max_dimension / max(height, width)
            gray = cv2.resize(
                gray,
                (int(width * scale), int(height * scale)),
                interpolation=cv2.INTER_AREA
            )

        # Improve contrast and reduce noise
        gray = cv2.createCLAHE(
            clipLimit=2.0,
            tileGridSize=(8, 8)
        ).apply(gray)

        blurred = cv2.GaussianBlur(gray, (3, 3), 0)

        # Detect dark handwriting on light paper
        _, binary = cv2.threshold(
            blurred,
            0,
            255,
            cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU
        )

        # Find separate handwritten digit components
        contours, _ = cv2.findContours(
            binary,
            cv2.RETR_EXTERNAL,
            cv2.CHAIN_APPROX_SIMPLE
        )

        boxes = []

        image_h, image_w = binary.shape

        for contour in contours:
            x, y, w, h = cv2.boundingRect(contour)
            area = cv2.contourArea(contour)

            # Ignore tiny noise
            if area < 12 or w < 3 or h < 7:
                continue

            # Ignore large page/background regions
            if w > image_w * 0.90 or h > image_h * 0.90:
                continue

            boxes.append((x, y, w, h))

        if not boxes:
            return {
                "success": False,
                "error": (
                    "No number detected. Upload a clear photo "
                    "with dark handwritten digits on light paper."
                )
            }, 400

        # Read digits from left to right
        boxes.sort(key=lambda box: box[0])

        extracted_digits = []
        confidences = []

        for x, y, w, h in boxes:
            # Use the existing digit preprocessing helper
            digit_image = preprocess_one_number_digit(
                gray, x, y, w, h
            )

            model_input = (
                digit_image.astype("float32") / 255.0
            ).reshape(1, 28, 28, 1)

            scores = digit_model.predict(
                model_input,
                verbose=0
            )[0]

            predicted_digit = int(np.argmax(scores))
            confidence = float(scores[predicted_digit] * 100)

            extracted_digits.append(str(predicted_digit))
            confidences.append(confidence)

        # Return the complete number as a single value
        extracted_number = "".join(extracted_digits)
        average_confidence = sum(confidences) / len(confidences)
        # Save Automatic Number Extraction in History
        save_history(
            prediction=str(extracted_number),
            confidence=round(float(average_confidence), 2),
            mode="Automatic Number Extraction"
        )

        return {
            "success": True,
            "number": extracted_number,
            "prediction": extracted_number,
            "confidence": round(average_confidence, 2),
            "mode": "automatic_number_extraction"
        }
       
    except Exception as error:
        print("Automatic number extraction error:", str(error))

        return {
            "success": False,
            "error": str(error)
        }, 500
# =================================================
# START FLASK SERVER
# =================================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )