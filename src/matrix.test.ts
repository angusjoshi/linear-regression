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
      [-1 / 3, 1 / 3],
      [2 / 3, 1 / 3],
    ]);
    const actualResult = a.inverse();
    expect(a.inverse().equalsWithAcceptableError(expectedResult, 0.01)).toBe(
      true,
    );
  });
});
