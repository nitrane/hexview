
var process = require('process');
var app = require('app');
var BrowserWindow = require('browser-window');
var Menu = require ('menu');
var dialog = require ('dialog');

var g_mainwindow = null;

require('crash-reporter').start();

/**
 * Tell the client to open a new file.
 */
function openFile (filenames) {  
  g_mainwindow.send ('file-open', filenames[0]);
}

/**
 * Prompt the user to select a ROM to open.
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
  
  dialog.showOpenDialog (g_mainwindow, options, openFile);
}

/**
 * Handle the window being closed.
 */
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
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
  
  g_mainwindow = new BrowserWindow ({width: 800, height: 600});
  g_mainwindow.loadUrl('file://' + __dirname + '/index.html');

  g_mainwindow.on('closed', function() {
    g_mainwindow = null;
  });
  
  g_mainwindow.webContents.on ('did-finish-load', function () {
    g_mainwindow.send ('init');
  });
  
  g_mainwindow.on('resize', function () {
    g_mainwindow.send ('resize');
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
          click: function () { g_mainwindow.send ('file-close'); }
        },
        {
          label: 'Exit',
          click: function () { g_mainwindow.close (); }
        }
      ],
    }
  ];
  
  var menu = Menu.buildFromTemplate (mainmenu);
  g_mainwindow.setMenu (menu);  
});
