import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import Modal from '..';

describe('<Modal /> Tests', () => {
  it('Should render its title and children', () => {
    render(<Modal id="test" title="F-TYPE" onClose={() => {}}>Extra details</Modal>);

    expect(screen.getByRole('dialog', { name: 'F-TYPE' })).not.toBeNull();
    expect(screen.getByText('Extra details')).not.toBeNull();
  });

  it('Should have no accessibility violations', async () => {
    render(<Modal id="test" title="F-TYPE" onClose={() => {}}>Extra details</Modal>);

    // Modal renders via a portal into document.body, so axe must scan
    // there rather than the RTL container, which stays empty. The
    // "region" rule is disabled since it expects a full page with
    // landmarks, not an isolated component under test.
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });

  it('Should focus the dialog on mount', () => {
    render(<Modal id="test" title="F-TYPE" onClose={() => {}}>Extra details</Modal>);

    expect(document.activeElement).toEqual(screen.getByRole('dialog'));
  });

  it('Should play the exit animation and defer onClose until it finishes when Escape is pressed', () => {
    const onClose = jest.fn();
    render(<Modal id="test" title="F-TYPE" onClose={onClose}>Extra details</Modal>);
    const overlay = screen.getByTestId('modal-overlay');

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(overlay.className).toContain('Modal--closing');
    expect(onClose).not.toBeCalled();

    fireEvent.animationEnd(overlay);

    expect(onClose).toBeCalledTimes(1);
  });

  it('Should defer onClose until the exit animation finishes when the overlay is clicked', () => {
    const onClose = jest.fn();
    render(<Modal id="test" title="F-TYPE" onClose={onClose}>Extra details</Modal>);
    const overlay = screen.getByTestId('modal-overlay');

    fireEvent.click(overlay);
    expect(onClose).not.toBeCalled();

    fireEvent.animationEnd(overlay);

    expect(onClose).toBeCalledTimes(1);
  });

  it('Should not call onClose when the dialog content is clicked', () => {
    const onClose = jest.fn();
    render(<Modal id="test" title="F-TYPE" onClose={onClose}>Extra details</Modal>);

    fireEvent.click(screen.getByRole('dialog'));

    expect(onClose).not.toBeCalled();
  });

  it('Should defer onClose until the exit animation finishes when the close button is clicked', () => {
    const onClose = jest.fn();
    render(<Modal id="test" title="F-TYPE" onClose={onClose}>Extra details</Modal>);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).not.toBeCalled();

    fireEvent.animationEnd(screen.getByTestId('modal-overlay'));

    expect(onClose).toBeCalledTimes(1);
  });

  it('Should not wait for an animation before calling onClose when reduced motion is preferred', () => {
    const matchMediaMock = jest.fn().mockReturnValue({ matches: true });
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = matchMediaMock;

    const onClose = jest.fn();
    render(<Modal id="test" title="F-TYPE" onClose={onClose}>Extra details</Modal>);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(onClose).toBeCalledTimes(1);
    expect(matchMediaMock).toBeCalledWith('(prefers-reduced-motion: reduce)');

    window.matchMedia = originalMatchMedia;
  });

  it('Should ignore an animationend event bubbling up from the dialog', () => {
    const onClose = jest.fn();
    render(<Modal id="test" title="F-TYPE" onClose={onClose}>Extra details</Modal>);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    fireEvent.animationEnd(screen.getByRole('dialog'));

    expect(onClose).not.toBeCalled();
  });

  it('Should restore focus to the previously focused element on unmount', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    const { unmount } = render(<Modal id="test" title="F-TYPE" onClose={() => {}}>Extra details</Modal>);
    unmount();

    expect(document.activeElement).toEqual(trigger);
    trigger.remove();
  });
});
