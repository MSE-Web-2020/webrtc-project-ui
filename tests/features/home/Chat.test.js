import React from 'react';
import { shallow } from 'enzyme';
import { Chat } from '../../../src/features/home/Chat';

describe('home/Chat', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <Chat {...props} />
    );

    expect(
      renderedComponent.find('.home-chat').length
    ).toBe(1);
  });
});
