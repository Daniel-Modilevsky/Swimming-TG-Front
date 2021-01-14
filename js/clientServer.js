/*global $ */
/*jslint browser: true*/
/*eslint no-console: "error"*/

$(document).ready(function(){

    $("#but_upload").click(function(){

        var fd = new FormData();
        var files = $('#file')[0].files;
        
        // Check file selected or not
        if(files.length > 0 ){
           fd.append('file',files[0]);

           $.ajax({
              url: 'upload.php',
              type: 'post',
              data: fd,
              contentType: false,
              processData: false,
              success: function(response){
                 if(response != 0){
                    $("#img").attr("src",response); 
                    $(".preview img").show(); // Display image element
                 }else{
                    alert('file not uploaded');
                 }
              },
           });
        }else{
           alert("Please select a file.");
        }
    });
});


function postLogin(){
    const formData = {
            'user_name' : $('input[name=user_name]').val(),
            'password': $('input[name=password]').val()
        };
    
    
        $.ajax({
            url: 'http://localhost:8080/api/authentication/login',
            type: 'POST', 
            data:formData,
            cache: false,
            async:false,
            dataType : 'json',
            success: function(user) {
                localStorage.setItem("User", formData.user_name);
                let id = user.profile._id;
                localStorage.setItem("UserId", id);
                top.location.href="home.html";
            },  
            error:function(jqXHR, textStatus, message){  
                $('.error-box').append(`<h2>errors</h2><p>`+message+`</p>`);
            }
        })
}
function postRegister(){
    let input2 = document.getElementById("customFile").value;
    let input1 = $('#customFile')[0].files;
    console.log(input2);
    console.log(input1);
    var fd = new FormData();
    var files = $('#customFile')[0].files;
    fd.append('image',files[0]);

    
    const formData = {
        'user_name' : $('input[name=user_name]').val(),
        'email': $('input[name=email]').val(),
        'password': $('input[name=password]').val(),
        'password2': $('input[name=password2]').val(),
        'image': input1
    };
    $.ajax({
        url: 'http://localhost:8080/api/authentication/signup',
        type: 'POST', 
        data:formData,
        cache: false,
        dataType : 'json',
        success: function(user) {
            localStorage.setItem("User", formData.user_name);
            let id = user.profile._id;
            localStorage.setItem("Id", id);
            top.location.href="home.html";
        },  
        error:function(message){  
            $('.error-box').append(`<h2>errors</h2><p>`+message+`</p>`);
        }
    })
}
async function Parseusername(){
    await imageShow();
    setTimeout(function(){ 
        let user = localStorage.getItem("User");
        let image = localStorage.getItem("image");
        let urlImage = "";
        if(image == 'img/Unknown_person.jpg') urlImage = image;
        else urlImage = 'http://localhost:8080/' + image;
        $('#mini-profile').empty();
        $('#mini-profile').append(
            '<img src="' + urlImage +'">'+
            '<h4 id = "userName" class="text-light"> '+ user +' </h4></div> '
        );
    }, 500);
;}

