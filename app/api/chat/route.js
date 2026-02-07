import { NextResponse } from 'next/server';
import { InferenceClient } from "@huggingface/inference";
import { products } from '../../../lib/products';

export async function POST(request) {
    try {
        const { prompt } = await request.json();

        const API_KEY = process.env.NEXT_PUBLIC_HF_API_KEY;

        if (!API_KEY) {
            return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });
        }

        const client = new InferenceClient(API_KEY);

        const systemPrompt = `
You are a helpful and intelligent shopping assistant for SmartCart.
Your goal is to help users find the perfect product from our catalog.

Here is the list of available products in JSON format:
${JSON.stringify(products.map(p => ({ id: p.id, name: p.name, description: p.description, price: p.price })))}

INSTRUCTIONS:
1. Identify products that match the user's request.
   - USE FUZZY MATCHING: "headphones" matches "Wireless Noise-Canceling Headphones". "monitor" matches "4K Ultra HD Monitor" and "Standard Monitor".
   - HANDLE MULTIPLE REQUESTS: If user asks for "A or B", recommend ANY that match. Do NOT require a product to match both categories.
2. Return a SINGLE JSON object. 
3. Do NOT return multiple options. Do NOT return "OR".
4. The JSON must follow this structure exactly:
{
  "message": "Short recommendation message.",
  "product_ids": [1, 4, 6]
}
5. Return ONLY the JSON. No "AI:" prefix. No markdown code blocks.

EXAMPLES:

Request: "Do you have webcams?"
Response:
{
  "message": "Yes, we have a 1080p Webcam (id: 6) perfect for clear video calls.",
  "product_ids": [6]
}
Request: "Do you have any monitors?"
Response:
{
  "message": "Yes, we have a 4K Ultra HD Monitor (id: 5) with crystal-clear visuals and a Standard Monitor (id: 8) for daily use.",
  "product_ids": [5, 8]
}
Request: "Do you have headphones or a watch?"
Response:
{
  "message": "We have both! Check out our Wireless Noise-Canceling Headphones (id: 1) and Smart Fitness Watch (id: 2).",
  "product_ids": [1, 2]
}
Request: "Any recommendations for desktop accessories?"
Response:
{
  "message": "For desktop accessories, we have our Wireless Mouse (id: 7) and our Mechanical Gaming Keyboard (id: 3) with customizable RGB backlighting. I'd also recommend our 1080p Webcam (id: 6) for clear video calls.",
  "product_ids": [7, 3, 6]
}
`;

        const response = await client.chatCompletion({
            model: "HuggingFaceH4/zephyr-7b-beta:featherless-ai",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
            ],
            max_tokens: 300,
            temperature: 0.3,
        });

        let rawContent = "{}";
        if (response.choices && response.choices[0] && response.choices[0].message) {
            rawContent = response.choices[0].message.content;
            console.log("AI Raw Response:", rawContent);
        }

        let parsedResponse = { message: "I'm sorry, I couldn't process that.", product_ids: [] };

        try {
            // Find the FIRST valid balanced JSON object
            const firstIndex = rawContent.indexOf('{');
            if (firstIndex !== -1) {
                let balance = 0;
                let lastIndex = -1;
                for (let i = firstIndex; i < rawContent.length; i++) {
                    if (rawContent[i] === '{') balance++;
                    if (rawContent[i] === '}') {
                        balance--;
                        if (balance === 0) {
                            lastIndex = i;
                            break;
                        }
                    }
                }

                if (lastIndex !== -1) {
                    const potentialJson = rawContent.substring(firstIndex, lastIndex + 1);
                    parsedResponse = JSON.parse(potentialJson);
                } else {
                    throw new Error("Balanced JSON not found");
                }
            } else {
                throw new Error("No JSON start found");
            }
        } catch (e) {
            console.error("Failed to parse AI JSON response:", rawContent);
            parsedResponse = {
                message: "I couldn't quite understand that. Could you try asking in a different way?",
                product_ids: []
            };
        }

        return NextResponse.json(parsedResponse);

    } catch (error) {
        console.error('API Route Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
