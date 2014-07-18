
Parse.initialize("GvPl2E2eHeyD1yy2AYLD2u10O3Ld08Ih2VVtCugG", "Sa5ErdXC4W3GnfjQJ3pKaT2uLMQqcTqJNuc84YXI");

Aloha.ready( function() {
    Aloha.jQuery('.memoBlock').aloha();
    Aloha.jQuery('#title').aloha();
    noteCtrl = new NoteCtrl();
    noteCtrl.loadView();
});
var parseSave = null;
var NoteObj = Parse.Object.extend("Note");
var NoteRelationObj = Parse.Object.extend("NoteRelation");
/*testObject.save({foo: "bar", oao:"oaoa"}).then(function(object) {
  alert("yay! it worked");
});*/

var NoteRelationModel = function()
{
    var modelObj = this;
    modelObj.parentId = null;  // one with one parent only
    modelObj.parseObj = null;
    
    for(var i=1 ; i<=9 ; i++){  // one with 9 childs at most
        var id = 'b' + i.toString();
        modelObj[id] = {};
        modelObj[id].childId = null;
    }
    modelObj.setChild = function(noteModel, blockId)
    { //blockId : b1~b9
        var query = new Parse.Query("NoteRelation");
        console.log("*******SET parent ID: ", noteModel.parseObj.id);
        console.log(noteModel.parseObj);
        modelObj.parentId = noteModel.parseObj.id;
        
        query.equalTo("parentId", noteModel.parseObj.id);
        query.equalTo("blockId", blockId);
        queryFunction = query.first().then(function(result) {
            if(typeof(result) == "undefined"){
                console.log("Create Child Note and Relation!!......");
                var parseNoteObj = new NoteObj();
                var currentUser = Parse.User.current();
                parseNoteObj.set('owner', currentUser.id);
                parseNoteObj.set('isRoot', 'false');
                parseNoteObj.setACL(new Parse.ACL(currentUser));
                for(var i=1 ; i<=9 ; i++){
                    var id = 'b' + i.toString();
                    parseNoteObj.set(id , '');
                }
                parseNoteObj.set('b5', $('#' + blockId + ' .memoBlock').html());
                var parseNoteSave = parseNoteObj.save();
                parseNoteSave.done(function(){
                    console.log("PARSE OBJ ID:", parseNoteObj.id);
                    modelObj[blockId].childId = parseNoteObj.id;
                    modelObj.save(blockId); 
                });
            }
            else
                modelObj[blockId].childId = result.get('childId');
            console.log("----END LOAD NOTE by TITLE--------");
        }, function(error){
            console.log("--------------NoteRelationModel findChild ERROR!------------");
            console.log(error);
        });
    }
    
    modelObj.setParent = function(noteModel)
    { //blockId : b1~b9
        var query = new Parse.Query("NoteRelation");
        query.equalTo("childId", noteModel.parseObj.id);
        console.log("-----setParent()----");
        queryFunction = query.first().then(function(result) {
            if(typeof(result) == "undefined")
                console.log("QUERY GET NOTHING!!......");
            else
                modelObj.parentId = result.get('parentId');
            
        }, function(error){
            console.log("--------------NoteRelationModel findChild ERROR!------------");
            console.log(error);
        });
    }
    
    modelObj.save = function(blockId)
    {
        if(modelObj.parseObj===null)
            modelObj.parseObj = new NoteRelationObj();
    
        modelObj.parseObj.set('parentId', modelObj.parentId);
        modelObj.parseObj.set('blockId', blockId);
        modelObj.parseObj.set('childId', modelObj[blockId].childId);
        parseSave = modelObj.parseObj.save();
        parseSave.done(function(){console.log("------RELATION SAVED!------")});
    }
    return this;
}

var NoteRelationView = function(noteModel, noteView)
{
    var viewObj = this;
    viewObj.noteModel = noteModel;
    viewObj.noteView = noteView;
    viewObj.renderChildView = function(noteRelationModel, blockId)
    {
        viewObj.noteModel.loadNoteById(noteRelationModel[blockId].childId);
        queryFunction.done(function(){
            viewObj.noteView.render(noteModel); 
        });
    }
    viewObj.renderParentView = function(noteRelationModel)
    {
        noteModel.loadNoteById(noteRelationModel.parentId);
        queryFunction.done(function(){
            noteView.render(noteModel);
        });
    }
    return this;
}

