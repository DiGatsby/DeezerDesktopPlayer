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

	mainWindow.webContents.session.clearCache(function(){}) 

	// load deezer
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
	mainWindow.webContents.on('did-finish-load', () => {
		mainWindow.webContents.executeJavaScript(`
			var backButton = document.createElement('button');
			backButton.id = 'previous-page-button';
			backButton.onclick = window.history.back;
			backButton.appendChild(document.createTextNode('←'));
			var sidebarContainer = document.getElementsByClassName('sidebar-container')[0];
			sidebarContainer.insertBefore(backButton, sidebarContainer.firstChild);
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