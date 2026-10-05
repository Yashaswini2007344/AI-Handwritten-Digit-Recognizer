from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# Allow React frontend to communicate with Flask backend
CORS(app)


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


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )