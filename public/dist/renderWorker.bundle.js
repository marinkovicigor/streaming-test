(()=>{var e=!1,t=1e3/30;function a(){e&&(self.postMessage({type:"drawFrame"}),setTimeout(a,t))}self.onmessage=function(t){"start"===t.data.type?(e=!0,a()):"stop"===t.data.type&&(e=!1)}})();