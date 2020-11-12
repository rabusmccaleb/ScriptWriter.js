

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  firebase.storage();
var photo;
firebase.auth().onAuthStateChanged(function(user) {
    if(user){
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      if(uid != null){
      }
      var providerData = user.providerData;
      getTransferScript();
      // ...
    } else {
    // if the user isn't already Signed in then it takes them back to the authentification page
      location.href="../SignIn/ToddWebSignIn.html";
    }
  });



function getTransferScript(){
  firebase.auth().onAuthStateChanged(function(user) {
      if(user){
        var db = firebase.firestore();
        var UserId = ""+ user.uid + "";
        UserID = UserId;
        var userProfileRef = db.collection("CreativeUsers").doc(UserId);

        userProfileRef.get().then(function(doc) {
          if (doc.exists) {
              var data = doc.data();
              if(data.isTransferScript == true){
                getScriptContentBackend(data.transferScript);
              }
          } else {
              console.log("No Transfer Script!");
          }
        }).catch(function(error) {
        console.log("Error getting document:", error);
        });
        // ...
      } else {
      // if the user isn't already Signed in then it takes them back to the authentification page
        location.href="../SignIn/ToddWebSignIn.html";
      }
    });

}


$(document).ready(function(){

  $('.logo').click(function(){
    location.href = "../DashBoard/ToddWebDashboard.html"
  });

})







var ScriptDataModel = {
  "UID" : "",
  "RefId" : "",
  "Status" : "Private", // defualt to private
  "isPublic" : false,
  "PublicID" : "",
  "Title" : "",
  "Summary" : "",
  "Tags" : [],
};

var ScriptContentDataModel = {
  "Artists" : [],
  "Dialouge" : [],
  "ArtDiscriptions" : [],
  "Slugs" : [],
  "Notes" : [],
  "Characters" : [],
};

var ScriptRef;

function Save(){
  var getTitle = $('.').val();
  var getSummary = $('.').val();
  var getTags = GetTags();

}


function GetTags(){

}






var UserID;
function addNewScript(){
      var user = firebase.auth().currentUser;
      if (user){
          var UserId = ""+ user.uid + "";
          var db = firebase.firestore();
          db.collection("CreativeUsers").doc(UserId).collection("Scripts").add({
            UID : UserID,
            RefId : "",
            Status : ScriptDataModel.Status, // defualt to private
            isPublic : ScriptDataModel.isPublic,
            PublicID : ScriptDataModel.PublicID,
            Title : ScriptDataModel.Title,
            Summary : ScriptDataModel.Summary,
            Tags : ScriptDataModel.Tags,
          })
          .then(function(docRef) {
              console.log("Usere Profile Info has been updated!");
              // Updating Document reference if the document was added successfully
              ScriptDataModel.RefId = docRef.id;
              currentRefId = docRef.id;
              //// Adding the rest of the script data to the back end :

              var db = firebase.firestore();
            db.collection("CreativeUsers").doc(UserId).collection("Scripts").doc(docRef.id).collection("ScriptContent").add({

                Artists : ScriptContentDataModel.Artists,
                Dialouge : ScriptContentDataModel.Dialouge,
                ArtDiscriptions : ScriptContentDataModel.ArtDiscriptions,
                Slugs : ScriptContentDataModel.Slugs,
                Notes : ScriptContentDataModel.Notes,
                Characters : ScriptContentDataModel.Characters

              }).then(function(doc){
                contentDocID = doc.id
              })
              var userRef = db.collection("CreativeUsers").doc(UserId).collection("Scripts").doc(ScriptDataModel.RefId);
              return userRef.update({
                  RefId : ScriptDataModel.RefId,
                  contentId : contentDocID
              })
              .then(function() {
                  console.log("Document successfully updated!");
              })
              .catch(function(error) {
                console.console.log("Error adding the document ref");
              });


          })
          // if there is an error below now then there was no document to update and the there was an error adding a document
          .catch(function(error) {
              console.error("Error Adding New Script document: ", error);
          });
      }// here is the end
}


function UpdateData(){
  if(currentRefId != "" && currentRefId != null){
      var db = firebase.firestore();
      firebase.auth().onAuthStateChanged(function(user) {
          // Checking if there is a user sign in...
          if(user){
            var db = firebase.firestore();
            var UserId = ""+ user.uid + "";
            UserID = UserId;
            var userProfileRef = db.collection("CreativeUsers").doc(UserId).collection("Scripts").doc("" + currentRefId + "");
            userProfileRef.get().then(function(doc) {
              if(doc.exists){
                    return userProfileRef.update({
                        // UserProfileImageURL : profileData.UserProfileImageURL,
                        UID : UserID,
                        RefId : currentRefId,
                        Status : ScriptDataModel.Status, // defualt to private
                        isPublic : ScriptDataModel.isPublic,
                        PublicID : ScriptDataModel.PublicID,
                        Title : ScriptDataModel.Title,
                        Summary : ScriptDataModel.Summary,
                        Tags : ScriptDataModel.Tags,
                    }).then(function(){
                        addScriptContent()
                    }).catch(function(){
                      console.log("Error.")
                    })

              }else{
                console.log("This is a new script.")
                // Add new Script to the backend : ->
                addNewScript();
              }
          }).catch(function(error){
            AlertFunction("There was an error saving your script.");
            console.log(error);
          })
          }// if user is not sign in else statement closing bracket
        })// auth closing bracket
  }else{
    addNewScript();
  }
}// update data end bracket

function getContentDocId(){

}

function addScriptContent(){
  var db = firebase.firestore();
  console.log("Document successfully updated!");


  firebase.auth().onAuthStateChanged(function(user) {
      // Checking if there is a user sign in...
      if(user){
        var db = firebase.firestore();
        var UserId = ""+ user.uid + "";
        UserID = UserId;
        var contentRef = db.collection("CreativeUsers").doc(UserID).collection("Scripts").doc("" + currentRefId + "").collection("ScriptContent").doc("" + contentDocID + "");

        contentRef.get().then(function(doc) {
          if(doc.exists){
                return contentRef.update({
                  Artists : ScriptContentDataModel.Artists,
                  Dialouge : ScriptContentDataModel.Dialouge,
                  ArtDiscriptions : ScriptContentDataModel.ArtDiscriptions,
                  Slugs : ScriptContentDataModel.Slugs,
                  Notes : ScriptContentDataModel.Notes,
                  Characters : ScriptContentDataModel.Characters
                }).then(function(){
                    console.log("Document Script Content updated!");
                    if(privateFlag == true ){
                      AlertFunction("Congrats You Saved A Script!");
                    }
                }).catch(function(){
                  console.log("Error.")
                  AlertFunction("There was an error saving your script.");
                })
          }else{
            console.log("This is a new script.")
            // Add new Script to the backend : ->
            AddContentData();
          }
      }).catch(function(error){console.log(error);})
      }// if user is not sign in else statement closing bracket
    })

}







var currentRefId = "";
var contentDocID = "";
var requestedScriptBasicData;
var requestedScriptContentData;
function getScriptContentBackend( docID ){
    // This function is for grabbing all of the scripts content from the backend so that the user can edit it and make use
    currentRefId = docID;
    var user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(function(user) {
        // Checking if there is a user sign in...
        if(user){
            var db = firebase.firestore();
            var UserId = ""+ user.uid + "";
            UserID = UserId;
            var scriptData = db.collection("CreativeUsers").doc(UserId).collection("Scripts").doc("" + docID + "");

            scriptData.get().then(function(doc){
                // querySnapshot.forEach( function(doc) {
                // doc.data() is never undefined for query doc snapshots
                if (doc.exists){
                      requestedScriptBasicData = doc.data();
                      ScriptDataModel.RefId = requestedScriptBasicData.RefId;
                      $('#summary').val(requestedScriptBasicData.Summary);
                      $('.TitleTextArea').val(requestedScriptBasicData.Title);

                      console.log(requestedScriptBasicData);

                      // making a request for the script content like dialogue, slugs, etc.
                      var scriptContentData = db.collection("CreativeUsers").doc(UserId).collection("Scripts").doc("" + docID + "").collection('ScriptContent');
                      scriptContentData.get().then(function(querySnapshot){

                        querySnapshot.forEach(function(doc) {
                          contentDocID = doc.id
                          requestedScriptContentData = doc.data();
                          console.log(requestedScriptContentData.Dialouge)
                          console.log(requestedScriptContentData);
                          arrayOfCharacters = requestedScriptContentData.Characters;
                          placeScriptContentOnPage(requestedScriptContentData);
                        });
                      })
                }

                // });

            }).catch(function(error) {
                console.log("Error getting documents: ", error);
            });

      }else{

      }
  });



}

var unsortedArray = [];

function placeScriptContentOnPage(item){
  var ArtDiscriptionsData = item.ArtDiscriptions;
  var DialougeData = item.Dialouge;
  var NotesData = item.Notes;
  var SlugsData = item.Slugs;

  var ArrayOfData = [ArtDiscriptionsData, DialougeData , NotesData, SlugsData];
  for(x = 0; x < ArrayOfData.length ; x++){
    for(i = 0; i < ArrayOfData[x].length; i++){
      unsortedArray.push(ArrayOfData[x][i]);
    }
  }
  console.log(unsortedArray);
  unsortedArray.sort(function(a, b) {
    return parseInt(a.indexInScript) - parseInt(b.indexInScript);
  });
  console.log(unsortedArray);
  placeDataOnDiv();
  placeCharacters();
}

function placeDataOnDiv(){
  for(x = 0 ; x < unsortedArray.length; x++){
    var type = unsortedArray[x].type;
    switch (type) {
      case 0:
        var character = unsortedArray[x].Character;
        var dialogue = unsortedArray[x].dialogue;
        AddCharTypeSwitch(type = 0, character = character , text = dialogue);
        break;

      case 1:
        var text = unsortedArray[x].artDesciption;
        AddCharTypeSwitch(type = 1, character = "" , text = text);
        break;

      case 2:
        var text = unsortedArray[x].slug;
        AddCharTypeSwitch(type = 2, character = "" , text = text);
        break;

      case 3:
        var text = unsortedArray[x].note;
        AddCharTypeSwitch(type = 3, character = "" , text = text);
        AddCharTypeSwitch(3);
        break;

      default:
      console.log("Error Placeing objects on div");
    }
  }
}

function AddCharTypeSwitch(type, character, text){
  switch(type){
    case 0:
      $('.ContentHolder').append(Dialogue(character = character, text = text)).fadeIn(500);
      InitializeContentEdit();
      RemoveThisDialogueObjectInit();
      break;
    case 1:
      $('.ContentHolder').append(ArtDesciption(text)).fadeIn(500);
      // initializeDoubleClick();
      InitializeContentEdit();
      RemoveThisDialogueObjectInit();
      break;
    case 2:
      $('.ContentHolder').append(Slug(text)).fadeIn(500);
      InitializeContentEdit();
      RemoveThisDialogueObjectInit();

      break;
    case 3:
      $('.ContentHolder').append(Note(text)).fadeIn(500);
      InitializeContentEdit();
      RemoveThisDialogueObjectInit();
      break;
  }
}

function placeCharacters(){
  for( x = 0 ; x < arrayOfCharacters.length; x++){
    CharacterName = arrayOfCharacters[x];
      var CharacterObject = '<div class="CharactersObject"><label class="CharacterNameLabel">'+ CharacterName +'</label></div>';
      $('.CharactersDiv').append(CharacterObject);
      //Make Character Div objects Sortable
      $('.CharactersDiv').sortable({
        axis : "x",
        // handle : '.StoryContentHandel',
        stop : function(event , ui) {
          }
      });

      $('.CharactersObject').click(function(){
        $('.CharactersObject').css({
          // "box-shadow" : "",
          "transition": "all 0.3s ease-in-out",
          "border" : "2px solid rgba(255, 255, 255, 0)"
        })
        $(this).css({
          // "box-shadow": "0px 0px 1.3vh rgb(105, 207, 255)",
          "transition": "all 0.3s ease-in-out",
          "border" : "2px solid white"
        })
        var characterName = $(this).find('.CharacterNameLabel').text();
        RecentCharacter = characterName;
      });
  }

}



function userIdeas(){

  firebase.auth().onAuthStateChanged(function(user){
  var db = firebase.firestore();
  var userIdeasRef = db.collection("UserIdeas");
    userIdeasRef.set({
      "UserIdeaRef" : user.uid,
      "idea" : getIdea(),
    })
  });
}

function getIdea(){
  var idea = $('.').val();
  return idea;
}





