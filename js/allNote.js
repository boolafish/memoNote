Parse.initialize("GvPl2E2eHeyD1yy2AYLD2u10O3Ld08Ih2VVtCugG", "Sa5ErdXC4W3GnfjQJ3pKaT2uLMQqcTqJNuc84YXI");
var NoteObj = Parse.Object.extend("Note");
var NoteRelationObj = Parse.Object.extend("NoteRelation");
var makeDelStat = false;

$(window).ready( function() {
    //closeLoadingIcon();
    console.log('WHY!////!!');
    checkLoginCloseLoader();
    allNoteCtrl = new AllNoteCtrl();
    allNoteCtrl.loadView();
});

function checkLoginCloseLoader()
{
    console.log(FbLoginReq);
    if( LoginStat  ){
        closeLoadingIcon();
    }
    else if(FbLoginReq !== null){
        FbLoginReq.done(function(){
            console.log('WHY!!!');
            closeLoadingIcon();
        });
    }
    else{
        console.log('EE..')
        setTimeout(function(){checkLoginCloseLoader();}, 500);
    }
}

var AllNoteModel = function()
{
    var modelObj = this; // since 'this' cannot be used in functions....
    
    modelObj.parseObjs = [];
    var setModelByParseObj = function(parseResults)
    {
        console.log("parseReults:------------");
        console.log(parseResults[0].get('b5'));
        modelObj.parseObjs = parseResults;
    }
    modelObj.getAllFromParse = function()
    {
        var query = new Parse.Query("Note");
        var currentUser = Parse.User.current();
        query.equalTo("owner", currentUser.id);
        query.equalTo("isRoot", "true");
        query.descending("createdAt");
        queryFunction = query.find().then(function(results) {
            if( results.length < 1)
                console.log("QUERY GET NOTHING!!......");
            else{
                setModelByParseObj(results);
            }
            console.log("----END LOAD NOTE by TITLE--------");
        }, function(error){
            console.log("--------------NoteModel loadNoteByTitle ERROR!------------");
            console.log(error);
        });
    }
    modelObj.delNote = function(noteId)
    {
         var query = new Parse.Query("Note");
         queryFunction = query.get( noteId , {
            success: function(noteObj) {
                console.log("DEL note: ", noteObj);
                noteObj.destroy();
                var query = new Parse.Query("NoteRelation");
                query.equalTo('parentId', noteId);
                queryFunction = query.find({ 
                    success: function(results) {
                        console.log("relationQuery, parentId = noteId: "+noteId+".");
                        console.log(results);
                        for(var i=0 ; i<results.length ; i++){
                            console.log("dfs del: ", results[i].get('childId') );
                            modelObj.delNote(results[i].get('childId'));
                            results[i].destroy();
                        }
                    }
                });
               
            },
            error: function(object, error) {
                alert("Some Error happened!");
                console.log("--------------NoteModel loadNoteById ERROR!------------");
                console.log(error);
            }
        });
  
    }
    return modelObj;
}

var AllNoteView = function()
{
    this.render = function(allNoteModel)
    {
        var allNotes = allNoteModel.parseObjs;
        if(allNotes.length<1) return;
        console.log("---START RENDER VIEW -------");
        $('#allMemoNote').html(''); //clear '#allMemoNote'
        for(var i=0 ; i<allNotes.length ; i++){
            var goPageLoc = "note.html?id="+allNotes[i].id;
            var noteBlock = "";
            //noteBlock +=    '<a href="' + goPageLoc + '">'
            noteBlock +=        '<div class="memoNote" onclick="goNoteById(\''+allNotes[i].id+'\')">';
            noteBlock +=            '<div class="del" id="'+allNotes[i].id+'"> <br> DELETE <br> <i class="fa fa-trash-o"></i> </div>'
            noteBlock +=            allNotes[i].get('b5');
            noteBlock +=        '</div>'
            //noteBlock +=    '</a>'
            
            $('#allMemoNote').append(noteBlock);
        }
        $('.memoNote').css( 'cursor', 'pointer' );
        $('.del').css( 'cursor', 'pointer' );
    }
    this.makeDel = function()
    {
        $('.del').show();
        $('.memoNote').removeAttr('onclick');
    }
    return this;
}
function goNoteById(id)
{
    var url = "note.html?id="+id;
    window.location.href = url;
}
function makeDel()
{
    if(!makeDelStat){
        makeDelStat = true;
        allNoteCtrl.makeDel();
    }
    else{
        makeDelStat = false;
        $('.del').hide();
        allNoteCtrl.loadView();
    }
}

var AllNoteCtrl = function()
{
    var allNoteModel = new AllNoteModel();
    var allNoteView = new AllNoteView();
    var ctrlObj = this;
    ctrlObj.loadView = function(){
        allNoteModel.getAllFromParse();
        queryFunction.done(function(){
            allNoteView.render(allNoteModel);
        });
    }
    ctrlObj.makeDel = function(){
        allNoteView.makeDel();
        $('.del').click(function(){
            startLoadingIcon();
            makeDelStat = false;
            allNoteModel.delNote(this.id);
            queryFunction.done(function(){
                console.log("WHY.....");
                ctrlObj.loadView();  
                closeLoadingIcon();
            });
        });
    }
    
    
    return this;
}

