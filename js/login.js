Parse.initialize("GvPl2E2eHeyD1yy2AYLD2u10O3Ld08Ih2VVtCugG", "Sa5ErdXC4W3GnfjQJ3pKaT2uLMQqcTqJNuc84YXI");
var FbLoginReq = null;
var LoginStat = false;
var currentUser = Parse.User.current();
window.fbAsyncInit = function() {
  FbSetting = Parse.FacebookUtils.init({
        appId      : '675503189191901', // Facebook App ID
        channelUrl : '//boolafish.kd.io/memoNote/channel.html', // Channel File
        cookie     : true, // enable cookies to allow Parse to access the session
        xfbml      : true  // parse XFBML
    });
    
    // Additional initialization code here
    login();
};


(function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/all.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

function login()
{
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected' && currentUser) {
        // user logged in and linked to app
        // handle this case HERE
        console.log("ALREADY LOGGED IN!!");
        getPhoto();
        LoginStat = true;
      }
      else{
        FbLoginReq = Parse.FacebookUtils.logIn(null, {
          success: function(user) {
            if (!user.existed()) {
              console.log("User signed up and logged in through Facebook!");
            } else {
              console.log("User logged in through Facebook!");
            }
            console.log(user);
            getPhoto();
            LoginStat = true;
          },
          error: function(user, error) {
            alert("User cancelled the Facebook login or did not fully authorize.");
            console.log("ERROR----------------------");
            console.log(error, user);
          }
        });    
      }
   });
}

function getPhoto()
{
      /* make the API call */
    FB.api(
        "/me/picture",
        function (response) {
          if (response && !response.error) {
            $('#headImg').attr('src', response.data.url);
          }
        }
    );
}
