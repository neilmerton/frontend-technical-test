import { filterVehicles } from '../searchVehicles';

const vehicles = [
  {
    id: 'xe',
    description: 'The most advanced, efficient and refined sports saloon that Jaguar has ever produced',
    meta: {
      passengers: 5,
      drivetrain: ['AWD', 'RWD'],
      bodystyles: ['saloon'],
      emissions: { template: 'CO2 Emissions $value g/km', value: 99 },
    },
  },
  {
    id: 'ftype',
    description: 'Pulse-quickening, pure Jaguar sports car.',
    meta: {
      passengers: 2,
      drivetrain: ['RWD'],
      bodystyles: ['coupé', 'convertible'],
      emissions: { template: 'CO2 Emissions $value g/km', value: 234 },
    },
  },
  {
    id: 'ipace',
    description: 'An all-electric performance SUV.',
    meta: {
      passengers: 5,
      drivetrain: ['AWD'],
      bodystyles: ['suv'],
      emissions: { template: 'CO2 Emissions $value g/km', value: 0 },
    },
  },
];

describe('filterVehicles Tests', () => {
  it('Should return every vehicle when the query is empty or whitespace only', () => {
    expect(filterVehicles(vehicles, '')).toEqual(vehicles);
    expect(filterVehicles(vehicles, '   ')).toEqual(vehicles);
  });

  it('Should match by derived vehicle name, case-insensitively', () => {
    expect(filterVehicles(vehicles, 'f-type')).toEqual([vehicles[1]]);
    expect(filterVehicles(vehicles, 'F-TYPE')).toEqual([vehicles[1]]);
  });

  it('Should match by description', () => {
    expect(filterVehicles(vehicles, 'electric')).toEqual([vehicles[2]]);
  });

  it('Should match by array meta fields such as bodystyles and drivetrain', () => {
    expect(filterVehicles(vehicles, 'coupé')).toEqual([vehicles[1]]);
    expect(filterVehicles(vehicles, 'AWD')).toEqual([vehicles[0], vehicles[2]]);
  });

  it('Should match by nested meta fields such as emissions value', () => {
    expect(filterVehicles(vehicles, '234')).toEqual([vehicles[1]]);
  });

  it('Should match a vehicle if ANY whitespace-separated term matches (OR)', () => {
    expect(filterVehicles(vehicles, 'coupé suv')).toEqual([vehicles[1], vehicles[2]]);
  });

  it('Should return no vehicles when nothing matches', () => {
    expect(filterVehicles(vehicles, 'hovercraft')).toEqual([]);
  });
});