var privateFlag = false;
  $(document).ready(function(){
    $('.PublishPublicButton').click(function(){
      privateFlag = false;
      UpdateData();
//
      GrabAllData();
      publishPublic();
    });

    $('.PublishPrivateButton').click(function(){
      privateFlag = true;
      GrabAllData();
      UpdateData();
    });

    $('#publish').click(function(){
      $('.characterModal').hide().fadeIn();
      $('.HotKeysModal').hide();
      $('.AddTags').hide();
      $('.AddSummary').hide();
      $('.AddAnotherCharacterModalObject').hide();
      $('.PublishPublicOrPrivateModal').hide().fadeIn();
        $('.PublishPublicOrPrivateCard').fadeIn(300);
    });


    $('.CancelButton').click(function(){
      $('.PublishPublicOrPrivateCard').fadeOut(300);
      $('.PublishPublicOrPrivateModal').hide(400);
      $('.characterModal').fadeOut(450).hide();

    });

  });




  function publishPublic(){
    var user = firebase.auth().currentUser;
    ScriptDataModel.isPublic = true;
    ScriptDataModel.Status = "Public";

    if (user){
        var UserId = ""+ user.uid + "";

        var db = firebase.firestore();
        db.collection("PublicScripts").add({
          creatorUID : UserId,
          RefId : "",
          Status : ScriptDataModel.Status, // defualt to private
          isPublic : ScriptDataModel.isPublic,
          PublicID : ScriptDataModel.PublicID,
          Title : ScriptDataModel.Title,
          Summary : ScriptDataModel.Summary,
          Tags : ScriptDataModel.Tags,
        })

        .then(function(docRef) {
            console.log("Usere Profile Info has been updated!");
            // Updating Document reference if the document was added successfully
            ScriptDataModel.PublicID = docRef.id;
            //// Adding the rest of the script data to the back end :

            var db = firebase.firestore();
          db.collection("PublicScripts").doc(docRef.id).collection("ScriptContent").add({

              Artists : ScriptContentDataModel.Artists,
              Dialouge : ScriptContentDataModel.Dialouge,
              ArtDiscriptions : ScriptContentDataModel.ArtDiscriptions,
              Slugs : ScriptContentDataModel.Slugs,
              Notes : ScriptContentDataModel.Notes,
              Characters : ScriptContentDataModel.Characters

            })


            // Updating the public ref in the users script document document
            var userRef = db.collection("CreativeUsers").doc(UserId).collection("Scripts").doc(ScriptDataModel.RefId);
            UpdateData();
            return userRef.update({
                PublicID : ScriptDataModel.PublicID,
            })
            .then(function() {
                console.log("Document successfully updated!");
            })
            .catch(function(error) {
              console.console.log("Error adding the document ref");
            });


            //Updating the public ref in the public ref document
            var publicRef = db.collection('PublicScripts').doc(ScriptDataModel.PublicID);
            return publicRef.update({
                PublicID : ScriptDataModel.PublicID,
            })
            .then(function() {
                console.log("Document successfully updated!");
                AlertFunction("Congrats You Published Your A Public Script!");
            })
            .catch(function(error) {
              console.console.log("Error adding the document ref");
            });


        })




        // if there is an error below now then there was no document to update and the there was an error adding a document
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
    }// here is the end
  }














window

window.onbeforeunload = function(){return true};
window.onbeforeunload = function(evt) {
  var message = 'Are you sure you want to leave this page?';
  if (typeof evt == 'undefined') {
      evt = window.event;
  }
  if (evt) {
      evt.return = 'Are you sure you want to leave this page?';
  }
  return message;
}


var firstLoadCharBool;
$(document).ready(function(){
  if($('.CharactersObject').length <= 0){
    $('.DismissButton').hide();
    $('.characterModal').fadeIn( 200 , function(){
      $('.AddAnotherCharacterModalObject').hide().fadeIn(function(){
        $('.AddingCharacterInput').focus();
      });
      firstLoadCharBool = true;
  })
  }
})

function transferScriptRefUpdate(scriptRef, scriptBool){
  var user = firebase.auth().currentUser;
  firebase.auth().onAuthStateChanged(function(user) {
      // Checking if there is a user sign in...
      if(user){
          var db = firebase.firestore();
          var UserId = ""+ user.uid + "";
          UserID = UserId;
          var userProfileRef = db.collection("CreativeUsers").doc(UserId);


          return userProfileRef.update({
                transferScript: scriptRef,
                isTransferScript: scriptBool
              })
              .then(function() {
                location.href = '../ScriptWriter/ToddScriptWriter.html';
                console.log("Document successfully updated!");
              })
              .catch(function(error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
              });

        }else{
          console.log('User Not Auth')
        }

      });

}







function GrabAllData(){
  // GrabTitle:
  resetData()
  titleFunction();
  SaveFunction();
}

function resetData(){
  // Script Basic Dat reset so that tags won't have any duplicates
  ScriptDataModel.Tags = [];
  // Script content reset so that data can be stored on the backend without any duplicates
  ScriptContentDataModel.Artists = [];
  ScriptContentDataModel.Dialouge = [];
  ScriptContentDataModel.ArtDiscriptions = [];
  ScriptContentDataModel.Slugs = [];
  ScriptContentDataModel.Notes = [];
  ScriptContentDataModel.Characters = []

}

function AlertFunction(text){
  // Make Text equal to the alert label:
    $('.AlertLabel').text(text);
  // Animate Alert label down
  $('.AlertCard').hide().fadeIn(0).animate({top : "5vh"}, 500, function(){
      setTimeout(function(){
        $('.AlertCard').animate({top : "-5vh"}, 500).fadeOut();
      },  2000 );
    });


}

function titleFunction(){
  if($('.TitleTextArea').val() != ""){
     var title = $('.TitleTextArea').val();
     ScriptDataModel.Title = title;
     console.log(ScriptDataModel);
  }else{
    var errorMessage = "You must Enter A Title";
    AlertFunction(errorMessage);
  }
}


// Save:

$(document).ready(function(){
  $('#save').click(function(){
    privateFlag = true;
    GrabAllData();
    UpdateData();
  });
});


$(document).ready(function(){
  $('.TitleTextArea').keydown(function(event) {
  if (event.which == 13) {
      event.preventDefault();
      $('.TitleTextArea').blur();
      $('.TyperWriter').focus();
    }
  });
})










var ScriptContentDataModel = {
  "Artists" : [],
  "Dialouge" : [],
  "ArtDiscriptions" : [],
  "Slugs" : [],
  "Notes" : [],
  "Characters" : [],
};



var dialogueCounter = 0;
var artDesciptionCounter = 0;
var slugCounter = 0;
var noteCounter = 0;

function SaveFunction(){
  console.log("dialogueObject");
  $('.ContentHolder').children('li').each(function(){
    console.log("dialogueObject");

    if( $(this).is("#0") ){
      var index = $(this).index();
      var character = $(this).eq(0).find('.CharacterName').text();
      var dialogue = $(this).eq(0).find('.DialogueLabel').val();
      var dialogueObject = {
        "type" : 0,
        "Character" : character,
        "dialogue" : dialogue,
        "indexInDialogue" : dialogueCounter,
        "indexInScript" : index,
      }
      dialogueCounter = dialogueCounter + 1;

      ScriptContentDataModel.Dialouge.push(dialogueObject);
      console.log(dialogueObject);


    }else if($(this).is("#1")){
      var index = $(this).index();
      var artDesciption = $(this).eq(0).find('.ArtDesciptionLabel').val();

      var ArtDesObject = {
        "type" : 1,
        "artDesciption" : artDesciption,
        "indexInArtDescription" : artDesciptionCounter,
        "indexInScript" : index,
      }
      artDesciptionCounter = artDesciptionCounter + 1;
      console.log(ArtDesObject);




      ScriptContentDataModel.ArtDiscriptions.push(ArtDesObject);


    }else if($(this).is("#2")){
      var index = $(this).index();
      var slug = $(this).eq(0).find('.SlugLabel').val();
      var SlugDesObject = {
        "type" : 2,
        "slug" : slug,
        "indexInSlug" : slugCounter,
        "indexInScript" : index,
      }

      slugCounter = slugCounter + 1;
      console.log(SlugDesObject);
      ScriptContentDataModel.Slugs.push(SlugDesObject);
    }else if($(this).is("#3")){
      var index = $(this).index();
      var note = $(this).eq(0).find('.NoteLabel').val();
      var NoteDesObject = {
        "type" : 3,
        "note" : note,
        "indexInNote" : noteCounter,
        "indexInScript" : index,
      }
      console.log(ArtDesObject);

      ScriptContentDataModel.Notes.push(NoteDesObject);
      noteCounter = noteCounter + 1;
    }

  });
  ScriptContentDataModel.Characters = arrayOfCharacters;
  ScriptDataModel.Tags = SelectedTags;
}


//Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls:
//Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls:
//Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls:
//Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls:
//Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls:
//Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls:
//Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls:
//Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls:
//Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls:
//Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls:
//Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls:
//Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls:
//Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls:
//Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls:
//Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls:
//Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls:
//Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls:
//Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls:
//Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls://Menu Controls:



$(document).ready(function(){
    $(".AddArtistButton").click(function(){
      AddArtist();
    });

    $('.AddArtistTextArea').keydown(function(event) {
    if (event.which == 13) {
      AddArtist();
      }
    });




    function AddArtist(){
      if($('.AddArtistTextArea').val() != ""){
        var ArtistName = $('.AddArtistTextArea').val();
        if( NoDuplicateArtist(ArtistName) == true){
          var ArtistOject = '<div class="AddArtistObject"><div class="ArtistCenterDiv"><label class="ArtistName">'+ ArtistName + '</label></div><div class="RemoveArtistObject"><label class="RemoveArtistLabel">x</label></div></div>';
          //Append Artist object
          $('.ArtistPlacement').append(ArtistOject);
          //Make Character Div objects Sortable
          $('.AddArtistTextArea').val("");
          $('.AddArtistTextArea').trigger("click");
          // Initialize remove button for it
          $('.RemoveArtistObject').click(function(){
            $(this).parents('.AddArtistObject').remove();
        });
        }else{
          var ErrorMessage = 'You Entered A Duplicate Artist Name'
        }

      }else{
        var ErrorMessage = 'You Must Enter A Character Name'
      }
    }

    $('.RemoveArtistObject').click(function(){
        $(this).parents('.AddArtistObject').remove();
    });
});

function NoDuplicateArtist(InQuestionInQuestion){
  var flag = true;
  $('.AddArtistObject').each(function(){
    if($(this).find('.ArtistName').eq(0).text() == InQuestionInQuestion){
      flag = false;
    }
  });
  return flag
};



// '<div class="AddArtistObject"><div class="ArtistCenterDiv"><label class="ArtistName">'+ ArtistName+'</label></div><div class="RemoveArtistObject"><label class="RemoveArtistLabel">x</label></div></div>'







//  full screen:
  var isFullScreen = false;
  var isHighlighted = false;
  $(document).ready(function(){
      $('.Menu').click(function(){
        toggleSideMenu();
    });

    $('.CreatorsModeButton').click(function(){
      if(isFullScreen == false){
        openFullscreen();
        isFullScreen = true;
      }else{
        closeFullscreen();
        isFullScreen = false
      }
    });


    $('.HighligtsButton').click(function(){
      if(isHighlighted == false){
        textIsHighlighted(true);
        isHighlighted = true;

        $('.HighligtsButton').css({
          "background-color" : "rgb(51, 51, 51)",
        });
      }else{
        textIsHighlighted(false);
        isHighlighted = false;

        $('.HighligtsButton').css({
          "background-color" : "",
        });

      }
    });


    $('.BackToDashButton').click(function(){
      location.href = "../DashBoard/ToddWebDashboard.html"
    });



    var firstLoadSideMenu = true;
    function toggleSideMenu(){
      // $('.sideMenu').toggle();


      if($('.sideMenu').is(':visible')){//cheicking if visible

            $(".sideMenu").animate({
              width: 0
          }, function(){
            $('.sideMenu').hide();
          });
      }else{
        if(firstLoadSideMenu == true){

          $(".sideMenu").animate({
                width: 0
            }, function(){
              $('.sideMenu').show();
          });
                  $(".sideMenu").animate({
                    width: "18vw"
                });


              }else{

                $(".sideMenu").animate({
                  width: "18vw"
              });


              }
          }
  }
  });

  function higlightsStatus(){
    if(isHighlighted == false){
      var InversStatus = !isHighlighted;
      textIsHighlighted(InversStatus);
      isHighlighted = InversStatus;

      $('.HighligtsButton').css({
        "background-color" : "rgb(51, 51, 51)",
      });
    }else{
      var InversStatus = !isHighlighted;
      textIsHighlighted(InversStatus);
      isHighlighted = InversStatus;

      $('.HighligtsButton').css({
        "background-color" : "",
      });

    }
  }





function WriterMode(){
    // $('.topControl').fadeOut();
    // $('.Controls').css({
    //     "height" : "100vh" ,
    // })
}

var elem = document.documentElement;
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    elem.webkitRequestFullscreen();

  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }

}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();

  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}


