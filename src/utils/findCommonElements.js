const findCommonElements = (arr1, arr2) => {
  const setArr1 = new Set(arr1);

  const commonElements = arr2.filter((item) => setArr1.has(item));

  return [...new Set(commonElements)];
};

module.exports = findCommonElements;
