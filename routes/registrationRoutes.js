const express = require('express');
const registrationController = require('../controllers/registrationController');
const { loginValidator,registrationValidator } = require("../helpers/validation");
const path = require('path')
const multer = require('multer');

const router = express.Router();

// Multer file uploads
const filestore = multer.diskStorage({
  destination: (req, file, cb) => {    
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // cb(null, file.originalname + '-' + uniqueSuffix);
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    // cb(null, file.originalname);
    // console.log(file.originalname);
  }
});

const upload = multer({ storage: filestore });

// Routes for registration
router.get('/userData', registrationController.getRegistrationData);
router.get('/getUser/:id', registrationController.getUserId);
router.post('/register',upload.single("file"), registrationValidator, registrationController.handleRegistration);
router.post('/login', loginValidator, registrationController.handleLogin);
router.delete('/deleteUser/:userId', registrationController.handledelete);
router.put('/updateUser/:id',upload.single('file'), registrationController.handleUpdate);

module.exports = router;
