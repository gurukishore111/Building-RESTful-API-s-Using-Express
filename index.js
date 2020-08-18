const express = require("express");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const app = express();
const mongoose = require("mongoose");

//Joi for validation
const Joi = require("joi");
mongoose
  .connect("mongodb://localhost/vidly")
  .then(() =>
    console.log("====================Creating Database====================")
  )
  .catch((err) =>
    console.log("Error occur ,when connecting the database", err)
  );

app.use(express.json());

app.use(genres);
app.use("/api/customers", customers);

const port = process.env.PORT || 9000;

app.listen(port, () => console.log(`Listening the port ${port}`));
