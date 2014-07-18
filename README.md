memoNote
========

A 9 puzzle web note. Inspired by "改變一生的曼陀羅MeMo技法". GIve a UI to easy set 9 puzzle note that helps thinking about things.<br>
Include: HTML + CSS + Javascript + Jquery + Parse + FB api

========

To Set a web:

1. Get a FB develop app ID.
2. Get a Parse account.
3. Download the code.
4. Code settings: FB app ID and Parse settings. (See Below)
5. Put the web to your own domain.
6. Done!

=========

Code Settings:

1. FB login settings: <br>
   in 'login.js' (under 'js' folder):
```
  FbSetting = Parse.FacebookUtils.init({
        appId      :  YOUR_FB_APP_ID , // Facebook App ID
        channelUrl : '//YOUR_WEB_DOMAIN/channel.html', // Channel File
        cookie     : true, // enable cookies to allow Parse to access the session
        xfbml      : true  // parse XFBML
    });
```

2. Parse settings: <br>
    in 'login.js', 'note.js', 'allNote.js' (under 'js' folder)
```
  Parse.initialize( Parse Application ID, Parse Javascript Key);
  // this can be copy from https://parse.com/apps/quickstart#parse_data/web/existing
```
