/* 
Alright... I am beginning to wonder if what I am trying to do cannot be done using pure JS
Idk... maybe TensorflowJS could provide some hints
But the meantime, I'll just do the embeddings and heavy calculations in Python 
Where maybe a sort of pub sub system could be used, in that NodeJS publishes a topic of new message 
Python consumes the queued message & stores it for lookup later, publishing a "response stored" or something topic 
Then, NodeJS can refer to the lookup table containing the cosine similarites etc (but not the intimidating scientific numbers ~ mantissas?)
*/

const numjs = require('numjs');
(async () => {
    
// Function to calculate the dot product of two arrays
function dotProduct(a, b) {
    let sum = 0;
    for (let i = 0; i < a.shape[0]; i++) {
        sum += a.get(i) * b.get(i);
    }
    return sum;
}

// Function to calculate the magnitude (norm) of an array
function magnitude(a) {
    let sum = 0;
    for (let i = 0; i < a.shape[0]; i++) {
        sum += a.get(i) * a.get(i);
    }
    return Math.sqrt(sum);
}

// Function to calculate cosine similarity
function cosineSimilarity(a, b) {
    return dotProduct(a, b) / (magnitude(a) * magnitude(b));
}

const response = await fetch("http://127.0.0.1:8000/?input=hello");
  const json = await response.json();
  const embeddings_as_numbers = []
  /* 
  json.embeddings.replaceAll("", "0").split(" ").forEach(embedding => {
    embeddings_as_numbers.push(Number(embedding))
  });
  */
   //json.embeddings.replaceAll("", "0").split(" ")
   console.log(numjs.array(json.embeddings).get(0))
  console.log(cosineSimilarity(numjs.array(json.embeddings), numjs.array(json.embeddings)))
  //console.log(embeddings_as_numbers)
})()
