import React, { useState, useEffect } from "react";
import { Modal, Button, Label, Textarea } from "flowbite-react";
import PropTypes from "prop-types";

const UpdatePointingModal = ({ show, onClose, pointing, onUpdate }) => {
  const [pole, setPole] = useState(pointing.pole._id);
  const [societe, setSociete] = useState(pointing.societe._id);
  const [typeTache, setTypeTache] = useState(pointing.typeTache._id);
  const [tache, setTache] = useState(pointing.tache._id);
  const [timeStart, setTimeStart] = useState(pointing.timeStart);
  const [timeEnd, setTimeEnd] = useState(pointing.timeEnd);
  const [comment, setComment] = useState(pointing.comment);
  const [poles, setPoles] = useState([]);
  const [societes, setSocietes] = useState([]);
  const [typeTaches, setTypeTaches] = useState([]);
  const [taches, setTaches] = useState([]);

  useEffect(() => {
    setPole(pointing.pole._id);
    setSociete(pointing.societe._id);
    setTypeTache(pointing.typeTache._id);
    setTache(pointing.tache._id);
    setTimeStart(pointing.timeStart);
    setTimeEnd(pointing.timeEnd);
    setComment(pointing.comment);
    fetchPoles();
    fetchSocietes(pointing.pole._id);
    fetchTypeTaches();
    fetchTaches(pointing.typeTache._id);
  }, [pointing]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedPointing = {
      pole: pole,
      societe: societe,
      typeTache: typeTache,
      tache: tache,
      timeStart: timeStart,
      timeEnd: timeEnd,
      comment: comment,
    };

    try {
      const res = await fetch(`/api/pointings/${pointing._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPointing),
      });

      if (res.ok) {
        const data = await res.json();
        onUpdate(data);
        onClose();
      } else {
        console.error("Failed to update pointing");
      }
    } catch (error) {
      console.error("Error updating pointing:", error);
    }
  };

  return (
    <Modal show={show} onClose={onClose} size="xl">
      <Modal.Header>Update Pointing</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="block">
              <Label value="Pole:" className="block" />
              <select
                value={pole}
                onChange={(e) => {
                  setPole(e.target.value);
                  fetchSocietes(e.target.value);
                }}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Please select a pole</option>
                {poles.map((pole, index) => (
                  <option key={index} value={pole._id}>
                    {pole.NomP}
                  </option>
                ))}
              </select>
            </div>
            <div className="block mt-4">
              <Label value="Company:" className="block" />
              {pole && (
                <select
                  value={societe}
                  onChange={(e) => setSociete(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Please select a Company</option>
                  {societes.map((societe, index) => (
                    <option key={index} value={societe._id}>
                      {societe.noms}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="block mt-4">
              <Label value="Type Task:" className="block" />
              <select
                value={typeTache}
                onChange={(e) => {
                  setTypeTache(e.target.value);
                  fetchTaches(e.target.value);
                }}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Please select a TypeTache</option>
                {typeTaches.map((typeTache, index) => (
                  <option key={index} value={typeTache._id}>
                    {typeTache.typetache}
                  </option>
                ))}
              </select>
            </div>
            {typeTache && (
              <div className="block mt-4">
                <Label value="Tache:" className="block" />
                <select
                  value={tache}
                  onChange={(e) => setTache(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Please select a Tache</option>
                  {taches.map((tache, index) => (
                    <option key={index} value={tache._id}>
                      {tache.nomtache}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="timeStart" value="Time Start" />
            <input
              id="timeStart"
              type="time"
              value={timeStart}
              onChange={(e) => setTimeStart(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <Label htmlFor="timeEnd" value="Time End" />
            <input
              id="timeEnd"
              type="time"
              value={timeEnd}
              onChange={(e) => setTimeEnd(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <Label htmlFor="comment" value="Comment" />
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Update Pointing</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

UpdatePointingModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  pointing: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default UpdatePointingModal;
