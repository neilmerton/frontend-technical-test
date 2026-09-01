import React from 'react';
import {
  render, fireEvent, screen, act
} from '@testing-library/react';
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
  {
    id: 'ftype',
    price: '£60,000',
    description: 'Pulse-quickening, pure Jaguar sports car.',
    media: [
      { name: 'vehicle', url: '/images/16x9/ftype_k17.jpg' },
      { name: 'vehicle', url: '/images/1x1/ftype_k17.jpg' },
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

  describe('Search', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('Should filter the rendered vehicles down to those matching the search term', () => {
      useData.mockReturnValue([false, false, vehicles]);
      render(<VehicleList />);

      fireEvent.change(screen.getByLabelText('Search vehicles'), { target: { value: 'f-type' } });
      act(() => { jest.runAllTimers(); });

      expect(screen.queryByRole('heading', { name: 'F-TYPE' })).not.toBeNull();
      expect(screen.queryByRole('heading', { name: 'XE' })).toBeNull();
    });

    it('Should show a "no results" state when the search term matches nothing', () => {
      useData.mockReturnValue([false, false, vehicles]);
      render(<VehicleList />);

      fireEvent.change(screen.getByLabelText('Search vehicles'), { target: { value: 'hovercraft' } });
      act(() => { jest.runAllTimers(); });

      expect(screen.queryByTestId('results')).toBeNull();
      expect(screen.queryByTestId('no-results')).not.toBeNull();
    });

    it('Should restore every vehicle when the search term is cleared', () => {
      useData.mockReturnValue([false, false, vehicles]);
      render(<VehicleList />);

      const input = screen.getByLabelText('Search vehicles');
      fireEvent.change(input, { target: { value: 'f-type' } });
      act(() => { jest.runAllTimers(); });
      fireEvent.change(input, { target: { value: '' } });
      act(() => { jest.runAllTimers(); });

      expect(screen.queryByRole('heading', { name: 'XE' })).not.toBeNull();
      expect(screen.queryByRole('heading', { name: 'F-TYPE' })).not.toBeNull();
    });
  });
});
