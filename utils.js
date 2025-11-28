export function fixZero(n) {
  return Object.is(n, -0) ? 0 : n;
}
