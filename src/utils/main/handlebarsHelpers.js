export const helpers = {
  eq: (a, b) => a == b,
  add: (a, b) => a + b,
  sub: (a, b) => {
    const result = a - b;
    return result < 0 ? 0 : result;
  },
};
