import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StopwatchComponent } from '../components/Stopwatch';

// Mock StopwatchManager
const mockStart = jest.fn();
const mockPause = jest.fn();
const mockResume = jest.fn();
const mockReset = jest.fn();
const mockOnTick = jest.fn();
const mockGetStatus = jest.fn().mockReturnValue({
  state: 'idle',
  elapsedSeconds: 0,
  displayText: '00:00:00',
});

jest.mock('../utils/StopwatchManager', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      start: mockStart,
      pause: mockPause,
      resume: mockResume,
      reset: mockReset,
      onTick: mockOnTick,
      getStatus: mockGetStatus,
    })),
  };
});

describe('Stopwatch Component - Visual Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStatus.mockReturnValue({
      state: 'idle',
      elapsedSeconds: 0,
      displayText: '00:00:00',
    });
  });

  it('matches snapshot in idle state', () => {
    const { container } = render(<StopwatchComponent />);
    expect(container).toMatchSnapshot();
  });

  it('renders the Stopwatch heading', () => {
    render(<StopwatchComponent />);
    expect(screen.getByText('Stopwatch')).toBeInTheDocument();
  });

  it('renders the time display showing 00:00:00 by default', () => {
    render(<StopwatchComponent />);
    expect(screen.getByText('00:00:00')).toBeInTheDocument();
  });

  it('renders Start and Reset buttons in idle state', () => {
    render(<StopwatchComponent />);
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('renders Start button with primary style', () => {
    render(<StopwatchComponent />);
    const startBtn = screen.getByText('Start');
    expect(startBtn).toHaveClass('btn', 'btn-primary');
  });

  it('renders Reset button with secondary style', () => {
    render(<StopwatchComponent />);
    const resetBtn = screen.getByText('Reset');
    expect(resetBtn).toHaveClass('btn', 'btn-secondary');
  });

  it('renders stopwatch-container as root element', () => {
    const { container } = render(<StopwatchComponent />);
    expect(container.querySelector('.stopwatch-container')).toBeInTheDocument();
  });

  it('renders the large stopwatch display', () => {
    const { container } = render(<StopwatchComponent />);
    expect(container.querySelector('.large-stopwatch-display')).toBeInTheDocument();
  });

  it('renders the controls section', () => {
    const { container } = render(<StopwatchComponent />);
    expect(container.querySelector('.controls')).toBeInTheDocument();
  });

  it('shows Pause button when stopwatch is running', () => {
    mockGetStatus.mockReturnValue({
      state: 'running',
      elapsedSeconds: 5,
      displayText: '00:00:05',
    });
    mockOnTick.mockImplementation((cb: (status: any) => void) => {
      cb({
        state: 'running',
        elapsedSeconds: 5,
        displayText: '00:00:05',
      });
    });

    render(<StopwatchComponent />);
    expect(screen.getByText('Pause')).toBeInTheDocument();
    expect(screen.queryByText('Start')).not.toBeInTheDocument();
  });

  it('matches snapshot when stopwatch is running', () => {
    mockGetStatus.mockReturnValue({
      state: 'running',
      elapsedSeconds: 65,
      displayText: '00:01:05',
    });
    mockOnTick.mockImplementation((cb: (status: any) => void) => {
      cb({
        state: 'running',
        elapsedSeconds: 65,
        displayText: '00:01:05',
      });
    });

    const { container } = render(<StopwatchComponent />);
    expect(container).toMatchSnapshot();
  });

  it('shows Resume button when stopwatch is paused', () => {
    mockGetStatus.mockReturnValue({
      state: 'paused',
      elapsedSeconds: 10,
      displayText: '00:00:10',
    });
    mockOnTick.mockImplementation((cb: (status: any) => void) => {
      cb({
        state: 'paused',
        elapsedSeconds: 10,
        displayText: '00:00:10',
      });
    });

    render(<StopwatchComponent />);
    expect(screen.getByText('Resume')).toBeInTheDocument();
  });

  it('matches snapshot when stopwatch is paused', () => {
    mockGetStatus.mockReturnValue({
      state: 'paused',
      elapsedSeconds: 3661,
      displayText: '01:01:01',
    });
    mockOnTick.mockImplementation((cb: (status: any) => void) => {
      cb({
        state: 'paused',
        elapsedSeconds: 3661,
        displayText: '01:01:01',
      });
    });

    const { container } = render(<StopwatchComponent />);
    expect(container).toMatchSnapshot();
  });

  it('displays updated time from onTick callback', () => {
    mockGetStatus.mockReturnValue({
      state: 'running',
      elapsedSeconds: 125,
      displayText: '00:02:05',
    });
    mockOnTick.mockImplementation((cb: (status: any) => void) => {
      cb({
        state: 'running',
        elapsedSeconds: 125,
        displayText: '00:02:05',
      });
    });

    render(<StopwatchComponent />);
    expect(screen.getByText('00:02:05')).toBeInTheDocument();
  });

  it('has no extra controls beyond Start/Pause, Reset', () => {
    render(<StopwatchComponent />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });
});
