export class Matrix {
  public rows: number[][];
  constructor(rows: number[][]) {
    if (rows.length === 0) {
      this.rows = [];
      return;
    }

    const columnDimension = rows[0].length;
    if (!rows.every((row) => row.length == columnDimension)) {
      throw new Error("Matrix must have rows with equal length");
    }

    this.rows = rows.map((row) => [...row]);
  }

  public getColDimension = () => {
    if (this.rows.length === 0) {
      return 0;
    }

    return this.rows[0].length;
  };

  public getRowDimension = () => {
    return this.rows.length;
  };

  public prettyPrint() {
    console.log(
      "[" + this.rows.map((row) => row.join(", ")).join("]\n[") + "]",
    );
  }

  private getMulRows(other: Matrix) {
    if (this.getColDimension() != other.getRowDimension()) {
      throw new Error("Incompatible matrix dimension for multiplication");
    }

    const resultRowDimension = this.getRowDimension();
    const middleDimension = this.getColDimension();
    const resultColumnDimension = other.getColDimension();

    const resultRows = [];

    for (let i = 0; i < resultRowDimension; i++) {
      const currentRow = [];
      for (let j = 0; j < resultColumnDimension; j++) {
        let currentSum = 0;
        for (let k = 0; k < middleDimension; k++) {
          currentSum += this.rows[i][k] * other.rows[k][j];
        }
        currentRow.push(currentSum);
      }
      resultRows.push(currentRow);
    }

    return resultRows;
  }
  public mul(other: Matrix) {
    const resultRows = this.getMulRows(other);

    return new Matrix(resultRows);
  }

  public copy() {
    return new Matrix(this.rows.map((row) => [...row]));
  }

  public equalsWithAcceptableError(other: Matrix, acceptableError: number) {
    if (this.getRowDimension() != other.getRowDimension()) {
      return false;
    }
    if (this.getColDimension() != other.getColDimension()) {
      return false;
    }

    for (let i = 0; i < this.getRowDimension(); i++) {
      for (let j = 0; j < this.getColDimension(); j++) {
        const difference = Math.abs(this.rows[i][j] - other.rows[i][j]);
        if (difference > acceptableError) {
          return false;
        }
      }
    }

    return true;
  }
  public equals(other: Matrix) {
    return this.equalsWithAcceptableError(other, 0);
  }

  public det() {
    return 0;
  }
  public inverse() {
    if (this.getColDimension() != this.getRowDimension()) {
      throw new Error("Cannot invert non-square matrix");
    }

    if (this.getRowDimension() != 2) {
      // TODO implement inversion for larger matrices
      throw new Error("Inversion is currently only supported for 2x2 matrices");
    }

    const det =
      this.rows[0][0] * this.rows[1][1] - this.rows[0][1] * this.rows[1][0];

    if (det == 0) {
      throw new Error("The matrix is singular and cannot be inverted");
    }

    const newRows = [
      [this.rows[1][1], -this.rows[1][0]],
      [-this.rows[0][1], this.rows[0][0]],
    ];

    return new Matrix(newRows).scale(1 / det);
  }

  private isSameDimension(other: Matrix) {
    const hasSameRowDimension =
      this.getRowDimension() == other.getRowDimension();
    const hasSameColDimension =
      this.getColDimension() == other.getColDimension();

    return hasSameRowDimension && hasSameColDimension;
  }
  public add(other: Matrix) {
    if (!this.isSameDimension(other)) {
      throw new Error("Cannot add matrices with differing dimensions");
    }

    const newRows = this.rows.map((row, rowIndex) => {
      return Matrix.addRows(row, other.rows[rowIndex]);
    });

    return new Matrix(newRows);
  }

  public sqrt() {
    const newRows = this.rows.map((row) => {
      return row.map((entry) => Math.sqrt(entry));
    });

    return new Matrix(newRows);
  }

  public sub(other: Matrix) {
    if (!this.isSameDimension(other)) {
      throw new Error("Cannot subtract matrices with differing dimensions");
    }

    const newRows = this.rows.map((row, rowIndex) => {
      return Matrix.subRows(row, other.rows[rowIndex]);
    });

    return new Matrix(newRows);
  }

  public scale(scalingFactor: number) {
    const newRows = this.rows.map((row) =>
      row.map((entry) => entry * scalingFactor),
    );
    return new Matrix(newRows);
  }

  public scaleRows(scalingFactors: number[]) {
    if (scalingFactors.length != this.getRowDimension()) {
      throw new Error(
        "scaling factors array must be the same length as the row dimension of the matrix",
      );
    }

    const newRows = this.rows.map((row, rowIndex) =>
      row.map((entry) => entry * scalingFactors[rowIndex]),
    );

    return new Matrix(newRows);
  }

  public transpose() {
    const newRows = [];
    for (let j = 0; j < this.getColDimension(); j++) {
      const newRow = [];
      for (let i = 0; i < this.getRowDimension(); i++) {
        newRow.push(this.rows[i][j]);
      }
      newRows.push(newRow);
    }

    return new Matrix(newRows);
  }

  private swapRows(a: number, b: number) {
    const temp = this.rows[a];
    this.rows[a] = this.rows[b];
    this.rows[b] = temp;
  }
  private static scaleRow(row: number[], scalingFactor: number) {
    return row.map((num) => num * scalingFactor);
  }

  private static addRows(left: number[], right: number[]) {
    return left.map((entry, index) => entry + right[index]);
  }

  private static subRows(left: number[], right: number[]) {
    return left.map((entry, index) => entry - right[index]);
  }

  public static fromColumnVector(columnVector: number[]) {
    return new Matrix(columnVector.map((entry) => [entry]));
  }

  public static fromRowVector(rowVector: number[]) {
    return new Matrix([rowVector]);
  }
}
