import Express from "express";
import {
  addTypeTache,
  addTacheWithTypeTache,
  getAllTypeTaches,
  getTachesByTypeTache

} from "../controllers/tache.controller.js";

const router = Express.Router();

router.post("/addtypetache", addTypeTache);
router.post('/tacheWithTypeTache/:typeTacheId', addTacheWithTypeTache);
router.get("/getAllTypeTaches", getAllTypeTaches);
router.get('/getTypeTaches/:typeTacheId', getTachesByTypeTache);




export default router;
