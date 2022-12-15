//importa o express
const express = require('express');
const cors = require('cors');

//inicializa o express
const app = express();

//CONFIG JSON RESPONSE
app.use(express.json());

//SOLVER CORS
app.use(cors());

//PUBLIC FOLDER FOR IMAGE
app.use(express.static('public'));

//ROUTES
const UserRoutes = require('./routes/UserRoutes');
const PetRoutes = require('./routes/PetRoutes');
app.use('/users', UserRoutes);
app.use('/pets', PetRoutes);

//roda o servidor na porta 5000
app.listen(5000);