const express = require('express');
const cors = require('cors');

const app = express();

//CONFIG JSON RESPONSE
app.use(express.json());

//SOLVER CORS
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

//PUBLIC FOLDER FOR IMAGE
app.use(express.static('public'));

//ROUTES


app.listen(5000);