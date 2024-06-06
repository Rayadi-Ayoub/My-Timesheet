import React, { useState, useEffect } from "react";
import { Spinner, Button, Alert, Label, Textarea, Card } from "flowbite-react";
import { useSelector, useDispatch } from "react-redux";
import {
  addPointingsStart,
  addPointingsSuccess,
  addPointingsFailure,
} from "../redux/user/userSlice";

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
    console.log(event.target.value);
    // setTimeStart(event.target.value + ":00");
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

    if (!selectedSociete || !selectedTache) {
      console.log("Societes or Taches is empty");
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
  };

  const generateOptions = (count) => {
    return Array.from({ length: count }, (_, i) => (
      <option key={i} value={i.toString().padStart(2, "0")}>
        {i.toString().padStart(2, "0")}
      </option>
    ));
  };

  return (
    <div className="max-w-2xl mx-auto p-3 w-full ">
      <Card className="p-6 dark:bg-gray-800">
        <h1 className="my-7 text-center font-semibold text-3xl text-gray-900 dark:text-gray-100">
          Add Your Pointing
        </h1>
        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="timeStart"
                className="text-sm font-bold text-gray-700 dark:text-gray-200"
              >
                Time Start
              </label>
              {/* <select
                id="timeStart"
                name="timeStart"
                value={timeStart}
                onChange={handleTimeStartChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="" disabled>
                  HH
                </option>
                {generateOptions(24)}
              </select> */}
              <input
                type="time"
                id="timeStart"
                name="timeStart"
                value={timeStart}
                onChange={handleTimeStartChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                value={timeEnd}
                onChange={handleTimeEndChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={selectedPole}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">Please select a pole</option>
            {poles.map((pole, index) => (
              <option key={index} value={pole._id}>
                {pole.NomP}
              </option>
            ))}
          </select>
          {selectedPole && (
            <select
              value={selectedSociete}
              onChange={handleSocieteChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
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
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">Please select a TypeTache</option>
            {typeTaches.map((typeTache, index) => (
              <option key={index} value={typeTache._id}>
                {typeTache.typetache}
              </option>
            ))}
          </select>
          {selectedTypeTache && (
            <select
              value={selectedTache}
              onChange={handleTacheChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="">Please select a Tache</option>
              {taches.map((tache, index) => (
                <option key={index} value={tache._id}>
                  {tache.nomtache}
                </option>
              ))}
            </select>
          )}
          <div className="max-w-md">
            <div className="mb-2 block">
              <Label htmlFor="comment" value="Your comment" />
            </div>
            <Textarea
              id="comment"
              placeholder="Leave a comment..."
              required
              rows={4}
              value={comment}
              onChange={handleCommentChange}
            />
          </div>
          <Button
            type="submit"
            gradientDuoTone="purpleToBlue"
            disabled={loading}
            outline
          >
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="pl-3">Loading...</span>
              </>
            ) : (
              "Add Pointing"
            )}
          </Button>
          {addPointingsSuccessMessage && (
            <Alert color="success" className="mt-5">
              {addPointingsSuccessMessage}
            </Alert>
          )}
          {addPointingsErrorMessage && (
            <Alert color="failure" className="mt-5">
              {addPointingsErrorMessage}
            </Alert>
          )}
          {error && (
            <Alert color="success" className="mt-5">
              {error}
            </Alert>
          )}
        </form>
      </Card>
    </div>
  );
}

export default Pointing;