function imageShow(){
    id = localStorage.getItem("UserId");
    image = "img/Unknown_person.jpg"
    localStorage.setItem("image", image);
     $.ajax({
        url: `http://localhost:8080/api/users/${id}`,
        type: 'GET',
        success: function(user) {
            let newImage = user.user.image;
            if(newImage){
                localStorage.setItem("image", newImage);
            }
        },
        error:function(){  
           alert('Error - get User');
           top.location.href="404.html"
        }   
    });           
}
//=========EXCER============
function showExcercises(){
    console.log(`http://localhost:8080/api/excercisies`);
    $.ajax({
        url: `http://localhost:8080/api/excercisies`,
        type: 'GET',
        success: function(excercises) {
            $('#pid-excercise').empty();
            excercises.forEach(excersice => {
                $('#pid-excercise').append(
                    '<article class="exer hvr-curl-top-right hvr-shrink"><aside class="left-excer"><label class="head-excer">Step</label> : <span>'+ excersice.step +'</span><br>' +
                    //'<label>Level</label> : <span>'+ excersice.tempo +'</span><br>' +
                    (excersice.tempo == 'Easy' ? '<label>Level</label> : <img src="https://img.icons8.com/ios-filled/30/26e07f/heart-with-pulse--v1.png"/><br>': '') +
                    (excersice.tempo == 'Medium' ? '<label>Level</label> : <img src="https://img.icons8.com/ios-filled/30/CCCC00/heart-with-pulse--v1.png"/><br>': '') +
                    (excersice.tempo == 'Hard' ? '<label>Level</label> : <img src="https://img.icons8.com/fluent/30/26e07f/heart-with-pulse.png"/><br>': '') +
                    //'<label>Break</label> : <span>'+ excersice.break +'s</span></aside>' +
                     (excersice.break == 10 ? '<label>Break</label> : <img src="https://img.icons8.com/dotty/30/6495ED/forward-10.png"/>': '') +
                     (excersice.break == 15 ? '<label>Break</label> : <img src="https://img.icons8.com/carbon-copy/36/6495ED/15-circled-c.png"/>': '') +
                     (excersice.break == 20 ? '<label>Break</label> : <img src="https://img.icons8.com/carbon-copy/36/6495ED/20-circled-c.png"/>': '') +
                     (excersice.break == 30 ? '<label>Break</label> : <img src="https://img.icons8.com/dotty/30/6495ED/forward-30.png"/>': '') +
                     (excersice.break == 45 ? '<label>Break</label> : <img src="https://img.icons8.com/color/30/6495ED/45.png"/>': '') +
                     (excersice.break == 60 ? '<label>Break</label> : <img src="https://img.icons8.com/ios/30/6495ED/last-60-sec.png"/>': '') +
                    '</aside>'+
                    //<img src="https://img.icons8.com/dotty/80/000000/forward-30.png"/>
                    '<aside class="midle-excer"><label>Mount</label> : <span>'+ excersice.count +' x '+ excersice.distance +'</span><br>' +
                    '<label>Style</label> : <span>'+ excersice.multiple +'</span><br>' + 
                    '<label>Details</label> : <span>'+ excersice.details +'</span></aside>' +
                    '<aside class="right-excer">' + 
                    (excersice.isKickBoard == true ? '<img src="https://img.icons8.com/fluent/40/000000/buoyancy-compensator.png"/>': '') +
                    (excersice.isFins == true ? '<img src="https://img.icons8.com/officel/40/000000/flippers.png"/><br>': '') +
                    (excersice.isPullbuoy == true ? '<img src="https://img.icons8.com/ultraviolet/40/000000/float.png"/>': '') +
                    (excersice.isHandPaddles == true ? '<img src="https://img.icons8.com/wired/40/4a90e2/hand.png"/>': '') 

                );
            });
        },
        error:function(){  
           alert('Error - showExcercises');
           top.location.href="404.html";
        }   
    });
}
function postExcercise(){    
    let styles = document.getElementsByClassName('multiple');
    let newStyles = [];
    if(styles[0].checked) newStyles.push(styles[0].value);
    if(styles[1].checked) newStyles.push(styles[1].value);
    if(styles[2].checked) newStyles.push(styles[2].value);
    if(styles[3].checked) newStyles.push(styles[3].value);
    if(styles[4].checked) newStyles.push(styles[4].value);
    
    let equipments = document.getElementsByClassName('equipment');
     const formData = {
            'count' : document.getElementById("count").value,
            'distance': document.getElementById("distance").value,
            'multiple': newStyles,
            'step': document.getElementById("step").value,
            'details': document.getElementById("details").value,
            'tempo': document.getElementById("tempo").value,
            'break': document.getElementById("break").value,
            'isFins': equipments[0].value,
            'isPullbuoy': equipments[1].value,
            'isHandPaddles': equipments[2].value,
            'isKickBoard': equipments[3].value
        };
        console.log(formData);
        $.ajax({
            url: 'http://localhost:8080/api/excercisies',
            type: 'POST', 
            data:formData,
            cache: false,
            dataType : 'json',
            success: function(excersice) {
                top.location.href="excercises.html";
            },  
            error:function(message){  
                $('.error-box').append(`<h2>errors</h2><p>`+message+`</p>`);
            }
        })
}
function getExcerciseByStep(step){
    console.log(`http://localhost:8080/api/step/:${step}`);
    let stepList = '';
    if(step == 'Race')          stepList = '#race-article';
    else if(step == 'Warm Up')  stepList = '#worm-article'; 
    else if(step == 'Main Set') stepList = '#mainset-article'; 
    else                        stepList = '#swimdown-article'; 

    $.ajax({
        url: `http://localhost:8080/api/step/${step}`,
        type: 'GET',
        success: function(excercises) {
            $('#pid-excer-by-step').empty();
            excercises.forEach(excersice => {
                //getExcercise(stepList, excersice._id);
                let str = `${excersice._id}, ${stepList}`;
                $('#pid-excer-by-step').append(
                    '<article class="exer hvr-curl-top-right hvr-shrink" onClick="chooseExcer(\'' + str + '\')"><aside class="left-excer"><label class="head-excer">Step</label> : <span>'+ excersice.step +'</span><br>' +
                    (excersice.tempo == 'Easy' ? '<label>Level</label> : <img src="https://img.icons8.com/ios-filled/30/26e07f/heart-with-pulse--v1.png"/><br>': '') +
                    (excersice.tempo == 'Medium' ? '<label>Level</label> : <img src="https://img.icons8.com/ios-filled/30/CCCC00/heart-with-pulse--v1.png"/><br>': '') +
                    (excersice.tempo == 'Hard' ? '<label>Level</label> : <img src="https://img.icons8.com/fluent/30/26e07f/heart-with-pulse.png"/><br>': '') +
                     (excersice.break == 10 ? '<label>Break</label> : <img src="https://img.icons8.com/dotty/30/6495ED/forward-10.png"/>': '') +
                     (excersice.break == 15 ? '<label>Break</label> : <img src="https://img.icons8.com/carbon-copy/36/6495ED/15-circled-c.png"/>': '') +
                     (excersice.break == 20 ? '<label>Break</label> : <img src="https://img.icons8.com/carbon-copy/36/6495ED/20-circled-c.png"/>': '') +
                     (excersice.break == 30 ? '<label>Break</label> : <img src="https://img.icons8.com/dotty/30/6495ED/forward-30.png"/>': '') +
                     (excersice.break == 45 ? '<label>Break</label> : <img src="https://img.icons8.com/color/30/6495ED/45.png"/>': '') +
                     (excersice.break == 60 ? '<label>Break</label> : <img src="https://img.icons8.com/ios/30/6495ED/last-60-sec.png"/>': '') +
                    '</aside>'+
                    '<aside class="midle-excer"><label>Mount</label> : <span>'+ excersice.count +' x '+ excersice.distance +'</span><br>' +
                    '<label>Style</label> : <span>'+ excersice.multiple +'</span><br>' + 
                    '<label>Details</label> : <span>'+ excersice.details +'</span></aside>' +
                    '<aside class="right-excer">' + 
                    (excersice.isKickBoard == true ? '<img src="https://img.icons8.com/fluent/40/000000/buoyancy-compensator.png"/>': '') +
                    (excersice.isFins == true ? '<img src="https://img.icons8.com/officel/40/000000/flippers.png"/><br>': '') +
                    (excersice.isPullbuoy == true ? '<img src="https://img.icons8.com/ultraviolet/40/000000/float.png"/>': '') +
                    (excersice.isHandPaddles == true ? '<img src="https://img.icons8.com/wired/40/4a90e2/hand.png"/>': '')
                );
            }); 
        },
        error:function(){  
           alert('Error - showExcercises');
           top.location.href="404.html";
        }   
    });
}


