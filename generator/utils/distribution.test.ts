import { generateUniform, generateNormal } from "./distribution.ts";
import { assertEquals, assert } from "jsr:@std/assert";

/**
 * Generate a sequence of length length of number
 * @param length
 */
type seededGenerator = (length: number) => number[];

/**
 * Generate a sequence of length length of number for a given seed
 * @param seed
 * @param length
 */
type AnonymousGenerator = (seed: number, length: number) => number[];

function correctLength(generator: seededGenerator, length: number) {
  const values = generator(length);
  assertEquals(values.length, length);
}

function arraySorted(generator: seededGenerator, length: number) {
  const values = generator(length);
  for (let i = 1; i < values.length; i++) {
    assert(values[i - 1] <= values[i]);
  }
}

function correctRange(
  generator: seededGenerator,
  length: number,
  min: number,
  max: number
) {
  const values = generator(length);
  for (const value of values) {
    assert(value >= min);
    assert(value <= max);
  }
}

Deno.test("distribution: generateUniform", async (test) => {
  const generator = (seed: number, length: number) =>
    generateUniform(seed, length);
  await testGenerator(test, generator, 0, 1);
});

Deno.test("distribution: generateNormal", async (test) => {
  for (let i = 0; i < 10; i++) {
    const mean = Math.random();
    const stddev = Math.random();
    const generator = (seed: number, length: number) =>
      generateNormal(seed, length, mean, stddev, 0, 1);
    await testGenerator(test, generator, 0, 1);
  }
});

async function testGenerator(
  test: Deno.TestContext,
  generator: AnonymousGenerator,
  min: number,
  max: number
) {
  await test.step("length", () => {
    for (let length = 1; length < 10; length++) {
      for (let i = 0; i < 1000; i++)
        correctLength((length) => generator(i, length), length);
    }
  });
  await test.step("values are sorted", () => {
    for (let length = 1; length < 10; length++) {
      for (let i = 0; i < 1000; i++)
        arraySorted((length) => generator(i, length), length);
    }
  });
  await test.step("values are consistent for a given seed", () => {
    for (let length = 1; length < 10; length++) {
      for (let seed = 0; seed < 1000; seed++) {
        const values1 = generator(seed, 10);
        const values2 = generator(seed, 10);
        assertEquals(values1, values2);
      }
    }
  });
  await test.step("range", () => {
    for (let length = 1; length < 10; length++) {
      for (let i = 0; i < 1000; i++)
        correctRange((length) => generator(i, length), length, min, max);
    }
  });
}
