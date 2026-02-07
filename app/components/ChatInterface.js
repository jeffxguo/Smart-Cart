'use client';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, clearHistory, selectMessages, selectChatLoading, selectChatError } from '@/lib/features/chatSlice';
import { selectAllProducts } from '@/lib/features/productSlice';
import TypingIndicator from './TypingIndicator';
import ProductCard from './ProductCard';

export default function ChatInterface() {
    const [inputValue, setInputValue] = useState('');
    const dispatch = useDispatch();
    const messages = useSelector(selectMessages);
    const loading = useSelector(selectChatLoading);
    const error = useSelector(selectChatError);
    const allProducts = useSelector(selectAllProducts);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            dispatch(sendMessage(inputValue.trim()));
            setInputValue('');
        }
    };

    return (
        <div className="card shadow-sm border-0 h-100 d-flex flex-column">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center flex-shrink-0">
                <h5 className="mb-0">Smart Assistant</h5>
                {messages.length > 0 && (
                    <button
                        className="btn btn-sm btn-light text-primary"
                        onClick={() => dispatch(clearHistory())}
                        title="Clear History"
                    >
                        Clear
                    </button>
                )}
            </div>

            <div className="card-body overflow-auto bg-light flex-grow-1" style={{ minHeight: 0 }}>
                {messages.length === 0 && (
                    <div className="text-center text-muted mt-5">
                        <p>Hello! Ask me for suggestions.</p>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div key={index} className={`d-flex mb-3 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                        <div
                            className={`p-3 rounded-3 mw-75 ${msg.role === 'user'
                                ? 'bg-primary text-white rounded-bottom-right-0'
                                : 'bg-white border rounded-bottom-left-0'
                                }`}
                        >
                            <p className="mb-0">{msg.content}</p>
                            {msg.role === 'bot' && msg.relatedProductIds && msg.relatedProductIds.length > 0 && (
                                <div className="mt-3">
                                    <small className="text-muted d-block mb-2">Recommended for you:</small>
                                    <div className="d-flex flex-wrap gap-2">
                                        {msg.relatedProductIds.map(id => {
                                            const product = allProducts.find(p => p.id === id);
                                            if (!product) return null;
                                            return (
                                                <div key={id} style={{ width: '200px' }}>
                                                    <ProductCard product={product} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {loading && <TypingIndicator />}

                {error && (
                    <div className="alert alert-danger p-2 small text-center" role="alert">
                        {error}
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="card-footer bg-white flex-shrink-0">
                <form onSubmit={handleSubmit} className="d-flex gap-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Type a message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={loading}
                    />
                    <button type="submit" className="btn btn-primary" disabled={loading || !inputValue.trim()}>
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
