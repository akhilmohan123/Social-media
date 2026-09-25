import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { ArrowLeft, Eye, EyeSlash } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

import { _post } from '../../Socialmedia/axios/Axios';
import { updateLoginstatus, updatetoken } from '../../Redux/UserSlice';

import './Mdcss.css';

function Mdblogin() {
  const [value, setValue] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [codeSent, setCodeSent] = useState(false);
  const [verifyMode, setVerifyMode] = useState(false);

  const [otp, setOtp] = useState([
    '',
    '',
    '',
    '',
    '',
    ''
  ]);

  const inputsRef = useRef([]);

  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const URL = import.meta.env.VITE_BACKEND_URL;

  // ---------------- LOGIN ----------------

  function handleChange(e) {
    const { name, value } = e.target;

    setValue((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleClick() {
    if (!value.email || !value.password) {
      toast.warning('Please enter your email and password');
      return;
    }

    setLoading(true);

    try {
      const data = await _post('/login', value);

      if (data.data) {
        localStorage.setItem('userId', data.data);

        dispatch(updatetoken(data.data));
        dispatch(updateLoginstatus(true));

        toast.success('Login successfully');

        navigate('/social');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Login failed'
      );
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
    if (!resetEmail) {
      toast.warning('Enter your email address');
      return;
    }

    try {
      const res = await _post(
        '/auth/send-reset-code',
        {
          email: resetEmail
        }
      );

      if (res.status === 200) {
        toast.success('OTP sent to your email');

        setCodeSent(true);
        setTimer(30);
      }
    } catch (err) {
      toast.error('Failed to send OTP');
    }
  }

  // ---------------- TIMER ----------------

  useEffect(() => {
    let interval;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer]);

  // ---------------- OTP ----------------

  const handleOtpChange = (inputValue, index) => {
    if (!/^[0-9]?$/.test(inputValue)) {
      return;
    }

    const newOtp = [...otp];

    newOtp[index] = inputValue;

    setOtp(newOtp);

    if (inputValue && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (
      e.key === 'Backspace' &&
      !otp[index] &&
      index > 0
    ) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // ---------------- VERIFY OTP ----------------

  async function handleVerifyOtp() {
    const finalOtp = otp.join('');

    if (finalOtp.length !== 6) {
      toast.warning('Enter the complete OTP');
      return;
    }

    try {
      const res = await _post(
        '/auth/verify-reset-code',
        {
          email: resetEmail,
          otp: finalOtp
        }
      );

      if (res.status === 200) {
        toast.success('OTP verified');

        setVerifyMode(true);
      }
    } catch (err) {
      toast.error('Invalid OTP');
    }
  }

  // ---------------- RESET PASSWORD ----------------

  async function handlePasswordReset() {
    if (newPassword.length < 6) {
      toast.warning('Minimum 6 characters required');
      return;
    }

    try {
      const res = await _post(
        '/auth/reset-password',
        {
          email: resetEmail,
          newPassword
        }
      );

      if (res.status === 200) {
        toast.success('Password reset successful');

        setShowForgotPassword(false);
        setVerifyMode(false);
        setCodeSent(false);

        setOtp([
          '',
          '',
          '',
          '',
          '',
          ''
        ]);

        setResetEmail('');
        setNewPassword('');
      }
    } catch {
      toast.error('Reset failed');
    }
  }

  // ---------------- BACK TO LOGIN ----------------

  function handleBackToLogin() {
    setShowForgotPassword(false);
    setCodeSent(false);
    setVerifyMode(false);

    setOtp([
      '',
      '',
      '',
      '',
      '',
      ''
    ]);
  }

  return (
    <div className="loginPage">

      {/* LEFT VISUAL PANEL */}

      <section className="loginVisual">

        <div className="visualOverlay" />

        <div className="visualContent">

          <div className="brandLogo">
            <div className="brandIcon">
              S
            </div>

            <span>
              Socially
            </span>
          </div>

          <div className="visualText">

            <span className="visualTag">
              CONNECT · SHARE · DISCOVER
            </span>

            <h1>
              Your people.
              <br />
              Your moments.
              <br />
              <span>One place.</span>
            </h1>

            <p>
              Stay connected with the people,
              ideas and moments that matter to you.
            </p>

          </div>

          <div className="visualBottom">

            <div className="onlineUsers">

              <div className="userBubble">A</div>
              <div className="userBubble">M</div>
              <div className="userBubble">R</div>
              <div className="userBubble">+</div>

            </div>

            <span>
              Join a growing community
            </span>

          </div>

        </div>

      </section>

      {/* RIGHT FORM PANEL */}

      <section className="loginFormSection">

        <div className="loginFormContainer">

          {!showForgotPassword ? (

            <>
              <div className="formHeader">

                <span className="mobileBrand">
                  SOCIALly
                </span>

                <h2>
                  Welcome back
                </h2>

                <p>
                  Sign in to continue to your account.
                </p>

              </div>

              {/* Email */}

              <div className="inputGroup">

                <label>
                  Email address
                </label>

                <input
                  type="email"
                  name="email"
                  value={value.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />

              </div>

              {/* Password */}

              <div className="inputGroup">

                <div className="passwordLabel">

                  <label>
                    Password
                  </label>

                </div>

                <div className="passwordWrapper">

                  <input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    name="password"
                    value={value.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                  />

                  <button
                    type="button"
                    className="passwordToggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword
                      ? <EyeSlash />
                      : <Eye />
                    }
                  </button>

                </div>

              </div>

              {/* Forgot */}

              <div className="forgotRow">

                <button
                  onClick={() =>
                    setShowForgotPassword(true)
                  }
                >
                  Forgot password?
                </button>

              </div>

              {/* Login */}

              <button
                className="loginButton"
                onClick={handleClick}
                disabled={loading}
              >

                {loading
                  ? 'Signing in...'
                  : 'Sign in'
                }

                {!loading && (
                  <span>→</span>
                )}

              </button>

              {/* Divider */}

              <div className="divider">
                <span>OR</span>
              </div>

              {/* Google */}

              <button
                className="googleButton"
                onClick={handleGoogleLogin}
              >

                <FcGoogle size={21} />

                <span>
                  Continue with Google
                </span>

              </button>

              {/* Signup */}

              <p className="signupText">
                Don't have an account?
                <button
                  onClick={() => navigate('/signup')}
                >
                  Create account
                </button>
              </p>

            </>

          ) : (

            <>
              {/* RESET PASSWORD */}

              <div className="resetHeader">

                <button
                  className="backButton"
                  onClick={handleBackToLogin}
                >
                  <ArrowLeft />
                </button>

                <div>
                  <h2>
                    Reset password
                  </h2>

                  <p>
                    Securely recover your account.
                  </p>
                </div>

              </div>

              {/* EMAIL */}

              {!codeSent && (

                <>

                  <div className="resetIcon">
                    ✦
                  </div>

                  <div className="inputGroup">

                    <label>
                      Email address
                    </label>

                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) =>
                        setResetEmail(e.target.value)
                      }
                      placeholder="you@example.com"
                    />

                  </div>

                  <button
                    className="loginButton"
                    onClick={handleResetClick}
                    disabled={timer > 0}
                  >
                    {timer > 0
                      ? `Wait ${timer}s`
                      : 'Send verification code'
                    }
                  </button>

                </>

              )}

              {/* OTP */}

              {codeSent && !verifyMode && (

                <>

                  <div className="otpDescription">
                    <p>
                      Enter the 6-digit code sent to
                    </p>

                    <strong>
                      {resetEmail}
                    </strong>
                  </div>

                  <div className="otpContainer">

                    {otp.map((digit, index) => (

                      <input
                        key={index}
                        ref={(el) =>
                          (inputsRef.current[index] = el)
                        }
                        value={digit}
                        maxLength={1}
                        inputMode="numeric"
                        onChange={(e) =>
                          handleOtpChange(
                            e.target.value,
                            index
                          )
                        }
                        onKeyDown={(e) =>
                          handleKeyDown(e, index)
                        }
                      />

                    ))}

                  </div>

                  <button
                    className="loginButton"
                    onClick={handleVerifyOtp}
                  >
                    Verify code
                  </button>

                  <button
                    className="resendButton"
                    disabled={timer > 0}
                    onClick={handleResetClick}
                  >
                    {timer > 0
                      ? `Resend in ${timer}s`
                      : 'Resend code'
                    }
                  </button>

                </>

              )}

              {/* NEW PASSWORD */}

              {verifyMode && (

                <>

                  <div className="inputGroup">

                    <label>
                      New password
                    </label>

                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(e.target.value)
                      }
                      placeholder="Create a new password"
                    />

                  </div>

                  <button
                    className="loginButton"
                    onClick={handlePasswordReset}
                  >
                    Update password
                  </button>

                </>

              )}

            </>

          )}

        </div>

      </section>

    </div>
  );
}

export default Mdblogin;