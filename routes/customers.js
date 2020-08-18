const express = require("express");
const route = express.Router();
const mongoose = require("mongoose");
//Joi for validation
const Joi = require("joi");

//Creating Schema

const customersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 50,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: Number,
    required: true,
    minlength: 10,
    maxlength: 20,
  },
});

//Creating the modal
const Customers = mongoose.model("Customers", customersSchema);

//To Get Data

route.get("/", async (req, res) => {
  const customers = await Customers.find().sort("name");
  res.send(customers);
});

//Pass the Data in params
route.get("/:id", async (req, res) => {
  const customers = await Customers.findById(req.params.id);
  if (!customers) {
    res.status(404).send("Given id is not founded in data");
  }
  res.send(customers);
});

//To create new data

route.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
  }
  var customers = new Customers({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  customers = await customers.save();
  res.send(customers);
});

route.put("/:id", async (req, res) => {
  const customers = await Customers.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!customers) {
    res.status(404).send("Given id is not founded in data");
  }
  const { error } = validateCustomer(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  res.send(customers);
});

//To Delete the data

route.delete("/:id", async (req, res) => {
  const customers = await Customers.findByIdAndRemove(req.params.id);
  if (!customers) {
    res.status(404).send("The given id is not found");
    return;
  }
  res.send(customers);
});

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(4).max(50).required(),
    phone: Joi.string().min(10).max(20).required(),
    isGold: Joi.boolean(),
  };

  return Joi.validate(customer, schema);
}

module.exports = route;
