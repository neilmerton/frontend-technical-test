import React, { useState } from 'react';
import deriveVehicleName from '../../utils/vehicleName';
import formatEmissions from '../../utils/formatEmissions';
import Modal from '../Modal';
import './style.scss';

export default function VehicleCard({ vehicle }) {
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const {
    id, price, description, media, meta
  } = vehicle;
  const name = deriveVehicleName(id);
  const wideImage = media.find((item) => item.url.includes('/16x9/'));
  const squareImage = media.find((item) => item.url.includes('/1x1/'));
  const fallbackImage = squareImage || wideImage;

  return (
    <article className="VehicleCard">
      <picture className="VehicleCard__media">
        {wideImage && <source media="(min-width: 768px)" srcSet={wideImage.url} />}
        <img
          className="VehicleCard__image"
          src={fallbackImage.url}
          alt={`${name} side profile`}
          loading="lazy"
        />
      </picture>
      <div className="VehicleCard__body">
        <h2 className="VehicleCard__name">{name}</h2>
        <p className="VehicleCard__price">{`From ${price}`}</p>
        <p className="VehicleCard__description">{description}</p>
        {meta && (
          <button
            type="button"
            className="VehicleCard__readMore"
            aria-haspopup="dialog"
            aria-label={`Read more about ${name}`}
            onClick={() => setDetailsOpen(true)}
          >
            Read more
          </button>
        )}
      </div>
      {meta && isDetailsOpen && (
        <Modal id={`vehicle-${id}`} title={name} onClose={() => setDetailsOpen(false)}>
          <dl className="VehicleCard__specs">
            <dt>Passengers</dt>
            <dd>{meta.passengers}</dd>
            <dt>Drivetrain</dt>
            <dd>{meta.drivetrain.join(', ')}</dd>
            <dt>Body styles</dt>
            <dd>{meta.bodystyles.join(', ')}</dd>
            <dt>Emissions</dt>
            <dd>{formatEmissions(meta.emissions)}</dd>
          </dl>
        </Modal>
      )}
    </article>
  );
}