//=========LISTS============
let warmList = []; 
let mainList = []; 
let downList = []; 
let raceList = []; 
let excerciseisList = [];
let totalDistance = 0;
localStorage.setItem("Distance", parseInt(0));


//=========LIST============
function pushList(list, id){
    list.push(id);
    showFormExcercises(list);
}
function removeList(str){
    let excerId = str.substr(0,str.indexOf(','));
    let listName = str.substr(str.indexOf(' ')+1);
    if(listName == '#worm-article') {
        let idx = warmList.indexOf(excerId);
        if (idx != -1) warmList.splice(idx, 1);
        showFormExcercises(listName);
    }
    else if (listName == '#mainset-article') {
        let idx = mainList.indexOf(excerId);
        if (idx != -1) mainList.splice(idx, 1);
        showFormExcercises(listName);
    }
     else if (listName == '#race-article') {
        let idx = raceList.indexOf(excerId);
        if (idx != -1) raceList.splice(idx, 1);
        showFormExcercises(listName);
    }
     else {
        let idx = downList.indexOf(excerId);
        if (idx != -1) downList.splice(idx, 1);
        showFormExcercises(listName);
    }
}

 

//=========EXCER=TO=LISTS============
function chooseExcer(str){
    // I WILL SAVE HERE THE EXCERCISE TO SEND TO THE SERVER AS A TRAIN FORM PARAMETERS
    let excerId = str.substr(0,str.indexOf(','));
    let listName = str.substr(str.indexOf(' ')+1);
    if(listName == '#race-article')     pushList(raceList, excerId);
    if(listName == '#worm-article')     pushList(warmList, excerId);
    if(listName == '#mainset-article')  pushList(mainList, excerId);
    if(listName == '#swimdown-article') pushList(downList, excerId);
    $.ajax({
        url: `http://localhost:8080/api/excercisies/${excerId}`,
        type: 'GET',
        success: function(excercise) {
            $(listName).append(
                '<article class="exer hvr-underline-from-center"><aside class="left-excer">'+
                (excercise.excercise.tempo == 'Easy' ? '<label>Level</label> : <img src="https://img.icons8.com/ios-filled/30/26e07f/heart-with-pulse--v1.png"/><br>': '') +
                    (excercise.excercise.tempo == 'Medium' ? '<label>Level</label> : <img src="https://img.icons8.com/ios-filled/30/CCCC00/heart-with-pulse--v1.png"/><br>': '') +
                    (excercise.excercise.tempo == 'Hard' ? '<label>Level</label> : <img src="https://img.icons8.com/fluent/30/26e07f/heart-with-pulse.png"/><br>': '') +
                     (excercise.excercise.break == 10 ? '<label>Break</label> : <img src="https://img.icons8.com/dotty/30/6495ED/forward-10.png"/>': '') +
                     (excercise.excercise.break == 15 ? '<label>Break</label> : <img src="https://img.icons8.com/carbon-copy/36/6495ED/15-circled-c.png"/>': '') +
                     (excercise.excercise.break == 20 ? '<label>Break</label> : <img src="https://img.icons8.com/carbon-copy/36/6495ED/20-circled-c.png"/>': '') +
                     (excercise.excercise.break == 30 ? '<label>Break</label> : <img src="https://img.icons8.com/dotty/30/6495ED/forward-30.png"/>': '') +
                     (excercise.excercise.break == 45 ? '<label>Break</label> : <img src="https://img.icons8.com/color/30/6495ED/45.png"/>': '') +
                     (excercise.excercise.break == 60 ? '<label>Break</label> : <img src="https://img.icons8.com/ios/30/6495ED/last-60-sec.png"/>': '') +
                    '</aside>'+
                    '<aside class="midle-excer"><label>Mount</label> : <span>'+ excercise.excercise.count +' x '+ excercise.excercise.distance +'</span><br>' +
                    '<label>Style</label> : <span>'+ excercise.excercise.multiple +'</span><br>' + 
                    '<label>Details</label> : <span>'+ excercise.excercise.details +'</span></aside>' +
                    '<aside class="right-excer">' + 
                    (excercise.excercise.isKickBoard == true ? '<img src="https://img.icons8.com/fluent/40/000000/buoyancy-compensator.png"/>': '') +
                    (excercise.excercise.isFins == true ? '<img src="https://img.icons8.com/officel/40/000000/flippers.png"/><br>': '') +
                    (excercise.excercise.isPullbuoy == true ? '<img src="https://img.icons8.com/ultraviolet/40/000000/float.png"/>': '') +
                    (excercise.excercise.isHandPaddles == true ? '<img src="https://img.icons8.com/wired/40/4a90e2/hand.png"/>': '')+
                '</aside><button class="plus btn btn-danger" onClick="removeList(\'' + str + '\')"><i class="bx bx-minus"></i>' + '</button>'
                );
        },
        error:function(){  
           alert('Error - getMovie');
           top.location.href="404.html"
        }   
    });
}
function getExcercise(listName, id){
    let str = `${id}, ${listName}`;
    $.ajax({
        url: `http://localhost:8080/api/excercisies/${id}`,
        type: 'GET',
        success: function(excercise) {
           $(listName).append(
                '<article class="exer hvr-underline-from-center"><aside class="left-excer">'+
                '<label class="head-excer">Step</label> : <span class="head-excer">'+ excercise.excercise.step +'</span><br>' +
                (excercise.excercise.tempo == 'Easy' ? '<label>Level</label> : <img src="https://img.icons8.com/ios-filled/30/26e07f/heart-with-pulse--v1.png"/><br>': '') +
                    (excercise.excercise.tempo == 'Medium' ? '<label>Level</label> : <img src="https://img.icons8.com/ios-filled/30/CCCC00/heart-with-pulse--v1.png"/><br>': '') +
                    (excercise.excercise.tempo == 'Hard' ? '<label>Level</label> : <img src="https://img.icons8.com/fluent/30/26e07f/heart-with-pulse.png"/><br>': '') +
                     (excercise.excercise.break == 10 ? '<label>Break</label> : <img src="https://img.icons8.com/dotty/30/6495ED/forward-10.png"/>': '') +
                     (excercise.excercise.break == 15 ? '<label>Break</label> : <img src="https://img.icons8.com/carbon-copy/36/6495ED/15-circled-c.png"/>': '') +
                     (excercise.excercise.break == 20 ? '<label>Break</label> : <img src="https://img.icons8.com/carbon-copy/36/6495ED/20-circled-c.png"/>': '') +
                     (excercise.excercise.break == 30 ? '<label>Break</label> : <img src="https://img.icons8.com/dotty/30/6495ED/forward-30.png"/>': '') +
                     (excercise.excercise.break == 45 ? '<label>Break</label> : <img src="https://img.icons8.com/color/30/6495ED/45.png"/>': '') +
                     (excercise.excercise.break == 60 ? '<label>Break</label> : <img src="https://img.icons8.com/ios/30/6495ED/last-60-sec.png"/>': '') +
                    '</aside>'+
                    '<aside class="midle-excer"><label>Mount</label> : <span>'+ excercise.excercise.count +' x '+ excercise.excercise.distance +'</span><br>' +
                    '<label>Style</label> : <span>'+ excercise.excercise.multiple +'</span><br>' + 
                    '<label>Details</label> : <span>'+ excercise.excercise.details +'</span></aside>' +
                    '<aside class="right-excer">' + 
                    (excercise.excercise.isKickBoard == true ? '<img src="https://img.icons8.com/fluent/40/000000/buoyancy-compensator.png"/>': '') +
                    (excercise.excercise.isFins == true ? '<img src="https://img.icons8.com/officel/40/000000/flippers.png"/><br>': '') +
                    (excercise.excercise.isPullbuoy == true ? '<img src="https://img.icons8.com/ultraviolet/40/000000/float.png"/>': '') +
                    (excercise.excercise.isHandPaddles == true ? '<img src="https://img.icons8.com/wired/40/4a90e2/hand.png"/>': '')+
                '</aside><button class="plus btn btn-danger" onClick="removeList(\'' + str + '\')"><i class="bx bx-minus"></i>' + '</button>'
                );
        },
        error:function(){  
           alert('Error - getMovie');
           top.location.href="404.html"
        }   
    });               
}
function showFormExcercises(listName){
    $(listName).empty();
    if(listName == '#worm-article'){
        warmList.forEach(excer => {
            getExcercise(listName, excer);     
     });  
    }
    else if(listName == '#mainset-article'){
        mainList.forEach(excer => {
            getExcercise(listName, excer);     
     });  
    }
     else if(listName == '#swimdown-article'){
        downList.forEach(excer => {
            getExcercise(listName, excer);     
     });  
    }
     else{
        raceList.forEach(excer => {
            getExcercise(listName, excer);     
     });  
    }
}
async function distance(excerciseisList){
    await excerciseisList.forEach(element => {
        $.ajax({
            url: `http://localhost:8080/api/excercisies/${element}`,
            type: 'GET',
            success: function(excercise) {
                let coun = excercise.excercise.count;
                let dist = excercise.excercise.distance;
                let mount = coun * dist;
                let oldDist = parseInt(localStorage.getItem("Distance")) + parseInt(mount);
                //alert(oldDist);
                localStorage.setItem("Distance", oldDist);
                //totalDistance = totalDistance + mount;
            },
            error:function(){  
               alert('Error - distance');
               top.location.href="404.html"
            }      
        });
    })
    //return totalDistance;
}

