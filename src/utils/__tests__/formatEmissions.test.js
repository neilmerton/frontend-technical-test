import formatEmissions from '../formatEmissions';

describe('formatEmissions Tests', () => {
  it('Should substitute the value into the template', () => {
    const emissions = { template: 'CO2 Emissions $value g/km', value: 234 };

    expect(formatEmissions(emissions)).toEqual('CO2 Emissions 234 g/km');
  });

  it('Should handle a zero value', () => {
    const emissions = { template: 'CO2 Emissions $value g/km', value: 0 };

    expect(formatEmissions(emissions)).toEqual('CO2 Emissions 0 g/km');
  });
});
