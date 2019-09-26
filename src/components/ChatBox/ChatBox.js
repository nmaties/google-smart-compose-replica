import React from 'react';
import ReactDOM from 'react-dom';
import './Chatbox.css';
import { WordsList } from '../../dictionaries/words';

const MAX_NUMBER_OF_LETTERS_CHECKED = 4;
const MIN_CHAR_DIFFERENCE_BETWEEN_WORD_AND_ABBR = 2;

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
      words: WordsList.getWordsList
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
    if(e.which === 32 && e.type === 'keydown' && this.state.toggleAutoComplete) {
      this.learnNewWords();
    }
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
    const fullText = this.chatBox.current.innerText;
    const validText = fullText.split(' ').filter((word) => {
      if(word.length >= MAX_NUMBER_OF_LETTERS_CHECKED) {
        return word;
      }
    });

    if(!validText.length) {
      return;
    }
    
    const existingWordsList = WordsList.getWordsList;
    const tempWordsList = {};
    validText.forEach((word) => {
      const isWordAlreadyInList = (wordToCheck) => !!Object.values(WordsList.getWordsList).filter(word => word === wordToCheck).length
      const isAbbrAlreadyInList = (abbrToCheck) => !!Object.keys(WordsList.getWordsList).filter(abbr => abbr === abbrToCheck).length;
      const twoWordSubstring = word.substring(0, 2);
      const threeWordSubstring = word.substring(0, 3);
      const fourWordSubstring = word.substring(0, 4);
      const isWordWithinMinLength = (substring) =>  word.length - substring.length >= MIN_CHAR_DIFFERENCE_BETWEEN_WORD_AND_ABBR;

      if(!existingWordsList[twoWordSubstring] && isWordWithinMinLength(twoWordSubstring) && !isWordAlreadyInList(word) && !isAbbrAlreadyInList(twoWordSubstring)) {
        tempWordsList[twoWordSubstring] = word;
        return;
      }

      if(!existingWordsList[threeWordSubstring] && isWordWithinMinLength(threeWordSubstring) && !isWordAlreadyInList(word) && !isAbbrAlreadyInList(threeWordSubstring)) {
        tempWordsList[threeWordSubstring] = word;
        return;
      }

      if(!existingWordsList[fourWordSubstring] && isWordWithinMinLength(fourWordSubstring) && !isWordAlreadyInList(word) && !isAbbrAlreadyInList(fourWordSubstring)) {
        tempWordsList[fourWordSubstring] = word;
        return;
      }
    });

    WordsList.setWordsList = tempWordsList;
    this.setState({
      ...this.state,
      words: WordsList.getWordsList
    })
  }

  render () {
    const { words } = this.state;
    const wordsAbbrList = Object.keys(words);
    return (
      <div className="row">
        <div className="col-md-3">
          {
            wordsAbbrList.length ?<div className="wordsList">
           <ul className="list-group">
            <li className="list-group-item active">Learned words&nbsp; 
              <span className="badge badge-warning badge-pill"> {wordsAbbrList.length}</span>
            </li>
            {
              wordsAbbrList.map(abbr => {
                return (<li className="list-group-item" key={abbr}>{ `${abbr} - ${this.state.words[abbr]}` }</li>)
              })
            }
            </ul>
          </div>  : null
          }
        </div>
        <div className="card col-md-6">
        <h5 className="card-header">
          Google smart compose replica
          {/* <button type="button" onClick={() => this.toggleAutoComplete()} className="btn btn-sm btn-outline-danger float-right">
            Autocomplete&nbsp;
            <span className="badge badge-primary"></span>
          </button> */}
        </h5>
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
          </div>
          <div>
            <ul>
              <li>
                To autocomplete an existing abbreviation from the list press ENTER.
              </li>
              <li>
                Words must have a min length of 4 characters.
              </li>
              <li>
                Words must have at least 2 characters between the abbreviation and the actual word.
              </li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    )
  }
}

export default ChatBox;