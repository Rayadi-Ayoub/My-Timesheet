import React, { useState, useEffect } from "react";

function Pole() {
  const [poles, setPoles] = useState([]);
  const [selectedPole, setSelectedPole] = useState("");
  const [societes, setSocietes] = useState([]);

  useEffect(() => {
    fetchPoles();
  }, []);

  const fetchPoles = async () => {
    const response = await fetch(`/api/poles`);
    const data = await response.json();
    //console.log(data);
    setPoles(data);
  };

  const fetchSocietes = async (poleId) => {
    const response = await fetch(`/api/getSocietesByPole/${poleId}`);
    const data = await response.json();
    setSocietes(data);
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
  return (
    <div>
      <select value={selectedPole} onChange={handleChange}>
        <option value="">Please select a pole</option>
        {poles.map((pole, index) => (
          <option key={index} value={pole._id}>
            {pole.NomP}
          </option>
        ))}
      </select>
      {selectedPole && (
        <select>
          <option value="">Please select a societe</option>
          {societes.map((societe, index) => (
            <option key={index} value={societe._id}>
              {societe.noms}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default Pole;
