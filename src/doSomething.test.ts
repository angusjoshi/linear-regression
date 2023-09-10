import { describe, expect, it } from "bun:test";
import { one } from "./one";

describe("one", () => {
  it("equals 1", () => {
    expect(one()).toEqual(1);
  });
});
