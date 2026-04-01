import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CmsContext } from '../context/CmsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, ArrowRight, RefreshCw, Key, Mail } from 'lucide-react';

export default function AdminLogin() {
  const { requestOtp, verifyOtp, isAuthenticated } = useContext(CmsContext);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/admin');
  }, [isAuthenticated, navigate]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await requestOtp(email);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Access Denied. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await verifyOtp(email, otp);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification Failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* AMBIENT GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#27c93f]/[0.05] blur-[150px] -z-10 rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.8)] relative group overflow-hidden">
          {/* TOP DECO */}
          <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
            <Shield className="w-12 h-12 text-[#27c93f]" />
          </div>

          <div className="mb-12">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#27c93f] flex items-center justify-center text-black shadow-[0_0_20px_rgba(39,201,63,0.3)]">
                   <Zap className="w-5 h-5 fill-current" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Architect Console</h2>
             </div>
             <p className="text-[#A1A1A6] text-[10px] font-black uppercase tracking-[0.4em]">Restricted Access Terminal</p>
          </div>

          <form onSubmit={step === 1 ? handleRequestOtp : handleVerifyOtp} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="email-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-2 flex items-center gap-2">
                      <Mail className="w-3 h-3" /> Identity Header (Email)
                    </label>
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@architect-vault.me"
                      className="w-full px-6 py-4 rounded-2xl bg-black border border-white/5 text-white text-xs font-black tracking-widest transition-all focus:border-[#27c93f]/40 outline-none"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] hover:bg-[#27c93f] transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Request Secure Token <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="otp-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-2 flex items-center gap-2">
                      <Key className="w-3 h-3" /> Authorization Code
                    </label>
                    <input 
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="000 000"
                      className="w-full px-6 py-4 rounded-2xl bg-black border border-white/5 text-white text-2xl font-black tracking-[0.8em] transition-all focus:border-[#27c93f]/40 outline-none text-center"
                    />
                    <p className="text-[8px] text-[#27c93f] uppercase font-black tracking-widest text-center mt-4 animate-pulse">Token Dispatched to Secure Email</p>
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-[#27c93f] text-black font-black uppercase tracking-[0.3em] text-[10px] hover:brightness-110 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Authorize Session'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="w-full text-[9px] font-black uppercase text-white/20 hover:text-white/40 tracking-widest transition-all"
                  >
                    Reset Identity Loop
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-500 text-[10px] uppercase font-black tracking-widest text-center mt-4"
              >
                [ERROR]: {error}
              </motion.p>
            )}
          </form>
        </div>
        
        {/* BOTTOM METADATA */}
        <div className="mt-8 text-center space-y-4">
           <p className="text-white/10 text-[9px] font-black uppercase tracking-[0.4em]">Architect Vault Security v1.4.2 [STABLE]</p>
        </div>
      </motion.div>
    </div>
  );
}
