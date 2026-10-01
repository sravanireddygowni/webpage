
const express = require("express");
const path = require("path");

const app = express();

const PORT = 3000;

// Allow JSON data
app.use(express.json());

// Allow files from this folder
app.use(express.static(__dirname));


// Open coverage.html
app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "coverage.html")
    );
});


// Chatbot API
app.post("/chat", async (req, res) => {

    try {

        const userMessage = req.body.message;

        if (!userMessage) {
            return res.json({
                reply: "Please type a question."
            });
        }


        // Send question to Ollama
        const ollamaResponse = await fetch(
            "http://127.0.0.1:11434/api/generate",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    model: "llama3.2",

                    prompt: `
You are CoverHub AI Assistant.

You are an assistant for a mobile covers website.

Available mobile covers:

1. iPhone 15 - ₹499
2. Samsung S24 - ₹399
3. OnePlus 12 - ₹349
4. Redmi Note 13 - ₹299
5. Vivo V30 - ₹329

Answer the customer's questions simply,
clearly and politely.

Customer question:
${userMessage}
`,

                    stream: false

                })
            }
        );


        // Convert Ollama response to JSON
        const data = await ollamaResponse.json();


        // Send answer to webpage
        res.json({
            reply: data.response
        });

    }


    catch (error) {

        console.error(error);

        res.status(500).json({

            reply:
                "❌ Cannot connect to Ollama. Please make sure Ollama is running."

        });

    }

});


// Start server
app.listen(PORT, () => {

    console.log(
        "================================="
    );

    console.log(
        "CoverHub AI Server Started!"
    );

    console.log(
        "Open: http://localhost:3000"
    );

    console.log(
        "================================="
    );

});