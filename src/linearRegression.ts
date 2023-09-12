import Matrix from "ml-matrix";

type LinearModel = {
  // x: number;
  // yHat: number;
  // yHatStandardError: number;
  // alpha: number;
  // alphaStandardError: number;
  // beta: number;
  // betaStandardError: number;
};
export const weightedLinearRegression: LinearModel = (
  X: Matrix,
  y: Matrix,
  newX: Matrix,
  weights: number[],
) => {
  const rootWeights = weights.map((weight) => Math.sqrt(weight));

};

const sum = (nums: number[]) =>
  nums.reduce((currentSum, element) => currentSum + element, 0);
const squareArray = (array: number[]) => array.map((num) => num * num);
const elementwiseProduct = (x: number[], y: number[]) => {
  if (x.length != y.length) {
    throw new Error("arrays must be same length for element wise product");
  }

  return x.map((element, index) => element * y[index]);
};