var arrayOfCharacters = new Array();
var RecentCharacter = "";
$(document).ready(function(){
    $('.AddCharButton').click(function(){
        $('.CharacterCard').hide()
        $('.AddAnotherCharacterModalObject').hide().show();
        $('.characterModal').hide(function(){
            $('.characterModal').fadeIn( 200 , function(){
                $('.CharacterCard').fadeIn()
                $('.AddingCharacterInput').focus()
            })
        });
    });

    $(".AddCharacterButton").click(function(){
      AddCharcter();
    });


    $('.AddingCharacterInput').keydown(function(event) {
      if (event.which == 13) {
        AddCharcter();
        }
      });


    function AddCharcter(){
      if($('.AddingCharacterInput').val() != ""){
        var CharacterName = $('.AddingCharacterInput').val();
        if( NoDuplicateCharacters(CharacterName) == true){
          arrayOfCharacters.push(CharacterName);
          var CharacterObject = '<div class="CharactersObject"><label class="CharacterNameLabel">'+ CharacterName +'</label></div>';
          $('.CharactersDiv').append(CharacterObject);
          initilializeCharacterobject();
          //Make Character Div objects Sortable
          $('.CharactersDiv').sortable({
            axis : "x",
            // handle : '.StoryContentHandel',
            stop : function(event , ui) {
              }

          });
          $('.AddingCharacterInput').val("");
        }else{
          var ErrorMessage = 'You Entered A Duplicate Character Name'
          AddCharacterErrorMesage(ErrorMessage);
        }

      }else{
        var ErrorMessage = 'You Must Enter A Character Name'
        AddCharacterErrorMesage(ErrorMessage);
      }
    }


    function AddCharacterErrorMesage(ErrorMessage) {
      var ErrorMessage = ErrorMessage;
      $('.AddCharacterErrorMessage').text(ErrorMessage);
      $('.AddCharacterErrorMessage').hide(function(){
        $('.AddCharacterErrorMessage').fadeIn(1000, function(){
          $('.AddCharacterErrorMessage').fadeOut(1000);
        })
      });
     }



    function NoDuplicateCharacters(CharcterInQuestion){
      var flag = true;
      $('.CharactersObject').each(function(){
        if($(this).find('.CharacterNameLabel').eq(0).text() == CharcterInQuestion){
          flag = false;
        }
      });
      return flag
    };


    $(".AddCharacterConfirmationButton").click(function(){
      if($('.CharactersObject').length >= 1){
          if($('.AddingCharacterInput').val() != ""){
            var CharacterName = $('.AddingCharacterInput').val();
            if( NoDuplicateCharacters(CharacterName) == true){
              var CharacterObject = '<div class="CharactersObject"><label class="CharacterNameLabel">'+ CharacterName +'</label></div>';
              $('.CharactersDiv').append(CharacterObject);
              $('.AddingCharacterInput').val("");
            }
          }
          $('.characterModal').fadeOut(500);
          $('DismissButtonDiv').show();
          $('.AddAnotherCharacterModalObject').hide();

          //This is to trigger a click of the first character  objcet if the usere is just loading in
          if(firstLoadCharBool == true){
            $('.CharactersObject').eq(0).trigger('click');
            firstLoadCharBool = false;
          }
          $('.TyperWriter').focus();
       }else{
         var error = "You must add at least one Character";
          AddCharacterErrorMesage(error);
       }
    });




    $('.DismissButton').click(function(){
      $('.characterModal').fadeOut(500);
      $('.AddAnotherCharacterModalObject').hide();
    });



    function initilializeCharacterobject(){
      $('.CharactersObject').click(function(){
        $('.CharactersObject').css({
          // "box-shadow" : "",
          "transition": "all 0.3s ease-in-out",
          "border" : "2px solid rgba(255, 255, 255, 0)"
        })
        $(this).css({
          // "box-shadow": "0px 0px 1.3vh rgb(105, 207, 255)",
          "transition": "all 0.3s ease-in-out",
          "border" : "2px solid white"
        })
        var characterName = $(this).find('.CharacterNameLabel').text();
        RecentCharacter = characterName;
      });

    }
});


$('.GoNewProjectAcrossTabsButton').click(function(){
    //use the actuall link when hosting
            // location.href = "https://www.toddlit.com/ToddNewProject.html"

    firebase.auth().onAuthStateChanged(function(user) {
        // Checking if there is a user sign in...

        if(user){
            UpdateData();
            var db = firebase.firestore();
            var UserId = ""+ user.uid + "";
            UserID = UserId;
            var userProfileRef = db.collection("CreativeUsers").doc(UserId);
            userProfileRef.update({
              transferScript : ScriptDataModel.RefID
            });
            location.href = "../ToddNewProject.html";
          }

        });

});








function textIsHighlighted(ShouldBeHighLighted) {
  if(ShouldBeHighLighted == true){
    $('.DialogueDiv').css({
      "background-color" : "rgba(255, 0, 0, 0.05)"
    });
    $('.ArtDesciptionDiv').css({
      "background-color" : "rgba(255, 238, 0, 0.05)"
    });
    $('.SlugDiv').css({
      "background-color" : "rgba(0, 128, 0, 0.05)"
    });
    $('.NoteDiv').css({
      "background-color" : "rgba(0, 0, 255, 0.05)"
    });

  }else{

    $('.DialogueDiv').css({
      "background-color" : "transparent"
    });
    $('.ArtDesciptionDiv').css({
      "background-color" : "transparent"
    });
    $('.SlugDiv').css({
      "background-color" : "transparent"
    });
    $('.NoteDiv').css({
      "background-color" : "transparent"
    });

  }
}


// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:
// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:
// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:
// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:
// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:
// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:
// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:
// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:
// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:
// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:
// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:
// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:
// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:
// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:
// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:
// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:
// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:
// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:
// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:
// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:
// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:// Summary Modal:

$(document).ready(function(){
  $('.SummaryButton').click(function(){
    $('.AddSummary').hide().show();

    $('.AddSummary').hide().show();
    $('.characterModal').hide(function(){
        $('.characterModal').fadeIn( 200 , function(){
            $('.AddSummary').fadeIn()
        })
    });

  });


  $('.SummaryConfirmButton').click(function(){
    $('.characterModal').fadeOut(500);
    $('.AddSummary').hide();
    var summaryData = $('#summary').val();
    ScriptDataModel.Summary = summaryData;
  });
// Blue Man follows a strange being attempting to make sense of the meaning of tough events in his life.

  $('.DismissSummaryButton').click(function(){
    $('.characterModal').fadeOut(500);
    $('.AddSummary').hide();
  });


});




//Hot Keys Modal // Hot Keys Modal//Hot Keys Modal // Hot Keys Modal
//Hot Keys Modal // Hot Keys Modal//Hot Keys Modal // Hot Keys Modal
//Hot Keys Modal // Hot Keys Modal//Hot Keys Modal // Hot Keys Modal
//Hot Keys Modal // Hot Keys Modal//Hot Keys Modal // Hot Keys Modal
//Hot Keys Modal // Hot Keys Modal//Hot Keys Modal // Hot Keys Modal
//Hot Keys Modal // Hot Keys Modal//Hot Keys Modal // Hot Keys Modal
//Hot Keys Modal // Hot Keys Modal//Hot Keys Modal // Hot Keys Modal
//Hot Keys Modal // Hot Keys Modal//Hot Keys Modal // Hot Keys Modal
//Hot Keys Modal // Hot Keys Modal//Hot Keys Modal // Hot Keys Modal
//Hot Keys Modal // Hot Keys Modal//Hot Keys Modal // Hot Keys Modal
//Hot Keys Modal // Hot Keys Modal//Hot Keys Modal // Hot Keys Modal
//Hot Keys Modal // Hot Keys Modal//Hot Keys Modal // Hot Keys Modal
//Hot Keys Modal // Hot Keys Modal//Hot Keys Modal // Hot Keys Modal
//Hot Keys Modal // Hot Keys Modal//Hot Keys Modal // Hot Keys Modal
//Hot Keys Modal // Hot Keys Modal//Hot Keys Modal // Hot Keys Modal
//Hot Keys Modal // Hot Keys Modal//Hot Keys Modal // Hot Keys Modal
//Hot Keys Modal // Hot Keys Modal//Hot Keys Modal // Hot Keys Modal
//Hot Keys Modal // Hot Keys Modal//Hot Keys Modal // Hot Keys Modal
//Hot Keys Modal // Hot Keys Modal//Hot Keys Modal // Hot Keys Modal


