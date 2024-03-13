const { createModel } = require('../src');
const { mockData01 } = require('./mockData');
const { rounder } = require('./helpers');

describe('Test basic workflow', () => {
  it('fits the model with provided data', () => {
    const model = createModel();
    model.fit(mockData01, [3]);
    expect(rounder(model.estimate(3, 4))).toBe(5);
  });

  it('supports params export', () => {
    const model = createModel();
    model.fit(mockData01, [3]);
    const params = model.saveParams();
    expect(params[3]).toBeDefined();
    expect(params[3]).toHaveLength(4);
  });

  it('supports params import', () => {
    const oldModel = createModel();
    oldModel.fit(mockData01, [3]);
    const params = oldModel.saveParams();

    const newModel = createModel();
    // no fitting
    newModel.loadParams(params);

    expect(oldModel.estimate(3, 4)).toBe(newModel.estimate(3, 4));
  });
});
