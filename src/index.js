const { writeFileSync, readFileSync } = require('fs');
const { buildSystem } = require('./systemBuilder');
const { solve } = require('./systemSolver');
const { getExpression } = require('./helpers');

const createModel = () => {

  let params = {};

  const fit = (data,degrees) => {
    degrees.forEach(degree => {
      const system = buildSystem(data, degree);
      const coefficients = solve(...system);
      params[degree] = coefficients;
    });
  };

  const estimate = (degree,x) => params[degree] && params[degree].reduce((acc,c,i)=>acc+c*x**i,0);

  const loadParams = path => {
    const loadedData = JSON.parse(readFileSync(path));
    params = { ...params, ...loadedData };
  };

  const saveParams = path => writeFileSync(path, JSON.stringify(params, null, 2));

  const saveExpressions = path => {
    const paramsWithExpressions = Object.entries(params).reduce((acc,[degree,coefficients]) => {
      acc[degree] = getExpression(coefficients);
      return acc;
    },{});
    writeFileSync(path, JSON.stringify(paramsWithExpressions, null, 2));
  };

  return { fit, estimate, loadParams, saveParams, saveExpressions };
};

module.exports = {
  createModel
};