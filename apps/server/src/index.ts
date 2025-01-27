import express from "express";
import "dotenv/config.js";
import { refreshLast3DaysOfSchedule } from "./fetches/schedule-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello from Express server!");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// refreshLast3DaysOfSchedule();