//=========Train=Form============
function collectTrainExcer(excerciseisList, warmList, mainList, downList, raceList){
    warmList.forEach(element => excerciseisList.push(element));
    mainList.forEach(element => excerciseisList.push(element));
    downList.forEach(element => excerciseisList.push(element));
    raceList.forEach(element => excerciseisList.push(element));
    return excerciseisList;
}
async function postTrain(){   
    let exercisies = await collectTrainExcer(excerciseisList, warmList, mainList, downList, raceList); 
    await distance(exercisies);
    let formData;
    setTimeout(function(){ 
        let myTotalDistance = parseInt(localStorage.getItem("Distance"));
        formData = {
            'name' : $('input[name=name]').val(),
            'date': $('input[name=date]').val(),
            'exercisies': exercisies,
            'totalDistance': parseInt(localStorage.getItem("Distance")),        
        };
    $.ajax({
        url: 'http://localhost:8080/api/trains',
        type: 'POST', 
        data:formData,
        cache: false,
        dataType : 'json',
        success: function(train) {
            localStorage.setItem('trainID', train._id);
            pushTrain();
            top.location.href="trainshow.html";
        },  
        error:function(message){  
            $('.error-box').append(`<h2>errors</h2><p>`+message+`</p>`);
        }
    })
    }, 1000);
    let myTotalDistance = parseInt(localStorage.getItem("Distance"));
    //alert(myTotalDistance);
    //localStorage.setItem("Distance", parseInt(0));
    
   
}


