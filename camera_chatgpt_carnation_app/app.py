import base64
import os

from flask import Flask, jsonify, render_template, request
from openai import OpenAI

app = Flask(__name__, static_folder="static", template_folder="templates")
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


@app.route("/")
def index():
    return render_template("index.html")


@app.post("/api/respond")
def respond():
    data = request.get_json(force=True)
    user_text = data.get("message", "")

    if not user_text.strip():
        return jsonify({"error": "Messaggio vuoto"}), 400

    completion = client.responses.create(
        model="gpt-4.1-mini",
        input=[
            {
                "role": "system",
                "content": "Rispondi in italiano in modo chiaro e utile.",
            },
            {
                "role": "user",
                "content": user_text,
            },
        ],
    )

    return jsonify({"reply": completion.output_text})


@app.post("/api/transform")
def transform_image():
    data = request.get_json(force=True)
    image_data_url = data.get("image", "")

    if not image_data_url.startswith("data:image"):
        return jsonify({"error": "Immagine non valida"}), 400

    image_b64 = image_data_url.split(",", 1)[1]
    image_bytes = base64.b64decode(image_b64)

    result = client.images.edit(
        model="gpt-image-1",
        image=image_bytes,
        prompt=(
            "Trasforma l'intera scena in un campo di garofani rossi, "
            "mantenendo la composizione originale e un risultato fotorealistico."
        ),
        size="1024x1024",
    )

    transformed_b64 = result.data[0].b64_json
    return jsonify({"image": f"data:image/png;base64,{transformed_b64}"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
