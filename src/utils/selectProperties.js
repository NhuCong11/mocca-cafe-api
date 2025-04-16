const selectProperties = (obj, props) => {
  const propsArray = props.split(' ');
  const newObj = {};
  propsArray.forEach((prop) => {
    if (obj.hasOwnProperty(prop)) {
      newObj[prop] = obj[prop];
    }
  });
  return newObj;
};

module.exports = selectProperties;
