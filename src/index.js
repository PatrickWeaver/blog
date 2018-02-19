const $ = require("jquery");

$('document').ready(function(){

  // API url and Client url are passed from environment variable to front end via local
  var apiUrl = $( "#apiUrl" ).html();
  var clientUrl = $( "#clientUrl" ).html();


  // Import Post:
  $( "button#import-post-button" ).click(function() {
    $( "#import-post-form").show();
  });

  $( "button#submit-import-post" ).click(function(event) {
    event.preventDefault();

    importData = {
      url: $( "#import-post-url").val(),
      source: $( "#import-post-source :selected" ).val()
    }
    var path = "/import";

    $.ajax({
      type: "POST",
      dataType: "json",
      contentType: "application/json",
      url: clientUrl + path,
      data: JSON.stringify(importData),
      success: function(data) {
        console.log("Success!");
        $( "#new-post-title" ).val(data.title);
        $( "#new-post-body").html(data.body);
        fillSlug(data.title);
        $('html, body').animate({
            scrollTop: $("#new-post-title").prev().offset().top
        }, 500);

      },
      error: function(xhr, status, err, a) {
        console.log("Error: " + err + " -- Status: " + status);
      }
    });

  });


  // New Post:

  // Autofill date:
  var d = new Date;
  $( "#new-post-date").val(formatDate(d));

  var autofillSlug = true;

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
    if ( autofillSlug ) {
      fillSlug( $( this ).val() );
    }
    $( this ).val( $( this ).val().substr(0, 1024));
  });

  $( "#new-post-slug" ).focusin(function() {
    autofillSlug = false;
  });

  $( "#new-post-slug" ).focusout(function() {
    fillSlug( $( this ).val() );
    if ( $( this ).val() === slugify( $( "#new-post-title" ).val().substr(0, 1024)) ) {
      autofillSlug = true;
    }
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

  function fillSlugFrom(){
    var fillButtonsHTML = "";
    var fillFromAreas = ["title", "summary", "body"];
    for (var i in fillFromAreas) {
      var value = $( "#new-post-" + fillFromAreas[i] ).val();
      if (value != "") {
        fillButtonsHTML += "<li><button type='button' class='fill-slug-from'>" + fillFromAreas[i] + "</button></li>";
      }
    }

    if (fillButtonsHTML != "") {
      if (fillButtonsHTML != ""){
        $( "#slug-fill > ul" ).html(fillButtonsHTML);
      } else {
        $( "#slug-fill > ul").hide();
      }
      $( "#slug-fill" ).show();
    }

    $( "body" ).on("click", ".fill-slug-from", function(event) {
      event.preventDefault();
      slug = slugify($( "#new-post-" + $( this ).html().toLowerCase() ).val().substr(0, 1024));
      $( "#new-post-slug" ).val(slug);
      $( "#slug-fill" ).hide();
    });


    $('html, body').animate({
        scrollTop: $("#new-post-slug").prev().offset().top
    }, 500);
  }

  $( ".close-status-modal" ).click(function() {
    $( "#post-status" ).hide();
    $( "#post-loading" ).hide();
    $( "#post-success" ).hide();
    $( "#post-failure" ).hide();
  });

  function postAPI(path) {

    // Grab post data from the form:
    var slug = slugify($( "#new-post-slug" ).val().substr(0, 1024));
    if (slug === "") {
      fillSlugFrom();
      return;
    }

    var apiData = {
      title: $( "#new-post-title" ).val().substr(0, 1024),
      slug: slug,
      summary: $( "#new-post-summary" ).val(),
      post_date: $( "#new-post-date" ).val(),
      body: $( "#new-post-body" ).val()
    }
    console.log("API URL: " + apiUrl + path);
    console.log(apiData.slug);

    $( "#post-status" ).show();
    $( "#post-loading" ).show();

    $.ajax({
      type: "POST",
      dataType: "json",
      contentType: "application/json",
      url: apiUrl + path,
      data: JSON.stringify(apiData),
      success: function(data) {
        try {
          console.log(data);
          if (data[0].success) {
            setTimeout(function() {
              $( "#post-success" ).show();
              $( "#post-loading" ).hide();
            }, 500);
          } else {
            throw "Not posted";
          }
        }
        catch (err) {
          apiPostError(err);
        }
      },
      error: function(xhr, status, err, a) {
        console.log("Error: " + err + " -- Status: " + status);
        apiPostError(err);
      }
    });
    function apiPostError(e) {
      setTimeout(function() {
        $( "#post-failure" ).show();
        $( "#post-loading" ).hide();
      }, 500);
    }
  }

});