type Permutation = number[];

export function factorial(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Returns the hash of a permutation in reverse lexicographic order.
 * @param permutation
 * @returns The hash of the permutation
 */
export function hash(permutation: Permutation): number {
  const n = permutation.length;
  let index = 0;
  let factorialValue = factorial(n - 1);
  const used = Array(n).fill(false); // Track used elements

  // Traverse the permutation from left to right (big-endian logic)
  for (let i = 0; i < n; i++) {
    const currentElement = permutation[i];
    let countSmaller = 0;

    // Count how many unused elements are smaller than the current element
    for (let j = currentElement + 1; j <= n; j++) {
      if (!used[j - 1]) countSmaller++;
    }

    index += countSmaller * factorialValue;

    // Mark the current element as used
    used[currentElement - 1] = true;

    // Decrease the factorial value for the next iteration
    if (i < n - 1) {
      factorialValue /= n - 1 - i;
    }
  }

  return index;
}

export function realize(hash: number, length: number): number[] {
  const permutation = [];
  const available = Array.from({ length: length }, (_, i) => i + 1); // Elements [1, 2, ..., n]

  // Start with the factorial of (n - 1) for the first element
  let factorialValue = factorial(length);
  for (let i = 1; i <= length; i++) {
    hash %= factorialValue;
    factorialValue = factorial(length - i); // Factorial for current level
    // Determine which element to choose based on the index
    const rank = Math.floor(hash / factorialValue);

    permutation.push(available[available.length - rank - 1]); // Select element from the end
    available.splice(available.length - rank - 1, 1); // Remove the used element

    // Update the index to focus on the remainder
  }

  return permutation;
}
