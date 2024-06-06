import Express from "express";
import {
  addTypeTache,
  addTacheWithTypeTache,
  getAllTypeTaches,
  getTachesByTypeTache,
  updateTypeTache,
  deleteTypeTache,
  updateTache,
  deleteTache,
  getAllTaches
} from "../controllers/tache.controller.js";

const router = Express.Router();

router.post("/addtypetache", addTypeTache);
router.post('/tacheWithTypeTache/:typeTacheId', addTacheWithTypeTache);
router.get("/getAllTypeTaches", getAllTypeTaches);
router.get('/getTypeTaches/:typeTacheId', getTachesByTypeTache);
router.put('/typetaches/:typeTacheId', updateTypeTache);
router.delete('/typetaches/:typeTacheId', deleteTypeTache);
router.put('/taches/:tacheId', updateTache); 
router.delete('/taches/:tacheId', deleteTache); 
router.get('/taches', getAllTaches);

export default router;
