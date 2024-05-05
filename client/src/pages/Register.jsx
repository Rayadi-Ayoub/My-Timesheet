import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Datepicker } from "flowbite-react";

export default function Register() {
  const [formData, setFormData] = useState({});
  const [errorMessage, seterrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    console.log(formData);
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
      !formData.password
    ) {
      return seterrorMessage("Please fill out all fields.");
    }

    try {
      setLoading(true);
      seterrorMessage(null);
      const res = await fetch("/api/register/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        seterrorMessage(data.message);
      }
      setLoading(false);
    } catch (error) {
      seterrorMessage(error.message);
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
              <label
                htmlFor="poste"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Poste
              </label>
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
              <label
                htmlFor="departement"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Departement
              </label>
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
          </form>
        </div>
        <div>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Hiring Date " />

              <TextInput id="hiringDate" type="date" onChange={handleChange} />
            </div>

            <div>
              <Label value="Address" />
              <TextInput
                type="text"
                placeholder="address"
                id="address"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Phone" />
              <TextInput
                type="text"
                placeholder="phone"
                id="phone"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Email " />
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
                " Sign Up"
              )}
            </Button>
          </form>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
