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
      !formData.employeeCost
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
    <div className="main-h-screen mt-20">
      <div className="grid grid-cols-2 gap-5 max-w-3xl mx-auto">
        <div>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Matricule" />
              <TextInput
                type="text"
                placeholder="Matricule"
                id="matricule"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Poste" />
              <select
                id="poste"
                value={formData.poste}
                onChange={handleChange}
                className="block w-full p-2 mb-1 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Choose a poste</option>
                <option value="admin">ADMIN</option>
                <option value="manager">MANAGER</option>
                <option value="user">USER</option>
                <option value="controller">CONTROLEUR</option>
              </select>
            </div>
            <div>
              <Label value="Departement" />
              <select
                id="departement"
                value={formData.departement}
                onChange={handleChange}
                className="block w-full p-2 mb-1 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Choose a departement</option>
                <option value="Generale">Générale</option>
                <option value="Financiere">Financiere</option>
                <option value="Informatique">Informatique</option>
                <option value="Juridique">Juridique</option>
              </select>
            </div>
            <div>
              <Label value="Employee Cost" />
              <TextInput
                type="text"
                placeholder="Employee Cost"
                id="employeeCost"
                onChange={handleChange}
              />
            </div>
          </form>
        </div>
        <div>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Hiring Date" />
              <TextInput id="hiringDate" type="date" onChange={handleChange} />
            </div>
            <div>
              <Label value="Address" />
              <TextInput
                type="text"
                placeholder="Address"
                id="address"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Phone" />
              <TextInput
                type="text"
                placeholder="Phone"
                id="phone"
                onChange={handleChange}
              />
            </div>
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
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
          </form>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className=" flex   gap-4 justify-center p-4 ">
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
  );
}
