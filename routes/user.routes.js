const express = require("express");
const router = express.Router();
const authControllers = require('../controllers/auth.controller.js');
const verifyJWT = require('../middlewares/auth.middleware.js');
const userController = require('../controllers/user.controller.js');
const upload=require('../middlewares/multer.middleware.js');

router.post('/register',upload.single('avatar') , authControllers.registerUser);
router.post('/login', authControllers.loginUser);
router.post('/logout', verifyJWT, authControllers.logoutUser);

router.get('/getUser',verifyJWT,userController.getUsers);
router.post('/updateUser',verifyJWT,upload.single('avatar'),userController.updateUser);




module.exports = router;