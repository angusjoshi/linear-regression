import { Matrix } from "./matrix";

describe("constructor", () => {
  it("constructs square matrix correctly", () => {
    const rows = [
      [1, 2],
      [3, 4],
    ];
    const theMatrix = new Matrix(rows);

    expect(theMatrix.rows).toEqual(rows);
    expect(theMatrix.getColDimension()).toEqual(2);
    expect(theMatrix.getRowDimension()).toEqual(2);
  });

  it("constructs rectangular matrix correctly", () => {
    const rows = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];
    const theMatrix = new Matrix(rows);

    expect(theMatrix.rows).toEqual(rows);
    expect(theMatrix.getColDimension()).toEqual(2);
    expect(theMatrix.getRowDimension()).toEqual(3);
  });

  it("throws if rows are not uniform in length", () => {
    const unevenRows = [
      [1, 2, 3],
      [4, 5],
    ];
    expect(() => new Matrix(unevenRows)).toThrow(
      "Matrix must have rows with equal length",
    );
  });
});

describe("scale", () => {
  it("scales a matrix correctly", () => {
    const a = new Matrix([
      [1, 2, 3],
      [4, 5, 6],
    ]);

    const expectedResult = new Matrix([
      [2, 4, 6],
      [8, 10, 12],
    ]);

    expect(a.scale(2).equals(expectedResult)).toBe(true);
  });
});
describe("equals", () => {
  it("returns true for equal square matrices", () => {
    const leftMatrix = new Matrix([
      [1, 2],
      [3, 4],
    ]);
    const rightMatrix = new Matrix([
      [1, 2],
      [3, 4],
    ]);

    expect(leftMatrix.equals(rightMatrix)).toBe(true);
  });

  it("returns true for equal rectangular matrices", () => {
    const leftMatrix = new Matrix([
      [1, 2, 3],
      [3, 4, 5],
    ]);
    const rightMatrix = new Matrix([
      [1, 2, 3],
      [3, 4, 5],
    ]);

    expect(leftMatrix.equals(rightMatrix)).toBe(true);
  });

  it("returns false for similar dimension matrices with different entries", () => {
    const leftMatrix = new Matrix([
      [1, 2],
      [3, 4],
    ]);
    const rightMatrix = new Matrix([
      [1, 1],
      [3, 4],
    ]);

    expect(leftMatrix.equals(rightMatrix)).toBe(false);
  });

  it("returns false for matrices with different dimensions", () => {
    const leftMatrix = new Matrix([
      [1, 2],
      [3, 4],
    ]);
    const rightMatrix = new Matrix([
      [1, 2, 3],
      [3, 4, 5],
    ]);

    expect(leftMatrix.equals(rightMatrix)).toBe(false);
  });
});

