/* 
Provide 3 unique implementations of the following function in JavaScript.

**Input**: `n` - any integer

*Assuming this input will always produce a result lesser than `Number.MAX_SAFE_INTEGER`*.

**Output**: `return` - summation to `n`, i.e. `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`.
*/

// 1. use Gausse's mathematical formula S=n(n+1)/2
const sum_to_n_a = function (n) {
  const sum = n * (n + 1) / 2
  return sum
};

// 2. The terminal addition method, a variation of Gausse's formula, is more optimal than the if-while loop because it only runs half the loop.
const sum_to_n_b = function(n) {
    let sum = 0;
    for (let i = 1; i <= Math.floor(n/2); i++) {
        sum += i + (n - i + 1)
    }
    if (n % 2 !== 0) {
        sum += Math.floor(n / 2) + 1; // If n is odd, add the middle number
    }
    return sum;
};

// 3. use reduce(), performance is lower than loop because it has to create array but more suitable if need to calculate unique value but not change on each value
const sum_to_n_c = function(n) {
  const arr = Array.from({ length: n }, (_, i) => i + 1);
  return arr.reduce((acc, num) => acc+num,0)
};

console.log(sum_to_n_a(5))
console.log(sum_to_n_b(5))
console.log(sum_to_n_c(5))