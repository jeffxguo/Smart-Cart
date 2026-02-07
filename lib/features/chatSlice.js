import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAIResponse } from '../../services/aiService';

export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async (messageContent, { rejectWithValue }) => {
        try {
            console.log('Dispatching sendMessage thunk:', messageContent);
            const data = await fetchAIResponse(messageContent);

            return {
                userMessage: messageContent,
                botResponse: data.message,
                relatedProductIds: data.product_ids || []
            };
        } catch (error) {
            console.error("Thunk Error:", error);
            return rejectWithValue(error.message || 'Failed to fetch response');
        }
    }
);

const initialState = {
    messages: [], // Array of { role: 'user' | 'bot', content: string, relatedProductIds: [] }
    loading: false,
    error: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        clearHistory: (state) => {
            state.messages = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.pending, (state, action) => {
                state.loading = true;
                state.error = null;
                state.messages.push({
                    role: 'user',
                    content: action.meta.arg,
                    relatedProductIds: []
                });
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.messages.push({
                    role: 'bot',
                    content: action.payload.botResponse,
                    relatedProductIds: action.payload.relatedProductIds
                });
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.messages.push({
                    role: 'bot',
                    content: "Sorry, something went wrong. Please try again.",
                    relatedProductIds: []
                });
            });
    },
});

export const selectMessages = (state) => state.chat.messages;
export const selectChatLoading = (state) => state.chat.loading;
export const selectChatError = (state) => state.chat.error;

export const { clearHistory } = chatSlice.actions;
export default chatSlice.reducer;
