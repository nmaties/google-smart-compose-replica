export const WordsList = {
  get getWordsList() {
    return this.wordsList ? this.wordsList : {};
  },
  set setWordsList(newWords) {
    if(!this.wordsList) {
      this.wordsList = {};
    }
    this.wordsList = {
      ...this.wordsList,
      ...newWords
    };
  }
}