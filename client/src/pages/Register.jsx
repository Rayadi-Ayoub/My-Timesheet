import React, { useState } from "react";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";

export default function Register() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.username ||
      !formData.matricule ||
      !formData.poste ||
      !formData.departement ||
      !formData.hiringDate ||
      !formData.address ||
      !formData.phone ||
      !formData.email ||
      !formData.password ||
      !formData.employeeCost ||
      !formData.billingcost === ""
    ) {
      return setErrorMessage("Please fill out all fields.");
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/register/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        setErrorMessage(data.message);
      }
      setLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl w-full space-y-8 bg-white dark:bg-gray-800 p-10 shadow-md rounded-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Register
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <Label
                htmlFor="username"
                value="Username"
                className="dark:text-white"
              />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
                className="mt-1 dark:bg-gray-700 dark:text-white"
              />
              <Label
                htmlFor="matricule"
                value="Matricule"
                className="dark:text-white"
              />
              <TextInput
                type="text"
                placeholder="Matricule"
                id="matricule"
                onChange={handleChange}
                className="mt-1 dark:bg-gray-700 dark:text-white"
              />
              <Label
                htmlFor="poste"
                value="Poste"
                className="dark:text-white"
              />
              <select
                id="poste"
                value={formData.poste}
                onChange={handleChange}
                className="block w-full p-2 mt-1 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a poste</option>
                <option value="admin">ADMIN</option>
                <option value="manager">MANAGER</option>
                <option value="user">USER</option>
                <option value="controller">CONTROLEUR</option>
              </select>
              <Label
                htmlFor="departement"
                value="Departement"
                className="dark:text-white"
              />
              <select
                id="departement"
                value={formData.departement}
                onChange={handleChange}
                className="block w-full p-2 mt-1 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a departement</option>
                <option value="Generale">Générale</option>
                <option value="Financiere">Financiere</option>
                <option value="Informatique">Informatique</option>
                <option value="Juridique">Juridique</option>
                <option value="Securite">Securite</option>
              </select>
              <Label
                htmlFor="employeeCost"
                value="Employee Cost"
                className="dark:text-white"
              />
              <TextInput
                type="text"
                placeholder="Employee Cost"
                id="employeeCost"
                onChange={handleChange}
                className="mt-1 dark:bg-gray-700 dark:text-white"
              />
              <Label
                htmlFor="billingcost"
                value="Billing Cost"
                className="dark:text-white"
              />
              <TextInput
                type="text"
                placeholder="Billing Cost"
                id="billingcost"
                onChange={handleChange}
                className="mt-1 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <Label
                htmlFor="hiringDate"
                value="Hiring Date"
                className="dark:text-white"
              />
              <TextInput
                id="hiringDate"
                type="date"
                onChange={handleChange}
                className="mt-1 dark:bg-gray-700 dark:text-white"
              />
              <Label
                htmlFor="address"
                value="Address"
                className="dark:text-white"
              />
              <TextInput
                type="text"
                placeholder="Address"
                id="address"
                onChange={handleChange}
                className="mt-1 dark:bg-gray-700 dark:text-white"
              />
              <Label
                htmlFor="phone"
                value="Phone"
                className="dark:text-white"
              />
              <TextInput
                type="text"
                placeholder="Phone"
                id="phone"
                onChange={handleChange}
                className="mt-1 dark:bg-gray-700 dark:text-white"
              />
              <Label
                htmlFor="email"
                value="Email"
                className="dark:text-white"
              />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
                className="mt-1 dark:bg-gray-700 dark:text-white"
              />
              <Label
                htmlFor="password"
                value="Password"
                className="dark:text-white"
              />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
                className="mt-1 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-center">
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
                "Sign Up"
              )}
            </Button>
          </div>
        </form>
        {errorMessage && (
          <Alert className="mt-5" color="failure">
            {errorMessage}
          </Alert>
        )}
      </div>
    </div>
  );
}
