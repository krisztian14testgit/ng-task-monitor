// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
// chrome_bin setting: https://gist.github.com/kenvontucky/f5c4bdd2fa515f56a7ed0fe343984e95
const process = require('process');
const fs = require('fs');
try {
  const puppeteerPath = require('puppeteer').executablePath();
  // Check if the puppeteer Chrome binary actually exists
  if (fs.existsSync(puppeteerPath)) {
    process.env.CHROME_BIN = puppeteerPath;
  } else {
    // Fallback to system Chrome if puppeteer binary doesn't exist
    process.env.CHROME_BIN = process.env.CHROME_BIN || '/usr/bin/google-chrome';
  }
} catch (e) {
  // Fallback to system Chrome if puppeteer is not available
  process.env.CHROME_BIN = process.env.CHROME_BIN || '/usr/bin/google-chrome';
}

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/ng-task-monitor'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },
    customLaunchers: {
      MyHeadlessChromium: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-gpu',
          '--remote-debugging-port-9222'
        ]
      }
    },
    reporters: ['progress', 'kjhtml', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['MyHeadlessChromium'],
    // karma exits when test running is over
    singleRun: true,
    restartOnFileChange: true
  });
};
