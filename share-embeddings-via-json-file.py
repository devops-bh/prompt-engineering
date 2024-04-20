import tensorflow_hub as hub
import tensorflow as tf
import json
# remember to pip install uvicorn && unicorn embed-api:app --reload (--reload means saving auto reruns the app)
embed = hub.load("https://tfhub.dev/google/universal-sentence-encoder/4")
import json
with open('data.json', 'w') as f:
    json.dump({
        "embeddings": embed([input]).numpy()[0]
    }, f)