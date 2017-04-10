const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const globalShortcut = electron.globalShortcut

const path = require('path')
const url = require('url')

const CSSURL = "https://cdn.rawgit.com/Viltzu/DeezerDesktopPlayer/a14e272a/deezerbdp.css"
const JSURL = "https://cdn.rawgit.com/Viltzu/DeezerDesktopPlayer/a14e272a/deezerbdp.js"

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow


// To be moved to it's own file
let keyRegisterFn = (...args) => globalShortcut.register(...args);

function createWindow () {

	// ----------------------------------------------------------

	//const keyShortcuts = require('./features/keyShortcuts')
	keyRegisterFn('MediaPreviousTrack', () => {
		mainWindow.webContents.executeJavaScript(`previousTrack();`)
	});

	keyRegisterFn('MediaPlayPause', () => {
		mainWindow.webContents.executeJavaScript(`pauseUnpauseTrack();`)		
	});

	keyRegisterFn('MediaNextTrack', () => {
		var platform = process.platform
		mainWindow.webContents.executeJavaScript(`nextTrack();`)
	});	

	// -----------------------------------------------------------

	// Create the browser window.
	if (process.platform == 'darwin') {
		mainWindow = new BrowserWindow({width: 1080, height: 680, titleBarStyle: 'hidden', title: 'Deezer BDP'})
	} else {
		mainWindow = new BrowserWindow({width: 1080, height: 680, title: 'Deezer BDP'})//frame: false})
	}
	mainWindow.setTitle('Deezer BDP');

	//mainWindow.webContents.session.clearCache(function(){}) 

	// load deezer
	mainWindow.loadURL(url.format({
		pathname: 'www.deezer.com/',
		protocol: 'https:',
		slashes: true
	}))

	mainWindow.webContents.on('dom-ready', (event) => {
		console.log("DOM ready");

		mainWindow.webContents.executeJavaScript(`
			var customCSS = document.createElement('link');
			customCSS.rel = 'stylesheet';
			customCSS.type = 'text/css';
			customCSS.href = '${CSSURL}';
			document.getElementsByTagName('head')[0].appendChild(customCSS);

			var customJS = document.createElement('script');
			customJS.src = '${JSURL}';
			document.getElementsByTagName('head')[0].appendChild(customJS);
			`)
	})

	mainWindow.on('closed', function () {
		mainWindow = null
	})
}
app.on('ready', createWindow)

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow()
	}
})