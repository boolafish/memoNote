function closeLoadingIcon()
{
    setTimeout(function(){
        var loader = document.getElementsByClassName("loader");
        console.log("close loading icon!\n", loader);
        for(var i in loader){
            if(loader[i].style && (typeof loader[i].style != 'undefined') )
                loader[i].style.display = "none";
        }
    }, 500); // given a little delay to better cover the loading stuff time
    
}

function startLoadingIcon()
{
    var loader = document.getElementsByClassName("loader");
    console.log("start loading icon!\n", loader);
    for(var i in loader){
        if(loader[i].style && (typeof loader[i].style != 'undefined') )
            loader[i].style.display = "block";
    }
}