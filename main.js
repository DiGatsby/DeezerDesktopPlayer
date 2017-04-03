const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const globalShortcut = electron.globalShortcut

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow


// To be moved to it's own file
let keyRegisterFn = (...args) => globalShortcut.register(...args);
/*if (process.platform === 'win32') {
	const hook = require('ll-keyboard-hook-win');

	keyRegisterFn = (key, fn) => {
		hook.on('down', key, fn);
	};
}*/

function createWindow () {

	// ----------------------------------------------------------

	//const keyShortcuts = require('./features/keyShortcuts')
	keyRegisterFn('MediaPreviousTrack', () => {
		mainWindow.webContents.executeJavaScript(`
			$('.control-prev').trigger('click');
			`)
	});

	keyRegisterFn('MediaPlayPause', () => {
		mainWindow.webContents.executeJavaScript(`
			$('.control-play').trigger('click');
			`)		
	});

	keyRegisterFn('MediaNextTrack', () => {
		mainWindow.webContents.executeJavaScript(`
			$('.control-next').trigger('click');
			`)
	});	

	// -----------------------------------------------------------

	// Create the browser window.
	if (process.platform == 'darwin') {
		mainWindow = new BrowserWindow({width: 1080, height: 680, titleBarStyle: 'hidden'})
	} else {
		mainWindow = new BrowserWindow({width: 1080, height: 680 })//frame: false})
	}

	// and load the index.html of the app.
	mainWindow.loadURL(url.format({
		pathname: 'www.deezer.com/',
		protocol: 'https:',
		slashes: true
	}))

	mainWindow.webContents.on('dom-ready', (event) => {
		console.log("DOM ready");
		/*mainWindow.webContents.executeJavaScript(`
			var script = document.createElement('script');
			script.src = 'https://code.jquery.com/jquery-2.2.4.min.js';
			script.type = 'text/javascript';
			document.getElementsByTagName('head')[0].appendChild(script);
			`)*/
		mainWindow.webContents.executeJavaScript(`
			var customCSS = document.createElement('link');
			customCSS.rel = 'stylesheet';
			customCSS.type = 'text/css';
			customCSS.href = 'https://rawgit.com/Viltzu/DeezerDesktopPlayer/master/custombase.css';
			document.getElementsByTagName('head')[0].appendChild(customCSS);
			`)			
	})

	// Open the DevTools.
	//mainWindow.webContents.openDevTools()

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null
	})
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow()
	}
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
