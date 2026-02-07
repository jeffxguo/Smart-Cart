export const fetchAIResponse = async (prompt) => {
    console.log('fetchAIResponse called with prompt:', prompt);

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API Error: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('fetchAIResponse Error:', error);
        throw error;
    }
};
