const buildArray = size => new Array(size).fill('');

const buildBase = degree => buildArray(degree+1).map((_,i) => x => x**i);

const buildGramMatrix = (data, base) => buildArray(base.length)
  .map((_,i) => buildArray(base.length)
  .map((_,j) => data.reduce((acc,[x]) => acc + base[i](x)*base[j](x),0)));

const buildIndependentTerm = (data, base) => buildArray(base.length)
  .map((_,i) => [].concat(data.reduce((acc,[x,y]) => acc + base[i](x)*y,0)));

const buildSystem = (data, degree) => {
  const base = buildBase(degree);
  const gramMatrix = buildGramMatrix(data,base);
  const independentTerm = buildIndependentTerm(data,base);
  return [gramMatrix, independentTerm];
};

module.exports = {
  buildSystem
};