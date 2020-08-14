const express = require("express");
const { join } = require("path");
const app = express();
//Joi for validation
const Joi = require("joi");

app.use(express.json());

const movies = [
  {
    id: "1",
    name: "Action",
  },
  {
    id: "2",
    name: "Action",
  },
  {
    id: "3",
    name: "Thriller",
  },
  {
    id: "4",
    name: "Comedy",
  },
  {
    id: "5",
    name: "Comedy",
  },
];

//To Get Data
app.get("/", (req, res) => {
  res.send("Hello Vidly");
});

app.get("/api/moives", (req, res) => {
  res.send(movies);
});

//Pass the Data in params
app.get("/api/moives/:id", (req, res) => {
  const moive = movies.find((c) => c.id === req.params.id);
  if (!moive) {
    res.status(404).send("Given id is not founded in data");
  }
  res.send(moive);
});

//To create new data

app.post("/api/moives", (req, res) => {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  const result = Joi.validate(req.body, schema);

  console.log("====================================");
  console.log(result);
  console.log("====================================");

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
  }
  const moive = {
    id: movies.length + 1,
    name: req.body.name,
  };
  movies.push(moive);
  res.send(moive);
});

//To update the Data

app.put("/api/moives/:id", (req, res) => {
  const moive = movies.find((c) => c.id === req.params.id);
  if (!moive) {
    res.status(404).send("Given id is not founded in data");
  }
  const schema = {
    name: Joi.string().min(3).required(),
  };

  const result = Joi.validate(req.body, schema);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  moive.name = req.body.name;
  res.send(moive);
});

//To Delete the data

app.delete("/api/moives/:id", (req, res) => {
  const moive = movies.find((c) => c.id === req.params.id);
  if (!moive) {
    res.status(404).send("The given id is not found");
    return;
  }

  const index = movies.indexOf(moive);
  movies.splice(index, 1);

  res.send(moive);
});

const port = process.env.PORT || 9000;

app.listen(port, () => console.log(`Listening the port ${port}`));
