import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App.tsx';
import counterReducer from './features/counter/counterSlice.ts';

function renderWithStore() {
  const store = configureStore({ reducer: { counter: counterReducer } });
  return render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
}

describe('App', () => {
  it('renders and increments the counter on click', async () => {
    renderWithStore();
    expect(screen.getByText('count: 0')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '+1' }));
    expect(screen.getByText('count: 1')).toBeInTheDocument();
  });
});
