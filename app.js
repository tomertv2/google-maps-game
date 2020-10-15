const express = require('express');
const fs = require('fs').promises;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/data', async (req, res) => {
  const places = await fs.readFile('./data.json');
  const parsedPlaces = JSON.parse(places);
  res.send(parsedPlaces);
});

module.exports = app;
