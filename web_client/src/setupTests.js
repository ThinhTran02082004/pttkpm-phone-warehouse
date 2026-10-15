import '@testing-library/jest-dom';

class ResizeObserverMock {
  observe() {}

  unobserve() {}

  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;
window.ResizeObserver = ResizeObserverMock;

jest.mock('react-apexcharts', () => {
  const React = require('react');

  return function MockChart(props) {
    return React.createElement(
      'div',
      {
        'data-testid': `chart-${props.options?.chart?.id || props.type}`,
      },
      props.options?.chart?.id || props.type
    );
  };
});
