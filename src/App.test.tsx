import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './app/store.ts';
import App from './App.tsx';

// Don't hit the network on mount; the Works fetch/stub is covered separately.
vi.mock('./features/works/worksApi.ts', () => ({
  fetchWorks: () => Promise.resolve([]),
  createWork: () => Promise.reject(new Error('unused in this test')),
  updateWork: () => Promise.reject(new Error('unused in this test')),
}));

// The sidebar switcher loads the org/project context on mount; give it one of each.
vi.mock('./features/context/contextApi.ts', () => ({
  fetchOrganizations: () =>
    Promise.resolve([{ id: 'O-1', name: 'Gos & co', description: '' }]),
  fetchProjects: () =>
    Promise.resolve([{ id: 'P-1', organization_id: 'O-1', name: 'Workinabox', description: '' }]),
  createOrganization: () => Promise.reject(new Error('unused in this test')),
  updateOrganization: () => Promise.reject(new Error('unused in this test')),
  createProject: () => Promise.reject(new Error('unused in this test')),
  updateProject: () => Promise.reject(new Error('unused in this test')),
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
