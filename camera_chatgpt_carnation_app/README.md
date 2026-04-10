# Camera + ChatGPT + Garofani Rossi

Piccola app Flask che:
1. usa ChatGPT come risponditore testuale;
2. usa la fotocamera del browser per catturare un'immagine;
3. invia l'immagine a `gpt-image-1` per trasformarla in una scena di garofani rossi.

## Avvio

```bash
cd camera_chatgpt_carnation_app
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export OPENAI_API_KEY="la_tua_chiave"
python app.py
```

Apri `http://localhost:5000`.

## Note

- La trasformazione è generativa: il risultato può variare a ogni esecuzione.
- Serve una chiave OpenAI valida con accesso ai modelli usati.
