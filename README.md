## Introduction
Survivor is an easy to install and use browser tracker for students to play Survivor, a review game based on [Grudgeball](http://toengagethemall.blogspot.com/2013/02/grudgeball-review-game-where-kids-attack.html) by Kara Wilkins. Originally written in [AngularJS](http://angularjs.org), I rewrote it using [Vue](https://vuejs.org) to gain experience with the framework.

## Installation
You don't need to run any install programs to set up Survivor. Just copy the index.html file and the Image, Script, and Stylesheet folders to any location on a hard drive or a flash drive. You don't even need administrator rights. 

## Use
Open the index.html file using either Chrome, Firefox, or Safari. To use Edge you'll need to run the file from a webserver.

To create your own student or team list:
1. Click the student desk icon.
2. Type (or paste in) a list of comma separated student names.
3. Click use list. 
4. Click the student desk icon to hide the student data source section.

To save a student list:
1. Click the student desk icon.
2. Type in a name for the list under the "From Local Storage" section.
3. Click save page. Note that this will save both the student list and the number of strikes they have.

Note that student lists are saved in a browser's local storage. This means that you'll need to use the *same* computer and *same* web browser when you want to retrieve your saved list. 

To retrieve a saved student list:
1. Click the student desk icon.
2. Click the dropdown next to "Load Results:", and select the name of the saved list.
3. The student list should update automatically.

If you mistakingly give a student a strike, you can undo the mistake by clicking the arrow button under the student desk button. You can undo clicks all the way back to the point where you loaded the student list.

The list is smart board friendly. That means that multiple rapid clicks on a student will not be registered. If you want to add two strikes to a student or team, you must wait 0.25 seconds between clicks.

## Suggested Lesson Plans
This is a great review game for students. You can have students compete individually or in teams. Here's how I used it:

1. Choose whether you want students to compete individually or in teams. You can use either student names or team names in Survivor.
2. Give the class a review question and some appropriate time to work on it.
3. Walk around and check for correct answers. Write down which student answered correctly.
4. Call out each student with a correct answer. They vote against *another* student and must do so publically. Give that student they voted against a strike. A student who gets three strikes is out. They cannot win, but like the Survivor TV show, they can still vote against other students if they get a correct answer.
5. Repeat the process until only one student is left without three strikes. They are the winner.

This game works because:
1. Even when students get three strikes, they can still vote against the person who voted against them. This gives students incentive to stay in the game even when they've been voted out.
2. Students love to get revenge against each other. This is why students must vote against each other publically.
3. Whenever my class has played, students tend to make alliances and eliminate the top students first. Usually the student that wins is not one that is normally recognized.

The biggest problem with the game is the amount of time spent voting. I try to reduce this by giving each student 5 seconds to make their voting choice. If they don't then I'll vote for that student, usually by voting against their friends.

If you have a large class then expect the game to take more than one class period. You can save the game to resume it later, or you can just declare a winner or winner(s) at the end of the class period.

## License
[MIT](http://opensource.org/licenses/MIT)

## Test Installation
If you do want to run the included tests, then you'll need to have [node](https://nodejs.org) installed, [Google Chrome](https://www.google.com/Chrome), as well as either [npm](https://npmjs.com) or [yarn](https://github.com/yarnpkg/yarn). Copy all files and folders to your hard drive. From that directory, open a command prompt and install the dependencies using the following command:

###NPM
```
npm install
```

###Yarn
```
yarn
```

There are two tests: unit tests using [Karma](https://github.com/karma-runner/karma) and functional / end-to-end tests using [Nightwatch](nightwatchjs.org). Nightwatch requires that you set up ChromeDriver to run its tests. The process is complicated and is detailed [here](http://nightwatchjs.org/gettingstarted#browser-drivers-setup).

To execute the tests, use the following commands:

###NPM
```
npm test
npm run test-client
```
###Yarn
```
yarn test
yarn run test-client
```

