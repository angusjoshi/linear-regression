import {ColumnVector} from "./columnVector";

describe('constructor', () => {
  it('constructs a column vector correctly', () => {
    const aVector = new ColumnVector([1, 2, 3]);

    expect(aVector.rows).toEqual([[1], [2], [3]]);
  })
})