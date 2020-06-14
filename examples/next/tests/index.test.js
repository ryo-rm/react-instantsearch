import React from 'react';
import renderer from 'react-test-renderer';
import App from '../pages/index';

jest.mock('next/router', () => {
  return {
    __esmodulle: true,
    useRouter: jest.fn().mockImplementation(() => {
      return {
        push: jest.fn(),
      };
    }),
  };
});

describe('Next app recipes', () => {
  it('App renders without crashing', () => {
    const component = renderer.create(<App searchState={{}} />);

    expect(component.toJSON()).toMatchSnapshot();
  });
});
