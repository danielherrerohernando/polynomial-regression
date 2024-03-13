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

  const loadParams = (loadedData) => {
    params = { ...params, ...loadedData };
  };

  const saveParams = () => params;

  const saveExpressions = () => {
    const paramsWithExpressions = Object.entries(params).reduce((acc,[degree,coefficients]) => {
      acc[degree] = getExpression(coefficients);
      return acc;
    },{});
    return paramsWithExpressions;
  };

  const expressions = () => {
    return Object.entries(params).reduce((acc,[degree,coefficients]) => {
      acc[degree] = getExpression(coefficients);
      return acc;
    },{});
  };

  return { fit, estimate, loadParams, saveParams, saveExpressions, expressions };
};

module.exports = {
  createModel
};
