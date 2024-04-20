// https://stackoverflow.com/a/23452742
// depending on your configuration, this may need to be python or python3 
// https://www.npmjs.com/package/numjs
const numjs = require("numjs")

function cosineSimilarity(embeddingA, embeddingB) {
    console.log("embedding a: ")
    console.log(embeddingA)
    /* 
    // Calculate dot product
    const dotProduct = embeddingA.reduce((sum, value, index) => sum + value * embeddingB[index], 0);
    
    // Calculate norms
    const normA = Math.sqrt(embeddingA.reduce((sum, value) => sum + value * value, 0));
    const normB = Math.sqrt(embeddingB.reduce((sum, value) => sum + value * value, 0));
    
    // Calculate cosine similarity
    return dotProduct / (normA * normB);
    */
}

// Example usage
const embeddingA = [2, 1, 2, 3, 2, 9];
const embeddingB = [3, 4, 2, 4, 5, 5];
//console.log("Cosine Similarity:", cosineSimilarity(embeddingA, embeddingB));



/* 
function convert_to_embeddings(prompt) {
    // assume that the name has been extracted & removed 
    const path = require('path');
    const { spawn } = require('child_process');
    const pythonScriptPath = path.join(__dirname, 'convert-to-embedding.py');
    const pythonProcess = spawn("python", [pythonScriptPath, "prompt"]);
    return pythonProcess.stdout.on('data', (data) => {
        console.log(data.toString());
        return data.toString()
    });
}
*/

const path = require('path');
const { spawn } = require('child_process');

function convert_to_embeddings(prompt) {
    return new Promise((resolve, reject) => {
        const pythonScriptPath = path.join(__dirname, 'convert-to-embedding.py');
        const pythonProcess = spawn("python", [pythonScriptPath, prompt]);
        //let dataBuffer = "";
        let data = ""

        pythonProcess.stdout.on('data', (_data) => {
            //console.log(_data.toString());
            //dataBuffer += data.toString();
            // remove \r, \n, quotes and insert commas & transform into an array  
            data = _data.toString().replaceAll("\r", "").replaceAll("\n", "").replaceAll("[", "").replaceAll("]","").split(" ")
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(`Python script exited with code ${code}`);
            } else {
                resolve(data);
            }
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
    });
}

// Example usage
convert_to_embeddings("hello I am a test").then(data => {
    //console.log("Data from Python script:", data);
}).catch(error => {
    console.error("Error:", error);
});

//convert_to_embeddings("hello I am a test")

function memoize(fn) {
    const cache = {};
    
    return function (...args) {
        const key = JSON.stringify(args);
        
        if (!cache[key]) {
            cache[key] = fn.apply(this, args);
        }
        
        return cache[key];
    };
}


/* 
{
    original_prompt: string, original_prompt_embedding: array<number>, original_prompt_response: string
}
*/
let existing_prompts_and_responses = [
    {
        original_prompt: "how much money does <name> make?", 
        //original_prompt_embedding: convert_to_embeddings("how much money does <name> make?"), 
        original_prompt_embedding: null,
        original_prompt_response: "this is just a test"
    }, 
    {
        original_prompt: "how much debt does <name> have?", 
        //original_prompt_embedding: convert_to_embeddings("how much debt does <name> have?"), 
        original_prompt_embedding: null,
        original_prompt_response: "this is just ANOTHER test"
    }
]

existing_prompts_and_responses.forEach(existing_prompt_and_response => {
    convert_to_embeddings(existing_prompt_and_response.original_prompt).then(data => {
        //console.log("Data from Python script:", data);
    }).catch(error => {
        console.error("Error:", error);
    });            
})

// Assuming existing_prompts_and_responses is an array of objects with original_prompt property
async function processPrompts() {
    for (const existing_prompt_and_response of existing_prompts_and_responses) {
        try {
            const data = await convert_to_embeddings(existing_prompt_and_response.original_prompt);
            existing_prompt_and_response.original_prompt_embedding = []
            data.forEach(el => {
                if (el == "" || el.length <= 0) {
                    //console.log("empty")
                    // not sure why there may be empty values in the embeddings, 
                    // should these be replaced with 0 or ?
                    // I have no clue why this does not result in zeros where the empty strings are 
                    existing_prompt_and_response.original_prompt_embedding.push(0)
                }else {
                    // maybe consider making this a pure function 
                    existing_prompt_and_response.original_prompt_embedding.push(el)
                }
            })
            //console.log("Data from Python script:", data);
        } catch (error) {
            console.error("Error:", error);
        }
    }
}



(async () => {
    console.log("\nACTUAL INTERACTION\n")
    const processedPrompts = await processPrompts()
    console.log("\nPROCESSED: \n")
    //console.log(JSON.stringify(processedPrompts))
    //console.log(existing_prompts_and_responses)
    const current_prompt_as_embedding_as_string_arrays = await convert_to_embeddings("is this a test?")
    //console.log(current_prompt_as_embedding)
    console.log("cosineSimilarity")
    // [refactor] I think we might as well just use numjs or tensorflow 
    // maybe try something like .replaceAll("", "0").split(" ").forEach(embedding here or elsewhere 
    // actually maybe just try (numjs.array(json.embeddings)
    let current_prompt_as_embedding_empty_strings_handled = current_prompt_as_embedding_as_string_arrays.toString().replaceAll("", 0).replace("\'","").split(",")
    // hope this retains the scientific numbers 
    //cosineSimilarity(numjs.array(current_prompt_as_embedding_empty_strings_handled), [0, 2, 1])
    cosineSimilarity(current_prompt_as_embedding_empty_strings_handled, [0, 2, 1])
    //get_response_if_prompt_is_similar(current_prompt)
})()

// may need to pass in the name, and we could also inject the existing_prompts_and_responses array 
function get_response_if_prompt_is_similar(current_prompt) {
    return existing_prompts_and_responses.forEach(prompt_and_response => {
        // 0.9 is somewhat of an arbitrary threshold 
        if (cosineSimilarity(existing_prompts_and_responses.original_prompt_embedding, current_prompt) > 0.9) {
            // remember to utilize name injection when using this function 
            return existing_prompts_and_responses.original_prompt_response 
        }
        // there's probably better error handling techniques 
        return -1; 
    })
} 


// now that I think about it, the name will need to be provided, which will hopefully prevent the 
// the issue of the chatbot from responding with the wrong person's information - 
const getResponseIfSimilar = get_response_if_prompt_is_similar("how much money does <name> make?")
if (getResponseIfSimilar != -1) {
    //console.log(getResponseIfSimilar)
} else {
    console.log("the prompts were not similar enough")
}

/* 
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
*/