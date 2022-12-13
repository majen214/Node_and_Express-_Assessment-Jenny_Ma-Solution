const express = require("express");
const app = express();

const getZoos = require("./utils/getZoos");
const validateZip = require("./middleware/validateZip");

app.get("/zoos/all", (req, res, next) => {
  const admin = req.query.admin;
  if (admin === 'true') {
    const zoos = getZoos();
    const str = zoos.join('; ');
    res.send(`All zoos: ${str}`)
  } else {
    next('You do not have access to that route.')
  }
});

app.get("/check/:zip", validateZip, (req, res, next) => {
  const zip = req.params.zip;
  const zoos = getZoos(zip)

  if (zoos) {
    res.send(`${zip} exists in our records.`)
  } else {
    next(`${zip} does not exist in our records.`)
  }
});

app.get("/zoos/:zip", validateZip, (req, res, next) => {
  const zip = req.params.zip; 
  const zoos = getZoos(zip)
  const str = zoos.join('; ')
  if (zoos && zoos.length > 0) { // []
    res.send(`${zip} zoos: ${str}`)
  } else { // undefined
    next(`${zip} has no zoos.`)
  }
});


//error handler - to send error message back to the user
app.use((err, req, res, next) => {
  res.send(err);
});

// Not-found handler
app.use((req, res, next) => {
  res.send(`That route could not be found!`);
});

module.exports = app; 