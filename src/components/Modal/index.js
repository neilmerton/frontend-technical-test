import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './style.scss';

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function prefersReducedMotion() {
  return typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function Modal({
  id, title, onClose, children
}) {
  const dialogRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);

  // Skips the exit-animation wait entirely when the user has requested
  // reduced motion, matching the CSS override in style.scss.
  function requestClose() {
    if (prefersReducedMotion()) {
      onClose();
      return;
    }

    setIsClosing(true);
  }

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const dialogNode = dialogRef.current;
    dialogNode.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        requestClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = Array.from(dialogNode.querySelectorAll(FOCUSABLE_SELECTOR));
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
  }, [onClose]);

  const titleId = `${id}-title`;

  // Only the overlay's own animation should trigger the deferred close,
  // not one bubbling up from the dialog's animation finishing too.
  function handleOverlayAnimationEnd(event) {
    if (isClosing && event.target === event.currentTarget) {
      onClose();
    }
  }

  // Only a click on the backdrop itself should close the modal, not one
  // bubbling up from inside the dialog.
  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) {
      requestClose();
    }
  }

  return createPortal(
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div
      className={`Modal${isClosing ? ' Modal--closing' : ''}`}
      data-testid="modal-overlay"
      onClick={handleOverlayClick}
      onAnimationEnd={handleOverlayAnimationEnd}
    >
      <div
        className="Modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={dialogRef}
        tabIndex={-1}
      >
        <header className="Modal__header">
          <button type="button" className="Modal__close" aria-label="Close" onClick={requestClose}>
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
          <h2 className="Modal__title" id={titleId}>{title}</h2>
        </header>
        <div className="Modal__content">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