$(document).ready(function(){
  $('.HotKeysButton').click(function(){
    $('.HotKeysModal').hide().show();

    $('.characterModal').hide(function(){
        $('.characterModal').fadeIn( 200 , function(){
            $('.HotKeysModal').fadeIn()
        })
    });

  });


  $('.DismissHotButtonDiv').click(function(){
    $('.characterModal').fadeOut(500);
    $('.HotKeysModal').hide();
  });


});













// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:
// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:
// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:
// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:
// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:
// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:
// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:
// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:
// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:
// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:
// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:
// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:
// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:
// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:
// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:
// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:
// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:// Type Writer:


//pressing the enter key... the enter key is key 13
$(document).ready(function() {
  $('.TyperWriter').keydown(function(event) {
      if (event.which == 13) {
        textValue = $('.TyperWriter').val();
        TypeSwitch(textValue);
        $('.TyperWriter').val("");

        $('.PaperDiv').scrollTop($('.PaperDiv')[0].scrollHeight);
        textIsHighlighted(isHighlighted);
        event.preventDefault();
       }
  });
});

$(document).ready(function(){
    $( ".ContentHolder" ).sortable({
      axis : "y",

    });
});
function TypeSwitch(text){
  switch(TyperWriterType){
    case 0:
      $('.ContentHolder').append(Dialogue(character = RecentCharacter, text = textValue)).fadeIn(500);
      InitializeContentEdit();
      RemoveThisDialogueObjectInit();
      break;
    case 1:
      $('.ContentHolder').append(ArtDesciption(text)).fadeIn(500);
      // initializeDoubleClick();
      InitializeContentEdit();
      RemoveThisDialogueObjectInit();
      break;
    case 2:
      $('.ContentHolder').append(Slug(text)).fadeIn(500);
      InitializeContentEdit();
      RemoveThisDialogueObjectInit();

      break;
    case 3:
      $('.ContentHolder').append(Note(text)).fadeIn(500);
      InitializeContentEdit();
      RemoveThisDialogueObjectInit();
      break;
  }
}



function Dialogue(character , text){
  return '<li class="DialogueDiv" id="0"><div class="CharcterNameDiv"> <label class="removeThisDia">x</label> <label class="CharacterName">'+ character +'</label></div><textarea onkeyup="textAreaAdjust(this)"  class="DialogueLabel">'+ text +'</textarea> </li>'
}
function ArtDesciption(text){
  return '<li class="ArtDesciptionDiv" id="1" > <label class="removeThisArt">x</label> <label class="ArtDesciptionTitle"> Action Discription:</label><textarea onkeyup="textAreaAdjust(this)" class="ArtDesciptionLabel">'+ text +'</textarea></li>'
 }

 function Slug(text){
   return '<li class="SlugDiv" id="2" > <label class="removeThisSlug">x</label>  <label class="IntLabel">Int.</label><textarea onkeyup="textAreaAdjust(this)" class="SlugLabel">'+ text +'</textarea></li>'
 }

 function Note(text){
   return '<li class="NoteDiv" id="3" > <label class="removeThisNote">x</label> <div class="NoteVStack"><label class="NoteTitle">*Note :</label><textarea onkeyup="textAreaAdjust(this)" class="NoteLabel">'+ text +'</textarea></div></li>'
 }


function RemoveThisDialogueObjectInit(){

    $('.removeThisDia').click(function(){
      $(this).parents('.DialogueDiv').remove();
    });

    $('.removeThisArt').click(function(){
      $(this).parents('#1').remove();
    });

    $('.removeThisSlug').click(function(){
      $(this).parents('.SlugDiv').remove();
    });

    $('.removeThisNote').click(function(){
      $(this).parents('.NoteDiv').remove();
    });

}

function textAreaAdjust(element) {
  autosize($('.DialogueLabel'));
  autosize($('.ArtDesciptionLabel'));
  autosize($('.SlugLabel'));
  autosize($('.NoteLabel'));
}



function isAlreadyEditing(){
  var NewText = $('.DialogueDiv').eq(DialgueEditLoc).find('.DialogueLabel').val();
  var Object = '<label class="DialogueLabel">'+ NewText +'</label>';
  $('.DialogueLabel').blur();
  event.preventDefault();
  console.log("It's getting there." + DialgueEditLoc);
  $('.DialogueDiv').eq(DialgueEditLoc).find('.DialogueLabel').remove();
  $('.DialogueDiv').eq(DialgueEditLoc).append(Object);
  DialogueIsEding = false;
  InitializeContentEdit();
}


var DialgueEditLoc , ArtDesEditLoc, SlugEditLoc, NoteEditLoc;
var DialgueIsEdting = false , ArtDesIsEdting = false, SlugIsEdting = false, NoteIsEdting = false;
var getText = ""; var getCharacter = "";
function InitializeContentEdit(){

  $('.DialogueDiv').click(function(){
    $('.DialogueLabel').keydown(function(event) {
    if (event.which == 13) {
      $('.DialogueLabel').blur();
      $('.TyperWriter').focus();
      event.preventDefault();
    }
  });


  });

  $('.ArtDesciptionDiv').click(function(){
    ArtDesNew();
  });

  var ArtDesTriggerKey = false;
  var ArtDesNewText = "";
  function ArtDesNew(){
    $('.ArtDesciptionLabel').keydown(function(event) {
    if (event.which == 13) {
      $('.ArtDesciptionLabel').blur();
      $('.TyperWriter').focus();
      event.preventDefault();
    }
  });

  }


  $('.SlugDiv').click(function(){

    $('.SlugLabel').keydown(function(event) {
    if (event.which == 13) {
      $('.SlugLabel').blur();
      $('.TyperWriter').focus();
      event.preventDefault();
      }
    });
  });

  $('.NoteDiv').click(function(){
    $('.NoteLabel').keydown(function(event) {
      if (event.which == 13) {
        $('.NoteLabel').blur();
        $('.TyperWriter').focus();
        event.preventDefault();
      }
    });
  });
}









$(document).ready(function () {
  //Switches the text area type
  $('.DialogueButton').click(function(){
    SwitchTypeWriter(0);
    turnOffScripObjectIdicators();
    $(this).css({
      "border" : "2px solid #428FFF",
      "transition": "all 0.3s ease-in-out"
    });
  });

  $('.ImgDiscriptionButton').click(function(){
      SwitchTypeWriter(1);
      turnOffScripObjectIdicators();
      $(this).css({
        "border" : "2px solid #428FFF",
        "transition": "all 0.3s ease-in-out"
      });
  });

  $('.SlugButton').click(function(){
      SwitchTypeWriter(2);
      turnOffScripObjectIdicators();
      $(this).css({
        "border" : "2px solid #428FFF",
        "transition": "all 0.3s ease-in-out"
      });
  });

  $('.NoteButton').click(function(){
      SwitchTypeWriter(3);
      turnOffScripObjectIdicators();
      $('.NoteButton').css({
        "border" : "2px solid #428FFF",
        "transition": "all 0.3s ease-in-out"
      });
  });

});


