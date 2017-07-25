var survivorCommands = {
  optionsToggle() {
    return this.click('@studentButton');
  },
  listClick() {
    this.api.pause(250);
    return this.click('@listButton');
  },
  saveClick() {
    this.api.pause(250);
    return this.click('@saveButton');
  },
  undoClick() {
    return this.click('@undoButton');
  },
  studentClick(num) {
    return this.click(`.student:nth-of-type(${num})`);
  },
  setList(names) {
    return this.clearValue('@typedList')
      .setValue('@typedList', names.join())
      .listClick();  
  },
  getStrikes(num) {
    return `.student:nth-of-type(${num}) > .strikes`;
  },
  getStudentName(num) {
    return `.student:nth-of-type(${num}) > div:first-child`;
  }
};
module.exports = {
  url: 'http://localhost:3000/survivor/',
  elements: {
    appDiv: {
      selector: 'div#app'
    },
    optionsDiv: {
      selector: 'div.options'
    },
    studentButton: {
      selector: 'span.classOptions:first-of-type'
    },
    undoButton: {
      selector: 'span.classOptions:last-of-type'
    },  
    typedList: {
      selector: 'textarea'
    },
    listButton: {
      selector: 'div.col:last-child > span.saveButton'
    },
    saveButton: {
      selector: 'div.col:first-of-type > span.saveButton'
    },
    localStoragePageName: {
      selector: 'input:first-of-type'
    },
    lastLocalStorageItem: {
      selector: 'div.col:first-of-type > select > option:last-child'
    },
    localStorageSelect: {
      selector: 'div.col:first-of-type > select'
    }
  },
  commands: [survivorCommands]
};