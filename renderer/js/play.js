var ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.on('playEvent', function (event, talk){

  document.getElementById('loading').style.display='none';
  document.getElementById('video').style.display='block';
  document.getElementById('video').src = talk.src;
  document.getElementById('video').play();

});


ipcRenderer.on('pauseEvent', function (event){
  if(document.getElementById('video').paused){
      document.getElementById('video').play();
  } else {
    document.getElementById('video').pause();
  }
});
