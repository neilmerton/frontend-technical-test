import React from 'react';
import {
  render, fireEvent, screen, act
} from '@testing-library/react';
import { axe } from 'jest-axe';
import VehicleSearch from '..';

describe('<VehicleSearch /> Tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('Should call onSearch with the initial empty term on mount', () => {
    const onSearch = jest.fn();
    render(<VehicleSearch onSearch={onSearch} />);

    act(() => { jest.runAllTimers(); });

    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('Should not call onSearch again until the debounce delay has passed', () => {
    const onSearch = jest.fn();
    render(<VehicleSearch onSearch={onSearch} />);
    onSearch.mockClear();

    fireEvent.change(screen.getByLabelText('Search vehicles'), { target: { value: 'f-type' } });

    expect(onSearch).not.toHaveBeenCalled();

    act(() => { jest.runAllTimers(); });

    expect(onSearch).toHaveBeenCalledWith('f-type');
  });

  it('Should only call onSearch with the latest value when typing is debounced', () => {
    const onSearch = jest.fn();
    render(<VehicleSearch onSearch={onSearch} />);
    onSearch.mockClear();

    const input = screen.getByLabelText('Search vehicles');
    fireEvent.change(input, { target: { value: 'sa' } });
    fireEvent.change(input, { target: { value: 'saloon' } });

    act(() => { jest.runAllTimers(); });

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('saloon');
  });

  it('Should have no accessibility violations', async () => {
    jest.useRealTimers();
    const { container } = render(<VehicleSearch onSearch={() => {}} />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
