const { buildSystem } = require('./systemBuilder');
const { solve } = require('./systemSolver');


const createModel = () => {

  const estimator = {};

  const fit = data => degree => {
    const system = buildSystem(data, degree);
    const coefficients = solve(...system);
    estimator[degree] = x => coefficients.reduce((acc,c,i)=>acc+c*x**i,0);
  };

  const estimate = degree => x => estimator[degree] && estimator[degree](x);

  return {fit, estimate};
};

module.exports = {
  createModel
};