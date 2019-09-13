// ./src/database/movies.js
const {getDatabase} = require('./mongo');
var ObjectID = require('mongodb').ObjectID;

const collectionName = 'movies';

async function insertMovie(movie) {
  const database = await getDatabase();
  const {insertedId} = await database.collection(collectionName).insertOne(movie);
  return insertedId;
}

async function getMovies() {
  const database = await getDatabase();
  return await database.collection(collectionName).find({}).toArray();
}

async function setFavoriteMovie(id, movie) {
  const database = await getDatabase();
  delete movie._id;
  await database.collection(collectionName).update(
    { _id: new ObjectID(id), },
    {
      $set: {
        ...movie,
        favorite: true
      },
    },
  );
}

async function removeFavoriteMovie(id, movie) {
  const database = await getDatabase();
  delete movie._id;
  await database.collection(collectionName).update(
    { _id: new ObjectID(id), },
    {
      $set: {
        ...movie,
        favorite: false
      },
    },
  );
}


async function getFavoriteMovies() {
  const database = await getDatabase();
  return await database.collection(collectionName).find({favorite: true}).toArray();
}

module.exports = {
  insertMovie,
  getMovies,
  setFavoriteMovie,
  removeFavoriteMovie, 
  getFavoriteMovies
};
