import { Matrix, inverse } from "ml-matrix";

export type LinearModel = {
  yHat: Matrix;
  yHatStandardError: number[];
  betas: Matrix;
  betaStandardErrors: number[];
  x: Matrix;
};

type RegressionType = "SIGMA" | "WEIGHTED";

function linearRegression(
  x: Matrix,
  y: Matrix,
  weights: number[],
  newX: Matrix,
  regressionType: RegressionType,
): LinearModel {
  const rootWeights = sqrtArray(weights);
  const weightedX = scaleRows(x, rootWeights);
  const weightedY = scaleRows(y, rootWeights);
  const weightedXT = weightedX.transpose();
  const weightedXTX = weightedXT.mmul(weightedX);
  const inverseWeightedXTX = inverse(weightedXTX);
  const betas = inverseWeightedXTX.mmul(weightedXT).mmul(weightedY);
  const residuals = Matrix.sub(y, x.mmul(betas));
  const residualsAsArray = residuals.getColumn(0);

  const errorVariance =
    regressionType === "WEIGHTED"
      ? arraySum(elementwiseProduct(weights, squareArray(residualsAsArray))) /
        (y.rows - x.columns)
      : 1;

  const covarianceMatrix = Matrix.mul(inverseWeightedXTX, errorVariance);
  const errorCoefficients = sqrtArray(covarianceMatrix.diag());
  const newXDesign = newX.clone().addColumn(0, new Array(newX.rows).fill(1));
  const newY = newXDesign.mmul(betas);
  const newYVariance = newXDesign
    .mmul(covarianceMatrix)
    .mmul(newXDesign.transpose());
  const newYStandardError = sqrtArray(newYVariance.getColumn(0));

  return {
    x: newX,
    yHat: newY,
    yHatStandardError: newYStandardError,
    betas: betas,
    betaStandardErrors: errorCoefficients,
  };
}

export function weightedLinearRegression(
  x: Matrix,
  y: Matrix,
  newX: Matrix,
  weights: number[],
): LinearModel {
  return linearRegression(x, y, weights, newX, "WEIGHTED");
}

export function sigmaLinearRegression(
  x: Matrix,
  y: Matrix,
  newX: Matrix,
  sigmas: number[],
): LinearModel {
  const weights = sigmas.map((sigma) => 1 / (sigma * sigma));
  return linearRegression(x, y, weights, newX, "SIGMA");
}

export function unweightedLinearRegression(x: Matrix, y: Matrix, newX: Matrix) {
  const weights = new Array(x.rows).fill(1);
  return linearRegression(x, y, weights, newX, "WEIGHTED");
}

export const scaleRows = (theMatrix: Matrix, scaleBy: number[]) => {
  if (scaleBy.length !== theMatrix.rows) {
    throw new Error(
      "scaleBy array must be equal in length to the number of rows of the matrix",
    );
  }

  const newMatrix = theMatrix.clone();

  scaleBy.forEach((scale, index) => {
    newMatrix.mulRow(index, scale);
  });
  return newMatrix;
};

const arraySum = (a: number[]) => {
  return a.reduce((currentSum, num) => currentSum + num, 0);
};

const elementwiseProduct = (a: number[], b: number[]) => {
  if (a.length !== b.length) {
    throw new Error("arrays must be same length for elementiwse product");
  }

  return a.map((num, index) => num * b[index]);
};

export const squareArray = (nums: number[]) => {
  return nums.map((num) => num * num);
};
export const sqrtArray = (nums: number[]) => {
  return nums.map((num) => Math.sqrt(num));
};

export const sqrtEntries = (theMatrix: Matrix) => {
  const newMatrix = new Matrix(theMatrix);
  newMatrix.apply((rowIndex, colIndex) => {
    newMatrix.set(
      rowIndex,
      colIndex,
      Math.sqrt(newMatrix.get(rowIndex, colIndex)),
    );
  });

  return newMatrix;
};
