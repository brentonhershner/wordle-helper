import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders Wordle Helper heading', () => {
  render(<App />);
  expect(screen.getByText('Wordle Helper')).toBeInTheDocument();
});

test('renders section headings for each input group', () => {
  render(<App />);
  expect(screen.getByText('Correct Letters')).toBeInTheDocument();
  expect(screen.getByText('Misplaced but Correct')).toBeInTheDocument();
  expect(screen.getByText('Rejects')).toBeInTheDocument();
});

test('renders default prompt when no filters are set', () => {
  render(<App />);
  expect(screen.getByText(/filter down the list/i)).toBeInTheDocument();
});
