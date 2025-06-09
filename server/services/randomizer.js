export const getRandomElement = (arr) => {
  // Generate a random index between 0 (inclusive) and the array's length (exclusive)
  const randomIndex = Math.floor(Math.random() * arr.length);

  // Return the element at the random index
  return arr[randomIndex];
};

// Example usage:
// const myList = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
// const randomItem = getRandomElement(myList);
// console.log(randomItem);
