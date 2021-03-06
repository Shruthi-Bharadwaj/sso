// jscs:disable
/* eslint-disable */

function setupGAnalytics(gaid) {
  // only setup if on hire.quezx.com
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('create', gaid, 'auto');

  if(localStorage && localStorage.userinfo) {
    let userId; // Handle user based analytics
    try {
      userId = JSON.parse(localStorage.userinfo).id;
    } catch (e) {
      console.log(e);
    }

    ga('set', 'userId', userId);
  }

  ga('send', 'pageview');
}

export default setupGAnalytics;
