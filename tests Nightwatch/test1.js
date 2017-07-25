describe('Survivor Vue Test', function () {
  'use strict';

  function compareStudents(survivor, expectedValue) {
    /// <summary>
    /// Compares student names on page with passed in array values. Order must match. Function has side effects.
    /// </summary>
    /// <param name="survivor" type="object">Survivor instance passed to it function</param>
    /// <param name="expectedValue" type="array">Array of student names</param>
    /// <returns>undefined (no return value)</returns>
    expectedValue.forEach((value, index) => survivor.expect.element(survivor.getStudentName(index + 1)).text.to.equal(value));
  }
  function compareStrikes(survivor, expectedValue) {
    /// <summary>
    /// Compares strikes displayed on page with passed in array value.
    /// </summary>
    /// <param name="survivor" type="object">Survivor instance passed to it function</param>
    /// <param name="expectedValue" type="array">Array of X's signifying strikes</param>
    /// <returns>undefined (no return value)</returns>
    expectedValue.forEach((value, index) => survivor.expect.element(survivor.getStrikes(index + 1)).text.to.equal(value));
  }

  describe('with Nightwatch', function () {
    var survivor = {};

    before(function (client, done) {
      done();
    });

    after(function (client, done) {
      client.end(function () {
        done();
      });
    });

    afterEach(function (client, done) { 
      done();
    });

    beforeEach(function (client, done) {
      done();
    });

    it('Loads Survivor Vue main page and launches app', function (client) {
      survivor = client.page.SurvivorVue();
      survivor.navigate()
        .assert.title('Survivor Vue Version');
      survivor.expect.element('@appDiv').to.be.visible;
      survivor.expect.element('@optionsDiv').to.not.be.visible;
    });
    it('Student button opens and closes student data source section', function (client) {
      survivor.optionsToggle().expect.element('@optionsDiv').to.be.visible;
      survivor.optionsToggle().expect.element('@optionsDiv').to.not.be.visible;
    });
    it('Can add names using typed list', function (client) {
      const studentList = ['Kobe Bryant', 'Lebron James'];
      let c = 0;
      survivor.optionsToggle()
        .expect.element('@typedList').to.be.visible;
      survivor.setList(studentList);
      client.pause(250);
      //Ensure names get added and they match
      compareStudents(survivor, studentList);
      //client.elements('css selector', '.student > div:first-child', function (result) {
      //  result.value.forEach(function (v) {
      //    client.elementIdText(v.ELEMENT, function (res) {
      //      client.assert.equal(res.value, studentList[c++]);
      //    });
      //  });
      //});
      // Ensure each student has zero strikes
      compareStrikes(survivor, studentList.map(i => ''));
    });
    it('Can save names into local storage', function (client) {
      const studentList1 = ['Kevin Durant', 'Stephen Curry', 'Russel Westbrook'],
            studentList2 = ['Mickey Mouse', 'Minnie Mouse'];
      //let found = false;
      survivor.setList(studentList1);
      client.pause(250);
      survivor.setValue('@localStoragePageName', 'test17')
        .saveClick();
      client.pause(250);
      survivor.expect.element('@lastLocalStorageItem').text.to.equal('test17');
      survivor.setList(studentList2);
      client.pause(250);
      compareStudents(survivor, studentList2);
      survivor.setValue('@localStorageSelect', 'test17');
      client.pause(250);
      compareStudents(survivor, studentList1);
    });
    it('Undo button will undo last clicks', function (client) {
      const studentList1 = ['Kevin Durant', 'Stephen Curry', 'Russel Westbrook'];
      survivor.setList(studentList1);
      [2, 3, 2, 1].forEach(i => {
        client.pause(500);
        survivor.studentClick(i);
      });
      compareStrikes(survivor, ['X', 'XX', 'X']);
      [
        ['', 'XX', 'X'],
        ['', 'X', 'X'],
        ['', 'X', ''],
        ['', '', ''],
        ['', '', '']
      ].forEach(i => {
        client.pause(500);
        survivor.undoClick();
        compareStrikes(survivor, i);
      });
    });
    it('Cannot add more than three strikes', function (client) {
      const studentList1 = ['Kevin Durant', 'Stephen Curry', 'Russel Westbrook'];
      survivor.setList(studentList1);
      [1, 1, 1].forEach(i => {
        client.pause(500);
        survivor.studentClick(i);
      });
      compareStrikes(survivor, ['XXX', '', '']);
      client.pause(500);
      survivor.studentClick(1);
      compareStrikes(survivor, ['XXX', '', '']);
    });
  });
});

