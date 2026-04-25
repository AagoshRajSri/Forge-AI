export const generateWithHF = async (prompt: string, systemPrompt?: string, model: string = "Qwen/Qwen2.5-Coder-32B-Instruct") => {
    // StarCoder v1 is decommissioned on the serverless Inference API.
    // We use Qwen2.5-Coder-32B-Instruct by default, but allow overriding to 7B for faster revisions.
    const modelName = model;

    // Use the OpenAI-compatible router endpoint which is robust and supports chat models.
    const url = `https://router.huggingface.co/v1/chat/completions`;

    console.log(`Generating code using model: ${modelName}`);

    const messages: any[] = [];
    if (systemPrompt) {
        messages.push({ role: "system", content: systemPrompt });
    }
    messages.push({ role: "user", content: prompt });

    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.HF_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: modelName,
            messages,
            max_tokens: 4000,
            temperature: 0.2,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`HF Router API Error (${response.status}): ${errorText}`);
        throw new Error(`HF Router API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    if (data.error) {
        throw new Error(data.error.message || data.error);
    }

    // The OpenAI-compatible endpoint returns an object with choices
    return data.choices?.[0]?.message?.content || data.generated_text;
};
