import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addPointingsStart,
  addPointingsSuccess,
  addPointingsFailure,
} from "../redux/user/userSlice";
import { Button } from "flowbite-react";

function Pointing() {
  const { currentUser, error } = useSelector((state) => state.user);
  const [poles, setPoles] = useState([]);
  const [selectedPole, setSelectedPole] = useState("");
  const [societes, setSocietes] = useState([]);
  const [selectedSociete, setSelectedSociete] = useState("");
  const [typeTaches, setTypeTaches] = useState([]);
  const [taches, setTaches] = useState([]);
  const [selectedTypeTache, setSelectedTypeTache] = useState("");
  const [selectedTache, setSelectedTache] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [addPointingsSuccessMessage, setAddPointingsSuccessMessage] =
    useState("");
  const [addPointingsErrorMessage, setAddPointingsErrorMessage] = useState("");
  const dispatch = useDispatch();

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

  const handleSocieteChange = (event) => {
    setSelectedSociete(event.target.value);
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

  const handleTacheChange = (event) => {
    setSelectedTache(event.target.value);
  };

  const handleTimeStartChange = (event) => {
    setTimeStart(event.target.value);
  };

  const handleTimeEndChange = (event) => {
    setTimeEnd(event.target.value);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !selectedPole ||
      !selectedSociete ||
      !selectedTypeTache ||
      !selectedTache ||
      !timeStart ||
      !timeEnd ||
      !comment
    ) {
      setAddPointingsErrorMessage("Please fill out all fields.");
      return;
    }

    const pointingData = {
      pole: selectedPole,
      societe: selectedSociete,
      typeTache: selectedTypeTache,
      tache: selectedTache,
      timeStart,
      timeEnd,
      comment,
      createdBy: currentUser._id,
    };

    dispatch(addPointingsStart());

    try {
      setLoading(true);
      const response = await fetch(`/api/pointings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pointingData),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(addPointingsSuccess(data));
        setLoading(false);
        setAddPointingsSuccessMessage("Pointing added successfully");
        resetForm();
      } else {
        const errorData = await response.json();
        dispatch(addPointingsFailure(errorData));
        setAddPointingsErrorMessage("Failed to add pointing");
      }
    } catch (error) {
      dispatch(addPointingsFailure(error.message));
      setAddPointingsErrorMessage(error.message);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedPole("");
    setSelectedSociete("");
    setSelectedTypeTache("");
    setSelectedTache("");
    setTimeStart("");
    setTimeEnd("");
    setComment("");
    setAddPointingsErrorMessage("");
    setAddPointingsSuccessMessage("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl w-full p-6">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
          <h1 className="text-center font-bold text-4xl text-gray-800 dark:text-gray-100 mb-8">
            Add Your Pointing
          </h1>
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="timeStart"
                  className="text-sm font-bold text-gray-800 dark:text-gray-200"
                >
                  Time Start
                </label>
                <input
                  type="time"
                  id="timeStart"
                  name="timeStart"
                  value={timeStart}
                  onChange={handleTimeStartChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="timeEnd"
                  className="text-sm font-bold text-gray-800 dark:text-gray-200"
                >
                  Time End
                </label>
                <input
                  type="time"
                  id="timeEnd"
                  name="timeEnd"
                  value={timeEnd}
                  onChange={handleTimeEndChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                />
              </div>
            </div>
            <select
              value={selectedPole}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
            >
              <option value="">Please select a pole</option>
              {poles.map((pole, index) => (
                <option key={index} value={pole._id}>
                  {pole.NomP}
                </option>
              ))}
            </select>
            <select
              value={selectedSociete}
              onChange={handleSocieteChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
            >
              <option value="">Please select a Company</option>
              {societes.map((societe, index) => (
                <option key={index} value={societe._id}>
                  {societe.noms}
                </option>
              ))}
            </select>
            <select
              value={selectedTypeTache}
              onChange={handleTypeTacheChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
            >
              <option value="">Please select a TypeTache</option>
              {typeTaches.map((typeTache, index) => (
                <option key={index} value={typeTache._id}>
                  {typeTache.typetache}
                </option>
              ))}
            </select>
            <select
              value={selectedTache}
              onChange={handleTacheChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
            >
              <option value="">Please select a Tache</option>
              {taches.map((tache, index) => (
                <option key={index} value={tache._id}>
                  {tache.nomtache}
                </option>
              ))}
            </select>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="comment"
                className="text-sm font-bold text-gray-800 dark:text-gray-200"
              >
                Your comment
              </label>
              <textarea
                id="comment"
                placeholder="Leave a comment..."
                required
                rows={4}
                value={comment}
                onChange={handleCommentChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
              />
            </div>
            <Button
              type="submit"
              gradientDuoTone="purpleToPink"
              className="w-full text-white font-bold py-1 px-2 rounded-md text-sm focus:ring-4 focus:ring-orange-300 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 2.042.737 3.904 1.961 5.363l2.039-1.072z"
                    ></path>
                  </svg>
                  <span className="pl-3">Loading...</span>
                </div>
              ) : (
                "Add Pointing"
              )}
            </Button>
            <div className="mt-5 text-center">
              {addPointingsSuccessMessage && (
                <div className="text-green-600 font-bold">
                  {addPointingsSuccessMessage}
                </div>
              )}
              {addPointingsErrorMessage && (
                <div className="text-red-600 font-bold">
                  {addPointingsErrorMessage}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Pointing;
