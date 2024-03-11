// Ideally we would have the following documentation for every function.

/**
 * Checks if an array is sorted based on a specified predicate.
 * 
 * @param {T[]} array - The array to check.
 * @param {(element: T) => number | string} predicate - A function that takes an element of the array and returns a value to compare.
 * @param {'asc' | 'desc'} order - The order in which to check the sorting (default is 'asc').
 * @returns {boolean} - True if the array is sorted according to the predicate and order, false otherwise.
 */
export function isSortedBy<T>(array: T[], predicate: (element: T) => number | string, order: 'asc' | 'desc' = 'desc'): boolean {
  return array.every((_, i, arr) =>
    i === 0 || (order === 'asc' ? predicate(arr[i - 1]) <= predicate(arr[i]) : predicate(arr[i - 1]) >= predicate(arr[i]))
  );
}