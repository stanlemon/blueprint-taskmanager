import findOneById from "./findOneById";

describe("findOneById", () => {
  it("undefined", () => {
    expect(findOneById(undefined, undefined)).toBeNull();
  });
  it("null", () => {
    expect(findOneById(null, null)).toBeNull();
  });

  it("empty array", () => {
    expect(findOneById([], 1)).toBeNull();
  });

  it("array", () => {
    expect(findOneById([{ id: 1 }, { id: 2 }, { id: 3 }], 2)).toEqual({
      id: 2,
    });
  });

  it("array without ids", () => {
    expect(findOneById([{ value: 1 }, { value: 2 }], 2)).toBeNull();
  });
});
