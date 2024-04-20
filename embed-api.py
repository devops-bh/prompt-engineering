"""
tried to reframe from writing an endpoint, 
first tried using processes to execute a python script which spat back out the embeddings as its output 
to be consumed by the initial NodeJS process
Made some progress but code was starting to pretty bad and I ran into an elusive behavior I wasn't expecting 

I then tried using the npm package equivalent of the python package I originally used for the embeddings 
https://www.npmjs.com/package/@tensorflow-models/universal-sentence-encoder
But it wasn't as straightforward as the Python script, and ended up having to try peer into the Github source code 
as the documentation is likely dated 
Also it seems like they were using a Python based encoder model, and thus were converting it into a TFJS model 
Which is fairly easy but I'd assume it'd be daunting/confusing if you didn't have prior context as to why 
developers do this 

Technically we could have a shared file, not sure if thats possible or if we'd need to keep re-opening 
and closing the file due to file locking mechanisms (which prevent race conditions) 
Though given that Numpy is a giant array perhaps a CSV could make sense? 

Ultimately you could imagine this script as a microservice or a serverless function, I am just going to 
refer to it as an endpoint 
"""

# https://www.youtube.com/watch?v=iWS9ogMPOI0
import tensorflow_hub as hub
import tensorflow as tf
from fastapi import FastAPI
import json
# remember to pip install uvicorn && unicorn embed-api:app --reload (--reload means saving auto reruns the app)
print("curl http://127.0.0.1:8000/?input=hello%20there")
embed = hub.load("https://tfhub.dev/google/universal-sentence-encoder/4")
app = FastAPI()
# decorator 
@app.get("/")
def root(input: str): # query param example: http://localhost:3000?input=hi%20there 
    # where "%20" is the URL encoding for spaces  
    # dictionary (similar to a JS object literal, or a hash map)
    return {"input": input, "embeddings": str(embed([input]).numpy()[0]).replace("\n", "")} 
