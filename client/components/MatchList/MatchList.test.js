import React from 'react'
import { render } from 'react-testing-library'
import { MatchList } from './MatchList'

describe('MatchList component', () => {
  it('renders the matchlist', () => {
    const component  = render(<MatchList />);
    const matchList = component.getByTestId('matchList');
    expect(matchList.className).toBe("list-group");
  });

  it('renders the first match element from the list', () => {
    const component  = render(<MatchList />);
    const matchElement = component.getByTestId('0');
    expect(matchElement.className).toBe("list-group-item list-group-item-action");
    expect(matchElement.innerHTML).toBe('Nice to hear from you also.')
  });

  it('renders the first match element from the list', () => {
    const component  = render(<MatchList />);
    const matchElement = component.getByTestId('4');
    expect(matchElement.className).toBe("list-group-item list-group-item-action");
    expect(matchElement.innerHTML).toBe('Nice to e-meet you!')
  });
});