import React, { useState, useEffect } from "react";
import { Spinner, Button, Alert , Label, Textarea } from "flowbite-react";
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
  const [typeTaches, setTypeTaches] = useState([]);
  const [taches, setTaches] = useState([]);
  const [selectedTypeTache, setSelectedTypeTache] = useState("");
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

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!societes.length || !taches.length) {
      console.log("Societes or Taches is empty");
      return;
    }

    const pointingData = {
      pole: selectedPole,
      societe: societes[0]._id,
      typeTache: selectedTypeTache,
      tache: taches[0]._id,
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
      } else {
        const errorData = await response.json();
        dispatch(addPointingsFailure(errorData));
        setAddPointingsErrorMessage("Failed to add pointing");
      }
    } catch (error) {
      dispatch(addPointingsFailure(error.message));
      setAddPointingsError(error.message);
      setLoading(false);
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
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <select
          value={selectedPole}
          onChange={handleChange}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">Please select a pole</option>
          {poles.map((pole, index) => (
            <option key={index} value={pole._id}>
              {pole.NomP}
            </option>
          ))}
        </select>
        {selectedPole && (
          <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">Please select a TypeTache</option>
          {typeTaches.map((typeTache, index) => (
            <option key={index} value={typeTache._id}>
              {typeTache.typetache}{" "}
            </option>
          ))}
        </select>
        {selectedTypeTache && (
          <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
      <Textarea id="comment" placeholder="Leave a comment..." required rows={4} 
      onChange={handleCommentChange}/>
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
            " Add Pointing"
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
    </div>
  );
}

export default Pointing;
