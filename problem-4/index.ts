/**
 * 
 * @param n 
 * @returns 
 * @description
 * It has a time complexity of O(1) because it uses a mathematical formula to calculate the sum of the first n natural numbers.
 */
function sum_to_n_a(n: number): number {
  return n * (n + 1) / 2;
}

/**
 * 
 * @param n 
 * @returns 
 * @description
 * The second implementation has a time complexity of O(n) because it uses a loop to iterate through the numbers from 1 to n and sum them up.
 */
function sum_to_n_b(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

/**
 * 
 * @param n 
 * @returns 
 * @description
 * The third implementation also has a time complexity of O(n) because it uses recursion to sum up the numbers from 1 to n.
 */
function sum_to_n_c(n: number): number {
  if (n === 0) {
    return 0;
  }
  return n + sum_to_n_c(n - 1);
}

// console.log(sum_to_n_a(150));
// console.log(sum_to_n_b(150));
// console.log(sum_to_n_c(150));