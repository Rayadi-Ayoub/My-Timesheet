import React, { useState } from "react";
import {
  Alert,
  Button,
  Label,
  Spinner,
  TextInput,
  Modal,
} from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import ForgetPasswordModal from "./ForgetPasswordModal";
import VerifyOTP from "./VerifyOTP";
import ChangePassword from "./ChangePassword";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showForgetPasswordModal, setShowForgetPasswordModal] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"));
    }

    try {
      dispatch(signInStart());
      const res = await fetch("/api/register/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/dashboard?tab=pointing");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  const handleForgetPassword = () => {
    setShowForgetPasswordModal(true);
  };

  const handleOtpSent = (success, email) => {
    setShowForgetPasswordModal(false);
    if (success) {
      setEmail(email);
      setShowOtpInput(true);
    }
  };

  const handleOtpVerified = () => {
    setShowOtpInput(false);
    setShowChangePassword(true);
  };

  return (
    <div className="main-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Geiser
            </span>
            System
          </Link>
          <p className="text-sm mt-5">
            You can sign in with your email and password or contact your
            manager.
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Password" />
              <TextInput
                type="password"
                placeholder="************"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <button onClick={handleForgetPassword} className="text-blue-500">
              Forget Password?
            </button>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
      <Modal
        show={showForgetPasswordModal}
        onClose={() => setShowForgetPasswordModal(false)}
      >
        <ForgetPasswordModal onClose={handleOtpSent} />
      </Modal>
      <Modal show={showOtpInput} onClose={() => setShowOtpInput(false)}>
        <VerifyOTP email={email} onVerified={handleOtpVerified} />
      </Modal>
      <Modal
        show={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      >
        <ChangePassword email={email} />
      </Modal>
    </div>
  );
}
