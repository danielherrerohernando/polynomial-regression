const { createModel } = require('../src');
const { mockData } = require('./mockData');
const { rounder } = require('./helpers');

describe('Test basic workflow', () => {
  const model = createModel();
  it('fits the model with provided data', () => {
    model.fit(mockData)(3);
    expect(rounder(model.estimate(3)(4))).toBe(5);
  });
});