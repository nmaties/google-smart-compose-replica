import React from 'react'
import { render } from 'react-testing-library'
import { App } from './App'

describe('App component', () => {
  it('renders the middle column', () => {
    const component  = render(<App />);
    const middleColumnHeader = component.queryByText('Message Header');
    expect(middleColumnHeader.innerHTML).toBe('Message Header')
  });

  it('renders the left column', () => {
    const component  = render(<App />);
    const leftColumnText = component.queryByText('Words list:');
    expect(leftColumnText.innerHTML).toBe('Words list: ')
  });

  it('renders the left column inner list', () => {
    const component  = render(<App />);
    const leftColumnInnerText = component.queryByText("ka");
    expect(leftColumnInnerText.innerHTML).toBe('ka')
  });

  it('renders the right column', () => {
    const component  = render(<App />);
    const rightColumnText = component.queryByText('"Nice to" expression autocompletion');
    expect(rightColumnText.innerHTML).toBe('"Nice to" expression autocompletion')
  });

  it('renders the footer', () => {
    const component  = render(<App />);
    const footer = component.queryByText('Message box autocompletion usage:');
    expect(footer.innerHTML).toBe('Message box autocompletion usage:')
  });

  it('renders the right column inner list', () => {
    const component  = render(<App />);
    const rightColumnInnerText = component.queryByText('Nice to hear from you also.');
    expect(rightColumnInnerText.innerHTML).toBe('Nice to hear from you also.')
  });

  it('renders the middle column recepient name input', () => {
    const component  = render(<App />);
    const recepientNameInput = component.getByTestId('name');
    expect(recepientNameInput.placeholder).toBe("Recepient name");
    expect(recepientNameInput.className).toBe("form-control input-custom");
    expect(recepientNameInput.name).toBe("name");
    expect(recepientNameInput.type).toBe("text");
    expect(recepientNameInput.value).toBe("");
  });

  it('renders the middle column title input', () => {
    const component  = render(<App />);
    const messageTitle = component.getByTestId('message');
    expect(messageTitle.placeholder).toBe("Message title");
    expect(messageTitle.className).toBe("form-control input-custom");
    expect(messageTitle.name).toBe("message");
    expect(messageTitle.type).toBe("text");
    expect(messageTitle.value).toBe("");
  });
});