import { useEffect, useState, useRef } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBIcon, MDBInput } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import './Mdcss.css';
import { _post } from '../../Socialmedia/axios/Axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { updateLoginstatus, updatetoken } from '../../Redux/UserSlice';
import { ArrowLeft } from 'react-bootstrap-icons';

function Mdblogin() {
  const [value, setValue] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [codeSent, setCodeSent] = useState(false);
  const [verifyMode, setVerifyMode] = useState(false);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const URL = import.meta.env.VITE_BACKEND_URL;

  // ---------------- LOGIN ----------------
  function handleChange(e) {
    const { name, value } = e.target;
    setValue((prev) => ({ ...prev, [name]: value }));
  }

  async function handleClick() {
    setLoading(true);
    try {
      const data = await _post("/login", value);

      if (data.data) {
        localStorage.setItem('userId', data.data);
        dispatch(updatetoken(data.data));
        dispatch(updateLoginstatus(true));

        toast.success("Login successfully");
        navigate("/social");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  // ---------------- GOOGLE LOGIN ----------------
  function handleGoogleLogin() {
    window.location.href = `${URL}/google/authenticate`;
  }

  // ---------------- SEND OTP ----------------
  async function handleResetClick() {
    try {
      const res = await _post("/auth/send-reset-code", { email: resetEmail });

      if (res.status === 200) {
        toast.success("OTP sent to your email");
        setCodeSent(true);
        setTimer(30);
      }
    } catch (err) {
      toast.error("Failed to send OTP");
    }
  }

  // ---------------- TIMER ----------------
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // ---------------- OTP INPUT ----------------
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // ---------------- VERIFY OTP ----------------
  async function handleVerifyOtp() {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      toast.warning("Enter full OTP");
      return;
    }

    try {
      const res = await _post("/auth/verify-reset-code", {
        email: resetEmail,
        otp: finalOtp,
      });

      if (res.status === 200) {
        toast.success("OTP verified");
        setVerifyMode(true);
      }
    } catch (err) {
      toast.error("Invalid OTP");
    }
  }

  // ---------------- RESET PASSWORD ----------------
  async function handlePasswordReset() {
    if (newPassword.length < 6) {
      toast.warning("Min 6 characters required");
      return;
    }

    try {
      const res = await _post("/auth/reset-password", {
        email: resetEmail,
        newPassword,
      });

      if (res.status === 200) {
        toast.success("Password reset successful");
        setShowForgotPassword(false);
        setVerifyMode(false);
        setCodeSent(false);
        setOtp(["", "", "", "", "", ""]);
      }
    } catch {
      toast.error("Reset failed");
    }
  }

  return (
    <MDBContainer fluid style={{ height: "100vh" }}>
      <MDBRow className="h-100 g-0">

        {/* LEFT SIDE */}
        <MDBCol md="6" className="d-flex align-items-center justify-content-center">
          <div style={{ width: "80%" }}>

            {!showForgotPassword ? (
              <>
                <h3 className="text-center mb-4">Login</h3>

                <MDBInput label="Email" name="email" value={value.email} onChange={handleChange} />
                <MDBInput label="Password" type="password" name="password" value={value.password} onChange={handleChange} className="mt-3"/>

                <Button className="w-100 mt-3" onClick={handleClick}>
                  Login
                </Button>

                <Button className="w-100 mt-2" onClick={handleGoogleLogin}>
                  <FcGoogle /> Google Login
                </Button>

                <p className="text-center mt-3" onClick={() => setShowForgotPassword(true)} style={{ cursor: "pointer" }}>
                  Forgot Password?
                </p>
              </>
            ) : (
              <>
<div className="position-relative mb-3">
  <Button
    variant="outline-dark"
    onClick={() => setShowForgotPassword(false)}
    className="position-absolute start-0 top-50 translate-middle-y d-flex align-items-center gap-2"
  >
    <ArrowLeft />
    Back
  </Button>

  <h4 className="text-center m-0">Reset Password</h4>
</div>
                {!codeSent && (
                  <>
                    <MDBInput label="Email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
                    <Button className="w-100 mt-3" onClick={handleResetClick} disabled={timer > 0}>
                      {timer > 0 ? `Wait ${timer}s` : "Send OTP"}
                    </Button>
                  </>
                )}

                {codeSent && !verifyMode && (
                  <>
                    <div className="d-flex justify-content-center mt-3">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          value={digit}
                          maxLength={1}
                          onChange={(e) => handleOtpChange(e.target.value, i)}
                          onKeyDown={(e) => handleKeyDown(e, i)}
                          ref={(el) => (inputsRef.current[i] = el)}
                          style={{ width: "40px", margin: "5px", textAlign: "center" }}
                        />
                      ))}
                    </div>

                    <Button className="w-100 mt-3" onClick={handleVerifyOtp}>
                      Verify OTP
                    </Button>

                    <Button className="w-100 mt-2" disabled={timer > 0} onClick={handleResetClick}>
                      {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                    </Button>
                  </>
                )}

                {verifyMode && (
                  <>
                    <MDBInput label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <Button className="w-100 mt-3" onClick={handlePasswordReset}>
                      Reset Password
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </MDBCol>

        {/* RIGHT IMAGE */}
        <MDBCol md="6" className="d-none d-md-block p-0">
          <img
            src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7"
            alt="img"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </MDBCol>

      </MDBRow>
    </MDBContainer>
  );
}

export default Mdblogin;