var TyperWriterType = 0;
 function SwitchTypeWriter(isDialogue){
  if(isDialogue == 0 && $('.TyperWriter').val() == "" && TyperWriterType == TyperWriterType){
    // Basically if there is no text, if the one you are clicking on isn't the same one you are on, and keeping a one to one ratio
      $('.TyperWriter').attr("maxlength" , "300");
      $('.TyperWriter').attr("placeholder" , "Enter the character dialogue (max 300 characters)");
      turnOffScripObjectIdicators();
      $(".DialogueButton").css({
        "border" : "2px solid #428FFF",
        "transition": "all 0.3s ease-in-out"
      });
      TyperWriterType = 0;
  }else if(isDialogue == 1){
      $('.TyperWriter').attr("maxlength" , "1000000");
      $('.TyperWriter').attr("placeholder" , "Enter the art discription of your story Events");
      turnOffScripObjectIdicators();
      $(".ImgDiscriptionButton").css({
        "border" : "2px solid #428FFF",
        "transition": "all 0.3s ease-in-out"
      });
      TyperWriterType = 1;
  }else if(isDialogue == 2){
      $('.TyperWriter').attr("maxlength" , "1000000");
      $('.TyperWriter').attr("placeholder" , "Enter A location where and when actions are happening in the story");
      turnOffScripObjectIdicators();
      $(".SlugButton").css({
        "border" : "2px solid #428FFF",
        "transition": "all 0.3s ease-in-out"
      });
      TyperWriterType = 2;
  } else if(isDialogue == 3){
      $('.TyperWriter').attr("maxlength" , "1000000");
      $('.TyperWriter').attr("placeholder" , "Enter A  story note");
      turnOffScripObjectIdicators();
      $(".NoteButton").css({
        "border" : "2px solid #428FFF",
        "transition": "all 0.3s ease-in-out"
      });
      TyperWriterType = 3;
  }
}

function turnOffScripObjectIdicators(){
  var ScriptObjects = [
    $('.DialogueButton'),
    ('.ImgDiscriptionButton'),
    $('.SlugButton'),
    $('.NoteButton'),
  ];

  for( x = 0 ; x < ScriptObjects.length ; x++){
    $(ScriptObjects[x]).css({
      "border" : "2px solid rgba(0, 0, 0, 0)",
      "transition": "all 0.3s ease-in-out"
    });
  }
}




//  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys:
//  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys:
//  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys:
//  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys:
//  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys:
//  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys:
//  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys:
//  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys:
//  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys:
//  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys:
//  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys:
//  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys:
//  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys:
//  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys:
//  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys:
//  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys:
//  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys:
//  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys:
//  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys:
//  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys://  Hot Keys:


document.addEventListener('keydown', (e) => {
  //https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
  //https://medium.com/@melwinalm/crcreating-keyboard-shortcuts-in-javascripteating-keyboard-shortcuts-in-javascript-763ca19beb9e
  //https://keycode.info/
  const myTextArea = $("#TyperWriter");
    if(e.ctrlKey && e.key == 'n'){
      e.preventDefault();
      SwitchTypeWriter(3);
      console.log("Event");
    }else if(e.ctrlKey && e.key == 'w'){
      e.preventDefault();
      SwitchTypeWriter(2);
      $('.TyperWriter').focus();
    }else if(e.ctrlKey && e.key == 'i'){
      e.preventDefault();
      SwitchTypeWriter(1);
      $('.TyperWriter').focus();
    }else if(e.ctrlKey && e.key == 'd'){
      e.preventDefault();
      SwitchTypeWriter(0);
      $('.TyperWriter').focus();
    }else if(e.ctrlKey && e.key == 's'){
      e.preventDefault();
      SaveFunction();
      $('.TyperWriter').focus();
    }else if(e.ctrlKey && e.key == 'h'){
      e.preventDefault();
      higlightsStatus();
      $('.TyperWriter').focus();
    }else if(e.ctrlKey && e.key == "z"){
      e.preventDefault();
      shiftBetweenLeftCharacters();
      $('.TyperWriter').focus();
    }else if(e.ctrlKey && e.key == "x"){
      e.preventDefault();
      shiftBetweenRightCharacters();
      $('.TyperWriter').focus();
    }else if(e.ctrlKey && e.key == 'c'){
      e.preventDefault();
      showCharacterModal();
    }

});




function showCharacterModal() {
  $('.CharacterCard').hide()
  $('.AddAnotherCharacterModalObject').hide().show();
  $('.characterModal').hide(function(){
      $('.characterModal').fadeIn( 200 , function(){
          $('.CharacterCard').fadeIn()
          $('.AddingCharacterInput').focus()
      })
  });
 }

var characterCounter = 0;
function shiftBetweenRightCharacters(){
  if(characterCounter < $(".CharactersObject").length){
    characterCounter = characterCounter + 1;
    $(".CharactersObject").eq(characterCounter).trigger('click');
    $('.TyperWriter').focus();
}else{
    characterCounter = 0;
    $(".CharactersObject").eq(characterCounter).trigger('click');
    $('.TyperWriter').focus();
  }
}



function shiftBetweenLeftCharacters(){
  if(characterCounter < 0){
    characterCounter = $(".CharactersObject").length - 1;
    $(".CharactersObject").eq(characterCounter).trigger('click');
    $('.TyperWriter').focus();
  }else{
    characterCounter = characterCounter - 1;
    $(".CharactersObject").eq(characterCounter).trigger('click');
    $('.TyperWriter').focus();
  }
}














/// Tag Controls:

