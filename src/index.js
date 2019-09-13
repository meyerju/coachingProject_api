console.log("Hello, world!");
// ./src/index.js

// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const {startDatabase} = require('./database/mongo');
const {insertMovie, getMovies, setFavoriteMovie, removeFavoriteMovie, getFavoriteMovies} = require('./database/movies');

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all movies
app.get('/', async (req, res) => {
  res.send(await getMovies());
});

app.get('/favorites', async (req, res) => {
  res.send(await getFavoriteMovies());
});

app.post('/', async (req, res) => {
  const newMovie = req.body;
  await insertMovie(newMovie);
  res.send({ message: 'New Movie inserted!'});
});

app.put('/favorite/:id', async (req, res) => {
  const updateMovie = req.body;
  await setFavoriteMovie(req.params.id,updateMovie);
  res.send({ message: 'Movie added to the list of favorites.'});
});

app.put('/remove_favorite/:id', async (req, res) => {
  const updateMovie = req.body;
  await removeFavoriteMovie(req.params.id,updateMovie);
  res.send({ message: 'Movie was removed from the list of favorites.'});
});

// start the in-memory MongoDB instance
startDatabase().then(async () => {
  //fill the database 
  await insertMovie({title: 'Star Wars', favorite: false});
  await insertMovie({title: 'Inception', favorite: false});
  await insertMovie({title: 'Singing in the Rain', favorite: false});
  await insertMovie({title: 'Titanic', favorite: false});

  // start the server
  app.listen(3001, async () => {
    console.log('listening on port 3001');
  });
});
