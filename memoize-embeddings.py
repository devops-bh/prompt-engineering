import tensorflow_hub as hub
import tensorflow as tf

# Load the Universal Sentence Encoder's TF Hub module
embed = hub.load("https://tfhub.dev/google/universal-sentence-encoder/4")

# Define the phrases
phrases = [
    "does Angelie Neal spend anything on groceries?",
    "does Angelie Neal much on groceries?" 
]

# Convert phrases to embeddings
embeddings = embed(phrases)
# Print the embeddings
"""
for phrase, embedding in zip(phrases, embeddings):
    print(f"Phrase: {phrase}\nEmbedding: {embedding}\n")
"""

import numpy as np
from numpy.linalg import norm

# expect a similarity score above 0.50 (0.50 is somewhat of an arbitrary number)
embedding_a = embeddings[0]
embedding_b = embeddings[1]
# I don't think we need to make each question lower phrase as capitalization doesn't seem to affect the difference 
embedding_cosine_similarity = np.dot(embedding_a, embedding_b) / (norm(embedding_a) * norm(embedding_b))
print(f"The similarity between phrase A ({phrases[0]}) \n& phrase B \n{phrases[1]} is: \n", embedding_cosine_similarity)

