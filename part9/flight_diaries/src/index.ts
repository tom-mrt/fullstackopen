import express from 'express';
import diaryRouter from './routes/diaries';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors())

const PORT = 3000;

app.get("/ping", (_req, res) => {
  console.log("pinded here");
  res.send("pong");
});

app.use("/api/diaries", diaryRouter);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});