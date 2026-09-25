import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { Eye, EyeSlash, ArrowRight } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

import './Mdsignup.css';

function Mdbsignup() {
  const [value, setValue] = useState({
    fname: '',
    lname: '',
    email: '',
    password: ''
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const URL = import.meta.env.VITE_BACKEND_URL;

  const emailRegex = /^[\w.+-]+@([\w-]+\.)+[\w-]{2,}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

  // ---------------- GOOGLE SIGNUP ----------------

  const handleGoogleSignup = () => {
    window.location.href = `${URL}/google/authenticate`;
  };

  // ---------------- VALIDATION ----------------

  function onValidation() {
    let valid = true;

    const newError = {
      email: '',
      password: ''
    };

    if (!emailRegex.test(value.email)) {
      newError.email = 'Please enter a valid email address';
      valid = false;
    }

    if (!passwordRegex.test(value.password)) {
      newError.password =
        'Password must contain at least 6 characters and a number';
      valid = false;
    }

    setError(newError);

    return valid;
  }

  // ---------------- INPUT CHANGE ----------------

  function handleChange(e) {
    const { name, value: inputValue } = e.target;

    setValue((prevValue) => ({
      ...prevValue,
      [name]: inputValue
    }));

    if (name === 'email' || name === 'password') {
      setError((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  }

  // ---------------- IMAGE ----------------

  function handleImage(e) {
    const file = e.target.files[0];

    if (!file) {
      setImage(null);
      return;
    }

    setImage(file);
  }

  // ---------------- SUBMIT ----------------

  async function handleSubmit(e) {
    e.preventDefault();

    if (!onValidation()) {
      toast.error('Please check your details');
      return;
    }

    setLoading(true);

    const form = new FormData();

    form.append('fname', value.fname);
    form.append('lname', value.lname);
    form.append('password', value.password);
    form.append('email', value.email);

    if (image) {
      form.append('profilePic', image);
    }

    try {
      const res = await axios.post(
        `${URL}/signup`,
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (res.status === 200) {
        toast.success('Account created successfully!');

        navigate('/login');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signupPage">

      {/* ========================================
          LEFT VISUAL
      ======================================== */}

      <section className="signupVisual">

        <div className="signupVisualOverlay" />

        <div className="signupVisualContent">

          {/* BRAND */}

          <div className="signupBrand">

            <div className="signupBrandIcon">
              S
            </div>

            <span>
              Socially
            </span>

          </div>

          {/* MAIN TEXT */}

          <div className="signupHeroText">

            <span className="signupTag">
              CREATE · CONNECT · SHARE
            </span>

            <h1>
              Your story
              <br />
              starts <span>here.</span>
            </h1>

            <p>
              Create your profile, connect with people
              and start sharing the moments that matter.
            </p>

          </div>

          {/* DECORATIVE CARDS */}

          <div className="floatingCard floatingCardOne">

            <div className="miniAvatar">
              A
            </div>

            <div>
              <strong>
                New connection
              </strong>

              <small>
                Someone followed you
              </small>
            </div>

          </div>

          <div className="floatingCard floatingCardTwo">

            <span className="heartIcon">
              ♥
            </span>

            <div>
              <strong>
                1,284
              </strong>

              <small>
                people are sharing
              </small>
            </div>

          </div>

        </div>

      </section>

      {/* ========================================
          SIGNUP FORM
      ======================================== */}

      <section className="signupFormSection">

        <div className="signupFormContainer">

          {/* HEADER */}

          <div className="signupHeader">

            <span className="mobileSignupBrand">
              SOCIALly
            </span>

            <h2>
              Create your account
            </h2>

            <p>
              Join the community and start connecting.
            </p>

          </div>

          {/* GOOGLE */}

          <button
            type="button"
            className="signupGoogleButton"
            onClick={handleGoogleSignup}
          >

            <FcGoogle size={21} />

            <span>
              Continue with Google
            </span>

          </button>

          {/* DIVIDER */}

          <div className="signupDivider">
            <span>
              OR CONTINUE WITH EMAIL
            </span>
          </div>

          {/* FORM */}

          <form onSubmit={handleSubmit}>

            {/* NAME */}

            <div className="nameInputs">

              <div className="signupInputGroup">

                <label>
                  First name
                </label>

                <input
                  type="text"
                  name="fname"
                  value={value.fname}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />

              </div>

              <div className="signupInputGroup">

                <label>
                  Last name
                </label>

                <input
                  type="text"
                  name="lname"
                  value={value.lname}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />

              </div>

            </div>

            {/* EMAIL */}

            <div className="signupInputGroup">

              <label>
                Email address
              </label>

              <input
                type="email"
                name="email"
                value={value.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />

              {error.email && (
                <span className="signupError">
                  {error.email}
                </span>
              )}

            </div>

            {/* PASSWORD */}

            <div className="signupInputGroup">

              <label>
                Password
              </label>

              <div className="signupPasswordWrapper">

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  name="password"
                  value={value.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  minLength="6"
                />

                <button
                  type="button"
                  className="signupPasswordToggle"
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

              {error.password && (
                <span className="signupError">
                  {error.password}
                </span>
              )}

              <span className="passwordHint">
                Minimum 6 characters with at least one number
              </span>

            </div>

            {/* PROFILE IMAGE */}

            <div className="profileUpload">

              <div className="profileUploadText">

                <div className="profileUploadIcon">
                  +
                </div>

                <div>

                  <label htmlFor="profileImage">
                    Profile picture
                  </label>

                  <span>
                    Optional · JPG, PNG or WEBP
                  </span>

                </div>

              </div>

              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleImage}
              />

              {image && (
                <span className="selectedFile">
                  {image.name}
                </span>
              )}

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="signupButton"
              disabled={loading}
            >

              {loading ? (
                'Creating account...'
              ) : (
                <>
                  Create account
                  <ArrowRight />
                </>
              )}

            </button>

          </form>

          {/* LOGIN */}

          <p className="alreadyAccount">

            Already have an account?

            <button
              type="button"
              onClick={() => navigate('/login')}
            >
              Sign in
            </button>

          </p>

        </div>

      </section>

    </div>
  );
}

export default Mdbsignup;