var TagData = [
  {"name" : "Altruism",
  "value" : 0, "def" : "Altruism is the belief in or practice of disinterested and selfless concern for the well-being of others."},


  {"name" : "Egoism",
  "value" : 1, "def" : "Egosim is the belief that moral people should to act in their own self-interest."},


  {"name" : "Utilitarianism",
  "value" : 2, "def" : "Utilitarianism is the belief that moral actions are right if they are useful or for the benefit of a majority."},


  {"name" : "Stocism",
  "value" : 3, "def" : "Stocism is the endurance of pain or hardship without the display of feelings and without complaint."},


  {"name":"Expressionistic Behavior",
  "value" : 4, "def" : "Expressionistic Behavior is a form of expression where pain, endurance, and hardship take a backseat to exposing one's self emotionally and focusing more importantly on living in the moment."},


  {"name" : "Normal Behavior Ethics",
  "value" : 5, "def" : ""},


  {"name" : "Individuality",
  "value" : 6, "def" : "Individuality is the quality or character of a particular person or thing that distinguishes them from others of the same kind. An individuality philosophical postion would place individual differences as being more important then collective identity such as nationalism."},


  {"name" : "Collectivism",
  "value" : 7, "def" : "Collectivism is the practice or principle of giving a group priority over each individual in it."},


  {"name" : "Essentialism",
  "value" : 8, "def" : "Essentialism is the philosophical conviction that an object or individueal have an inate meaning or essense."},


  {"name" : "Existentialism",
  "value" : 9, "def" : "Existentialism is a form of philosophical enquiry that explores the nature of existence by emphasizing the meaning and essense human experiences and objects to be subjective. It is to say meaning is not found in the object or human, instead meaning is synshtized by the human onto the object and the experience."},


  {"name" : "Love",
  "value" : 10, "def" : "No definition will suit love. It is left to you and us all to make arguements for it's definition."},


  {"name" : "Humor",
  "value" : 11, "def" : "Humor is the quality of being amusing or comic, especially as expressed in literature or speech."},


  {"name" : "Freedom",
  "value" : 12, "def" : "Freedom is the power or right to act, speak, or think as one wants without hindrance or restraint."},


  {"name" : "Artificial Intelligence",
  "value" : 13, "def" : "Artificial Intelligence is intelligence demonstrated by machines, unlike the natural intelligence displayed by humans and animals"},


  {"name" : "Thought",
  "value" : 14, "def" : "Thought is an idea or opinion produced by thinking, or occurring suddenly in the mind."},


  {"name" : "Challenge",
  "value" : 15, "def" : "Challenge is a call to adventure that ask an individual or group of individuals to take on a task that has obstacles."},


  {"name" : "Bravery",
  "value" : 16, "def" : "Bravery is courageous behavior or character where an individual or group of individuals take on a task that is undesired or hard out moral responsibility."},


  {"name" : "Family",
  "value" : 17, "def" : "Family is a group of individuals bound together by companionship, care, and the desire to endure through life."},


  {"name" : "Exploration",
  "value" : 18, "def" : "Exploration is the action of traveling in or through an unfamiliar area in order to learn about it."},


  {"name" : "Meaning",
  "value" : 19, "def" : "Meaning doesn't have a good definition. It is one of those tricky conceptual words that are consitently defined by us."},


  {"name" : "Rationalism",
  "value" : 20, "def" : "Rationalism is a belief or theory that opinions and actions should be based on reason and knowledge rather than on religious belief or emotional response."},


  {"name" : "Creativity",
  "value" : 21, "def" : "Creativity is a phenomenon whereby something new and somehow valuable is formed. The created item may be intangible or a physical object."},


  {"name" : "Time",
  "value" : 22, "def" : "the indefinite continued progress of existence and events in the past, present, and future regarded as a whole."},


  {"name" : "Chaos Theory",
  "value" : 23, "def" : "Chaos theory is an interdisciplinary theory stating that, within the apparent randomness of chaotic complex systems, there are underlying patterns, interconnectedness, constant feedback loops, repetition, self-similarity, fractals, and self-organization."},

  {"name" : "Determinism",
  "value" : 24, "def" : "Determinism is the philosophical view that all events are determined completely by previously existing causes."},

  {"name" : "Compatibilism",
  "value" : 25, "def" : "Compatibilism is the belief that free will and determinism are mutually compatible and that it is possible to believe in both without being logically inconsistent."},

  {"name" : "Free Will",
  "value" : 26, "def" : "Free will is the ability to choose between different possible courses of action unimpeded and with out causal connections."},

  {"name" : "Models",
  "value" : 27, "def" : "Models, most commonly associated in artificial intelegence but useful in many other contexts, is the idea of a small closed system that is representational of a larger complex system. The idea has utility because the small model of the larger system helps us to make predictions about the large dynamic complex system."},

  {"name" : "Humanism",
  "value" : 28,
  "def" : "Humanism is an outlook or system of thought attaching prime importance to human rather than divine or supernatural matters."},

  {"name" : "Subconscious",
  "value" : 29,
  "def" : "Subconscious is the concerning the part of the mind of which one is not fully aware but which influences one's actions and feelings.",
  },

  {"name" : "Conscious",
  "value" : 30,
  "def" : "the fact of awareness by the mind of itself and the world.",
  },

  {"name" : "Economics",
  "value" : 31,
  "def" : "Economics is the branch of knowledge concerned with the production, consumption, and transfer of wealth.",
  },

  {"name" : "History",
  "value" : 32,
  "def" : "History is the study of actions, ideas, objects that happened in the past.",
  },

  {"name" : "Culture",
  "value" : 33,
  "def" : "Culture is the arts and other manifestations of human intellectual achievement regarded collectively.",
  },

  {"name" : "Philosophy of mind",
  "value" : 34,
  "def" : "Philosophy of mind is a branch of philosophy that studies the ontology and nature of the mind and its relationship with the body."
}


];


$(document).ready(function(){
  $('.TagsButton').click(function(){
    $('.AddTagsModal').hide().show();

    $('.AddTagsModal').hide().show();
    $('.characterModal').hide(function(){
        $('.characterModal').fadeIn( 200 , function(){
            $('.AddTagsModal').fadeIn()
        })
    });

  });
});


var SelectedTags = [];
$(document).ready(function(){
  function addTagObjects(){
      if( $('.TagObject').length <= 0){
        for(x = 0 ; x < TagData.length ; x++){
          var TagObject = '<button class="TagObject" id="'+ TagData[x].value +'">'+ TagData[x].name +'</button>';
          $('.nonSelectedTagsStack').append(TagObject);
          initailizeTagObject();
        }
       }
    }
    addTagObjects();

    function initailizeTagObject(){

        $('.nonSelectedTagsStack').find('.TagObject').click(function(){
          if($(this).parents('.nonSelectedTagsStack').length){
            var title = $(this).text();
            var index = returnIndex(title);
            var objectIndex = 0;
            // turnOffSelectedTags();
            $(this).appendTo('.SelectedTagsStack');
            $('.ExplainationsHeader').text(title);
            for( x = 0 ; x < TagData.length ; x++){
              if( title == TagData[x].name){
                var definition = TagData[x].def;
                $('#explainationBox').text(definition);
                var TagDataObject = TagData[x];
                SelectedTags.push(TagDataObject);
              }
            }
          }

          $('.SelectedTagsStack').find('.TagObject').click(function(){
              var title = $(this).text();
              var index = $(this).index(); //returnIndex(title);
              for( x = 0 ; x < TagData.length ; x++){
                if( title == TagData[x].name){
                  var definition = TagData[x].def;
                  $('#explainationBox').text(definition);
                }
              }
              for(i = 0 ; i < SelectedTags.length ; i++){
                if (SelectedTags[i].name == title) {
                   SelectedTags.splice( i ,1);
                 }
              }
              // turnOffSelectedTags();
              $(this).appendTo('.nonSelectedTagsStack');
              initailizeTagObject();
            })

          });
        }

});


function returnIndex(thisTitle){
  for(x = 0 ; x < TagData.length; x ++){
    var title = TagData[x].name;
    if( title == thisTitle){
      return x;
    }
  }
}



function turnOffSelectedTags(){
  $('.TagObject').css({
    "background" : "#428FFF"
  });
}
