import React from 'react';
import PropTypes from 'prop-types';
import { MessageBox } from "../MessageBox/MessageBox";
import { MatchList } from "../MatchList/MatchList";
import wordsAutocompletion from '../../dictionaries/words';
import expressionAutocompletion from "../../dictionaries/expressions";


export class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      message: '',
      matchListFlag: false,
      exactExpression: '',
    };
  }

  matchListToggle = (toggleFlag) => {
    this.setState({
      matchListFlag: toggleFlag
    })
  }

  passChoosenExpression = (value) => {
    this.setState({
      exactExpression: value,
      matchListFlag: false
    })
  }

  updateInputValue = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }

  render() {
    return <div className="container-fluid">
      <br/>
      <div className="row">
        <div className="col-md-3">
          <ul className="list-group">
            <li className="list-group-item active">Words list: </li>
              {Object.keys(wordsAutocompletion).map((key) => {
                return <li className="list-group-item" key={key}>
                  <mark>{key}</mark>
                  for => {wordsAutocompletion[key]}</li>
              })}
          </ul>
        </div>
        <div className="col-md-6">
          <div className="card border-dark mb-3">
            <div className="card-header bg-dark text-light">Message Header</div>
            <div className="card-body">
              <input type="text"
                     className="form-control input-custom"
                     onChange={evt => this.updateInputValue(evt)}
                     name="name"
                     data-testid="name"
                     value={this.state.name}
                     placeholder="Recepient name"/>
              <hr className="hr-mt-mb-0"/>
              <input type="text"
                     className="form-control input-custom"
                     onChange={evt => this.updateInputValue(evt)}
                     name="message"
                     data-testid="message"
                     value={this.state.message}
                     placeholder="Message title"/>
              <hr className="hr-mt-mb-0"/>
              <MessageBox name={this.state.name}
                          message={this.state.message}
                          matchExpression={this.matchListToggle}
                          exactExpression={this.state.exactExpression}/>
            </div>
          </div>
          {this.state.matchListFlag && <MatchList choosenValue={this.passChoosenExpression}/>}
        </div>
        <div className="col-md-3">
          <ul className="list-group">
            <li className="list-group-item active"><u>"Nice to" expression autocompletion</u></li>
            {expressionAutocompletion['Nice to'].map((key, idx) => {
              return <li className="list-group-item" key={idx}>
                <mark>{key}</mark>
              </li>;
            })}
          </ul>
        </div>
      </div>
      <div className="footer">
        <b>Message box autocompletion usage:</b> <br/>
        <p>1. The lists from the left and right are filled with available autocompletions for the message box.<br/>
          2. For words autocompletion you just have to type the words first 2 characters and press ENTER to autocomplete
          the hole word.<br/>
          3. For expressions you have to type the 'Nice to' (start of expression)
          and a list with available autocompletions will appear and you can simply select one by clicking on it.</p>
      </div>
    </div>
  }
}

App.propTypes = {
  name: PropTypes.string,
  message: PropTypes.string,
  matchListFlag: PropTypes.any,
  exactExpression: PropTypes.string,
};