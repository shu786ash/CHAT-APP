const express = require("express");
const router = express.Router();
const verifyJWT = require('../middlewares/auth.middleware.js');
const messageController = require('../controllers/message.controoler.js');

router.post('/send/:id', verifyJWT, messageController.sendMessage);
router.get('/:id', verifyJWT, messageController.getMessage);



module.exports = router;