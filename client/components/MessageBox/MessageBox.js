import React, { Component } from 'react';
import wordsAutocompletion from '../../dictionaries/words';
import expressionAutocompletion from "../../dictionaries/expressions";
import ReactDOM from 'react-dom';

const verifyText = (txt) =>{
  const wordsList = Object.keys(wordsAutocompletion).map(el => el.toLowerCase());
  if(wordsList.indexOf(txt.toLowerCase()) > -1){
    return true;
  }
  return false;
};

const setCursor = (wordLength) => {
  let el = document.getElementById("message-box");
  let range = document.createRange();
  let sel = window.getSelection();
  range.setStart(el.childNodes[0], wordLength);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
};

export class MessageBox extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.detectChange = this.detectChange.bind(this);

    this.state = {
      matchWord: false,
      matchExpression: false,
      html: ''
    }

  }

  componentDidMount() {
    ['keyup','keydown'].forEach( evt => {
      this.myRef.current.addEventListener(evt, this.detectChange, false);
    });
  }

  shouldComponentUpdate (nextProps) {
    if(nextProps.exactExpression !== this.props.exactExpression){
      ReactDOM.findDOMNode(this.myRef.current).focus();
      this.myRef.current.innerText = this.myRef.current.innerText.replace('Nice to', nextProps.exactExpression);
      setCursor(this.myRef.current.innerText.length);
    }
    return true;
  }

  triggerAutocompletionList(text, evt){
    if(!wordsAutocompletion[text]){
      return;
    }
    let autocompletion = wordsAutocompletion[text].slice(2, wordsAutocompletion[text].length);
    this.setState({
      html: evt.target.innerText +
      `<span class="autocompletion-text">${autocompletion}</span>`
    });
    this.setState({ matchWord: true});
    let cursorIndex = evt.target.innerText.length - wordsAutocompletion[text].length + 2;

    setCursor(cursorIndex);
  }

  detectChange(evt) {

    if(evt.which === 8){
      return;
    }

    let text = evt.target.innerText.split(' ');
    text = text[text.length - 1].slice(-2);

    expressionAutocompletion[evt.target.innerText.slice(-7)] ? this.props.matchExpression(true) : this.props.matchExpression(false);

    if(this.state.matchWord && evt.which !== 13) {
      let noAutocompletionText = evt.target.innerText.split(' ');
      let matchText = noAutocompletionText[noAutocompletionText.length - 1].substring(0, 2);
      noAutocompletionText[noAutocompletionText.length - 1] = matchText;
      this.setState({
        html: noAutocompletionText.join(' '),
        matchWord: false
      });

      setCursor(evt.target.innerText.length);
    }

    if (verifyText(text)) {
      this.triggerAutocompletionList(text, evt);
    }

    if(this.state.matchWord && evt.which === 13){
      this.setState({
        html: evt.target.innerText,
        matchWord: false
      });

      ReactDOM.findDOMNode(this.myRef.current).focus();
      setCursor(evt.target.innerText.length);
      evt.preventDefault();
    }

  }

  render() {
    return <div
        contentEditable={true}
        ref={this.myRef}
        id="message-box"
        data-testid="message-box-test-id"
        className="form-control textarea-custom"
        dangerouslySetInnerHTML={{__html: this.state.html }}
      ></div>
  }
}