import React, { useState } from "react";
import {
  Modal,
  Button,
  Label,
  TextInput,
  Alert,
  Spinner,
} from "flowbite-react";

const VerifyOTP = ({ email, onVerified }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400) {
          setMessage(data.message);
        } else {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
      } else {
        setMessage(data.message);
        setLoading(false);
        onVerified();
      }
    } catch (error) {
      setMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <Modal show={true} onClose={() => onVerified()}>
      <Modal.Header>Verify OTP</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div>
            <Label value="OTP" />
            <TextInput
              type="text"
              placeholder="Enter OTP"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="mt-4">
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="pl-3">Loading...</span>
              </>
            ) : (
              "Verify OTP"
            )}
          </Button>
        </form>
        {message && (
          <Alert color="failure" className="mt-4">
            {message}
          </Alert>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default VerifyOTP;
