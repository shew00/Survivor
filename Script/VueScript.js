/*eslint-env es6*/
/* global Vue */
/* global fetch */

var vm = (function () {
  'use strict';
  const undoList = [];
  const studentComponentRender = {
    props: {
      name: {
        type: String,
        required: true
      },
      strikes: {
        type: Number,
        default: 0
      },
      isOut: {
        type: Boolean,
        default: false
      },
      id: Number
    },
    computed: {
      strikesDisplay: function () {
        return 'X'.repeat(this.strikes);
      }
    },
    methods: {
      incrementStrikes: debounce(function () {
        this.$parent.$emit('addStrike', { id: this.id });
      }, 500, true)
    },
    //template: '<span class=\'student\' :class=\'{out: isOut}\' @click = \'incrementStrikes\'><div>{{name}}</div><div class=\'strikes\'>{{strikesDisplay}}</div></span>'
    render(createElement) {
      return createElement(
        'span',
        {
          'class': {
            student: true,
            out: this.isOut
          },
          on: {
            click: this.incrementStrikes
          }
        },
        [
          createElement('div', this.name),
          createElement('div', {
            attrs: {
              'class': 'strikes'
            }
          }, this.strikesDisplay)
        ]
      );
    }
  };
  const vm = new Vue({
    el: '#app',
    components: {
      'student': studentComponentRender
    },
    data: {
      students: [
          { name: 'Kobe Bryant', strikes: 0, isOut: false },
          { name: 'Lebron James', strikes: 1, isOut: false },
          { name: 'Kevin Durant', strikes: 3, isOut: true }
      ],
      showOptions: false,
      classes: { 0: 'no classes loaded' },
      curClass: 1,
      MAX_STRIKES: 3,
      typedList: "",
      localStorageItemList: [],
      localStorageItem: "",
      pageName: ""
    },
    methods: {
      newClassSelected () {
        getStudentsFromClass(parseInt(this.curClass, 10));
        clearUndoList();
      },
      submitList () {
        let newStudentList = this.typedList.split(','),
            vm = this;
        vm.students = [];
        newStudentList.forEach(item => {
          vm.students.push({
            name: item,
            strikes: 0,
            isOut: false
          });
        });
        clearUndoList();
      },
      submitToLocalStorage () {
        let listArray = loadListFromStorage() || [],
            listIndex = listArray.indexOf(this.pageName);
        if (listIndex === -1) {
          listArray.push(this.pageName);
          this.localStorageItemList = listArray;
        }
        localStorage.setItem("shew" + this.pageName, JSON.stringify(this.students));
        localStorage.setItem("shewSurvivorSaveList", JSON.stringify(listArray));
      },
      loadFromLocalStorage () {
        if (this.localStorageItem !== "") {
          this.students = readFromStorage('shew' + this.localStorageItem);
          clearUndoList();
        }
      },
      undo () {
        const item = undoList.pop();
        if (item !== undefined) {
          Vue.set(this.students, item.id, {
            name: this.students[item.id].name,
            strikes: item.strikes,
            isOut: false
          });
        }
      },
      undoDebounce: debounce(function () {
        this.undo();
      }, 250, true),
      addStrike (data) {
        const student = this.students[data.id];
        if (student.strikes === this.MAX_STRIKES) return;
        undoList.push({ id: data.id, strikes: student.strikes });
        Vue.set(this.students, data.id, {
          name: student.name,
          strikes: student.strikes + 1,
          isOut: student.strikes + 1 === this.MAX_STRIKES
        });
      }
    },
    created () {
      this.$on('addStrike', this.addStrike);
      getClasses();
      this.localStorageItemList = loadListFromStorage();
    }
  });

  function getClasses() {
    return fetch('../../classList/getClassList', {
      method: 'post'
    })
      .then(res =>
        res.json())
      .then(json =>
        vm.classes = json);
  }
  function getStudentsFromClass(classId) {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds

    return fetch('../../attendance/getPresentStudents', {
      method: 'post',
      body: JSON.stringify({
        classId: classId,
        attendanceDate: (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1)
      }),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    .then(res =>
      res.json())
    .then(json =>
      vm.students = buildStudentList(json));
  }
  function buildStudentList(json) {
    'use strict';
    const studentList = json;
    let nameList = [];
    studentList.forEach((student) => {
      if (student.Nickname) {
        nameList.push({ name: student.Nickname, strikes: 0, isOut: false });
      }
      else {
        nameList.push({ name: student.Name, strikes: 0, isOut: false });
      }
    });
    return nameList;
  }
  function readFromStorage(itemName) {
    return JSON.parse(localStorage.getItem(itemName));
  }
  function loadListFromStorage() {
    let itemList = readFromStorage('shewSurvivorSaveList');
    if (!itemList === null && itemList.length === 1) itemList.unshift('');
    return itemList;
  }
  function clearUndoList() {
    undoList.length = 0;
  }
  function debounce(func, wait, immediate) {
    // Source: https://stackoverflow.com/questions/24004791/can-someone-explain-the-debounce-function-in-javascript
    var timeout;

    return function () {
      var context = this,
          args = arguments;

      var callNow = immediate && !timeout;

      clearTimeout(timeout);

      timeout = setTimeout(function () {

        timeout = null;

        if (!immediate) {
          func.apply(context, args);
        }
      }, wait);

      if (callNow) func.apply(context, args);
    };
  }
  // Debug: start
  return {
    vm: vm,
    studentComponent: studentComponentRender,
    getClasses: getClasses,
    getStudentsFromClass: getStudentsFromClass,
    buildStudentList: buildStudentList,
    readFromStorage: readFromStorage,
    loadListFromStorage: loadListFromStorage,
    debounce: debounce,
    clearUndoList: clearUndoList
  };
  // Debug: end
})();