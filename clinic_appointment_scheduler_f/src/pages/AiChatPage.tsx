import { useState, useEffect } from 'react'
import api from '../api/client'

type ChatMessage = {
    id: number
    userMessage: string
    aiResponse: string
    createdAt: string
}

export default function AiChatPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [symptoms, setSymptoms] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadHistory()
    }, [])

    const loadHistory = async () => {
        try {
            const res = await api.get('/ai-chat/history')
            setMessages(res.data)
        } catch (err: any) {
            setError('Failed to load chat history')
        }
    }

    const analyzeSymptoms = async () => {
        if (!symptoms.trim()) return
        setLoading(true)
        setError(null)
        
        try {
            await api.post('/ai-chat/analyze', { symptoms });
            await loadHistory()
            setSymptoms('')
        } catch (err: any) {
            setError(err?.response?.data?.message ?? 'Failed to analyze symptoms')
        } finally {
            setLoading(false)
        }
    }

    const clearChatHistory = async () => {
        if (!confirm('Are you sure you want to clear all chat history?')) return
        
        try {
            await api.delete('/ai-chat/clear')
            setMessages([])
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err: any) {
            setError('Failed to clear chat history')
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            analyzeSymptoms()
        }
    }

    return (
        <div className="page-container">
            <h2 style={{textAlign: 'center', marginBottom: '2rem'}}>🤖 AI Health Assistant</h2>
            
            <div className="card" style={{marginBottom: '2rem', background: '#f0f4ff', border: '1px solid #c6d2fd'}}>
                <h3 style={{color: '#553c9a', margin: '0 0 1rem 0'}}>🤖 Powered by Google Gemini AI</h3>
                <p style={{margin: 0, color: '#666'}}>
                    Describe your symptoms and get instant AI-powered health insights using Google's advanced Gemini AI model. 
                    Get possible causes and professional recommendations. 
                    <strong> This is not a substitute for professional medical advice.</strong>
                </p>
            </div>

            <div style={{maxWidth: '800px', margin: '0 auto'}}>
                {error && <div className="alert alert-error">{error}</div>}
                
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                    <h3 style={{margin: 0}}>Chat History</h3>
                    {messages.length > 0 && (
                        <button
                            className="btn btn-secondary"
                            onClick={clearChatHistory}
                            style={{fontSize: '0.9rem', padding: '0.5rem 1rem'}}
                        >
                            🗑️ Clear All
                        </button>
                    )}
                </div>
                
                <div style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    height: '400px',
                    overflowY: 'auto',
                    padding: '1rem',
                    marginBottom: '1rem',
                    background: '#f9fafb'
                }}>
                    {messages.length === 0 ? (
                        <div style={{textAlign: 'center', color: '#666', padding: '2rem'}}>
                            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🩺</div>
                            <p>Start by describing your symptoms...</p>
                        </div>
                    ) : (
                        messages.map(msg => (
                            <div key={msg.id} style={{marginBottom: '2rem'}}>
                                <div style={{
                                    background: '#e6fffa',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    marginBottom: '0.5rem',
                                    border: '1px solid #81e6d9'
                                }}>
                                    <div style={{fontWeight: '600', color: '#2c7a7b', marginBottom: '0.5rem'}}>
                                        👤 You:
                                    </div>
                                    <div>{msg.userMessage}</div>
                                </div>
                                <div style={{
                                    background: '#f0f4ff',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #c6d2fd'
                                }}>
                                    <div style={{fontWeight: '600', color: '#553c9a', marginBottom: '0.5rem'}}>
                                        🤖 Gemini AI:
                                    </div>
                                    <div 
                                        style={{whiteSpace: 'pre-line', lineHeight: '1.6'}} 
                                        dangerouslySetInnerHTML={{
                                            __html: msg.aiResponse
                                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                                .replace(/•/g, '•')
                                                .replace(/\n/g, '<br/>')
                                        }}
                                    />
                                </div>
                                <div style={{fontSize: '0.75rem', color: '#666', textAlign: 'right', marginTop: '0.25rem'}}>
                                    {new Date(msg.createdAt).toLocaleString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    <textarea
                        className="form-textarea"
                        placeholder="Describe your symptoms in detail... (Press Enter to send, Shift+Enter for new line)"
                        value={symptoms}
                        onChange={e => setSymptoms(e.target.value)}
                        onKeyDown={handleKeyPress}
                        rows={3}
                        style={{resize: 'vertical'}}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={analyzeSymptoms}
                        disabled={!symptoms.trim() || loading}
                        style={{alignSelf: 'flex-end'}}
                    >
                        {loading ? <><span className="loading"></span> Analyzing...</> : '🔍 Analyze Symptoms'}
                    </button>
                </div>

                <div className="card" style={{marginTop: '2rem', background: '#fed7d7', border: '1px solid #feb2b2'}}>
                    <h4 style={{color: '#742a2a', margin: '0 0 0.5rem 0'}}>⚠️ Important Disclaimer</h4>
                    <p style={{color: '#742a2a', margin: 0, fontSize: '0.9rem'}}>
                        This AI assistant provides general health information only and is not a substitute for professional medical advice, 
                        diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.
                    </p>
                </div>
            </div>
        </div>
    )
}