admobid = {
  banner: 'ca-app-pub-3940256099942544/6300978111'
};

function samkijo(){
  document.addEventListener('deviceready', initApp, false);
}

function initApp() {
  //Error here
  AdMob.createBanner({
    adId: admobid.banner,
    adSize:'CUSTOM',
    width: 400,
    height: 60,
    isTesting: true,
    overlap: true,
    autoShow: true,
    offsetTopBar: false,
    position: AdMob.AD_POSITION.BOTTOM_CENTER //,
      //bgColor: 'yellow'
  });
}