import React, { Component } from 'react';
import expressionAutocompletion from '../../dictionaries/expressions';

export class MatchList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      choosenExpression: ''
    };

    this.chooseSelection = this.chooseSelection.bind(this);
  }

  chooseSelection(e) {
    let value = e.target.dataset.value;
    this.props.choosenValue(value);
  }

  render() {

    const listItems = expressionAutocompletion['Nice to'].map((el, index) => {
      return (<li key={index}  data-value={el} data-testid={index} onClick={this.chooseSelection} className="list-group-item list-group-item-action">
        {el}
      </li>)
    });

    return <div>
      <div className="list-group" data-testid="matchList">
        {listItems}
      </div>
    </div>
  }
}