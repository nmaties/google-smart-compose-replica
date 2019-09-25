import React from 'react'
import { render } from 'react-testing-library'
import { MessageBox } from './MessageBox'

describe('MessageBox component', () => {
  it('renders the MessageBox', () => {
    const component  = render(<MessageBox />);
    const messageBox = component.getByTestId('message-box-test-id');
    expect(messageBox.className).toBe("form-control textarea-custom");
    expect(messageBox.innerHTML).toBe("");
    expect(messageBox.id).toBe('message-box')
  });
});