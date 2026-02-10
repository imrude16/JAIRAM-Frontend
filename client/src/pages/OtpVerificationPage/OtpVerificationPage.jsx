import { useEffect, useRef, useState } from "react";

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); //stores 6 digits of OTP   in an array
  const [error, setError] = useState(""); //please enter the complete 6-digit OTP
  const [timer, setTimer] = useState(30); //resend OTP timer
  const inputsRef = useRef([]); //move cursors to next box and backspace to previous box

  // Countdown timer for resend
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000); //decrease timer by 1 every second
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; //only allow digits and max length of 1

    const newOtp = [...otp];
    newOtp[index] = value; //update the specific index with the new value
    setOtp(newOtp); //update OTP

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus(); //move to next input if current input is filled and not the last one
    }
  };

  const handleKeyDown = (index, e) => { //handle backspace to move to previous input
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const code = otp.join(""); //join the OTP array into a single string

    if (code.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    alert("OTP verified successfully!");
    window.location.hash = "#/auth/login"; //redirect to login page after successful verification
  };

  const handleResend = () => {
    if (timer > 0) return;
    alert("OTP resent to your email");
    setTimer(30);//reset timer after resending OTP
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-blue-100 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">
            Verify Your Email
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Enter the 6-digit OTP sent to your email
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleVerify}>
            {/* OTP Inputs */}
            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
            >
              Verify OTP
            </button>
          </form>

          {/* Resend */}
          <div className="mt-4 text-sm text-slate-500">
            Didn’t receive the code?{" "}
            <button
              onClick={handleResend}
              disabled={timer > 0}
              className={`font-semibold ${
                timer > 0
                  ? "text-slate-400 cursor-not-allowed"
                  : "text-blue-600 hover:underline"
              }`}
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </button>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default OtpVerificationPage;
