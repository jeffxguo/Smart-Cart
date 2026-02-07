# SmartCart
SmartCart is a lightweight, AI-powered shopping assistant built with Next.js (React). It allows users to input questions and receive product suggestions powered by the Hugging Face Inference API.

## Features
-   **Prompt Input:** Users can type questions into a chat interface.
-   **AI Integration:** Fetches responses from the `HuggingFaceH4/zephyr-7b-beta` model via Hugging Face Inference API.
-   **Dynamic Display:** Responses are parsed and displayed as chat bubbles. The AI identifies relevant products and renders them as interactive cards.
-   **Error Handling & Loading:** Includes typing indicators during loading and visual error alerts if the API fails.

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd smart-cart
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    -   Create a file named `.env.local` in the root directory.
    -   Add your Hugging Face API Key:
        ```bash
        NEXT_PUBLIC_HF_API_KEY=your_huggingface_api_key_here
        ```

## Running the App

1.  Start the development server:
    ```bash
    npm run dev
    ```
2.  Open [http://localhost:3000](http://localhost:3000) in your browser.

