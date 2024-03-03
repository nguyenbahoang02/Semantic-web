import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: "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",
});

const helloWorld = (appendString) => {
  console.log("Hello World!" + appendString);
};

async function callChatGPTWithFunctions(appendString) {
  let chat = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    messages: [
      {
        role: "system",
        content: "Perform function requests for the user",
      },
      {
        role: "user",
        content: "Hello, I am Hoang",
      },
    ],
    functions: [
      {
        name: "helloWorld",
        description: "Prints hello world with the string passed to it",
        parameters: {
          type: "object",
          properties: {
            appendString: {
              type: "string",
              description: "The string to append to the hello world message",
            },
          },
          require: ["appendString"],
        },
      },
    ],
    function_call: "auto",
  });

  let wantsToUseFunction = chat.data.choices[0].finish_reason;
  console.log(wantsToUseFunction);
}

callChatGPTWithFunctions("It's about time!");
