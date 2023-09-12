import { Matrix, inverse } from "ml-matrix";

export type LinearModel = {
  yHat: Matrix;
  yHatStandardError: number[];
  betas: Matrix;
  betaStandardErrors: number[];
  x: Matrix;
};

export function weightedLinearRegression(
  x: Matrix,
  y: Matrix,
  newX: Matrix,
  weights: number[],
): LinearModel {
  const rootWeights = sqrtArray(weights);

  const weightedX = scaleRows(x, rootWeights);
  const weightedY = scaleRows(y, rootWeights);

  const weightedXT = weightedX.transpose();
  const weightedXTX = weightedXT.mmul(weightedX);

  const inverseWeightedXXT = inverse(weightedXTX);

  const beta = inverseWeightedXXT.mmul(weightedXT).mmul(weightedY);

  const residuals = Matrix.sub(y, x.mmul(beta));

  const residualsAsArray = residuals.getColumn(0);

  const errorVariance =
    arraySum(elementwiseProduct(weights, squareArray(residualsAsArray))) /
    (y.rows - x.columns);

  const covarianceMatrix = Matrix.mul(inverseWeightedXXT, errorVariance);

  const errorCoefficients = sqrtArray(covarianceMatrix.diag());

  const newXDesign = newX.clone().addColumn(0, new Array(newX.rows).fill(1));

  const newY = newXDesign.mmul(beta);

  const newYVariance = newXDesign
    .mmul(covarianceMatrix)
    .mmul(newXDesign.transpose());

  const newYStandardError = sqrtArray(newYVariance.getColumn(0));

  return {
    yHat: newY,
    yHatStandardError: newYStandardError,
    betas: beta,
    betaStandardErrors: errorCoefficients,
    x: newX,
  };
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
