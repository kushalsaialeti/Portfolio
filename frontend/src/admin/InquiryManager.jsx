import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, Book, MessageSquare, Clock, Trash2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function InquiryManager() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/contact`);
            setInquiries(res.data);
            setError('');
        } catch (err) {
            setError('Failed to load inquiries.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const markRead = async (id) => {
        try {
            await axios.patch(`${API_URL}/contact/${id}/read`);
            setInquiries(prev => prev.map(inq => inq._id === id ? { ...inq, isRead: true } : inq));
        } catch (err) {
            alert('Failed to mark as read.');
        }
    };

    const deleteInquiry = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        try {
            await axios.delete(`${API_URL}/contact/${id}`);
            setInquiries(prev => prev.filter(inq => inq._id !== id));
        } catch (err) {
            alert('Failed to delete.');
        }
    };

    if (loading && inquiries.length === 0) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <RefreshCw className="w-8 h-8 text-[#27c93f] animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Querying Contact Database...</p>
        </div>
    );

    return (
        <div className="space-y-10">
            <header className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-8 rounded-[32px] backdrop-blur-2xl">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-4">
                        Communication Hub
                        <span className="bg-[#27c93f]/20 text-[#27c93f] px-4 py-1 rounded-full text-[10px] tracking-[0.2em]">
                            {inquiries.length} SIGNALS
                        </span>
                    </h2>
                    <p className="text-[10px] mt-2 font-black uppercase tracking-[0.4em] text-[#27c93f]/60">Manage direct portfolio inquiries</p>
                </div>
                <button 
                  onClick={fetchInquiries}
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </header>

            {error && (
                <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black uppercase tracking-widest flex items-center gap-3">
                    <AlertCircle className="w-4 h-4" /> {error}
                </div>
            )}

            <div className="grid gap-6">
                <AnimatePresence mode="popLayout">
                    {inquiries.map((inq) => (
                        <motion.div
                            layout
                            key={inq._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, x: -20 }}
                            className={`relative group p-8 rounded-[40px] border transition-all duration-500 ${
                                inq.isRead ? 'bg-white/[0.01] border-white/5 ring-0' : 'bg-white/[0.03] border-[#27c93f]/30 ring-1 ring-[#27c93f]/10 shadow-[0_0_30px_rgba(39,201,63,0.05)]'
                            }`}
                        >
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="flex-grow space-y-6">
                                    <div className="flex flex-wrap gap-4 items-center">
                                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                                            <User className="w-3.5 h-3.5 text-[#27c93f]" />
                                            <span className="text-[11px] font-black uppercase tracking-widest">{inq.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                                            <Mail className="w-3.5 h-3.5 text-[#27c93f]" />
                                            <span className="text-[11px] font-black uppercase tracking-widest text-white/60">{inq.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 ml-auto">
                                            <Clock className="w-3.5 h-3.5 text-white/20" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-white/20">
                                                {new Date(inq.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-4">
                                            <Book className="w-5 h-5 text-[#27c93f]/40" />
                                            {inq.subject}
                                        </h3>
                                        <div className="p-6 rounded-3xl bg-black/40 border border-white/5 text-sm text-white/70 leading-relaxed font-medium">
                                            <MessageSquare className="w-4 h-4 mb-4 text-[#27c93f]/20" />
                                            {inq.message || "No message body provided."}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex md:flex-col gap-3">
                                    {!inq.isRead && (
                                        <button 
                                            onClick={() => markRead(inq._id)}
                                            className="p-5 rounded-3xl bg-[#27c93f] text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(39,201,63,0.3)]"
                                            title="Mark as Read"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => deleteInquiry(inq._id)}
                                        className="p-5 rounded-3xl bg-white/5 border border-white/10 hover:bg-red-500 hover:text-white transition-all group/del"
                                        title="Delete Log"
                                    >
                                        <Trash2 className="w-5 h-5 group-hover/del:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {inquiries.length === 0 && (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-[40px]">
                    <div className="p-6 inline-block rounded-full bg-white/5 mb-6">
                        <MessageSquare className="w-10 h-10 text-white/10" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[1em] text-white/10">Zero Active Signals Detected</p>
                </div>
            )}
        </div>
    );
}
