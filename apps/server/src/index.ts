import express from "express";
import "dotenv/config.js";
import "./fetches/schedule-fetch";
import "./fetches/executive-actions";
import "./fetches/executive-orders";
// import "./fetches/debt_by_day";

// Commenting out for now - most of these are not going to be meant to be ran regularily.
// import "./fetches/congress/congress";
// import "./fetches/congress/members";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello from Express server!");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
