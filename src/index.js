const { buildTransformations, buildGramMatrix, buildIndependentTerm } = require('./matrixBuilders');
const { solve } = require('./systemSolver');


const createModel = () => {

  const estimator = {
    0: x => x
  };

  const fit = data => degree => {
    const base = buildTransformations(degree);
    const gramMatrix = buildGramMatrix(data,base);
    const independentTerm = buildIndependentTerm(data,base);
    const coefficients = solve(gramMatrix,independentTerm);
    estimator[degree] = x => coefficients.reduce((acc,c,i)=>acc+c*x**i,0);
  };

  const estimate = degree => x => estimator[degree] && estimator[degree](x);

  return {fit, estimate};
};

module.exports = {
  createModel
};