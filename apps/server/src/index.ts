import express from "express";
import "dotenv/config.js";
import { fetchDocuments } from "./scripts/presidentialProject";
// import "./fetches/schedule-fetch";
// import "./fetches/executive-actions";
// import "./fetches/executive-orders";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello from Express server!");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

fetchDocuments();
