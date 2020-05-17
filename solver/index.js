const deepClone = arr => arr.map(row=>[].concat(row));
const rounder = n => Math.round(n*10000000000)/10000000000;

const triangularize = (matrix, indep) => {
  const m = deepClone(matrix);
  const b = deepClone(indep);
  const n = m.length;
  for (let i=0; i<n-1; i++) {
    for (let j=i+1; j<n; j++) {
      const c = m[j][i]/m[i][i];
      for (let k=i+1; k<n; k++) {
        m[j][k] = m[j][k] - c*m[i][k];
      }
      b[j][0] = b[j][0] - c*b[i][0];
    }
  }
  return [m,b];
};

const backSubstitute = (matrix, indep) => {
  const n = matrix.length;
  const x = [];
  for (let i=n-1; i>=0; i--) {
    const minus = x.reduce((acc,val,idx)=>acc+=val*matrix[i][n-1-idx],0);
    const sol = (indep[i][0] - minus)/matrix[i][i];
    x.push(sol);
  }
  return x.reverse();
};

const solve = (coefficients, independent) => backSubstitute(...triangularize(coefficients, independent));

module.exports = {
  solve
};