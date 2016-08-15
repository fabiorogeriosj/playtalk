var electron = require('electron');
var request = require('request');
var htmlToJson = require('html-to-json');

var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var ipcMain = electron.ipcMain;

var splash = null;
var win = null;
var channels = [];
var categories = [""];

app.on('ready', function (){
    splash = new BrowserWindow({
      width:940,
      height:470,
      center:true,
      resizable: false,
      movable: false,
      frame: false,
      transparent:true,
      show: false
    });

    splash.loadURL('file://'+__dirname+'/../renderer/splash.html')
    splash.once('ready-to-show', function (){
        splash.show();
    });
});

var createWinIndex = function (){
  win = new BrowserWindow({
    width:900,
    height: 600,
    show: false,
    autoHideMenuBar: true,
    darkTheme :true
  })
  win.loadURL('file://'+__dirname+'/../renderer/index.html');
  win.webContents.openDevTools();
  win.once('ready-to-show', function (){
      splash.close();
      win.show();
  });
}
ipcMain.on('loadChannels', function (event, arg){

  setTimeout(function (){
    // request('https://www.infoq.com/br/presentations/', function (error, response, body){
    //
    //   var promise = htmlToJson.parse(body);
    //
    //   promise.done(function (result) {
    //     event.sender.send('asynchronous-reply', result)
    //   });
    // });

    var promise = htmlToJson.request('https://www.infoq.com/br/presentations', {
      'news_type_video': function ($doc) {
        return $doc.find('.news_type_video');
      }
    }, function (err, result) {
      event.sender.send('asynchronous-reply', result)
    });
  }, 1000);

});

ipcMain.on('getCategories', function(event) {
    event.returnValue = categories;
});

ipcMain.on('getTalks', function (event, category){
    var talks = [];
    for (channel of channels) {
      for(item of channel.item){
        var existCategory = false;
        for(category of item.category){
          var exist = categories.filter(function(value){
            return value == category;
          });
          existCategory = true;
        }
        if(existCategory){
          if(exist.length){
              talks.push(item);
          }
        }
      }
    }
    event.returnValue = talks;
});
