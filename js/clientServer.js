/*global $ */
/*jslint browser: true*/
/*eslint no-console: "error"*/

function sendIdToMovie(idMovie){
    localStorage.setItem("favoriteMovie", idMovie);
    top.location.href="movie.html";
}
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
                localStorage.setItem("Id", id);
                top.location.href="home.html";
            },  
            error:function(jqXHR, textStatus, message){  
                $('.error-box').append(`<h2>errors</h2><p>`+message+`</p>`);
            }
        })
}
function postRegister(){
    const formData = {
            'user_name' : $('input[name=user_name]').val(),
            'email': $('input[name=email]').val(),
            'password': $('input[name=password]').val(),
            'password2': $('input[name=password2]').val()
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
function displayPreviousImage(movies , index) {
    $("#our-recomandation").empty();
    let movie = movies[index];
    $('#our-recomandation').append("<img src = '" +'http://localhost:8080/' + movie.image + "' class='img-popular-big' >" );
}
let index = 0;
function getPopulars(){
    $.ajax({
        url: 'http://localhost:8080/api/populars',
        type: 'GET',
        success: function(movies) {
            displayPreviousImage(movies, index )
            index++;
            if(index == 5) index = 0;
        },  
        error:function(){  
           alert('Error - get - movies');
           top.location.href="404.html";
        }   
    });
}
function getMoviesByCategory(category, list){
    console.log(`http://localhost:8080/api/categories/:${category}`);
    $.ajax({
        url: `http://localhost:8080/api/categories/${category}`,
        type: 'GET',
        success: function(movies) {
            $(list).empty();
            $(list).append(`<h4>${category}</h4>`);
            movies.forEach(movie => {
                $(list).append(
                '<article class="movie-mini hvr-curl-top-right hvr-shrink" onClick="sendIdToMovie(\'' + movie._id + '\')" >' +
                "<img src = '" +'http://localhost:8080/' + movie.image + "'>" +
                "</article>"
        );
    });
        },
        error:function(){  
           alert('Error - getMoviesByCategory');
           top.location.href="404.html";
        }   
    });
}
function getIMDB(name) {
    const formData = {
        'name' : name
    };
    $.ajax({
        url: 'http://localhost:8080/api/movies/IMDB',
        type: 'GET',
        async: false,
        contentType: "application/json; charset=utf-8",
        data: formData,
        success: function(message) {
            localStorage.setItem(name,JSON.stringify(message));
        },
        error: function() {
            alert('Error - getIMDB');
            top.location.href="404.html";
        }
    });
};
function Parseusername(){
    let user = localStorage.getItem("User");
    $('#userName').append(
        `${user}`
    );
;}
function postComment(){
    let user = localStorage.getItem("User");
    let id = localStorage.getItem("Id");
    const formData = {
            'description' : $('textarea[name=description]').val(),
            'creationBy': id,
            'commentOn': localStorage.getItem("favoriteMovie"),
            'creationByName': user
        };
        $.ajax({
            url: 'http://localhost:8080/api/comments/',
            type: 'POST', 
            data:formData,
            cache: false,
            dataType : 'json'
        })
        .done(function(newComment) {
            top.location.href="movie.html"
        })
        .fail(function(jqXHR, textStatus, message){  
            alert(`Error - new Comment - ${textStatus} ,  ${message}`); 
            $('error-handler').html(JSON.stringify(err));
            top.location.href="404.html";
        });
}
function getComments(){
     $.ajax({
        url: `http://localhost:8080/api/moviecomments/${localStorage.getItem("favoriteMovie")}`,
        type: 'GET',
        success: function(comments) {           
            let myComments = comments.comments;
            $("#pid2").empty();
                myComments.forEach(comment => {
                $("#pid2").append(
                '<article class="pid-comment hvr-rectangle-out ">'+
                '<div class="article-body">'+
                '<label>'+comment.creationByName+':</label>'+
                '<p>'+comment.description+'</p></div>'+
                '<footer class="article-footer"><ul>'+
                '<li class="icon-left"><i class="bx bx-message"></i><span>1</span></li>'+
                '<li class="icon-right"><i class="bx bx-heart"></i><span>1</span></li></footer></article>'  
            )});
        },
        error:function(){  
           //alert('Error - get comments');
           //top.location.href="404.html";
        }   
     })
};
function getRecomandations(){
     $.ajax({
        url: 'http://localhost:8080/api/populars/',
        type: 'GET',
        success: function(movies) {
            $("#recommend-pid").empty();
            movies.forEach(movie => {
                $("#recommend-pid").append(
                    "<article><aside><img src = '" +'http://localhost:8080/' +  movie.image + "'>" +
                    '</aside><nav><ul><li><label>Name: </label><span class="movie-name">'+  movie.name + ''+    
                    '<li><label>Run Time: </label><span>'+ movie.runTime + ''+ 
                    '<li><label>Categories: </label><span>'+  movie.categories + ''+ 
                    '<li><label>Release Date: </label><span>'+  movie.releaseDate + ''+ 
                    '<li><label>Actors: </label><span>'+  movie.actors + ''+ 
                    '<li><label>Story Line: </label><span>'+  movie.storyline + ''+ '</ul></nav></article>'
                );
            });
        },  
        error:function(){  
           alert('Error - get - movies');
           top.location.href="404.html"
        }   
    });
}
function getMovie(){
    $.ajax({
        url: `http://localhost:8080/api/movies/${localStorage.getItem("favoriteMovie")}`,
        type: 'GET',
        success: function(movie) {
            getIMDB(movie.movie.name);
            const data = JSON.parse(localStorage.getItem(movie.movie.name));
            $("#movie-header").empty();
            $("#movie-header").append(data.data.title +" - Movie");

            $("#movie").empty();
            $("#movie").append(
                "<section id='movie-image'>" + 
                "<img src='" + data.data.poster + "'></section>"+
                "<div id='movie-details'><navbar class='movie-left'><ul>"+
                "<li><label>Name</label> : <span class='movie-name'>" + data.data.title + "</span></li>" +
                "<li><label>Time</label> : <span>"+data.data.length+"</span></li>" +
                " <li><label>Year</label> : <span>"+data.data.year+"</span></li>" +
                "<li><label>Rate</label> : <span>"+data.data.rating+"</span></li></ul></navbar>" +
                "<aside class='movie-right'><ul>"+       
                "<li><label>Categories</label> : <span>"+movie.movie.categories+"</span></li>"+
                "<li><label>Actors</label> : <span>"+movie.movie.actors+"</span></li>"+ 
                "<li><label>Writer</label> : <span>"+movie.movie.writer+"</span></li>"+ 
                "<li><label>Director</label> : <span>"+movie.movie.director+"</span></li></ul></aside>"+ 
                "<br>"+
                "<br>"+
                "<p><label>Story Line</label> : <span>"+data.data.plot+"</span></p></div>"
            );
            
        },
        error:function(){  
           alert('Error - getMovie');
           top.location.href="404.html"
        }   
    });
}

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
                    '<label>Level</label> : <span>'+ excersice.tempo +'</span><br>' +
                    '<label>Break</label> : <span>'+ excersice.break +'s</span></aside>' +
                    '<aside class="midle-excer"><label>Mount</label> : <span>'+ excersice.count +' x '+ excersice.distance +'</span><br>' +
                    '<label>Style</label> : <span>'+ excersice.multiple +'</span><br>' + 
                    '<label>Details:</label> : <span>'+ excersice.details +'</span></aside>' +
                    '<aside class="right-excer">');
                    if(excersice.isKickBoard){
                        $('#pid-excercise').append('<img src="https://img.icons8.com/fluent/48/000000/buoyancy-compensator.png"/>');
                    }
                    if(excersice.isFins){
                        $('#pid-excercise').append('<img src="https://img.icons8.com/officel/40/000000/flippers.png"/><br>');
                    }
                    if(excersice.isPullbuoy){
                        $('#pid-excercise').append('<img src="https://img.icons8.com/fluent/48/000000/buoyancy-compensator.png"/>');
                    }
                    if(excersice.isHandPaddles){
                        $('#pid-excercise').append('<img src="https://img.icons8.com/officel/40/000000/flippers.png"/>');
                    }
                    $('#pid-excercise').append('</aside></article>'); 
    });
        },
        error:function(){  
           alert('Error - showExcercises');
           top.location.href="404.html";
        }   
    });
}


$(document).on('click', '.img-popular-big', function(e) {
    top.location.href="recomend.html"
});
$(document).on('click', '#login-button', function(e){
    e.preventDefault();
    postLogin();
});
$(document).on('click', '#registerButton', function(e){
    e.preventDefault();
    postRegister();
});
$(document).on('click', '#GetMovies', function(e){
    e.preventDefault();
    getMoviesByCategory("Action");
});
$(document).on('click', '#comment-button', function(e){
    e.preventDefault();
    postComment();
});
$(document).on('click', '#TopRated', function(e){
    getIMDB("Avengers");
    e.preventDefault();
    e.stopPropagation();    
});