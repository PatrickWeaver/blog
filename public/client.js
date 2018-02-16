$('document').ready(function(){

  // New Post:

  // Autofill date:
  var d = new Date;
  $( "#new-post-date").val(formatDate(d));

  function formatDate(d) {
    return(
    d.getFullYear() + "-" + parseInt(d.getMonth() + 1) + "-" + d.getDate()
    + " " + d.getHours() + ":" + d.getMinutes())
  }


  // Generate slug
  // From: https://gist.github.com/mathewbyrne/1280286
  // Shortened to 1024 characters if if longer (it shouldn't be because the title is also 1024)
  function slugify(text) {
    slug = text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
    slug = slug.substr(0, 1024);
    return slug;
  }

  function fillSlug(text) {
    $(  "#new-post-slug" ).val(slugify(text.substr(0, 1024)));
  }

  // Auto populate slug on writing in title field
  $( "#new-post-title" ).keyup(function() {
    if ( $( "#new-post-slug" ).val() === "") {
      fillSlug( $( this ).val() );
    }
    $( this ).val( $( this ).val().substr(0, 1024));
  });

  $( "#new-post-slug" ).focusout(function() {
    fillSlug( $( this ).val() );
  });

  $( "#new-post-body" ).keyup(function() {
    if (
      $( "#new-post-title" ).val() === ""
      &&
      $( "#new-post-slug" ).val() === ""
    ) {
      fillSlug( $( this ).val() );
    }
  });

  $( "#new-post-form > .submit").click(function(event) {
    event.preventDefault();
    console.log($("#new-post-body").val());
    if ( $( "#new-post-body" ).val() != "") {
      postAPI("/posts/new/");
    } else {
      alert("Post must have body");
    }
  });


  function postAPI(path) {
    // API url is passed from environment variable to front end via local
    var apiUrl = $( "#apiUrl" ).html();
    //var apiUrl = "http://localhost:8000/blog/posts/"
    // Grab post data from the form:
    var slug = slugify($( "#new-post-slug" ).val().substr(0, 1024));
    if (slug === "") {
      slug = slugify($( "#new-post-title" ).val().substr(0, 1024));
    }
    if (slug === "") {
      slug = slugify($( "#new-post-body" ).val().substr(0, 1024));
    }

    var apiData = {
      title: $( "#new-post-title" ).val().substr(0, 1024),
      slug: slug,
      post_date: $( "#new-post-date" ).val(),
      body: $( "#new-post-body" ).val()
    }
    console.log("API URL: " + apiUrl + path);
    console.log(apiData.slug);
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
        //alert("Posted!");
        location.href="/";
      },
      error: function(xhr, status, err, a) {
        console.log("Error: " + err + " -- Status: " + status);
      }
    });
  }

});
