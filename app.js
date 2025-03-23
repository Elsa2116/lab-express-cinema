const express = require("express");
const mongoose = require("mongoose");
const hbs = require("hbs");
const app = express();

// Set up view engine
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

// Mongoose Model
const movieSchema = new mongoose.Schema({
  title: String,
  director: String,
  stars: [String],
  image: String,
  description: String,
  showtimes: [String]
});

const Movie = mongoose.model("Movie", movieSchema);

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/moviesDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Error connecting to the database", err));

// Home Route (Index Page)
app.get("/", (req, res) => {
  res.render("index");
});

// Movies List Route
app.get("/movies", (req, res) => {
  Movie.find()
    .then((movies) => {
      res.render("movies", { movies });
    })
    .catch((err) => console.log("Error fetching movies:", err));
});

// Movie Details Route
app.get("/movie/:id", (req, res) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      res.render("movie-details", { movie });
    })
    .catch((err) => console.log("Error fetching movie details:", err));
});

// Seed Route
app.get("/seed", (req, res) => {
  const movies = [
    {
      title: "Red Sparrow",
      director: "Francis Lawrence",
      stars: ["Jennifer Lawrence", "Joel Edgerton", "Matthias Schoenaerts"],
      image: "https://images-na.ssl-images-amazon.com/images/M/MV5BMTA3MDkxOTc4NDdeQTJeQWpwZ15BbWU4MDAxNzgyNTQz._V1_UX182_CR0,0,182,268_AL_.jpg",
      description: "Ballerina Dominika Egorova is recruited to 'Sparrow School,' a Russian intelligence service where she is forced to use her body as a weapon. Her first mission, targeting a C.I.A. agent, threatens to unravel the security of both nations.",
      showtimes: ["13:00", "15:30", "18:00", "20:10", "22:40"]
    },
    // Add more movies as needed...
  ];

  Movie.insertMany(movies)
    .then(() => {
      res.send("Movies have been seeded!");
    })
    .catch((err) => {
      res.send("Error seeding movies: " + err);
    });
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

