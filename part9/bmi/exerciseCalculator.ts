import { isNotNumber } from './utils';

interface ExParams {
  target: number,
  exercises: number[],
}

const parseExArguments = (args: string[]): ExParams => {
  if (args.length < 4) throw new Error("パラメータが不十分です");
  if (args.slice(2).some(a => isNotNumber(a))) throw new Error("数値を入力してください。");


  const target: number = Number(args[2]);
  const exercises: number[] = args.slice(3).map(s => Number(s));

  return {
    target,
    exercises
  };
};

type Rating = 1 | 2 | 3;

interface Result {
  periodLength: number;
  trainingDays: number;
  target: number;
  average: number;
  success: boolean;
  rating: Rating;
  ratingDescription?: string;
}

export const calculateExercises = (exercises: number[], target: number, comment?: string): Result => {
  const average: number = exercises.reduce((total, num) => total + num, 0) / exercises.length;
  const trainingDays: number = exercises.filter(d => d !== 0).length;
  const success: boolean = average >= target;

  let rating: Rating = 1;

  if (!success) {
    rating = 1;
  } else if (trainingDays === exercises.length) {
    rating = 3;
  } else {
    rating = 2;
  }


  return {
    periodLength: exercises.length,
    trainingDays,
    target,
    average,
    success,
    rating,
    ratingDescription: comment
  };
};

if (require.main === module) {
  try {
    const { target, exercises } = parseExArguments(process.argv);
    console.log(calculateExercises(exercises, target));
  } catch (error: unknown) {
    let errorMessage = "something went wrong: ";
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    console.log(errorMessage);
  }
}


