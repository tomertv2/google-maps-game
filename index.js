const express = require('express');
const app = require('./app');
const port = 8080;

// app.use('/', express.static(__dirname + '/index.html'));

// app.use('/index', express.static(__dirname + '/index.html'));

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