describe("mul", () => {
  it("computes correct result for square 2x2 matrix multiplication", () => {
    const left = new Matrix([
      [1, 2],
      [3, 4],
    ]);
    const right = new Matrix([
      [4, 5],
      [6, 7],
    ]);

    const expectedResult = new Matrix([
      [16, 19],
      [36, 43],
    ]);

    expect(left.mul(right).equals(expectedResult)).toBe(true);
  });

  it("computes the correct result for valid rectangular matrices", () => {
    const left = new Matrix([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
    const right = new Matrix([
      [1, 2, 3],
      [4, 5, 6],
    ]);

    const expectedResult = new Matrix([
      [9, 12, 15],
      [19, 26, 33],
      [29, 40, 51],
    ]);

    expect(left.mul(right).equals(expectedResult)).toBe(true);
  });

  it("throws if dimensions are not valid", () => {
    const left = new Matrix([
      [1, 2, 3],
      [4, 5, 6],
    ]);
    const right = new Matrix([
      [1, 2, 3],
      [4, 5, 6],
    ]);

    expect(() => left.mul(right)).toThrow(
      "Incompatible matrix dimension for multiplication",
    );
  });
});

describe("inverse", () => {
  it("correctly computes inverse of a 2x2 non-singular matrix", () => {
    const a = new Matrix([
      [1, 2],
      [1, -1],
    ]);

    const expectedResult = new Matrix([
      [1 / 3, 1 / 3],
      [2 / 3, -1 / 3],
    ]);
    expect(a.inverse().equalsWithAcceptableError(expectedResult, 0.001)).toBe(
      true,
    );
  });

  it("throws if the matrix is non-singular", () => {
    const a = new Matrix([
      [1, 1],
      [1, 1],
    ]);
    expect(() => a.inverse()).toThrow(
      "The matrix is singular and cannot be inverted",
    );
  });

  it("throws if the matrix is not square", () => {
    const a = new Matrix([
      [1, 2, 3],
      [4, 5, 6],
    ]);

    expect(() => a.inverse()).toThrow("Cannot invert non-square matrix");
  });
});

describe("add", () => {
  it("adds matrices with the same dimension correctly", () => {
    const a = new Matrix([
      [1, 2],
      [3, 4],
    ]);
    const b = new Matrix([
      [5, 6],
      [7, 8],
    ]);

    const expectedResult = new Matrix([
      [6, 8],
      [10, 12],
    ]);

    expect(a.add(b).equals(expectedResult)).toBe(true);
  });

  it("throws if the matrices have differing dimensions", () => {
    const a = new Matrix([
      [1, 2, 3],
      [4, 5, 6],
    ]);
    const b = new Matrix([
      [1, 2],
      [3, 4],
    ]);

    expect(() => a.add(b)).toThrow(
      "Cannot add matrices with differing dimensions",
    );
  });
});
describe("sub", () => {
  it("subtracts matrices with the same dimension correctly", () => {
    const a = new Matrix([
      [1, 2],
      [3, 4],
    ]);
    const b = new Matrix([
      [5, 6],
      [7, 8],
    ]);

    const expectedResult = new Matrix([
      [-4, -4],
      [-4, -4],
    ]);

    expect(a.sub(b).equals(expectedResult)).toBe(true);
  });

  it("throws if the matrices have differing dimensions", () => {
    const a = new Matrix([
      [1, 2, 3],
      [4, 5, 6],
    ]);
    const b = new Matrix([
      [1, 2],
      [3, 4],
    ]);

    expect(() => a.sub(b)).toThrow(
      "Cannot subtract matrices with differing dimensions",
    );
  });
});

describe("transpose", () => {
  it("transposes square matrix correctly", () => {
    const a = new Matrix([
      [1, 2],
      [3, 4],
    ]);

    const expectedResult = new Matrix([
      [1, 3],
      [2, 4],
    ]);

    expect(a.transpose().equals(expectedResult)).toBe(true);
  });

  it("transposes rectangular matrix correctly", () => {
    const a = new Matrix([
      [1, 2, 3],
      [3, 4, 5],
    ]);

    const expectedResult = new Matrix([
      [1, 3],
      [2, 4],
      [3, 5],
    ]);

    expect(a.transpose().equals(expectedResult)).toBe(true);
  });
});

describe("scaleRows", () => {
  it("scales rows of square matrix correctly", () => {
    const a = new Matrix([
      [1, 2],
      [3, 4],
    ]);
    const scalingFactors = [2, 3];

    const expectedResult = new Matrix([
      [2, 4],
      [9, 12],
    ]);

    expect(a.scaleRows(scalingFactors).equals(expectedResult)).toBe(true);
  });

  it("scales rows of rectangular matrix correctly", () => {
    const a = new Matrix([
      [1, 2, 3],
      [3, 4, 5],
    ]);
    const scalingFactors = [2, 3];

    const expectedResult = new Matrix([
      [2, 4, 6],
      [9, 12, 15],
    ]);

    expect(a.scaleRows(scalingFactors).equals(expectedResult)).toBe(true);
  });

  it("throws if the length of scaling factors is not equal to the row dimension", () => {
    const a = new Matrix([
      [1, 2, 3],
      [3, 4, 5],
      [5, 1, 3],
    ]);

    const scalingFactors = [1, 2];

    expect(() => a.scaleRows(scalingFactors)).toThrow(
      "scaling factors array must be the same length as the row dimension of the matrix",
    );
  });
});
