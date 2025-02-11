/* 
Provide 3 unique implementations of the following function in JavaScript.

**Input**: `n` - any integer

*Assuming this input will always produce a result lesser than `Number.MAX_SAFE_INTEGER`*.

**Output**: `return` - summation to `n`, i.e. `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`.
*/

// 1. sử dụng công thức toán học Gausse S=n(n+1)/2
const sum_to_n_a = function (n) {
  const sum = n * (n + 1) / 2
  return sum
};

// 2. Phương pháp cộng đầu cuối, biến thể của công thức Gausse, tối ưu hơn vòng lặp thông thường vì chỉ chạy nửa vòng lặp
const sum_to_n_b = function(n) {
    let sum = 0;
    for (let i = 1; i <= Math.floor(n/2); i++) {
        sum += i + (n - i + 1)
    }
    if (n % 2 !== 0) {
        sum += Math.floor(n / 2) + 1; // Nếu n lẻ, cộng phần giữa
    }
    return sum;
};

// 3. sử dụng reduce(), hiệu suất thấp hơn vòng lặp vì phải tạo mảng nhưng phù hợp hơn nếu cần tính giá trị duy nhất chứ ko thay đổi trên từng giá trị
const sum_to_n_c = function(n) {
  const arr = Array.from({ length: n }, (_, i) => i + 1);
  return arr.reduce((acc, num) => acc+num,0)
};

console.log(sum_to_n_a(5))
console.log(sum_to_n_b(5))
console.log(sum_to_n_c(5))