//=========Train=Show============
function getTrain(){
    let id = localStorage.getItem('trainID');
    $.ajax({
        url: `http://localhost:8080/api/trains/${id}`,
        type: 'GET',
        success: function(train) {
           $('#Train').append(
               '<img src="img/header-5.jpg" class="img-header">'+
               '<section class="train-header">'+
               '<h3>Train Name : '+ train.train.name +'</h3></section><section class="train-body">' +
               train.train.exercisies.forEach(excersice => {
                    getExcercise('.train-body', excersice);
               }) +
               '</section><section class="train-footer"><label>Date: </label><span>'+ (train.train.date).substr(0,10) +'</span>'+
               '<label class="center-lebel">Distance: </label><span> '+ train.train.totalDistance +'m</span>'+
               '<img src="img/logo.png" class="right-img"></section></div>'
           )     
        },
        error:function(){  
           alert('Error - getMovie');
           top.location.href="404.html"
        }   
    });           
};
function pushTrain(){
   let trainID = localStorage.getItem('trainID');
   let userId = localStorage.getItem('UserId');  

   const formData = { 'train' : trainID };
    $.ajax({
        url: `http://localhost:8080/api/users/${userId}`,
        type: 'PUT',
        data:formData,
        success: function(user) {
           console.log(user);
        },
        error:function(){  
           alert('Error - pushTrain');
           top.location.href="404.html"
        }   
    });       
}


