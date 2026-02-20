import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, X, SendHorizonal, GraduationCap, School, Phone, Mail, User } from 'lucide-react';
import { CHAT_FLOW } from '../utils/flows';

const Chatbot = React.forwardRef((props, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState('start');
    const [messages, setMessages] = useState([]);
    const [userData, setUserData] = useState({});
    const [inputValue, setInputValue] = useState('');
    const [progress, setProgress] = useState(0);
    const scrollRef = useRef(null);

    React.useImperativeHandle(ref, () => ({
        openToFlow: (stepKey) => {
            setIsOpen(true);
            if (stepKey) {
                setCurrentStep(stepKey);
                setMessages([]); // Reset for the new flow or keep? 
                // Let's reset to make it feel like a new entry point
                const step = CHAT_FLOW[stepKey];
                if (step) {
                    setMessages([{ type: 'bot', text: step.message, options: step.options || [], inputKey: step.input }]);
                }
            }
        }
    }));

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            addBotMessage(CHAT_FLOW.start.message, CHAT_FLOW.start.options);
        }
    }, [isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const addBotMessage = (text, options = [], inputKey = null) => {
        const formattedText = text.replace(/\{(\w+)\}/g, (_, key) => userData[key] || '');
        setMessages(prev => [...prev, { type: 'bot', text: formattedText, options, inputKey }]);
    };

    const calculateProgress = (stepKey) => {
        const flowSteps = {
            'choice': 10,
            'parent_name': 30,
            'parent_email': 60,
            'parent_phone': 90,
            'parent_final': 100,
            'school_name': 25,
            'school_email': 50,
            'school_phone': 75,
            'school_org': 90,
            'school_final': 100
        };
        return flowSteps[stepKey] || 0;
    };

    const handleOptionClick = (option) => {
        if (option.action === 'book_demo') {
            const redirectUrl = option.url || 'https://www.wizklub.com/';
            window.open(redirectUrl, '_blank');
            return;
        }
        setMessages(prev => [...prev, { type: 'user', text: option.label }]);
        const nextStep = option.next;
        processNextStep(nextStep);
    };

    const processNextStep = (stepKey) => {
        setCurrentStep(stepKey);
        setProgress(calculateProgress(stepKey));
        const step = CHAT_FLOW[stepKey];
        if (step) {
            setTimeout(() => {
                addBotMessage(step.message, step.options || [], step.input);
            }, 600);
        }
    };

    const handleSendInput = () => {
        if (!inputValue.trim()) return;

        const step = CHAT_FLOW[currentStep];
        const updatedData = { ...userData, [step.input]: inputValue };
        setUserData(updatedData);

        setMessages(prev => [...prev, { type: 'user', text: inputValue }]);
        setInputValue('');

        processNextStep(step.next);
    };

    return (
        <div className="chatbot-container">
            {/* Launcher Button */}
            <motion.button
                className="btn-primary launcher"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
            >
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="glass-card chat-window"
                        style={{
                            position: 'fixed',
                            bottom: '100px',
                            right: '24px',
                            width: '380px',
                            height: '550px',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            zIndex: 1000
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            background: 'var(--primary)',
                            padding: '20px',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <div className="icon-circle" style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '50%' }}>
                                <GraduationCap size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}><b>Akarsh</b> Chatbot</h3>
                                <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>Online | Expert Guidance</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="progress-container" style={{ background: 'rgba(0,0,0,0.05)', height: '4px', width: '100%' }}>
                            <motion.div
                                className="progress-bar"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                style={{
                                    height: '100%',
                                    background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                                    boxShadow: '0 0 10px var(--primary-glow)'
                                }}
                            />
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            style={{
                                flex: 1,
                                padding: '20px',
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                background: 'rgba(255,255,255,0.4)'
                            }}
                        >
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: msg.type === 'bot' ? -10 : 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`chat-bubble ${msg.type === 'bot' ? 'bot-bubble' : 'user-bubble'}`}
                                    style={{
                                        alignSelf: msg.type === 'bot' ? 'flex-start' : 'flex-end',
                                        background: msg.type === 'bot' ? 'white' : 'var(--primary)',
                                        color: msg.type === 'bot' ? '#1e293b' : 'white',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                        padding: '12px 16px',
                                        borderRadius: '16px',
                                        maxWidth: '85%',
                                        fontSize: '0.95rem',
                                        lineHeight: '1.5'
                                    }}
                                >
                                    {msg.text}

                                    {msg.type === 'bot' && msg.options && msg.options.length > 0 && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                                            {msg.options.map((opt, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleOptionClick(opt)}
                                                    style={{
                                                        padding: '8px 12px',
                                                        borderRadius: '8px',
                                                        border: '1px solid var(--primary)',
                                                        background: 'transparent',
                                                        color: 'var(--primary)',
                                                        cursor: 'pointer',
                                                        fontSize: '0.9rem',
                                                        textAlign: 'left',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.background = 'var(--primary)';
                                                        e.target.style.color = 'white';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.background = 'transparent';
                                                        e.target.style.color = 'var(--primary)';
                                                    }}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Input Area */}
                        {CHAT_FLOW[currentStep]?.input && (
                            <div style={{
                                padding: '16px',
                                borderTop: '1px solid rgba(0,0,0,0.05)',
                                background: 'white',
                                display: 'flex',
                                gap: '8px'
                            }}>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder={`Type your ${CHAT_FLOW[currentStep].input}...`}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendInput()}
                                    style={{
                                        flex: 1,
                                        padding: '10px 14px',
                                        borderRadius: '10px',
                                        border: '1px solid #e5e7eb',
                                        outline: 'none',
                                        fontSize: '0.95rem',
                                        color: '#1e293b'
                                    }}
                                />
                                <button
                                    onClick={handleSendInput}
                                    disabled={!inputValue.trim()}
                                    style={{
                                        padding: '10px',
                                        borderRadius: '10px',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <SendHorizonal size={20} />
                                </button>
                            </div>
                        )}

                        {/* Branding */}
                        <div style={{
                            padding: '8px',
                            textAlign: 'center',
                            fontSize: '0.7rem',
                            color: 'var(--text-muted)',
                            background: 'rgba(255,255,255,0.6)'
                        }}>
                            Powered by <b>Akarsh</b> WizKlub AI Chat Assistant
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

export default Chatbot;
