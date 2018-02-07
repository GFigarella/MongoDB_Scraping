

//test onclick for scrape button
$("#scrapeButton").on("click", function() {
    // Save the id from the p tag
    // var thisId = $(this).attr("data-id");
    console.log("You clicked this button");
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/scrape"
    })
    //   // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        var numberOfArticles = data.length;
        alert("Added " + numberOfArticles + " new articles.");
        window.location.href = '/';
        // // The title of the article
        // $("#notes").append("<h2>" + data.title + "</h2>");
        // // An input to enter a new title
        // $("#notes").append("<input id='titleinput' name='title' >");
        // // A textarea to add a new note body
        // $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // // A button to submit a new note, with the id of the article saved to it
        // $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // // If there's a note in the article
        // if (data.note) {
        //   // Place the title of the note in the title input
        //   $("#titleinput").val(data.note.title);
        //   // Place the body of the note in the body textarea
        //   $("#bodyinput").val(data.note.body);
        // }
      });
  });