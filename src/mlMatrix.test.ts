import Matrix, { determinant, inverse, LuDecomposition } from "ml-matrix";

describe("ml-matrix", () => {
  it("is great", () => {
    const a = new Matrix([
      [1, 2],
      [4, 5],
    ]);
    const b = new Matrix([[1], [2], [3]]);

    Matrix.columnVector([1, 2, 3]);

    console.log(inverse(a));

    // console.log(a.mmul(b));b
  });
});
