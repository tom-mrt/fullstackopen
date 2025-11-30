import express from 'express';
import cors from "cors";
import diagnoseRouter from './routes/diagnosesRoute';
import patientRouter from './routes/patientsRoute';

const app = express();
app.use(express.json());
app.use(cors())

const PORT = 3000;

app.get("/api/ping", (_req, res) => {
  res.send("pong");
});

app.use("/api/diagnoses", diagnoseRouter);
app.use("/api/patients", patientRouter);

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
  
});