import deriveVehicleName from '../vehicleName';

describe('deriveVehicleName Tests', () => {
  it.each([
    ['xe', 'XE'],
    ['xf', 'XF'],
    ['xj', 'XJ'],
    ['ftype', 'F-TYPE'],
    ['fpace', 'F-PACE'],
    ['ipace', 'I-PACE'],
  ])('Should derive "%s" as "%s"', (id, expected) => {
    expect(deriveVehicleName(id)).toEqual(expected);
  });
});
