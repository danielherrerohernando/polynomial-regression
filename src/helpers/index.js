const buildArray = size => new Array(size).fill('');
const deepClone = arr => arr.map(row=>[].concat(row));

module.exports = {
  buildArray,
  deepClone
};