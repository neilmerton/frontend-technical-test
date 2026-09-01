import React, { useState } from 'react';
import deriveVehicleName from '../../utils/vehicleName';
import formatEmissions from '../../utils/formatEmissions';
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

  function toggleDetails() {
    if (isDetailsOpen) {
      setDetailsOpen(false);
      return;
    }

    setDetailsOpen(true);
  }

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
            onClick={() => toggleDetails()}
          >
            Read more
          </button>
        )}
      </div>
      {meta && isDetailsOpen && (
        <div className="VehicleCard__drawer" id={`vehicle-${id}`} title={name}>
          <button type="button" className="VehicleCard__drawer__close" aria-label="Close" onClick={() => setDetailsOpen(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              aria-hidden="true"
              focusable="false"
            >
              <path fill="currentColor" d="M17.414 16L24 9.414L22.586 8L16 14.586L9.414 8L8 9.414L14.586 16L8 22.586L9.414 24L16 17.414L22.586 24L24 22.586z" />
            </svg>
          </button>
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
        </div>
      )}
    </article>
  );
}
