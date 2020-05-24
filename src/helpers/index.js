const buildArray = size => new Array(size).fill('');
const deepClone = arr => arr.map(row=>[].concat(row));

const addOperator = s => s[0]==='-' ? s : '+'+s;
const getExpression = params => params.reduce((acc,el,i)=> acc + addOperator(el.toString().replace('e','E'))+'*x^'+`${i}`,'');


module.exports = {
  buildArray,
  deepClone,
  getExpression
};