import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import VehicleList from '..';
import useData from '../useData';

jest.mock('../useData');

const vehicles = [
  {
    id: 'xe',
    price: '£30,000',
    description: 'The most advanced, efficient and refined sports saloon that Jaguar has ever produced',
    media: [
      { name: 'vehicle', url: '/images/16x9/xe_k17.jpg' },
      { name: 'vehicle', url: '/images/1x1/xe_k17.jpg' },
    ],
  },
];

describe('<VehicleList /> Tests', () => {
  it('Should show loading state if it not falsy', () => {
    useData.mockReturnValue([true, 'An error occurred', vehicles]);
    const { queryByTestId } = render(<VehicleList />);

    expect(queryByTestId('loading')).not.toBeNull();
    expect(queryByTestId('error')).toBeNull();
    expect(queryByTestId('results')).toBeNull();
  });

  it('Should show error if it is not falsy and loading is finished', () => {
    useData.mockReturnValue([false, 'An error occurred', vehicles]);
    const { queryByTestId } = render(<VehicleList />);

    expect(queryByTestId('loading')).toBeNull();
    expect(queryByTestId('error')).not.toBeNull();
    expect(queryByTestId('results')).toBeNull();
  });

  it('Should show results if loading successfully finished', () => {
    useData.mockReturnValue([false, false, vehicles]);
    const { queryByTestId } = render(<VehicleList />);

    expect(queryByTestId('loading')).toBeNull();
    expect(queryByTestId('error')).toBeNull();
    expect(queryByTestId('results')).not.toBeNull();
  });

  it('Should show an empty state when there are no vehicles to display', () => {
    useData.mockReturnValue([false, false, []]);
    const { queryByTestId } = render(<VehicleList />);

    expect(queryByTestId('loading')).toBeNull();
    expect(queryByTestId('error')).toBeNull();
    expect(queryByTestId('results')).toBeNull();
    expect(queryByTestId('empty')).not.toBeNull();
  });

  it('Should have no accessibility violations when showing results', async () => {
    useData.mockReturnValue([false, false, vehicles]);
    const { container } = render(<VehicleList />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
