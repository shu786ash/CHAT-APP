require('dotenv').config();
const express = require("express");
const {app,server} =require('./socket/socket.js');
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const userRoutes = require('./routes/user.routes.js');
const meesageRoutes=require('./routes/message.routes.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("💻 Mondodb Connected"))
  .catch(err => console.error(err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get("/", (req, res) => {
  res.send("home page");
});

app.use("/user", userRoutes);
app.use("/message",meesageRoutes);
server.listen(PORT, () => console.log("Server running on port " + PORT));