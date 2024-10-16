import random from "npm:random";

export function generateUniform(
  seed: number,
  length: number,
  min: number = 0,
  max: number = 1
) {
  random.use(seed);
  const array = Array.from({ length }, () => random.float(min, max)).sort();
  return array;
}

/**
 * Generate an array of length `length`
 * with values drawn from a normal distribution with mean `mean` and standard deviation `stddev`,
 * constrained to the range `[min, max]`.
 * So not an actual normal distribution, but a truncated one.
 * @param seed
 * @param length
 * @param mean
 * @param stddev
 * @param min
 * @param max
 * @returns
 */
export function generateNormal(
  seed: number,
  length: number,
  mean: number = 0,
  stddev: number = 1,
  min: number = -Infinity,
  max: number = Infinity
) {
  random.use(seed);
  const array = [];
  const normal = random.normal(mean, stddev);
  while (array.length < length) {
    const value = normal();
    if (value >= min && value <= max) {
      array.push(value);
    }
  }
  return array.sort();
}
