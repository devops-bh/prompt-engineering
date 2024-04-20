/* 
TODO: WHATS THE DIFFERENCE BETWEEN THE EMBEDDINGS (embed(...)) & TOKENIZER? 
- which 1 has the "meaningfullness"? 
*/
/* maybe try git clone & run 
https://github.com/tensorflow/tfjs-models/tree/master/universal-sentence-encoder
https://github.com/tensorflow/tfjs-models/blob/master/universal-sentence-encoder/demo/index.js
*/
/*const tf = */require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');

// Load the model.
use.load().then(model => {
  // Embed an array of sentences.
  const sentences = [
    'Hello.',
    'How are you?'
  ];
  model.embed(sentences).then(embeddings => {
    // `embeddings` is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
    // So in this example `embeddings` has the shape [2, 512].
    embeddings.print(true /* verbose */);
  });
});

// does the tokenizer produce the embeddings (which is the text as numbers?) ? 
use.loadTokenizer().then(tokenizer => {
  tokenizer.encode('Hello, how are you?'); // [341, 4125, 8, 140, 31, 19, 54]
});

// Load the model.
use.loadQnA().then(model => {
  // Embed a dictionary of a query and responses. The input to the embed method
  // needs to be in following format:
  // {
  //   queries: string[];
  //   responses: Response[];
  // }
  // queries is an array of question strings
  // responses is an array of following structure:
  // {
  //   response: string;
  //   context?: string;
  // }
  // context is optional, it provides the context string of the answer.

  const input = {
    queries: ['How are you feeling today?', 'What is captial of China?'],
    responses: [
      'I\'m not feeling very well.',
      'Beijing is the capital of China.',
      'You have five fingers on your hand.'
    ]
  };
  var scores = [];
  const embeddings = model.embed(input);
  /*
    * The output of the embed method is an object with two keys:
    * {
    *   queryEmbedding: tf.Tensor;
    *   responseEmbedding: tf.Tensor;
    * }
    * queryEmbedding is a tensor containing embeddings for all queries.
    * responseEmbedding is a tensor containing embeddings for all answers.
    * You can call `arraySync()` to retrieve the values of the tensor.
    * In this example, embed_query[0] is the embedding for the query
    * 'How are you feeling today?'
    * And embed_responses[0] is the embedding for the answer
    * 'I\'m not feeling very well.'
    */
  const embed_query = embeddings['queryEmbedding'].arraySync();
  const embed_responses = embeddings['responseEmbedding'].arraySync();
  // compute the dotProduct of each query and response pair.
  for (let i = 0; i < input['queries'].length; i++) {
    for (let j = 0; j < input['responses'].length; j++) {
      scores.push(dotProduct(embed_query[i], embed_responses[j]));
    }
  }
});

// Calculate the dot product of two vector arrays.
const dotProduct = (xs, ys) => {
  const sum = xs => xs ? xs.reduce((a, b) => a + b, 0) : undefined;

  return xs.length === ys.length ?
    sum(zipWith((a, b) => a * b, xs, ys))
    : undefined;
}

// zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
const zipWith =
    (f, xs, ys) => {
      const ny = ys.length;
      return (xs.length <= ny ? xs : xs.slice(0, ny))
          .map((x, i) => f(x, ys[i]));
    }
