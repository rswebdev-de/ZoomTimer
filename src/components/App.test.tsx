import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppComponent } from '../components/App';

// Mock child components to isolate App rendering
jest.mock('../components/Timer', () => {
  return function MockTimer() {
    return <div data-testid="timer-component">Timer Content</div>;
  };
});

jest.mock('../components/Stopwatch', () => {
  return function MockStopwatch() {
    return <div data-testid="stopwatch-component">Stopwatch Content</div>;
  };
});

const getTabButtons = () => {
  const nav = document.querySelector('.tab-navigation')!;
  const timerTab = within(nav as HTMLElement).getByText('Timer');
  const stopwatchTab = within(nav as HTMLElement).getByText('Stopwatch');
  return { timerTab, stopwatchTab };
};

describe('App Component - Visual Tests', () => {
  it('renders the app container with header', () => {
    const { container } = render(<AppComponent />);
    expect(container.firstChild).toHaveClass('app-container');
  });

  it('matches snapshot with default timer tab', () => {
    const { container } = render(<AppComponent />);
    expect(container).toMatchSnapshot();
  });

  it('renders the app title', () => {
    render(<AppComponent />);
    expect(screen.getByText('Zoom Timer App')).toBeInTheDocument();
  });

  it('renders both tab buttons', () => {
    render(<AppComponent />);
    const { timerTab, stopwatchTab } = getTabButtons();
    expect(timerTab).toBeInTheDocument();
    expect(stopwatchTab).toBeInTheDocument();
  });

  it('shows Timer tab as active by default', () => {
    render(<AppComponent />);
    const { timerTab, stopwatchTab } = getTabButtons();

    expect(timerTab).toHaveClass('tab-btn', 'active');
    expect(stopwatchTab).toHaveClass('tab-btn');
    expect(stopwatchTab).not.toHaveClass('active');
  });

  it('renders the Timer component by default', () => {
    render(<AppComponent />);
    expect(screen.getByTestId('timer-component')).toBeInTheDocument();
    expect(screen.queryByTestId('stopwatch-component')).not.toBeInTheDocument();
  });

  it('matches snapshot when Stopwatch tab is selected', () => {
    const { container } = render(<AppComponent />);
    const { stopwatchTab } = getTabButtons();
    fireEvent.click(stopwatchTab);
    expect(container).toMatchSnapshot();
  });

  it('switches to Stopwatch view when tab is clicked', () => {
    render(<AppComponent />);
    const { stopwatchTab } = getTabButtons();
    fireEvent.click(stopwatchTab);

    expect(screen.getByTestId('stopwatch-component')).toBeInTheDocument();
    expect(screen.queryByTestId('timer-component')).not.toBeInTheDocument();
  });

  it('updates tab active state when switching', () => {
    render(<AppComponent />);
    const { stopwatchTab } = getTabButtons();
    fireEvent.click(stopwatchTab);

    const tabs = getTabButtons();
    expect(tabs.stopwatchTab).toHaveClass('active');
    expect(tabs.timerTab).not.toHaveClass('active');
  });

  it('switches back to Timer view when timer tab is re-clicked', () => {
    render(<AppComponent />);
    const { stopwatchTab } = getTabButtons();
    fireEvent.click(stopwatchTab);
    const { timerTab } = getTabButtons();
    fireEvent.click(timerTab);

    expect(screen.getByTestId('timer-component')).toBeInTheDocument();
    expect(screen.queryByTestId('stopwatch-component')).not.toBeInTheDocument();
  });

  it('has correct structural elements', () => {
    const { container } = render(<AppComponent />);

    expect(container.querySelector('.app-header')).toBeInTheDocument();
    expect(container.querySelector('.tab-navigation')).toBeInTheDocument();
    expect(container.querySelector('.app-content')).toBeInTheDocument();
  });
});
