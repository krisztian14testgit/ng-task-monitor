// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
// chrome_bin setting: https://gist.github.com/kenvontucky/f5c4bdd2fa515f56a7ed0fe343984e95
const process = require('process');
const fs = require('fs');
const path = require('path');

function resolveWindowsPuppeteerChrome() {
  const userProfile = process.env.USERPROFILE;
  if (!userProfile) {
    return null;
  }

  const chromeCacheRoot = path.join(userProfile, '.cache', 'puppeteer', 'chrome');
  if (!fs.existsSync(chromeCacheRoot)) {
    return null;
  }

  const candidates = fs
    .readdirSync(chromeCacheRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('win64-'))
    .map((entry) => path.join(chromeCacheRoot, entry.name, 'chrome-win64', 'chrome.exe'))
    .filter((candidatePath) => fs.existsSync(candidatePath))
    .sort()
    .reverse();

  return candidates.length > 0 ? candidates[0] : null;
}

function resolveChromeBin() {
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) {
    return process.env.CHROME_BIN;
  }

  try {
    const puppeteer = require('puppeteer');
    const maybePath = puppeteer.executablePath();

    // Puppeteer < 25 returns string synchronously.
    if (typeof maybePath === 'string' && fs.existsSync(maybePath)) {
      return maybePath;
    }
  } catch (e) {
    // Ignore and continue with fallbacks.
  }

  if (process.platform === 'win32') {
    const winChrome = resolveWindowsPuppeteerChrome();
    if (winChrome) {
      return winChrome;
    }
  }

  const linuxFallbacks = ['/usr/bin/google-chrome', '/usr/bin/chromium-browser', '/usr/bin/chromium'];
  for (const fallbackPath of linuxFallbacks) {
    if (fs.existsSync(fallbackPath)) {
      return fallbackPath;
    }
  }

  return process.env.CHROME_BIN || '/usr/bin/google-chrome';
}

process.env.CHROME_BIN = resolveChromeBin();

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
      dir: path.join(__dirname, './coverage/ng-task-monitor'),
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
