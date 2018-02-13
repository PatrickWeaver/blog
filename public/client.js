$('document').ready(function(){

  // New Post:

  // Generate slug
  // From: https://gist.github.com/mathewbyrne/1280286

  function slugify(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }

  $( "#new-post-title" ).keyup(function() {
    $( "#new-post-slug" ).val(slugify($( this ).val()));
  });



  $( "#new-post-form > .submit").click(function(event) {
    event.preventDefault();
    postAPI("/posts/new/");
  })


  function postAPI(path) {
    // API url is passed from environment variable to front end via local
    var apiUrl = $( "#apiUrl" ).html();
    //var apiUrl = "http://localhost:8000/blog/posts/"
    // Grab post data from the form:
    var apiData = {
      title: $( "#new-post-title" ).val(),
      slug: $( "#new-post-slug").val(),
      post_date: $( "#new-post-date" ).val(),
      body: $( "#new-post-body" ).val()
    }
    console.log("API URL: " + apiUrl + path);
    $.ajax({
      type: "POST",
      dataType: "json",
      contentType: "application/json",
      //contentType: "application/x-www-form-urlencoded",
      url: apiUrl + path,
      data: JSON.stringify(apiData),
      //data: apiData,
      success: function(data) {
        console.log(data);
        alert("Posted!");
      },
      error: function(xhr, status, err, a) {
        console.log("Error: " + err + " -- Status: " + status);
      }
    });
  }

});
