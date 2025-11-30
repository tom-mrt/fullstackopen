import { isNotNumber } from './utils';

interface BodyParams {
  height: number,
  weight: number
}

const parseArguments = (args: string[]): BodyParams => {
  if (args.length !== 4) {
    throw new Error("パラメータ数は2つです。");
  }

  if (!isNotNumber(args[2]) && !isNotNumber(args[3])) {
    return {
      height: Number(args[2]),
      weight: Number(args[3])
    };
  } else {
    throw new Error("数値を入力してください");
  }
};


export const calculateBmi = (height: number, weight: number): string => {
  if (height === 0) {
    throw new Error("dividing by zero is not allowed");
  }

  const bmi: number = weight / ((height / 100)**2);
  console.log(bmi);
  
  
  if (bmi < 18.5) {
    return "too light";
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    return "normal range";
  } else if (bmi > 24.9 && bmi < 30) {
    return "too fat";
  } else {
    return "himan";
  }
};

if (require.main === module) {
  try {
    const { height, weight } = parseArguments(process.argv);
    console.log(calculateBmi(height, weight));
  } catch (error: unknown) {
    let errorMessage = "something went wrong: ";
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    console.log(errorMessage);
    
  }
};
