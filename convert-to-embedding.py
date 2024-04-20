import tensorflow_hub as hub
import tensorflow as tf
import sys
# hopefully this automatically gets cached & I am assuming these embeddings are compatible with ChatGPT though that doesn't entirely matter 
embed = hub.load("https://tfhub.dev/google/universal-sentence-encoder/4")
# print(sys.argv[1]) # anything that is printed to the console is fed into NodeJS to we don't want to print stuff we don't want
"""
the embedding model will return a tensor (a special data structure that neural networks work with)
a tensor is somewhat like a matrix 
The following line gets just the embeddings from the tensor and ignores the tensor as a whole 
As we do need the tensor, only values within the tensor 
"""
print(embed([sys.argv[1]]).numpy()[0])
sys.stdout.flush()