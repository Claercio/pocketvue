'use strict'

const electron = require('electron')
const path = require('path')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const dialog = require('electron').dialog
const Store = require('./store.js');

let mainWindow
let config = {}
let authUrl = "http://www.google.com";
if (process.env.NODE_ENV === 'development') {
  config = require('../config')
  config.url = `http://localhost:${config.port}`
} else {
  config.devtron = false
  config.url = `file://${__dirname}/dist/index.html`
}

const settings = require('electron-settings');

settings.set('userSettings', {
  accessToken: '123',
  userName: 'PocketUser1'
}).then(() => {
  settings.get('userSettings.accessToken').then(val => {
    console.log(val);
    // => "Cosmo"
  });
});


console.log(settings.getSettingsFilePath());
// First instantiate the class
const store = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'user-settings',
  defaults: {
    // 800x600 is the default size of our window
    requestToken: null,
    accessToken: null,
    loggedIn: false
  }
});


function createWindow () {
  /**
   * Initial window options
   */
  
  mainWindow = new BrowserWindow({
    webPreferences: {webSecurity: false},
    height: 600,
    width: 800,
    titleBarStyle: 'hidden-inset'
  })

  mainWindow.loadURL(config.url)

  if (process.env.NODE_ENV === 'development') {
    BrowserWindow.addDevToolsExtension(path.join(__dirname, '../node_modules/devtron'))

    let installExtension = require('electron-devtools-installer')

    installExtension.default(installExtension.VUEJS_DEVTOOLS)
      .then((name) => mainWindow.webContents.openDevTools())
      .catch((err) => console.log('An error occurred: ', err))
  }
  mainWindow.webContents.openDevTools()
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('resize', () => {
    // The event doesn't pass us the window size, so we call the `getBounds` method which returns an object with
    // the height, width, and x and y coordinates.
    // let { width, height } = mainWindow.getBounds();
    // Now that we have them, save them using the `set` method.
    // store.set('windowBounds', { width, height });
  });
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})



app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
