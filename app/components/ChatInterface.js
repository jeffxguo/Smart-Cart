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
        <div className="card-modern h-100 d-flex flex-column overflow-hidden">
            <div className="glass-header p-3 d-flex justify-content-between align-items-center flex-shrink-0 z-100">
                <div className="d-flex align-items-center gap-2">
                    <div className="bg-primary text-white p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M13.5 13.5c-.714 0-1.378-.175-1.956-.474l-.946-.504-.51.932c-.443.82-1.397 1.258-2.31 1.058C6.696 14.225 3.5 11.536 3.5 8.5c0-3.313 2.687-6 6-6s6 2.687 6 6c0 1.275-.387 2.457-1.047 3.447L13.5 13.5z" />
                        </svg>
                    </div>
                    <h5 className="mb-0 fw-bold text-dark">Smart Assistant</h5>
                </div>
                {messages.length > 0 && (
                    <button
                        className="btn btn-sm btn-outline-danger border-0 rounded-pill px-3"
                        onClick={() => dispatch(clearHistory())}
                        title="Clear History"
                    >
                        Clear
                    </button>
                )}
            </div>

            <div className="card-body overflow-auto bg-transparent flex-grow-1 p-4" style={{ minHeight: 0 }}>
                {messages.length === 0 && (
                    <div className="text-center text-muted mt-5 d-flex flex-column align-items-center">
                        <div className="mb-3 opacity-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M6 12c0 .667-.333 1-1 1H1c-.667 0-1-.333-1-1V1c0-.667.333-1 1-1h4c.667 0 1 .333 1 1v11z" opacity=".5" />
                                <path d="M11 12c0 .667-.333 1-1 1H7c-.667 0-1-.333-1-1V1c0-.667.333-1 1-1h4c.667 0 1 .333 1 1v11z" />
                            </svg>
                        </div>
                        <p className="fs-5">Hello! Ask me for suggestions</p>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div key={index} className={`d-flex mb-4 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                        <div className={`p-3 mw-75 shadow-sm ${msg.role === 'user' ? 'bubble-user' : 'bubble-bot'}`}>
                            <p className="mb-0" style={{ lineHeight: '1.5' }}>{msg.content}</p>
                            {msg.role === 'bot' && msg.relatedProductIds && msg.relatedProductIds.length > 0 && (
                                <div className="mt-4 pt-3 border-top border-black border-opacity-10">
                                    <small className="text-uppercase fw-bold text-muted d-block mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Recommended Products</small>
                                    <div className="d-flex flex-wrap gap-3">
                                        {msg.relatedProductIds.map(id => {
                                            const product = allProducts.find(p => p.id === id);
                                            if (!product) return null;
                                            return (
                                                <div key={id} style={{ width: '220px' }}>
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

                {loading && (
                    <div className="d-flex justify-content-start mb-4">
                        <div className="p-3 bubble-bot shadow-sm">
                            <TypingIndicator />
                        </div>
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger p-2 small text-center rounded-pill mx-auto w-75 shadow-sm" role="alert">
                        {error}
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="card-footer bg-transparent border-0 p-3 pt-0">
                <form onSubmit={handleSubmit} className="position-relative">
                    <input
                        type="text"
                        className="form-control form-control-lg border-0 shadow-md ps-4 py-3 rounded-pill"
                        placeholder="Type a message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={loading}
                        style={{ paddingRight: '120px', background: 'var(--bg-surface)' }}
                    />
                    <button
                        type="submit"
                        className="btn btn-modern position-absolute top-50 translate-middle-y end-0 me-2"
                        disabled={loading || !inputValue.trim()}
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
