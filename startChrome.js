var chromedriver = require('chromedriver');
module.exports = {
  before: function (done) {
    chromedriver.start();
    console.log('Chrome driver started\n');
    done();
  },

  after: function (done) {
    chromedriver.stop();

    done();
  }
};
