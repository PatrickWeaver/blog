$('document').ready(function(){

  console.log("TESTETESTSETSTT");

  $( "#new-post-form .submit").click(function() {
    postAPI("/blog/posts/new/");
  })


  function postAPI(path) {
    console.log("TEST");
    // API url is passed from environment variable to front end via local
    var apiUrl = $( "#apiUrl" ).html();
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
      },
      error: function(err) {
        console.log("Error: " + err);
        for (e in err){
          console.log(e + ": " + err[e]);
        }
      },
      dataType: JSON
    });
  }

});
