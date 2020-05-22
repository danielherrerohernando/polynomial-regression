const buildAugmentedMatrix = (leftMatrix, rightMatrix) => leftMatrix.map((row,i)=>row.concat(rightMatrix[i]));

const triangularize = (augmentedMatrix) => {
  const n = augmentedMatrix.length;
  for (let i=0; i<n-1; i++) {
    for (let j=i+1; j<n; j++) {
      const c = augmentedMatrix[j][i]/augmentedMatrix[i][i];
      for (let k=i+1; k<n+1; k++) {
        augmentedMatrix[j][k] = augmentedMatrix[j][k] - c*augmentedMatrix[i][k];
      }
    }
  }
  return augmentedMatrix;
};

const backSubstitute = (augmentedMatrix) => {
  const x = [];
  const n = augmentedMatrix.length;
  for (let i=n-1; i>=0; i--) {
    const alreadySolvedTerms = x.reduce((acc,val,idx) => acc + val*augmentedMatrix[i][n-1-idx], 0);
    x.push((augmentedMatrix[i][n] - alreadySolvedTerms) / augmentedMatrix[i][i]);
  }
  return x.reverse();
};

const solve = (leftMatrix, rightMatrix) => backSubstitute(triangularize(buildAugmentedMatrix(leftMatrix, rightMatrix)));

module.exports = {
  solve
};