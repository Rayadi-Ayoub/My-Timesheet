import express from 'express';
import { addPole, addSocieteToPole , deleteSociete ,deletePole , getSocietesByPole , getAllSocietes } from '../controllers/pole.controller.js';

const router = express.Router();

import multer from 'multer';

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.post("/addPole",upload.single('imagepole'), addPole);
router.get('/societes', getAllSocietes);
router.delete('/deletePole/:poleId', deletePole);
router.post("/addSociete/:poleId", addSocieteToPole);
router.delete('/deleteSociete/:societeId', deleteSociete);
router.get('/getSocietesByPole/:poleId', getSocietesByPole);

export default router;


