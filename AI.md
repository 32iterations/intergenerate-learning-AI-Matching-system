What is Gemini 3 Pro?
Gemini 3 Pro is the first model in Google's new Gemini 3 series, designed for complex tasks requiring broad world knowledge and advanced reasoning across multiple modalities (text, images, video, etc.). It comes with the following key capabilities:

Advanced reasoning: Built on state-of-the-art reasoning foundations
Agentic workflows: Designed to handle autonomous tasks and complex workflows
Multimodal processing: Can work with text, images, PDFs, and video
Dynamic thinking: Uses adaptive reasoning depth based on task complexity
Examples
Text generation
puter.ai.chat("Explain neural networks simply", { model: 'gemini-3-pro-preview' });
Complex reasoning
puter.ai.chat("Compare the benefits and drawbacks of solar vs wind energy",
  { model: 'gemini-3-pro-preview' }
);
Code generation
puter.ai.chat("Write a Python function to sort a list", 
  { model: 'gemini-3-pro-preview' }
);
Get Started Now
Just add one script tag to your HTML:

<script src="https://js.puter.com/v2/"></script>
No API keys and no infrastructure setup. Start building with Gemini 3 Pro immediately.


Free, Unlimited Gemini API
Nariman Jelveh
Updated: November 19, 2025
This tutorial will show you how to use Puter.js to access Gemini's powerful language models for free, without any API keys or usage restrictions. Using Puter.js, you can leverage models like Gemini 2.5 Flash, Gemini 2.0 Flash, Gemini 3 Pro, and Gemini 2.5 Pro for various tasks like text generation, image analysis, and complex reasoning, text and code generation, and more.

Puter is the pioneer of the "User-Pays" model, which allows developers to incorporate AI capabilities into their applications while users cover their own usage costs. This model enables developers to access advanced AI capabilities for free, without any API keys or sign-ups.

Getting Started
Puter.js works without any API keys or sign-ups. To start using Puter.js, include the following script tag in your HTML file, either in the <head> or <body> section:

<script src="https://js.puter.com/v2/"></script>
You're now ready to use Puter.js for free access to Gemini capabilities. No API keys or sign-ups are required.

Example 1: Basic Text Generation with Gemini 2.5 Flash
Here's a simple example showing how to generate text using Gemini 2.5 Flash:

<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
        puter.ai.chat("Explain the concept of black holes in simple terms", {
            model: 'gemini-2.5-flash'
        }).then(response => {
            puter.print(response);
        });
    </script>
</body>
</html>
Example 2: Using Gemini 3 Pro
For comparison, here's how to use Gemini 3 Pro:

<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
        puter.ai.chat("What are the major differences between renewable and non-renewable energy sources?", {
            model: 'gemini-3-pro-preview'
        }).then(response => {
            puter.print(response);
        });
    </script>
</body>
</html>
Example 3: Streaming Responses
For longer responses, use streaming to get results in real-time:

<html>
<body>
    <div id="output"></div>
    <script src="https://js.puter.com/v2/"></script>
    <script>
        async function streamResponses() {
            const outputDiv = document.getElementById('output');
            
            // Gemini 2.5 Flash with streaming
            outputDiv.innerHTML += '<h2>Gemini 2.5 Flash Response:</h2>';
            const flashResponse = await puter.ai.chat(
                "Explain the process of photosynthesis in detail", 
                {
                    model: 'gemini-2.5-flash',
                    stream: true
                }
            );
            
            for await (const part of flashResponse) {
                if (part?.text) {
                    outputDiv.innerHTML += part.text.replaceAll('\n', '<br>');
                }
            }            
        }

        streamResponses();
    </script>
</body>
</html>
Example 4: Comparing Models
Here's how to compare responses from both Gemini models:

