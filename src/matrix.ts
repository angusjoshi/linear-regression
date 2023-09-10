export class Matrix {
  public rows: number[][];
  constructor(rows: number[][]) {
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

  public mul(other: Matrix) {
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
    if (this.getColDimension() != this.getColDimension()) {
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
      [this.rows[0][0], -this.rows[0][1]],
    ];

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
}