//=========Profile===============
async function getUser(){
    let id = localStorage.getItem("UserId");
    let name = localStorage.getItem("User");
    let totalDistance = localStorage.getItem("totalDistance");
    let totalExcercise = localStorage.getItem("totalExcercise");
    let lestDate = localStorage.getItem("lestDate");
    
    
    await imageShow();
    setTimeout(function(){ 
        let image = localStorage.getItem("image");
        let urlImage = "";
        if(image == 'img/Unknown_person.jpg') urlImage = image;
        else urlImage = 'http://localhost:8080/' + image;
        $.ajax({
            url: `http://localhost:8080/api/users/${id}`,
            type: 'GET',
            success: function(user) {
                $('#user-name-span').append((name).toUpperCase());
                $('#my-profile').empty();
                $('#my-profile').append(
                    '<article><aside><img src = "'+urlImage+'"></aside>'+
                    '<nav><ul><li><label>Name: </label><span class="movie-name"> '+ user.user.user_name +' </span></li>'+
                    '<li><label>Email: </label><span> '+user.user.email +' </span></li>'+
                    '<li><label>Total Distance: </label><span> '+ (totalDistance/1000) +'km </span></li>'+
                    '<li><label>Total Trains: </label><span> '+ ((user.user.trainsHistory.length)-1) +' </span></li>'+
                    '<li><label>Total Excercise: </label><span> '+totalExcercise+' </span></li>'+
                    '<li><label>Last Workout: </label><span> '+lestDate+' </span></li></ul></nav>'+
                    '</article></div>'
                );
            },
            error:function(){  
               alert('Error - get User');
               top.location.href="404.html"
            }   
        });     
    },2000);
};
function getUserTrains(){
    let id = localStorage.getItem("UserId");
    let totalDistance = 0 ;
    let totalExcercise = 0;
    let lestDate = 01/01/90;
    $.ajax({
        url: `http://localhost:8080/api/users/${id}`,
        type: 'GET',
        success: function(user) {
            $('#my-profile-list').empty();
             user.user.trainsHistory.forEach(trainId => {
                console.log(trainId);
                $.ajax({
                    url: `http://localhost:8080/api/trains/${trainId}`,
                    type: 'GET',
                    success: function(train) {
                        $('#my-profile-list').append(
                            '<article class="hvr-rectangle-out">'+
                            '<img src="img/unknown.png">'+
                            '<section><label>Name: </label><span>'+train.train.name+'</span></section>'+
                            '<section><label>Excercisies: </label><span>'+ train.train.exercisies.length +'</span></section>'+
                            '<section><label>Distance: </label><span>'+train.train.totalDistance+'m</span></section>'+
                            '<section><label>Date: </label><span>'+(train.train.date).substr(0,10)+'</span></section></article>'
                        );
                        totalDistance = totalDistance + train.train.totalDistance;
                        totalExcercise = totalExcercise + train.train.exercisies.length;
                        lestDate = (train.train.date).substr(0,10);
                    },
                    error:function(err){  
                        console.log(`Error - get Train ${trainId} = {err}`);
                       //alert(`Error - get Train ${trainId}`);
                       //top.location.href="404.html"
                    }   
                });           
                  
            });
            setTimeout(async function(){ 
                console.log(`finish - totalDistance = ${totalDistance}`);
                console.log(`finish -totalExcercise = ${totalExcercise}`);
                console.log(`finish -lastDate = ${lestDate}`);
                localStorage.setItem("totalDistance", totalDistance);
                localStorage.setItem("totalExcercise", totalExcercise);
                localStorage.setItem("lestDate", lestDate);
            }, 500);
        },
        error:function(){  
           alert('Error - get User');
           top.location.href="404.html"
        }   
    });     
}



