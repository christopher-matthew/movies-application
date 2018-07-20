/**
 * es6 modules and imports
 */

const $ = require("jquery");
import sayHello from './hello';
sayHello('World');

/**
 * require style imports
 */
const {getMovies} = require('./api.js');

$(".container").show();
$("#form").hide();
// $("#editInput").hide();
// $("#editRating").hide();

function buildHtml(arrOfObj) {
    let html = "<table>";
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
        html += "<td class='editCol'><button class='editBtns'>Edit</button><a href='#'><i class='fa fa-trash-o' style='font-size:24px'></i></a></td>";
        html += "</tr>";
        html += "<tr class='editRow'>";
        html += `<td><input data-id=${movie.id}></td>`;
        html += "<td><input id='editRating'></td>";
        html += "<td></td>";
        html += "<td><i class='saveBtns fa fa-save' style='font-size:24px'></i></td>";
        html += "</tr>";
    });
    html += "</table>";
    return html;
}

getMovies().then((data) => $(".JsonTable").html(buildHtml(data)))
    .then(() => $(".container").hide())
    .then(() => $("#form").show())
    // .then(() => $(".editRow").hide())
    .catch((error) => {
        alert('Oh no! Something went wrong.\nCheck the console for details.');
        console.log(error);
    });

let addMovie = () => {
    $('#test').click(() => {
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
            .then(() => {
                getMovies().then((data) => $(".JsonTable").html(buildHtml(data)));
            })
            .catch(() => console.log("error!"));
    });
};

let editMovie = () => {
    $(document).on('click', '.editBtns', (e) => {
        $(e.currentTarget).closest('tr').next().toggleClass('visible');
    });
};

// let updateMoveAfterEdit = () => {
//     $(document).on('click', '.saveBtns', (e) => {
//         console.log($(e.currentTarget).last());
//     });
// };

let updateMoveAfterEdit = () => {
    $(document).on('click', '.saveBtns', (e) => {
        //console.log($(e.currentTarget).parent().parent().prev().children().last().html()); //GETS MOVIE ID
        console.log($(e.currentTarget).parent().parent().children().first().val());
        let movieId = parseInt($(e.currentTarget).parent().parent().prev().children().next().next().html());

       // console.log($(e.currentTarget).parent().parent().prev().children().html());
        // let editRating = $(e.currentTarget).parent().parent().prev().children().next().html();
        let editTitle = $('#editMovie').val();
        let editRating = $('#editRating').val();
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
                getMovies().then((data) => $(".JsonTable").html(buildHtml(data)));
            })
            .catch(() => console.log("error!"));

        // let newMovie = {title:editTitle, rating:editRating};
        // let request = $.ajax({
        //     url: "/api/movies",
        //     method: "POST",
        //     data: { title: editTitle, rating: editRating },
        //     dataType: "html"
        // });
        //
        // fetch(request)
        //     .then(() => {
        //         getMovies().then((data) => $(".JsonTable").html(buildHtml(data)));
        //     })
        //     .catch(() => console.log("error!"));
    });
};

updateMoveAfterEdit();

addMovie();
editMovie();





