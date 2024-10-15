import { factorial, hash, realize } from "./permutation.ts";
import { assertEquals, assert } from "jsr:@std/assert";

Deno.test("Factorial: ", async (test) => {
  const factorials = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800];
  for (let i = 0; i < factorials.length; i++) {
    await test.step(`Factorial of ${i} is ${factorials[i]}`, () => {
      assertEquals(factorial(i), factorials[i]);
    });
  }
});

Deno.test("Realize: required length", () => {
  for (let requiredLength = 1; requiredLength < 8; requiredLength++) {
    for (let hash = 0; hash < factorial(requiredLength); hash++) {
      const realized = realize(hash, requiredLength);
      assertEquals(realized.length, requiredLength);
      assertEquals(
        realized.sort(),
        Array.from({ length: requiredLength }, (_, i) => i + 1)
      );
    }
  }
});

Deno.test("hash and realize for all permutations of array size 3", () => {
  const permutations = [
    [1, 2, 3],
    [1, 3, 2],
    [2, 1, 3],
    [2, 3, 1],
    [3, 1, 2],
    [3, 2, 1],
  ];

  const hashes = new Set<number>();

  for (const perm of permutations) {
    const h = hash(perm);
    assert(!hashes.has(h), `Collision detected for hash ${h}`);
    hashes.add(h);
    const realized = realize(h, perm.length);
    assertEquals(realized, perm);
  }
});

Deno.test("random arrays hash and realize consistency", () => {
  const getRandomArray = (length: number) => {
    const array = Array.from({ length }, (_, i) => i + 1);
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  for (let i = 0; i < 1000; i++) {
    const length = Math.floor(Math.random() * 10) + 1;
    const randomArray = getRandomArray(length);
    const h = hash(randomArray);
    const realized = realize(h, length);
    assertEquals(realized, randomArray);
  }
});

Deno.test("hash of smaller arrays (tails) are consistent", async (test) => {
  for (let testHash = 0; testHash < factorial(8); testHash++) {
    const baseArray = realize(testHash, 10);
    while (baseArray.length > 1) {
      // Contains all the element from 1 to length
      if (
        baseArray.sort().filter((v, i) => v === i).length === baseArray.length
      ) {
        assertEquals(hash(baseArray), testHash);
        baseArray.shift();
      } else break;
    }
  }
});
