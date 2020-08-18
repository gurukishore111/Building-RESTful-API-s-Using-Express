const express = require("express");
const route = express.Router();
const mongoose = require("mongoose");
//Joi for validation
const Joi = require("joi");

//Creating Schema

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

//Creating the modal
const Movies = mongoose.model("Movies", movieSchema);

//To Get Data
route.get("/", (req, res) => {
  res.send("Hello Vidly");
});

route.get("/api/movies", async (req, res) => {
  const movies = await Movies.find().sort("name");
  res.send(movies);
});

//Pass the Data in params
route.get("/api/movies/:id", async (req, res) => {
  const movie = await Movies.findById(req.params.id);
  if (!movie) {
    res.status(404).send("Given id is not founded in data");
  }
  res.send(movie);
});

//To create new data

route.post("/api/movies", async (req, res) => {
  const { error } = validateGenre(req.body);

  if (error) {
    res.status(400).send(result.error.details[0].message);
  }
  var movie = new Movies({
    name: req.body.name,
  });
  movie = await movie.save();
  res.send(movie);
});

//To update the Data

route.put("/api/movies/:id", async (req, res) => {
  const movie = await Movies.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!movie) {
    res.status(404).send("Given id is not founded in data");
  }
  const { error } = validateGenre(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  res.send(movie);
});

//To Delete the data

route.delete("/api/movies/:id", async (req, res) => {
  const movie = await Movies.findByIdAndRemove(req.params.id);
  if (!movie) {
    res.status(404).send("The given id is not found");
    return;
  }
  res.send(movie);
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    description: Joi.string(),
  };

  return Joi.validate(genre, schema);
}
module.exports = route;
