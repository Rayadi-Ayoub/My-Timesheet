import Express from "express";
import { deleteUser, signout, test, updateUser, getUsers, uploadProfileImage, getDepartementsFromUsers } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import multer from "multer";
import { requestPasswordReset, verifyOtp, resetPassword } from '../controllers/user.controller.js';


const router = Express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './api/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });

router.post('/profile-upload-single', upload.single('profile-file'), uploadProfileImage);

router.get("/test", test);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get("/getusers", verifyToken, getUsers);
router.get("/getDepartements", getDepartementsFromUsers);
router.post('/request-password-reset', requestPasswordReset);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

export default router;
