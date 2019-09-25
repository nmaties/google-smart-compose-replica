import React from 'react';
import ReactDOM from 'react-dom';
import './Chatbox.css';

const MAX_NUMBER_OF_LETTERS_CHECKED = 4;
const setCursor = (wordLength) => {
  const el = document.getElementById("box");
  const range = document.createRange();
  const sel = window.getSelection();
  range.setStart(el.childNodes[0], wordLength);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
};

class ChatBox extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      matchedTerm: '',
      matchedWord: false,
      html: '',
      words: {
        my: 'myself',
        mys: 'myselfness',
        myss: 'mysselfyness'
      }
    }
    this.chatBox = React.createRef();
  }

  componentDidMount() {
    ['keydown', 'keyup'].forEach(evt => {
      this.chatBox.current.addEventListener(evt, this.updateMessage, false);
    });
  }

  checkIfLastWordMatchesExistingWords (word)  {
    const wordMatchesCases = {
      2: () => this.state.words[word.slice(0, 2)] ? { word: this.state.words[word.slice(0, 2)], char: 2 } : {},
      3: () => this.state.words[word.slice(0, 3)] ? { word: this.state.words[word.slice(0, 3)], char: 3 } : {},
      4: () => this.state.words[word.slice(0, 4)] ? { word: this.state.words[word.slice(0, 4)], char: 4 } : {},
      default: {}
    };
    return word && wordMatchesCases[word.length] ? wordMatchesCases[word.length]() : wordMatchesCases.default
  }

  updateMessage = (e) => {
    this.autoCompleteWord(e);
  }

  triggerSuggestions = (e, text, char) => {
    const textBeforeUpdate = e.target.innerText;
    const autocompletion = this.state.words[text].slice(char, this.state.words[text].length);
    this.setState({
      matchedTerm: autocompletion,
      matchedWord: true,
      html: `${e.target.innerText}<span class="autocompletion-text">${autocompletion}</span>`
    });
    const newCursor = textBeforeUpdate.length;
    setCursor(newCursor);
  }

  autoCompleteWord = (e) => {
    if(e.which === 8) {
      return;
    }

    if(!Object.keys(this.state.words).length) {
      return;
    }

    if(e.which === 13 && this.state.matchedWord) {
      this.setState({
        html: e.target.innerText,
        matchedWord: false,
      });

      ReactDOM.findDOMNode(this.chatBox.current).focus();
      const updatedCursor = e.target.innerText.length;
      setCursor(updatedCursor);
      e.preventDefault();
    }

    if(e.which !== 13 && this.state.matchedWord) {
      this.setState({
        html: e.target.innerText.slice(0, -this.state.matchedTerm.length),
        matchedTerm: '',
        matchedWord: false
      });
      setCursor(this.state.html.length);
    }

    const inputtedText = e.target.innerText;
    const inputtedArr = inputtedText.split(' ');
    const lastWord = inputtedArr[inputtedArr.length - 1];
    const wordIfMatched = lastWord ? this.checkIfLastWordMatchesExistingWords(lastWord) : {};

    if (wordIfMatched.word) {
      const noAutocompletionText = inputtedText.split(' ');
      const matchText = noAutocompletionText[noAutocompletionText.length - 1].substring(0, wordIfMatched.char);
      this.triggerSuggestions(e, matchText, wordIfMatched.char);
    }
  }

  learnNewWords = () => {

  }


  render () {
    return (
      <div className="row">
        <div className="col-md-3">
          Learned words list:
        </div>
        <div className="card col-md-6">
        <h5 className="card-header">React google smart compose</h5>
        <div className="card-body">
        <div className="ChatBox">
            <div className="ChatBoxMessage">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">Message box</span>
              </div>
              <div
                ref={this.chatBox}
                contentEditable={true}
                className="form-control box"
                id="box"
                rows="5"
                dangerouslySetInnerHTML={ { __html: this.state.html } }
                aria-label="Message"/>
            </div>
            </div>
            <br/>
            <button type="button" className="btn btn-primary btn-lg btn-block">Learn more words</button>
          </div>
        </div>
      </div>
      </div>
    )
  }
}

export default ChatBox;