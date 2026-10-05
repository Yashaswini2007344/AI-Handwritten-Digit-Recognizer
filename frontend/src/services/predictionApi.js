const API_URL = "http://127.0.0.1:5000/api/predict";

export async function predictImage(file, mode = "digit") {
  if (!file) {
    throw new Error("Please select or draw an image first.");
  }

  const formData = new FormData();

  formData.append("image", file);
  formData.append("mode", mode);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let message = `Backend error (${response.status})`;

      try {
        const data = await response.json();

        if (data?.message) {
          message = data.message;
        }

        if (data?.error) {
          message = data.error;
        }
      } catch {}

      throw new Error(message);
    }

    const data = await response.json();

    const prediction =
      data?.digit ??
      data?.prediction ??
      data?.label ??
      data?.result;

    if (
      prediction === undefined ||
      prediction === null
    ) {
      throw new Error(
        "Backend response does not contain a valid prediction."
      );
    }

    const confidence = Number(
      data?.confidence ??
      data?.score ??
      0
    );

    return {
      prediction,
      confidence: Number.isFinite(confidence)
        ? confidence
        : 0,
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