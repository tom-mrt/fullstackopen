import express from "express";
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  // パラメータ不足、型間違いへの対応
  if (Object.keys(req.query).length !== 2) throw new Error("パラメータの数が不足");

  const height: number = Number(req.query.height);
  const weight: number = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight)) throw new Error("パラメータの型が不正");
  
  try {
    const bmi: string = calculateBmi(height, weight);
    res.status(200).json({ height, weight, bmi });
  } catch (error: unknown) {
    let errorMessage = "something went wrong: ";
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    console.log(errorMessage);
  }
});

app.post("/exercises", (req, res) => {
  if (Object.keys(req.body).length !== 2) {
    res.status(400).send({ error: "パラメータ数が不十分です"});
  };

  const { daily_exercises, target } = req.body;

  if (daily_exercises.some((n: any) => isNaN(Number(n))) || isNaN(Number(target))) {
    res.status(400).send({ error: "パラメータには数値を入力して。"});
  }

  const result = calculateExercises(daily_exercises, target);

  return res.send({ result });

});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});


