import React, { useState } from "react";
import {
  Modal,
  Button,
  Label,
  TextInput,
  Alert,
  Spinner,
} from "flowbite-react";

export default function ForgetPasswordModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json(); // Move this inside the try block to parse JSON first

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("User not found");
        } else {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
      }

      setMessage(data.message);
      setLoading(false);
      onClose(true, email);
    } catch (error) {
      setMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Modal.Header>Forget Password</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div>
            <Label value="Email" />
            <TextInput
              type="email"
              placeholder="name@company.com"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              "Send OTP"
            )}
          </Button>
        </form>
        {message && (
          <Alert color="failure" className="mt-4">
            {message}
          </Alert>
        )}
      </Modal.Body>
    </>
  );
}
