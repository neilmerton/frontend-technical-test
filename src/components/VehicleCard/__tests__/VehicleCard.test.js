import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import VehicleCard from '..';

const vehicle = {
  id: 'ftype',
  apiUrl: '/api/vehicle_ftype.json',
  description: 'Pulse-quickening, pure Jaguar sports car.',
  price: '£60,000',
  media: [
    { name: 'vehicle', url: '/images/16x9/ftype_k17.jpg' },
    { name: 'vehicle', url: '/images/1x1/ftype_k17.jpg' },
  ],
  meta: {
    passengers: 2,
    drivetrain: ['AWD', 'RWD'],
    bodystyles: ['COUPÉ', 'CONVERTIBLE'],
    emissions: { template: 'CO2 Emissions $value g/km', value: 234 },
  },
};

describe('<VehicleCard /> Tests', () => {
  it('Should render the derived name, price and description', () => {
    render(<VehicleCard vehicle={vehicle} />);

    expect(screen.getByRole('heading', { name: 'F-TYPE' })).not.toBeNull();
    expect(screen.getByText('From £60,000')).not.toBeNull();
    expect(screen.getByText(vehicle.description)).not.toBeNull();
  });

  it('Should render both responsive image variants', () => {
    render(<VehicleCard vehicle={vehicle} />);

    const image = screen.getByRole('img', { name: 'F-TYPE side profile' });
    expect(image.getAttribute('src')).toEqual('/images/1x1/ftype_k17.jpg');

    const source = document.querySelector('source');
    expect(source.getAttribute('srcset')).toEqual('/images/16x9/ftype_k17.jpg');
  });

  it('Should open the details modal with vehicle meta when "Read more" is clicked', () => {
    render(<VehicleCard vehicle={vehicle} />);

    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Read more about F-TYPE' }));

    expect(screen.getByRole('dialog', { name: 'F-TYPE' })).not.toBeNull();
    expect(screen.getByText('AWD, RWD')).not.toBeNull();
    expect(screen.getByText('CO2 Emissions 234 g/km')).not.toBeNull();
  });

  it('Should not render a "Read more" button when there is no extra meta', () => {
    render(<VehicleCard vehicle={{ ...vehicle, meta: undefined }} />);

    expect(screen.queryByRole('button', { name: 'Read more about F-TYPE' })).toBeNull();
  });

  it('Should have no accessibility violations', async () => {
    const { container } = render(<VehicleCard vehicle={vehicle} />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should have no accessibility violations with the details modal open', async () => {
    render(<VehicleCard vehicle={vehicle} />);

    fireEvent.click(screen.getByRole('button', { name: 'Read more about F-TYPE' }));

    // The modal itself portals into document.body rather than the RTL
    // container. The "region" rule is disabled since it expects a full
    // page with landmarks, not an isolated component under test.
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });
});