<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
    (async () => {
        // Gemini 3 Pro
        const pro3_resp = await puter.ai.chat(
            'Tell me something interesting about quantum mechanics.',
            {model: 'gemini-3-pro-preview', stream: true}
        );
        puter.print('<h2>Gemini 3 Pro Response:</h2>');
        for await (const part of pro3_resp) {
            if (part?.text) {
                puter.print(part.text.replaceAll('\n', '<br>'));
            }
        }

        // Gemini 2.5 Pro
        const pro_resp = await puter.ai.chat(
            'Tell me something interesting about quantum mechanics.',
            {model: 'gemini-2.5-pro', stream: true}
        );
        puter.print('<h2>Gemini 2.5 Pro Response:</h2>');
        for await (const part of pro_resp) {
            if (part?.text) {
                puter.print(part.text.replaceAll('\n', '<br>'));
            }
        }

        // Gemini 2.5 Flash
        const flash_resp = await puter.ai.chat(
            'Tell me something interesting about quantum mechanics.',
            {model: 'gemini-2.5-flash', stream: true}
        );
        puter.print('<h2>Gemini 2.5 Flash Response:</h2>');
        for await (const part of flash_resp) {
            if (part?.text) {
                puter.print(part.text.replaceAll('\n', '<br>'));
            }
        }
    })();
    </script>
</body>
</html>
Example 5: Image Analysis
To analyze images, simply provide an image URL to puter.ai.chat():

<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <img src="https://assets.puter.site/doge.jpeg" id="image">
    <script>
        puter.ai.chat(
            "What do you see in this image?",
            "https://assets.puter.site/doge.jpeg",
            { model: 'gemini-2.5-flash' }
        ).then(response => {
            puter.print(response);
        });
    </script>
</body>
</html>
All models
The following Gemini models are available for free use with Puter.js:

gemini-3-pro-preview
gemini-2.5-pro
gemini-2.5-flash-lite
gemini-2.5-flash
gemini-2.0-flash-lite
gemini-2.0-flash
gemini-1.5-flash
That's it! You now have free access to Gemini's powerful language models using Puter.js. This allows you to add sophisticated AI capabilities to your web applications without worrying about API keys or usage limits.


Puter.js
Puter.js brings free, serverless, Cloud and AI directly to your frontend JavaScript with no backend code or API keys required. Just include a single <script> tag in your HTML file and you can instantly use file storage, databases, Claude, GPT, Gemini, and more right from your frontend code.

https://super-magical-website.com
OpenAI
Cloud Storage
Claude
Gemini
NoSQL
<script src="https://js.puter.com/v2/"></script>

Publish Web Pages
Auth
OCR
Networking
Text to Speech
Additionally, with Puter.js, you as the developer pay nothing since each user of your app covers their own Cloud and AI usage. Whether your app has 1 user or 1 million users, it costs you zero to run. Puter.js gives you infinitely scalable infrastructure, completely free.

Puter.js is powered by Puter, the open-source cloud operating system with a heavy focus on privacy. Puter does not use tracking technologies and does not monetize or even collect personal information.

Examples
Chat with GPT-5 nano
<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
        // Chat with GPT-5 nano
        puter.ai.chat(`What is life?`, { model: "gpt-5-nano" }).then(puter.print);
    </script>
</body>
</html>
Image Analysis

<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <img src="https://assets.puter.site/doge.jpeg" style="display:block;">
    <script>
        puter.ai
            .chat(`What do you see?`, `https://assets.puter.site/doge.jpeg`, {
                model: "gpt-5-nano",
            })
            .then(puter.print);
    </script>
</body>
</html>
Generate an image of a cat using AI

<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
        // Generate an image of a cat using the default model and quality. Please note that testMode is set to true so that you can test this code without using up API credits.
        puter.ai.txt2img('A picture of a cat.', true).then((image)=>{
            document.body.appendChild(image);
        });
    </script>
</body>
</html>
Stream the response

<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
    (async () => {
        const resp = await puter.ai.chat('Tell me in detail what Rick and Morty is all about.', {model: 'claude', stream: true });
        for await ( const part of resp ) puter.print(part?.text?.replaceAll('\n', '<br>'));
    })();
    </script>
</body>
</html>
