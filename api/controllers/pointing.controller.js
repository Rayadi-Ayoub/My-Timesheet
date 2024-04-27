import Pointing from "../models/pointing.model.js";



export const addPointing = async (req, res) => {
  const pointing = req.body;
  const newPointing = new Pointing(pointing);
  try {
    await newPointing.save();
    res.status(201).json(newPointing);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

export const deletePointing = async (req, res) => {
  const { pointingId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(pointingId)) return res.status(404).send(`No pointing with id: ${pointingId}`);
  await Pointing.findByIdAndRemove(pointingId);
  res.json({ message: "Pointing deleted successfully." });
}

export const getPointingsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const pointings = await Pointing.find({ idUser: userId });
    res.status(200).json(pointings);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const getPointing = async (req, res) => {
  const { pointingId } = req.params;
  try {
    const pointing = await Pointing.findById(pointingId);
    res.status(200).json(pointing);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}
