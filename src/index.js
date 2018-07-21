/**
 * es6 modules and imports
 */

import sayHello from './hello';
sayHello('World');

/**
 * require style imports
 */
const {getMovies} = require('./api.js');

$(".container").show();
$("#form").hide();
$(".heading").hide()

// $("#editInput").hide();
// $("#editRating").hide();

function buildHtml(arrOfObj) {
    let html = "<div class='table-responsive-sm'><table class='table table-striped table-dark table-hover'>";
    html += "<tr>";
    html += "<th>Movie Name</th>";
    html += "<th>Movie Rating</th>";
    html += "<th>Movie ID</th>";
    html += "</tr>";
    arrOfObj.forEach((movie) => {
        html += "<tr>";
        html += "<td>" + movie.title + "</td>";
        html += "<td>" + movie.rating + "</td>";
        html += "<td>" + movie.id + "</td>";
        html += "<td class='editCol'><button class='editBtns'>Edit</button><a href='#'><i class='fa fa-trash-o deleteBtn' style='font-size:24px'></i></a></td>";
        html += "</tr>";
        html += "<tr class='editRow displayNone'>";
        html += `<td><input data-id=${movie.id} value=${movie.title}></td>`;
        html += `<td><input value=${movie.rating}></td>`;
        html += "<td></td>";
        html += "<td><i class='saveBtns fa fa-save' style='font-size:24px'></i></td>";
        html += "</tr>";
    });
    return html;
}


getMovies().then((data) => $(".JsonTable").html(buildHtml(data)))
    .then(() => $(".loading-container").hide())
    .then(() => $("#form").show())
    .then(() => $(".heading").show())
    .catch((error) => {
        alert('Oh no! Something went wrong.\nCheck the console for details.');
        console.log(error);
    });

let addMovie = () => {
    $('#test').click(() => {
        $(".loading-container").show();
        $("#form").hide();
        $(".JsonTable").hide();
        $(".heading").hide();
        let movieTitleVal = $('#movieTitle').val();
        let movieRatingVal = $('#movieRating').val();

        let newMovie = {title:movieTitleVal, rating:movieRatingVal};
        let url = '/api/movies';
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMovie),
        };
        fetch(url, options)
            .then(() => {getMovies().then((data) => $(".JsonTable").html(buildHtml(data))).then(() => {
                $(".JsonTable").show();
                $("#form").show();
                $(".loading-container").hide();
                $(".heading").show();
                $("#movieTitle").val("");
                $("#movieRating").val("")
            })
            })
            .catch(() => console.log("error!"));
    });
};

let editMovie = () => {
    $(document).on('click', '.editBtns', (e) => {
        $(e.currentTarget).closest('tr').next().toggleClass('visible');
        $(e.currentTarget).parent().parent().next().toggle("displayNone")
    });
};


let updateMoveAfterEdit = () => {
    $(document).on('click', '.saveBtns', (e) => {
        $(".loading-container").show();
        $("#form").hide();
        $(".JsonTable").hide();
        $(".heading").hide()
        let movieId = parseInt($(e.currentTarget).parent().prev().prev().prev().children().data("id"));
        console.log(movieId);
        let editTitle = $(e.currentTarget).parent().prev().prev().prev().children().val();
        let editRating = $(e.currentTarget).parent().prev().prev().children().val();
        let newMovie = {title: editTitle, rating:editRating};
        let url = `/api/movies/${movieId}`;
        let options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMovie),
        };

        fetch(url, options)
            .then(() => {
                getMovies().then((data) => $(".JsonTable").html(buildHtml(data))).then(() => {
                    $(".JsonTable").show();
                    $(".loading-container").hide();
                    $("#form").show();
                    $(".heading").show();
                });

            })
            .catch(() => console.log("error!"));
    });
};

let deleteMovie = () => {
    $(document).on('click', '.deleteBtn', (e) => {
        $(".loading-container").show();
        $("#form").hide();
        $(".JsonTable").hide();
        $(".heading").hide();
        let movieId = $(e.currentTarget).parent().parent().prev().html();
        console.log(movieId);
        let editTitle = $(e.currentTarget).parent().prev().prev().prev().children().val();
        let editRating = $(e.currentTarget).parent().prev().prev().children().val();
        let newMovie = {title: editTitle, rating:editRating};
        let url = `/api/movies/${movieId}`;
        let options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMovie),
        };
        fetch(url, options)
            .then(() => {
                getMovies().then((data) => $(".JsonTable").html(buildHtml(data))).then(() => {
                    $(".JsonTable").show();
                    $(".loading-container").hide();
                    $("#form").show();
                    $(".heading").show()
                })
            })
            .catch(() => console.log("error!"));
    });
};



deleteMovie();
updateMoveAfterEdit();
addMovie();
editMovie();






