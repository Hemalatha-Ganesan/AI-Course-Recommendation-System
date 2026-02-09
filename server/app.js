const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Connect to MongoDB (no duplicate .then/.catch)
mongoose.connect("mongodb://127.0.0.1:27017/yourdb")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


app.use(express.json());


app.get("/", (req, res) => {
  res.send("Server is running!");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
