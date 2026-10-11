
const DIGIT_API_URL =
  "https://ai-handwritten-digit-recognizer.onrender.com/api/predict"

const MULTI_DIGIT_API_URL =
"https://ai-handwritten-digit-recognizer.onrender.com/api/predict-multi-digit";


const AUTOMATIC_NUMBER_EXTRACTION_API_URL =
"https://ai-handwritten-digit-recognizer.onrender.com/api/extract-number-image";


export async function predictImage(file, mode = "digit") {
  if (!file) {
    throw new Error("Please select or draw an image first.");
  }

  const formData = new FormData();
  formData.append("image", file);

  // Select the correct backend API
  const API_URL =
    mode === "automatic_number_extraction"
      ? AUTOMATIC_NUMBER_EXTRACTION_API_URL
      : mode === "multi_digit"
      ? MULTI_DIGIT_API_URL
      : DIGIT_API_URL;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data?.success === false) {
      throw new Error(
        data?.message ||
        data?.error ||
        `Backend error (${response.status})`
      );
    }

    // Read prediction according to recognition mode
    const prediction =
      mode === "automatic_number_extraction"
        ? (
            data?.number ??
            data?.prediction ??
            data?.result
          )
        : mode === "multi_digit"
        ? (
            data?.number ??
            data?.prediction ??
            data?.label ??
            data?.result
          )
        : mode === "character"
        ? (
            data?.character ??
            data?.prediction ??
            data?.label ??
            data?.result
          )
        : (
            data?.digit ??
            data?.prediction ??
            data?.label ??
            data?.result
          );

    if (prediction === undefined || prediction === null) {
      throw new Error(
        "Backend response does not contain a valid prediction."
      );
    }

    const confidence = Number(
      data?.confidence ?? data?.score ?? 0
    );

    return {
      prediction: String(prediction),
      number: String(prediction),
      confidence: Number.isFinite(confidence) ? confidence : 0,
      mode,
      raw: data,
    };

  } catch (error) {
    if (
      error instanceof TypeError ||
      error?.message?.includes("Failed to fetch")
    ) {
      throw new Error(
        "Backend is not connected. Please start the Python Flask server."
      );
    }

    throw error;
  }
}