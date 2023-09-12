import { Matrix } from "./matrix";

export class ColumnVector extends Matrix {
  constructor(coordinates: number[]) {
    super(coordinates.map((coordinate) => [coordinate]));
  }

  private getCoordinates() {
    return this.rows.flat();
  }

  public coordinatewiseProduct(other: ColumnVector) {
    if (this.getRowDimension() != other.getRowDimension()) {
      throw new Error(
        "Column vectors must have equal dimension to coordinatewise multiply",
      );
    }

    const newCoordinates = arrayElementwiseProduct(
      this.getCoordinates(),
      other.getCoordinates(),
    );

    return new ColumnVector(newCoordinates);
  }
}
const arrayElementwiseProduct = (x: number[], y: number[]) => {
  if (x.length != y.length) {
    throw new Error("arrays must be same length for element wise product");
  }

  return x.map((element, index) => element * y[index]);
};
