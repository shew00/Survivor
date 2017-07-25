// Karma test file
'use strict';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
function objEqualsShallow(obj1, obj2) {
  /// <summary>
  /// Shallow compares two objects. Returns true if keys and values are same, false otherwise. Only
  /// checks enumerable keys.
  /// </summary>
  /// <param name="obj1" type="type">First object</param>
  /// <param name="obj2" type="type">Second object</param>
  const l = Object.keys(obj1).length;
  return Object.keys(obj1).filter(i=>obj1[i] ===obj2[i]).length === l;
}
function getComponentElement(component, data) {
  /// <summary>
  /// Gets vue component allowing DOM inspection of resulting markup.
  /// </summary>
  /// <param name="component" type="Vue component">Name of vue component to render</param>
  /// <param name="data" type="object">Data object to pass to component</param>
  /// <returns type="">Component. Use $el method to get DOM methods.</returns>
  const Ctor = Vue.extend(component);
  const vm = new Ctor().$mount();
  Object.keys(data).forEach(function (key) {
    vm[key] = data[key];
  });
  return vm;
}
describe('Test of VueScript.js', function () {
  describe('Basic loading of module', function () {
    it('View should return the main view object', function () {
      assert(vm === Object(vm));
    });
  });
  describe('Student component basic tests', function () {
    it('Student component should exist', function () {
      assert(vm.studentComponent === Object(vm.studentComponent));
    });
    it('Student component should render with correct data', function (done) {
      const testCases = [
        { name: 'Lebron', strikes: 0, isOut: false, id: 1 }, // 0 strike check
        { name: 'Kobe', strikes: 1, isOut: false, id: 1 }, // 1 strike check
        { name: 'KG', strikes: 2, isOut: false, id: 1 }, // 2 strike check
        { name: 'Shaq', strikes: 3, isOut: true, id: 1 }, // 3 strike check and isout
        { name: 'CP3', strikes: 2, isOut: true, id: 1 } // 2 strike check and isout
      ];
      testCases.forEach(function (d) {
        const v = getComponentElement(vm.studentComponent, d);
        console.log(`Render data: Name '${d.name}', Strikes: ${d.strikes}, isOut: ${d.isOut}`);
        Vue.nextTick(function () {
          let cn = v.$el.className,
              n = v.$el.querySelector('div:first-child').innerText,
              s = v.$el.querySelector('div.strikes').innerText;
          if (d.isOut) {
            assert(cn === 'student out', `Class ${cn} does not match 'student out.'`);
          }
          else {
            assert(cn === 'student', `Class ${cn} does not match 'student.'`);
          }
          assert(n === d.name, `Name ${n} does not match ${d.name}.`);
          assert(s === 'X'.repeat(d.strikes), `Strikes ${s} does not match ${'X'.repeat(d.strikes)}.`);
          done();
        });
      });
    });
    it('Student component should send one message to parent function when student is clicked multiple times in 1/2 second', function (done) {
      const data = { name: 'Pinky', strikes: 0, isOut: false, id: 1 };
      let timesCalled = 0;
      const v = new Vue({
        created () {
          this.$on('addStrike', function (data) {
            assert(data.id === 1, `Message callback was called but data id is incorrect: expected 1 got ${data.id}`);
            timesCalled++;
          });
        },
        components: {
          student: vm.studentComponent
        },
        data: {
          student: data
        },
        el: '#app',
        template: '<student :name="student.name" :strikes="student.strikes" :id="student.id" :is-out="student.isOut"></student>'
      });
      //const c = getComponentElement(vm.studentComponent, data);
      v.$mount();
      for (let i = 0; i <= 4; i++) {
        v.$children[0].incrementStrikes();
      }
      Vue.nextTick(function () {
        setTimeout(function () {
          assert(timesCalled === 1, `Expected to be called 1 time, instead called ${timesCalled} times`);
          v.$destroy();
          done();
        }, 500);
      });
    });
  });
  describe('Main vue component local storage tests', function () {
    it('It should load list of items in local storage', function () {
      const testList = [
        'Physics P1',
        'Algebra P2',
        'Chemistry P3'
      ];
      localStorage.removeItem('shewSurvivorSaveList');
      localStorage.setItem('shewSurvivorSaveList', JSON.stringify(testList));
      const storageList = vm.loadListFromStorage();
      assert(testList.filter((item, index) => item === storageList[index]).length === 3);
    });
    it('It should return null if no items in local storage', function () {
      localStorage.removeItem('shewSurvivorSaveList');
      const storageList = vm.loadListFromStorage();
      assert(storageList === null);
    });
    it('It should save and retrieve student list from local storage.', function () {
      const testCases = [
        { name: 'Lebron', strikes: 0, isOut: false }, // 0 strike check
        { name: 'Kobe', strikes: 1, isOut: false }, // 1 strike check
        { name: 'KG', strikes: 2, isOut: false }, // 2 strike check
        { name: 'Shaq', strikes: 3, isOut: true }, // 3 strike check and isout
        { name: 'CP3', strikes: 2, isOut: true } // 2 strike check and isout
      ];
      vm.vm.students = testCases;
      localStorage.removeItem('shewAll stars');
      vm.vm.localStorageItem = 'All stars';
      vm.vm.pageName = 'All stars';
      vm.vm.submitToLocalStorage();
      vm.vm.students = [];
      assert(vm.vm.students.length === 0, 'Failed to clear student list in test');
      vm.vm.loadFromLocalStorage();
      const matches = testCases.map((item, index) => Object.keys(item).filter(i=>testCases[index][i] === vm.vm.students[index][i]).length);
      assert(matches.every(item => item === 3));
    });
  });
  describe('Build student list tests', function () {
    const jsonData = [
      { Name: 'Lebron', row: 7, col: 6 },
      { Name: 'Kobe', Nickname: 'Black Mamba', row: 6, col: 5 },
      { Name: 'Kevin', Nickname: 'KG', row: 1, col: 2 },
      { Name: 'Russell', Nickname: '', row: 2, col: 5 }
    ];
    it('Function should return array with length matching input', function () {
      const returnData = vm.buildStudentList([jsonData[0]]);
      assert(Array.isArray(returnData));
      assert(returnData.length === [jsonData[0]].length, 'Array length didn\'t match');
    });
    it('If function is input a student with just a name, then it should return that name as student name', function () {
      const r = vm.buildStudentList([jsonData[0]])[0];
      const e = { name: 'Lebron', strikes: 0, isOut: false };
      assert(Object.keys(r).filter(i=>r[i] === e[i]).length === 3);
    });
    it('If function input is a student with a nickname, then it should return that name as a student name', function () {
      const r = vm.buildStudentList([jsonData[1]])[0];
      const e = { name: 'Black Mamba', strikes: 0, isOut: false };
      assert(Object.keys(r).filter(i=>r[i] === e[i]).length === 3);
    });
    it('If function input is a student with a blank nickname, then it should return original name as student name', function () {
      const r = vm.buildStudentList([jsonData[3]])[0];
      const e = { name: 'Russell', strikes: 0, isOut: false };
      assert(Object.keys(r).filter(i=>r[i] === e[i]).length === 3);
    });
    it('Student input length should match student output length', function () {
      const r = vm.buildStudentList(jsonData);
      assert(r.length === jsonData.length);
    });
  });
  describe('Main vue component fetch tests', function () {
    it('Get classes call should update class list', function (done) {
      const d = { 0: 'Physics - 1', 1: 'Alg 2 - 2' };
      fetchMock.mock('end:getClassList', d);
      vm.getClasses();
      assert(fetchMock.called(), 'getClasses was not called.');
      fetchMock.restore();
      setTimeout(function () {
        let c = vm.vm.classes;
        assert(Object.keys(c).filter(i=>c[i] === d[i]).length === 2, 'Classes array did not get updated.');
        done();
      }, 500);
    });
    it('Get students from class call should update student list', function (done) {
      const d = [{ Name: 'Jay Z', row: 7, col: 6 },
                { Name: 'Madonna', Nickname: 'Material Girl', row: 6, col: 5 },
                { Name: 'Christopher', Nickname: 'Biggy Smalls', row: 1, col: 2 },
                { Name: 'Celine', Nickname: '', row: 2, col: 5 }],
            r = { name: 'Material Girl', strikes: 0, isOut: false }; // Checking only line 2
      fetchMock.mock('end:getPresentStudents', d);
      vm.getStudentsFromClass(1);
      assert(fetchMock.called(), 'getPresentStudents was not called.');
      const parameters = JSON.parse(fetchMock.lastCall()[1].body);
      assert(parameters.classId === 1, `ClassId -- expected 1 but got ${parameters.classId}`);
      const date = new Date(parameters.attendanceDate);
      assert(Object.prototype.toString.call(date) === "[object Date]" && isFinite(date), `Invalid date format submitted: submitted value is ${parameters.attendanceDate}`);
      setTimeout(function () {
        let s = vm.vm.students;
        assert(Object.keys(s[1]).filter(i=>s[1][i] === r[i]).length === 3, 'Student array did not get updated.');
        fetchMock.restore();
        done();
      }, 500);
    });
  });
  describe('Main vue component undo tests', function () {
    it('Undo on single item', function () {
      const s = [
       { name: 'Lebron', strikes: 0, isOut: false }, // 0 strike check
       { name: 'Kobe', strikes: 1, isOut: false }, // 1 strike check
       { name: 'KG', strikes: 2, isOut: false }, // 2 strike check
       { name: 'Shaq', strikes: 3, isOut: true }, // 3 strike check and isout
       { name: 'CP3', strikes: 2, isOut: true } // 2 strike check and isout
      ];
      vm.vm.students = s;
      vm.vm.addStrike({ id: 0 });
      vm.vm.addStrike({ id: 2 });
      assert(vm.vm.students[0].strikes === 1, 'Add strikes did not add strikes');
      assert(vm.vm.students[2].isOut === true, 'Third strike did not make an out');
      vm.vm.undo();
      assert(vm.vm.students[2].strikes === 2, 'Undo did not remove last strike');
      assert(vm.vm.students[2].isOut === false, 'Undo did not change isOut');
    });
    it('Undo should not change strike count when addStrike hasn\'t been called', function () {
      const s = [{ name: 'John', strikes: 2, isOut: false }];
      vm.clearUndoList();
      vm.vm.students = s;
      vm.vm.students[0].strikes = 1;
      vm.vm.undo();
      assert(vm.vm.students[0].strikes === 1);
    });
    it('Undo should reset when adding a new student list', function () {
      const s = [{ name: 'James', strikes: 1, isOut: false }];
      vm.vm.students = s;
      vm.vm.addStrike({ id: 0 });
      vm.vm.addStrike({ id: 0 });
      vm.vm.typedList = 'Julianna, Joshua, Jared, Jeremy';
      vm.vm.submitList();
      vm.vm.undo();
      assert(vm.vm.students[0].strikes === 0);
    });
    it('Undo should work LIFO', function () {
      this.timeout(5000);
      const s = [
         { name: 'Lebron', strikes: 0, isOut: false }, 
         { name: 'Kobe', strikes: 1, isOut: false }, 
         { name: 'KG', strikes: 1, isOut: false }, 
         { name: 'Shaq', strikes: 3, isOut: true },
         { name: 'CP3', strikes: 2, isOut: false } 
      ];
      const order = [0, 2, 4, 0, 1], // Order of strikes to add
            result = [1, 1, 1, 3, 2]; // Final strikes result after undoing
      let i = 0;
      vm.vm.students = s;
      order.forEach(id => vm.vm.addStrike({ id }));
      for (let i = 0; i < 4; i++) {
        vm.vm.undo();
      }
      assert(objEqualsShallow(vm.vm.students.map(i => i.strikes), result), 'Strikes do not match');
    });
  });
  describe('Main vue component add students from list test', function () {
    it('Test for one student, no commas', function () {
      const s = { name: 'Dr J', strikes: 0, isOut: false };
      vm.vm.typedList = 'Dr J';
      vm.vm.submitList();
      assert(objEqualsShallow(s,vm.vm.students[0]));
    });
    it('Test for multiple students', function () {
      const s = [
        { name: 'Lebron', strikes: 0, isOut: false }, 
        { name: 'Kobe', strikes: 0, isOut: false }, 
        { name: 'KG', strikes: 0, isOut: false }, 
        { name: 'Shaq', strikes: 0, isOut: false },
        { name: 'CP3', strikes: 0, isOut: false } 
      ];
      const sList = s.map(item => item.name).join(',');
      vm.vm.typedList = sList;
      vm.vm.submitList();
      const matches = s.map((item, index) => objEqualsShallow(item, vm.vm.students[index]));
      assert(matches.every(item => item === true));
    });
  });
});