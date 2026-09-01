import React, {
  useEffect, useRef, useState
} from 'react';
import deriveVehicleName from '../../utils/vehicleName';
import formatEmissions from '../../utils/formatEmissions';
import './style.scss';

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function prefersReducedMotion() {
  return typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function VehicleCard({ vehicle }) {
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const drawerRef = useRef(null);
  const {
    id, price, description, media, meta
  } = vehicle;
  const name = deriveVehicleName(id);
  const wideImage = media.find((item) => item.url.includes('/16x9/'));
  const squareImage = media.find((item) => item.url.includes('/1x1/'));
  const fallbackImage = squareImage || wideImage;
  const drawerId = `vehicle-${id}`;
  const drawerTitleId = `${drawerId}-title`;

  // Skips the exit-animation wait entirely when the user has requested
  // reduced motion, matching the CSS override in style.scss.
  function requestClose() {
    if (prefersReducedMotion()) {
      setDetailsOpen(false);
      return;
    }

    setIsClosing(true);
  }

  // Only the drawer's own animation should trigger the deferred close, not
  // one bubbling up from a descendant's animation finishing too.
  function handleDrawerAnimationEnd(event) {
    if (isClosing && event.target === event.currentTarget) {
      setIsClosing(false);
      setDetailsOpen(false);
    }
  }

  useEffect(() => {
    if (!isDetailsOpen) return undefined;

    const previouslyFocused = document.activeElement;
    const drawerNode = drawerRef.current;
    drawerNode.focus({ preventScroll: true });

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        requestClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = Array.from(drawerNode.querySelectorAll(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [isDetailsOpen]);

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
            aria-expanded={isDetailsOpen}
            aria-controls={drawerId}
            aria-label={`Read more about ${name}`}
            onClick={() => (isDetailsOpen ? requestClose() : setDetailsOpen(true))}
          >
            Read more
          </button>
        )}
      </div>
      {meta && (isDetailsOpen || isClosing) && (
        <div
          className={`VehicleCard__drawer${isClosing ? ' VehicleCard__drawer--closing' : ''}`}
          id={drawerId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={drawerTitleId}
          ref={drawerRef}
          tabIndex={-1}
          onAnimationEnd={handleDrawerAnimationEnd}
        >
          <div className="VehicleCard__drawer__header">
            <h2 className="VehicleCard__drawer__title" id={drawerTitleId}>{name}</h2>
            <button type="button" className="VehicleCard__drawer__close" aria-label="Close" onClick={requestClose}>
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
          </div>
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
