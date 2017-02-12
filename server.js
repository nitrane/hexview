
var process = require('process');
var app = require('app');
var BrowserWindow = require('browser-window');
var Menu = require ('menu');
var dialog = require ('dialog');

var mainWindow = null;

//require('crash-reporter').start();

/**
 * Open a file for hex viewing.
 */
function openFile (filenames) {  
  mainWindow.send ('load-file', filenames[0]);
}

/**
 * Prompt the user to select a file.
 */
function openFileDialog () {
  
  var filters = [
    { name: 'All Files', extensions: ['*'] }
  ];
  
  var options = { 
    title: "Open File...", 
    properties: ['openFile'],
    filters: filters 
  }; 
  
  dialog.showOpenDialog (mainWindow, options, openFile);
}

/**
 * Handle the window being closed.
 */
app.on('window-all-closed', function() {
  app.quit();
});

/**
 * Handle files being openned via the shell.
 */
app.on('open-file', function (event, path) {
  openFile ([path]);
});

/**
 * Initialize the application.
 */
app.on('ready', function() {
  
  mainWindow = new BrowserWindow ({width: 800, height: 600});
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
  
  mainWindow.webContents.on ('did-finish-load', function () {
    mainWindow.send ('close-file');
  });
  
  var mainmenu = [
    {
      label: 'File',
      submenu: [
        { 
          label: 'Open...', 
          click: openFileDialog 
        },
        {
          label: "Close",
          click: function () { mainWindow.send ('close-file'); }
        },
        {
          label: 'Exit',
          click: function () { mainWindow.close (); }
        }
      ],
    }
  ];
  
  var menu = Menu.buildFromTemplate (mainmenu);
  if (process.platform == 'darwin') {
    Menu.setApplicationMenu (menu);
  } else {
    mainWindow.setMenu (menu);
  }
});
