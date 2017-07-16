$('document').ready(function(){

  $( "#new-post-form > .submit").click(function(event) {
    event.preventDefault();
    postAPI("new/");
  })


  function postAPI(path) {
    // API url is passed from environment variable to front end via local
    var apiUrl = $( "#apiUrl" ).html();
    //var apiUrl = "http://localhost:8000/blog/posts/"
    // Grab post data from the form:
    var post_title = $( "#new-post-title" ).val();
    var post_date = $( "#new-post-date" ).val();
    var post_body = $( "#new-post-body" ).val();
    var apiData = {
      post_title: post_title,
      post_date: post_date,
      post_body: post_body
    }
    console.log("API URL: " + apiUrl);
    $.ajax({
      type: "POST",
      url: apiUrl + path,
      data: apiData,
      success: function(data) {
        console.log(data);
        alert("Posted!");
        for (d in data) {
          console.log(d + ": " + data[d]);
          for (e in data[d]) {
            console.log(e + ": " + data[d][e]);
          }
        }
      },
      error: function(xhr, status, err) {
        console.log("Error: " + err);
      }
    });
  }

});