//=========Random===============

function postRandom(){
    let equipments2 = document.getElementsByClassName('eqip');
    const formData = {
            'distance': document.getElementById("select-distance").value,
            'isFins': equipments2[0].checked,
            'isPullbuoy': equipments2[1].checked,
            'isHandPaddles':  equipments2[2].checked,
            'isKickBoard': equipments2[3].checked
        };
        console.log(formData);
        $.ajax({
            url: 'http://localhost:8080/api/random',
            type: 'POST', 
            data:formData,
            cache: false,
            dataType : 'json',
            success: function(msg, workout) {
                console.log(`msg - ${msg}`);
                console.log(workout);
            },  
            error:function(message){  
                $('.error-box').append(`<h2>errors</h2><p>`+message+`</p>`);
            }
        })
}



//=========LISTENER============
$(document).on('click', '#login-button', function(e){
    e.preventDefault();
    postLogin();
});
$(document).on('click', '#registerButton', function(e){
    e.preventDefault();
    postRegister();
});
$(document).on('click', '#form-exes-submit', function(e){
    e.preventDefault();
    postExcercise();
});
$(document).on('click', '#plus-race', function(e){
    e.preventDefault();
    getExcerciseByStep('Race');
});
$(document).on('click', '#plus-down', function(e){
    e.preventDefault();
    getExcerciseByStep('Swim Down');
});
$(document).on('click', '#plus-main', function(e){
    e.preventDefault();
    getExcerciseByStep('Main Set');
});
$(document).on('click', '#plus-worm', function(e){
    e.preventDefault();
    getExcerciseByStep('Warm Up');
});
$(document).on('click', '#form-train-submit', function(e){
    e.preventDefault();
    postTrain();
});
$(document).on('click', '#random-goto', function(e){
    e.preventDefault();
    top.location.href="random.html";
});
$(document).on('click', '#train-goto', function(e){
    e.preventDefault();
    top.location.href="train.html";
});
$(document).on('click', '#profile-goto', function(e){
    e.preventDefault();
    top.location.href="profile.html";
});
$(document).on('click', '#random-button', function(e){
    e.preventDefault();
    postRandom();
});

