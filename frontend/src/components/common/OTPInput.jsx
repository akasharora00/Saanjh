import React, { useState, useEffect, useRef } from "react";
import { RefreshCw, Clock } from "lucide-react";

const OTPInput = ({ onComplete, onResend, loading = false, error = "" }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(300); // 5 minutes (300s)
  const inputsRef = useRef([]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    const fullOtp = newOtp.join("");
    if (fullOtp.length === 6) {
      onComplete(fullOtp);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      inputsRef.current[5]?.focus();
      onComplete(pastedData);
    }
  };

  const handleResendClick = () => {
    setOtp(["", "", "", "", "", ""]);
    setTimer(300);
    if (onResend) onResend();
    inputsRef.current[0]?.focus();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-2.5 sm:gap-3" onPaste={handlePaste}>
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputsRef.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className={`w-11 h-13 sm:w-13 sm:h-15 text-center text-xl font-extrabold bg-slate-950/60 border rounded-2xl text-white outline-none transition-all duration-200 ${
              error
                ? "border-rose-500/70 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                : "border-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
            }`}
          />
        ))}
      </div>

      {/* Timer & Resend Option */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold px-1">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Clock size={14} className="text-blue-400" />
          <span>OTP Expires in: <strong className="text-blue-400 font-mono">{formatTime(timer)}</strong></span>
        </div>

        <button
          type="button"
          onClick={handleResendClick}
          disabled={timer > 0 || loading}
          className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 disabled:text-slate-600 disabled:cursor-not-allowed transition cursor-pointer"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          <span>Resend OTP</span>
        </button>
      </div>

      {error && <p className="text-xs font-semibold text-rose-400 text-center">{error}</p>}
    </div>
  );
};

export default OTPInput;
