var electron = require('electron');
var request = require('request');

var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var ipcMain = electron.ipcMain;
var globalShortcut = electron.globalShortcut;
var urlInfoQ = 'https://www.infoq.com';

var splash = null;
var win = null;
var winPlay = null;
var talks = [];
talks['all'] = [];
talks['development'] = [];
talks['architecture-design'] = [];
talks['data-science'] = [];
talks['culture-methods'] = [];
talks['devops'] = [];

var categories = [
  { id: 'all', title:'Todas', icon: 'internet.png' },
  { id: 'development', title: 'Desenvolvimento', icon: 'settings.png'},
  { id: 'architecture-design', title: 'Arquitetura e Design', icon: 'share.png'},
  { id: 'data-science', title: 'Data Science', icon: 'server.png'},
  { id: 'culture-methods', title: 'Cultura e Métodos', icon: 'list.png'},
  { id: 'devops', title: 'DevOps', icon: 'controls.png'}
];

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
    width:1035,
    height: 750,
    show: false,
    autoHideMenuBar: true
  })
  win.loadURL('file://'+__dirname+'/../renderer/index.html');
  //win.webContents.openDevTools();
  win.once('ready-to-show', function (){
      win.show();
      splash.close();
  });
}

var createWinPlayTalk = function (talk){
   winPlay = new BrowserWindow({
    width:650,
    height: 400,
    show: false,
    title: talk.title + ' - ' + talk.author,
    autoHideMenuBar: true,
    backgroundColor:'#000'
  })
  winPlay.loadURL('file://'+__dirname+'/../renderer/play.html');

  winPlay.once('ready-to-show', function (){
      winPlay.show();
      request(urlInfoQ + talk.link, function (error, res, body){
        talk.src = body.split("P.s = '")[1].split("'")[0];
        talk.urlTalk = urlInfoQ + talk.link;
        winPlay.webContents.send('playEvent', talk);
      });

      globalShortcut.register('CommandOrControl+Shift+Space', function() {
        winPlay.webContents.send('pauseEvent');
      })
  });
}

var getTalkFromBody = function (body, categoryId){
  var elements = body.split('class="news_type_video');
  for(item of elements){
    var talk = {}
    if(item.split('class="videolength">').length > 1){
      talk.link = item.split('href="')[1].split('"')[0];
      talk.title = item.split('title="')[1].split('"')[0];
      talk.image = item.split('<img src="')[1].split('"')[0];
      talk.time = item.split('class="videolength">')[1].split('</')[0];
      talk.author = item.split('class="author"')[1].split('title="')[1].split('"')[0];
      talk.date = item.split('class="author"')[1].split('&nbsp;em&nbsp;')[1].split('</span>')[0].trim().split('<a')[0];
      talk.description = item.split('<p>')[1].split('</p>')[0].trim();
      talks[categoryId].push(talk)
    }
  }
}

ipcMain.on('loadChannels', function (event, arg){
  request(urlInfoQ + '/br/presentations', function (error, res, body){
    getTalkFromBody(body, 'all');
    createWinIndex();
  });
});

ipcMain.on('getCategories', function(event) {
    event.returnValue = categories;
});
ipcMain.on('getTalks', function(event, category) {
    if(talks[category].length){
        event.returnValue = talks[category];
    } else {
      request(urlInfoQ + '/br/' +category+ '/presentations', function (error, res, body){
        getTalkFromBody(body, category);
        event.returnValue = talks[category];
      });
    }
});
ipcMain.on('playTalk', function (event, talk){
    createWinPlayTalk(talk)
});
