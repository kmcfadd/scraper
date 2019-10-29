$(document).ready(function() {
    // scrape articles
    $("#scrape").on("click", function(event) {
        event.preventDefault()
        $.ajax({
            url: "/scrape",
            type: "GET",
            success: function (response) {
                location.reload()
            }
        })
    })
    // save an article
    $(document).on("click", ".save", function (event) {
        event.preventDefault()
        var articleId = $(this).attr('data-id');
        $.ajax({
            url: "/articles/save-article" + articleId,
            type: "POST",
            success: function (response) {
                window.location.href = "/"
            },
            error: function (err) {
                console.log(err)
            }
        })
    })

    // remove saved article
    $(document).on("click", ".delete-saved", function (event) {
        event.preventDefault();
        var articleId = $(this).attr("data-id")
        $.ajax({
            url: "/articles/delete-saved" + articleId,
            type: "POST",
            success: function (response) {
                window.location.href = "/"
            },
            error: function (err) {
                console.log(err)
            }
        })
    })

    // clearing articles
    $("#clear-articles").on("click", function (event) {
        event.preventDefault();
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "/clear-articles",
            success: function (response) {
                $("#results").empty()
                location.reload()
            }
        })
    })

    // article notes
    $(document).on('click', '.add-note', function() {
        event.preventDefault()
        var title = $(this).data("title")
        var id = $(this).attr('data-id')
        $("#articleTitle" + id).text(title)
    })

    $(".save-note").on('click', function(event) {
        event.preventDefault()
        var thisId = $(this).attr('data-id')

        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/articles/save-note" + thisId,
            data: {
                noteTitle: $(`#noteTitle${thisId}`).val(),
                noteBody: $(`#noteBody${thisId}`).val()
            }
        })
        .then(function(dbArticle) {
            location.reload()
        })
    })

    $('.note-delete').on('click', function (event) {
        event.preventDefault()
        var thisId = $(event.target).attr('id')

        $.ajax({
            type: "POST",
            url: "/articles/delete" + thisId
        })
        .then(function(data) {
            location.reload()
        })
    })
})