var NoteRelationCtrl = function(noteModel, noteView)
{
    var noteRelationModel = new NoteRelationModel();
    var noteRelationView = new NoteRelationView(noteModel, noteView);
    var ctrlObj = this;
    ctrlObj.noteModel = noteModel;
    ctrlObj.noteView = noteView;
    ctrlObj.renderChild = function(blockId)
    {
        noteRelationModel.setChild(ctrlObj.noteModel, blockId);
        
        queryFunction.done(function(){
            // set time out to wait Parse save the NoteRelation into db....
            // I haven't think of a better way to handle yet orz...
            setTimeout(function(){noteRelationView.renderChildView(noteRelationModel, blockId);}, 500);
        });
    }
    ctrlObj.renderParent = function()
    {
        console.log(ctrlObj.noteModel.parseObj.get('isRoot'));
        if(ctrlObj.noteModel.parseObj.get('isRoot')=='true'){ // if is root, stop doing things!
            closeLoadingIcon();
            return;
        }
        noteRelationModel.setParent(ctrlObj.noteModel);
        queryFunction.done(function(){
            noteRelationView.renderParentView(noteRelationModel);
        });
    }
    return ctrlObj;
}
/***************************
NoteModel Class
Given 'note' and create an NoteModel instance
****************************/
var NoteModel = function()
{
    var modelObj = this;
    modelObj.parseObj = null;
    //modelObj.title = '';
    for(var i=1 ; i<=9 ; i++){
        var id = 'b' + i.toString();
        modelObj[id] = '';
    }
    //private function
    var setModelByParseObj = function(parseObj)
    {
      //  modelObj.title = parseObj.get('title');
        for(var i=1 ; i<=9 ; i++){
            var id = 'b' + i.toString();
            modelObj[id] = parseObj.get(id);
        }
        console.log('THIS:' , modelObj);
    }
    
    modelObj.setByCurrentHtml = function()
    {
        for(var i=1 ; i<=9 ; i++){
            var id = 'b' + i.toString();
            var blockHtml = $('#'+id+' .memoBlock').html();
            modelObj[id] = blockHtml;
            if(modelObj.parseObj === null)
                modelObj.parseObj = new NoteObj();
            modelObj.parseObj.set(id, blockHtml);
        }
    }
    modelObj.save = function()
    {
        if(modelObj.parseObj!==null){
            var currentUser = Parse.User.current();
            modelObj.parseObj.setACL(new Parse.ACL(currentUser));
            modelObj.parseObj.set('owner', currentUser.id);
            if(modelObj.parseObj.get('isRoot')!='false')
                modelObj.parseObj.set('isRoot', 'true');
            parseSave = modelObj.parseObj.save();
            parseSave.done(function(){
                console.log("------NOTE SAVED!------")
            });
        }
    }
    // load Note Info from Parse by parseObjId
    modelObj.loadNoteById = function(parseObjId)
    {
        var query = new Parse.Query("Note");
        
        queryFunction = query.get( parseObjId , {
            success: function(noteObj) {
                console.log("-------SUCCESS LoadNoteById("+parseObjId+")--------");
                setModelByParseObj(noteObj);
                modelObj.parseObj = noteObj;
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

var NoteView = function()
{
    this.render = function(noteModel)
    {
        console.log("--------NoteView render()----");
        for(var i=1 ; i<=9 ; i++){
            var id = 'b' + i.toString();
            var blockHtml = noteModel[id];
            $('#'+id+' .memoBlock').html(blockHtml);
        }
        closeLoadingIcon();
    }
    return this;    
}

var NoteCtrl = function()
{
    var noteModel = new NoteModel();
    var noteView = new NoteView();
    this.noteModel = noteModel;
    this.noteView = noteView;
    this.loadView = function()
    {
        var id = getIdByUrlParameter();
        if(id!==null){
            noteModel.loadNoteById(id);
            queryFunction.done(function(){
                console.log("-----OAO gg--------");
                console.log(noteModel);
                noteView.render(noteModel);
            });
        }
        closeLoadingIcon();
    }
    this.saveMemoNote = function()
    {
        noteModel.setByCurrentHtml();
        noteModel.save();
    }
   
    var getIdByUrlParameter = function()
    {
        var id;
        url=window.location.toString();
        if(url.search('id=')==-1) return null;
        url = url.split('id=');
        url = url[url.length-1];
        console.log('url--------------');
        console.log(url);
        id = url;
        return id;
    }
    return this;
}

function saveMemoNote()
{
    startLoadingIcon();
    noteCtrl.saveMemoNote();
    parseSave.done(function(){
        closeLoadingIcon();
    });
}

function nextNote(el)
{
    startLoadingIcon();
    var blockId = $(el).parent().get(0).id;
    console.log("------nextNote()------");
    console.log($(el).parent().get(0).id);
    console.log(blockId);
    noteCtrl.saveMemoNote();
    parseSave.done(function(){
        var noteRelationCtrl = new NoteRelationCtrl(noteCtrl.noteModel, noteCtrl.noteView);
        noteRelationCtrl.renderChild(blockId);
    });
}
function prevNote()
{
    startLoadingIcon();
    console.log("------prevNote-----");
    noteCtrl.saveMemoNote();
    parseSave.done(function(){
        console.log("parseSaveDone!!------------");
        var noteRelationCtrl = new NoteRelationCtrl(noteCtrl.noteModel, noteCtrl.noteView);
        noteRelationCtrl.renderParent();
    });
}
function memoNoteView(obj)
{
    for(var i=1 ; i<=9 ; i++){
        var id = 'b' + i.toString();
        var blockHtml = obj.get(id);
        $('#'+id).html(blockHtml);
    }
    $('#title h').html(obj.get('title'));
    console.log(obj.get('title'));
}
function clearNoteBlock(el)
{
    var blockId = $(el).parent().get(0).id;
    $('#'+blockId+' .memoBlock').html("");
}