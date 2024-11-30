// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('node:path')
const EventEmitter = require('events')

const loadingEvents = new EventEmitter()
let mainWindow = null
let splashWindow = null

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // Add splash load file
  splashWindow = new BrowserWindow({
    width: 600,
    height: 500,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  loadingEvents.on('finishedProgressBar', async () =>  {
    // and load the index.html of the app.
    splashWindow.close();
    await mainWindow.loadFile('src/pages/login-google.html')
    mainWindow.center();
    mainWindow.maximize();
    mainWindow.show();
  })

  loadingEvents.on('progressBar', async data => {
    splashWindow.webContents.send('progressBar', data);

    setTimeout(() => loadingEvents.emit('finishedProgressBar'), 1000)
  })

  splashWindow.loadFile('src/pages/splash.html');
  splashWindow.center();
  setTimeout(function () {
    loadingEvents.emit('progressBar', {percentage: 100, step: 2})
  }, 5000);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // if (splashWindow) {
  //   splashWindow.on('closed', () => {
  //     splashWindow.removeAllListeners()
  //     splashWindow = null
  //   })
  // }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed',  () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
