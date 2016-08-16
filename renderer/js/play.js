var ipcRenderer = require('electron').ipcRenderer;
ipcRenderer.on('playEvent', function (event, talk){
  iframe.src = talk.urlTalk;
  iframe.onload = function (){
    iframe.contentDocument.getElementById('video').play();
    iframe.contentDocument.getElementById('video').pause();
    video.style.display='block';
    video.src=talk.src;
    video.play();
    loading.style.display='none';
  }
});

ipcRenderer.on('pauseEvent', function (event){
  if(document.getElementById('video').paused){
      document.getElementById('video').play();
  } else {
    document.getElementById('video').pause();
  }
});
