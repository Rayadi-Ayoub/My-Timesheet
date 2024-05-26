import React, { useState } from "react";
import {
  Modal,
  Button,
  Label,
  TextInput,
  Alert,
  Spinner,
} from "flowbite-react";

const ChangePassword = ({ email }) => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword: formData.newPassword }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setMessage(data.message);
      setLoading(false);

      if (res.ok) {
        window.location.href = "/sign-in"; // Redirect to sign-in
      }
    } catch (error) {
      setMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <Modal show={true} onClose={() => {}}>
      <Modal.Header>Change Password</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div>
            <Label value="New Password" />
            <TextInput
              type="password"
              placeholder="New Password"
              id="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label value="Confirm Password" />
            <TextInput
              type="password"
              placeholder="Confirm Password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mt-4">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms" className="ml-2">
              I accept the Terms and Conditions
            </label>
          </div>
          <Button type="submit" disabled={loading} className="mt-4">
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="pl-3">Loading...</span>
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
        {message && (
          <Alert color="success" className="mt-4">
            {message}
          </Alert>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ChangePassword;
