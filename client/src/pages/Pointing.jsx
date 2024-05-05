import React, { useState, useEffect } from "react";
import { Button } from "flowbite-react";

function Pointing() {
  const [poles, setPoles] = useState([]);
  const [selectedPole, setSelectedPole] = useState("");
  const [societes, setSocietes] = useState([]);
  const [typeTaches, setTypeTaches] = useState([]);
  const [taches, setTaches] = useState([]);
  const [selectedTypeTache, setSelectedTypeTache] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");

  useEffect(() => {
    fetchPoles();
    fetchTypeTaches();
  }, []);

  const fetchPoles = async () => {
    const response = await fetch(`/api/poles`);
    const data = await response.json();

    setPoles(data);
  };

  const fetchSocietes = async (poleId) => {
    const response = await fetch(`/api/getSocietesByPole/${poleId}`);
    const data = await response.json();
    setSocietes(data);
  };
  const fetchTypeTaches = async () => {
    const response = await fetch("/api/getAllTypeTaches");
    const data = await response.json();
    setTypeTaches(data);
  };
  const fetchTaches = async (typeTacheId) => {
    const response = await fetch(`/api/getTypeTaches/${typeTacheId}`);
    const data = await response.json();
    setTaches(data);
  };

  const handleChange = (event) => {
    const selectedPole = event.target.value;
    setSelectedPole(selectedPole);
    if (selectedPole) {
      fetchSocietes(selectedPole);
    } else {
      setSocietes([]);
    }
  };

  const handleTypeTacheChange = (event) => {
    const selectedTypeTache = event.target.value;
    setSelectedTypeTache(selectedTypeTache);
    if (selectedTypeTache) {
      fetchTaches(selectedTypeTache);
    } else {
      setTaches([]);
    }
  };

  const handleTimeStartChange = (event) => {
    setTimeStart(event.target.value);
  };

  const handleTimeEndChange = (event) => {
    setTimeEnd(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const pointingData = {
      pole: selectedPole,
      societe: societes[0]._id, // assuming the first societe is selected
      typeTache: selectedTypeTache,
      tache: taches[0]._id, // assuming the first tache is selected
      timeStart,
      timeEnd,
    };

    const response = await fetch("/api/pointings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pointingData),
    });

    if (response.ok) {
      // handle successful submission
      console.log("Pointing added successfully");
    } else {
      // handle error
      console.log("Error adding pointing");
    }
  };

  return (
    <div className="max-w-lg mx-auto  p-3 w-full ">
      <h1 className="my-7 text-center font-semibold text-3xl ">
        Add Your Pointing
      </h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="timeStart"
            className="text-sm font-bold text-gray-700 dark:text-gray-200"
          >
            Time Start
          </label>
          <input
            type="time"
            id="timeStart"
            name="timeStart"
            onChange={handleTimeStartChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200"
          />
          <label
            htmlFor="timeEnd"
            className="text-sm font-bold text-gray-700 dark:text-gray-200"
          >
            Time End
          </label>
          <input
            type="time"
            id="timeEnd"
            name="timeEnd"
            onChange={handleTimeEndChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200"
          />
        </div>
        <select
          value={selectedPole}
          onChange={handleChange}
          className="w-full px-3 py-3 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
        >
          <option value="">Please select a pole</option>
          {poles.map((pole, index) => (
            <option key={index} value={pole._id}>
              {pole.NomP}
            </option>
          ))}
        </select>
        {selectedPole && (
          <select className="w-full px-3 py-3 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline">
            <option value="">Please select a Company</option>
            {societes.map((societe, index) => (
              <option key={index} value={societe._id}>
                {societe.noms}
              </option>
            ))}
          </select>
        )}
        <select
          value={selectedTypeTache}
          onChange={handleTypeTacheChange}
          className="w-full px-3 py-3 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
        >
          <option value="">Please select a TypeTache</option>
          {typeTaches.map((typeTache, index) => (
            <option key={index} value={typeTache._id}>
              {typeTache.typetache}{" "}
            </option>
          ))}
        </select>
        {selectedTypeTache && (
          <select className="w-full px-3 py-3 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline">
            <option value="">Please select a Tache</option>
            {taches.map((tache, index) => (
              <option key={index} value={tache._id}>
                {tache.nomtache}
              </option>
            ))}
          </select>
        )}
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Add Pointing
        </Button>
      </form>
    </div>
  );
}

export default Pointing;
