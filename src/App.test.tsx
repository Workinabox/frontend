import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './app/store.ts';
import App from './App.tsx';

// Don't hit the network on mount; the Works fetch/stub is covered separately.
vi.mock('./features/works/worksApi.ts', () => ({
  fetchWorks: () => Promise.resolve([]),
}));

describe('App', () => {
  it('renders the Works console', async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );
    expect(screen.getByRole('heading', { name: /Works/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ New work' })).toBeInTheDocument();
    // Wait for the (mocked, empty) fetch to settle so the state update is acted on.
    expect(await screen.findByText('No works yet.')).toBeInTheDocument();
  });
});
