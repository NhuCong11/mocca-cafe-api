const removeProperties = (obj, propsToRemove) => {
  const propsRemoveArray = propsToRemove.split(' ');
  for (let prop of propsRemoveArray) {
    delete obj[prop];
  }
};

module.exports = removeProperties;
