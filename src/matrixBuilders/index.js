const buildTransformations = degree => new Array(degree+1).fill('').map((_,i)=>x=>x**i);

const buildGramMatrix = (data, transformations) => {
  const m = [];
  const cache = {};
  for (let i=0; i<transformations.length; i++) {
    m[i] = [];
    for (let j=0; j<transformations.length; j++) {
      const id = [i,j].sort().join('');
      m[i][j] = cache[id] || data.reduce((acc,[x])=> acc + transformations[i](x)*transformations[j](x),0);
      cache[id] = m[i][j];
    }
  }
  return m;
};

const buildIndependentTerm = (data, transformations) => {
  const m = [];
  for (let i=0; i<transformations.length; i++) {
    m[i] = [];
    m[i][0] = data.reduce((acc,[x,y])=> acc + transformations[i](x)*y,0);
  }
  return m;
};

module.exports = {
  buildTransformations,
  buildGramMatrix,
  buildIndependentTerm
};