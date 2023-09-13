import Matrix from "ml-matrix";
import {
  LinearModel,
  scaleRows,
  sigmaLinearRegression,
  sqrtArray,
  sqrtEntries,
  unweightedLinearRegression,
  weightedLinearRegression,
} from "./linearRegression";

describe("scaleRows", () => {
  it("scales rows correctly", () => {
    const aMatrix = new Matrix([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);

    const scaledMatrix = scaleRows(aMatrix, [1, 2, 3]);
    const expectedResult = new Matrix([
      [1, 2, 3],
      [8, 10, 12],
      [21, 24, 27],
    ]);

    expect(scaledMatrix).toEqual(expectedResult);
  });

  it("throws if dimensions are mismatched", () => {
    const aMatrix = new Matrix([
      [1, 2, 3],
      [4, 5, 6],
    ]);
    const misMatchedArray = [1, 2, 3];

    expect(() => scaleRows(aMatrix, misMatchedArray)).toThrow(
      "scaleBy array must be equal in length to the number of rows of the matrix",
    );
  });
});

describe("sqrtEntries", () => {
  it("sqrts a column vector correctly", () => {
    const columnVector = Matrix.columnVector([1, 4, 9]);

    const result = sqrtEntries(columnVector);
    const expectedResult = Matrix.columnVector([1, 2, 3]);

    expect(result).toEqual(expectedResult);
  });
});

describe("sqrtArray", () => {
  it("sqrts an array correctly", () => {
    const anArray = [1, 4, 9, 16];
    const expectedResult = [1, 2, 3, 4];

    expect(sqrtArray(anArray)).toEqual(expectedResult);
  });
});

describe("weightedLinearRegression", () => {
  it("computes the correct result for n=5", () => {
    const x = Matrix.columnVector([0, 1, 2, 3, 4]);
    x.addColumn(0, [1, 1, 1, 1, 1]);

    const y = Matrix.columnVector([0.1, 2.2, 2.7, 3, 4]);
    const sigmas = [1, 1, 2, 2, 2];
    const weights = sigmas.map((sigma) => 1 / (sigma * sigma));
    const newX = Matrix.columnVector([5]);

    const result = weightedLinearRegression(x, y, newX, weights);

    const expectedResult = {
      yHat: Matrix.columnVector([5.369072]),
      yHatStandardError: [0.9723889462909812],
      betas: Matrix.columnVector([0.588144, 0.956186]),
      betaStandardErrors: [0.41868459525895235, 0.24172766377830565],
      x: Matrix.columnVector([5]),
    };

    expectResultToBeCloseTo(result, expectedResult);
  });
});

describe("sigmaLinearRegression", () => {
  it("computes the correct result for n=5", () => {
    const x = Matrix.columnVector([0, 1, 2, 3, 4]);
    x.addColumn(0, [1, 1, 1, 1, 1]);

    const y = Matrix.columnVector([0.1, 2.2, 2.7, 3, 4]);
    const sigmas = [1, 1, 2, 2, 2];
    const newX = Matrix.columnVector([5]);

    const result = sigmaLinearRegression(x, y, newX, sigmas);

    const expectedResult = {
      yHat: Matrix.columnVector([5.369072]),
      yHatStandardError: [1.9157513],
      betas: Matrix.columnVector([0.588144, 0.956186]),
      betaStandardErrors: [0.8248711, 0.4762396],
      x: Matrix.columnVector([5]),
    };

    expectResultToBeCloseTo(result, expectedResult);
  });
});

describe("unweightedLinearRegression", () => {
  it("computes the correct result for n=5", () => {
    const x = Matrix.columnVector([0, 1, 2, 3, 4]);
    x.addColumn(0, [1, 1, 1, 1, 1]);

    const y = Matrix.columnVector([0.1, 2.2, 2.7, 3, 4]);
    const sigmas = [1, 1, 2, 2, 2];
    const newX = Matrix.columnVector([5]);

    const result = unweightedLinearRegression(x, y, newX);

    const expectedResult = {
      yHat: Matrix.columnVector([4.98]),
      yHatStandardError: [0.5883309726109389],
      betas: Matrix.columnVector([0.68, 0.86]),
      betaStandardErrors: [0.43451121964800865, 0.1773884626086676],
      x: Matrix.columnVector([5]),
    };

    expectResultToBeCloseTo(result, expectedResult);
  });
});

/**
 * have to use toBeClose to rather than just toEqual due to floating point precision issues.
 * i don't know a way to do this with object deep equality testing so i test each member individually.
 **/
const expectResultToBeCloseTo = (
  result: LinearModel,
  expectedResult: LinearModel,
) => {
  expectMatricesToBeClose(result.yHat, expectedResult.yHat);
  expectArraysToBeClose(
    result.yHatStandardError,
    expectedResult.yHatStandardError,
  );
  expectMatricesToBeClose(result.betas, expectedResult.betas);
  expectArraysToBeClose(
    result.betaStandardErrors,
    expectedResult.betaStandardErrors,
  );
  expectMatricesToBeClose(result.x, expectedResult.x);
};

const expectMatricesToBeClose = (result: Matrix, expectedResult: Matrix) => {
  expect(result.rows).toEqual(expectedResult.rows);
  expect(result.columns).toEqual(expectedResult.columns);

  for (let i = 0; i < result.rows; i++) {
    for (let j = 0; j < result.columns; j++) {
      expect(result.get(i, j)).toBeCloseTo(expectedResult.get(i, j), 4);
    }
  }
};

const expectArraysToBeClose = (result: number[], expectedResult: number[]) => {
  expect(result.length).toEqual(expectedResult.length);
  result.forEach((num, index) =>
    expect(num).toBeCloseTo(expectedResult[index], 4),
  );
};
