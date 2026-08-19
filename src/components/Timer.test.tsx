import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TimerComponent, PRESET_TIMERS } from '../components/Timer';

// Mock ZoomSDKService
jest.mock('../services/ZoomSDKService', () => ({
  __esModule: true,
  default: {
    setDynamicIndicator: jest.fn(),
    removeDynamicIndicator: jest.fn(),
    setVirtualForeground: jest.fn(),
    removeVirtualForeground: jest.fn(),
    sendMessage: jest.fn(),
    onMessage: jest.fn(),
  },
}));

// Mock TimerManager
const mockInit = jest.fn();
const mockStart = jest.fn();
const mockPause = jest.fn();
const mockResume = jest.fn();
const mockStop = jest.fn();
const mockReset = jest.fn();
const mockOnTick = jest.fn();
const mockOnComplete = jest.fn();
const mockOnWarning = jest.fn();

jest.mock('../utils/TimerManager', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      init: mockInit,
      start: mockStart,
      pause: mockPause,
      resume: mockResume,
      stop: mockStop,
      reset: mockReset,
      onTick: mockOnTick,
      onComplete: mockOnComplete,
      onWarning: mockOnWarning,
      getStatus: jest.fn().mockReturnValue({
        state: 'idle',
        remainingSeconds: 60,
        totalSeconds: 60,
        displayText: '00:01:00',
      }),
    })),
  };
});

describe('Timer Component - Visual Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('matches snapshot in idle state', () => {
    const { container } = render(<TimerComponent />);
    expect(container).toMatchSnapshot();
  });

  it('renders the Timer heading', () => {
    render(<TimerComponent />);
    expect(screen.getByText('Timer')).toBeInTheDocument();
  });

  it('renders the time display showing 00:00:00 by default', () => {
    render(<TimerComponent />);
    expect(screen.getByText('00:00:00')).toBeInTheDocument();
  });

  it('renders three time input fields (hours, minutes, seconds)', () => {
    render(<TimerComponent />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(3);
  });

  it('renders time unit labels', () => {
    render(<TimerComponent />);
    expect(screen.getByText('Hours')).toBeInTheDocument();
    expect(screen.getByText('Minutes')).toBeInTheDocument();
    expect(screen.getByText('Seconds')).toBeInTheDocument();
  });

  it('renders colon separators between time units', () => {
    const { container } = render(<TimerComponent />);
    const separators = container.querySelectorAll('.separator');
    expect(separators).toHaveLength(2);
    separators.forEach((sep) => expect(sep.textContent).toBe(':'));
  });

  it('renders all preset timer buttons', () => {
    render(<TimerComponent />);
    PRESET_TIMERS.forEach((preset) => {
      expect(screen.getByText(preset.label)).toBeInTheDocument();
    });
  });

  it('renders 6 increment and 6 decrement buttons', () => {
    const { container } = render(<TimerComponent />);
    const incrementBtns = container.querySelectorAll('.increment-btn');
    const decrementBtns = container.querySelectorAll('.decrement-btn');
    expect(incrementBtns).toHaveLength(3);
    expect(decrementBtns).toHaveLength(3);
  });

  it('renders Start, Reset, and Cancel control buttons', () => {
    render(<TimerComponent />);
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders the Audio alarm checkbox (checked by default)', () => {
    render(<TimerComponent />);
    expect(screen.getByText('Audio alarm')).toBeInTheDocument();
    const checkboxes = screen.getAllByRole('checkbox');
    // First checkbox is Audio alarm
    expect(checkboxes[0]).toBeChecked();
  });

  it('renders the Show timer to all checkbox (unchecked by default)', () => {
    render(<TimerComponent />);
    expect(screen.getByText('Show timer to all')).toBeInTheDocument();
    const checkboxes = screen.getAllByRole('checkbox');
    // Second checkbox is Show timer to all
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('renders Start button with primary style', () => {
    render(<TimerComponent />);
    const startBtn = screen.getByText('Start');
    expect(startBtn).toHaveClass('btn', 'btn-primary');
  });

  it('renders Cancel button with danger style', () => {
    render(<TimerComponent />);
    const cancelBtn = screen.getByText('Cancel');
    expect(cancelBtn).toHaveClass('btn', 'btn-danger');
  });

  it('renders timer-container as root element', () => {
    const { container } = render(<TimerComponent />);
    expect(container.querySelector('.timer-container')).toBeInTheDocument();
  });

  it('renders the large timer display', () => {
    const { container } = render(<TimerComponent />);
    expect(container.querySelector('.large-timer-display')).toBeInTheDocument();
  });

  it('renders preset buttons section', () => {
    const { container } = render(<TimerComponent />);
    expect(container.querySelector('.preset-buttons')).toBeInTheDocument();
  });

  it('renders options section with checkboxes', () => {
    const { container } = render(<TimerComponent />);
    expect(container.querySelector('.options')).toBeInTheDocument();
  });

  it('matches snapshot when audio alarm is toggled off', () => {
    const { container } = render(<TimerComponent />);
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).not.toBeChecked();
    expect(container).toMatchSnapshot();
  });

  it('shows Resume button when timer is in paused state', () => {
    // Simulate paused state via onTick callback
    mockOnTick.mockImplementation((cb: (status: any) => void) => {
      cb({
        state: 'paused',
        remainingSeconds: 30,
        totalSeconds: 60,
        displayText: '00:00:30',
      });
    });

    render(<TimerComponent />);
    expect(screen.getByText('Resume')).toBeInTheDocument();
  });

  it('shows Pause button when timer is in running state', () => {
    mockOnTick.mockImplementation((cb: (status: any) => void) => {
      cb({
        state: 'running',
        remainingSeconds: 55,
        totalSeconds: 60,
        displayText: '00:00:55',
      });
    });

    const { container } = render(<TimerComponent />);
    expect(screen.getByText('Pause')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('disables inputs and presets when timer is running', () => {
    mockOnTick.mockImplementation((cb: (status: any) => void) => {
      cb({
        state: 'running',
        remainingSeconds: 55,
        totalSeconds: 60,
        displayText: '00:00:55',
      });
    });

    render(<TimerComponent />);
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input) => expect(input).toBeDisabled());

    PRESET_TIMERS.forEach((preset) => {
      expect(screen.getByText(preset.label)).toBeDisabled();
    });
  });

  it('displays updated time from onTick callback', () => {
    mockOnTick.mockImplementation((cb: (status: any) => void) => {
      cb({
        state: 'running',
        remainingSeconds: 125,
        totalSeconds: 300,
        displayText: '00:02:05',
      });
    });

    render(<TimerComponent />);
    expect(screen.getByText('00:02:05')).toBeInTheDocument();
  });
});
