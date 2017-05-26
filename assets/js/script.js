$(document).ready(function() {
  var letter1Choice = "black"
  var letter2Choice = "black"

  var bagContainerHeight = $(".main-bag-container").width() * .7
  $(".main-bag-container").height(bagContainerHeight)
  var bagContainerHeight = $(".main-letters-container").width() * .7
  $(".main-letters-container").height(bagContainerHeight)
  var letterTabHeight = $(".swatch-row").height() / 2
  $(".custom-letter-container").height(letterTabHeight)

  $(window).resize(function() {
    var newLetterHeight = $(".letters-wrapper ").height()
    $("#bagLetter1").css({ display: "block", height: newLetterHeight + "px" })
    $("#bagLetter2").css({ display: "block", height: newLetterHeight + "px" })
    bagContainerHeight = $(".main-bag-container").width() * .7
    $(".main-bag-container").height(bagContainerHeight)
    bagContainerHeight = $(".main-letters-container").width() * .7
    $(".main-letters-container").height(bagContainerHeight)
    letterTabHeight = $(".swatch-row").height() / 2
    $(".custom-letter-container").height(letterTabHeight)

  })

  $(".tab-letter-color-letter").click(function() {
    $(".tab-letter-color-letter.active").removeClass("active")
    $(".tab-letter-wrapper.active").removeClass("active")
    $(this).addClass("active")
    $(this).parent().addClass("active")

  })

  $("#tab-letter1").click(function() {
    $(".swatch-image-border.active").removeClass("active")
    $(".swatch-image-border").each(function() {
      if ($(this).data("material-swatch") == letter1Choice) {
        $(this).addClass("active")
      }
    })
  })
  $("#tab-letter2").click(function() {
    $(".swatch-image-border.active").removeClass("active")
    $(".swatch-image-border").each(function() {
      if ($(this).data("material-swatch") == letter2Choice) {
        $(this).addClass("active")
        $(this).parent().addClass("active")
      }
    })
  })
  $("#letters-input").on("input", function() {
    var $inputText = $(this).val()
    var newHeight = $(".letters-wrapper ").height()

    switch (true) {
      case $inputText.length > 0:
        $("#bagLetter2").css({ display: "none" })

        var newLetter1Path = (window.baseUrl || "") + "assets/img/letters/" + $inputText.charAt(0).toUpperCase() + "-" + letter1Choice + ".png"
        $("#tab-letter1").css({ background: "url(" + newLetter1Path + ") no-repeat", backgroundSize: "contain", backgroundPosition: "center" })
        $("#bagLetter1").attr("src", newLetter1Path) /*css({ background: "url(" + newLetter1Path + ") no-repeat", backgroundSize: "contain", backgroundPosition: "center" })*/
        $("#bagLetter1").css({ display: "block", height: newHeight + "px" })
        $("#custombar-custom-info").val("Danny-Black / " + $inputText.charAt(0).toUpperCase() + "-" + letter1Choice)
        if ($inputText.length > 1) {
          var newLetter2Path = (window.baseUrl || "") + "assets/img/letters/" + $inputText.charAt(1).toUpperCase() + "-" + letter2Choice + ".png"
          $("#bagLetter2").attr("src", newLetter2Path) /*css({ background: "url(" + newLetter1Path + ") no-repeat", backgroundSize: "contain", backgroundPosition: "center" })*/
          $("#bagLetter2").css({ display: "block", height: newHeight + "px" })
          $("input").blur()
          $("#tab-letter2").css({ background: "url(" + newLetter2Path + ") no-repeat", backgroundSize: "contain", backgroundPosition: "center" })
          $("#custombar-custom-info").val("Danny-Black / " + $inputText.charAt(0).toUpperCase() + "-" + letter1Choice + " / " + $inputText.charAt(1).toUpperCase() + "-" + letter2Choice)
        } else {
          $("#tab-letter2").css({ background: "none" })
        }

        break;
      default:
        $("#tab-letter1").css({ background: "none" })
        $("#tab-letter2").css({ background: "none" })
        $("#bagLetter1").css({ display: "none" })
        $("#bagLetter2").css({ display: "none" })
        break;

    }
  })
  $(".swatch-image-border").click(function() {
    var $inputText = $("#letters-input").val()
    $(".swatch-image-border.active").removeClass("active")
    $(this).addClass("active")
    if ($("#tab-letter1").hasClass("active")) {
      letter1Choice = $(this).data("material-swatch")
      var newLetter1Path = (window.baseUrl || "") + "assets/img/letters/" + $inputText.charAt(0).toUpperCase() + "-" + letter1Choice + ".png"
      $("#bagLetter1").attr("src", newLetter1Path) /*css({ background: "url(" + newLetter1Path + ") no-repeat", backgroundSize: "contain", backgroundPosition: "center" })*/
      $("#tab-letter1").css({ background: "url(" + newLetter1Path + ") no-repeat", backgroundSize: "contain", backgroundPosition: "center" })
      if ($inputText.length > 1) {
        $("#custombar-custom-info").val("Danny-Black / " + $inputText.charAt(0).toUpperCase() + "-" + letter1Choice + " / " + $inputText.charAt(1).toUpperCase() + "-" + letter2Choice)

      } else {
        $("#custombar-custom-info").val("Danny-Black / " + $inputText.charAt(0).toUpperCase() + "-" + letter1Choice)
      }
    } else if ($("#tab-letter2").hasClass("active")) {
      letter2Choice = $(this).data("material-swatch")
      var newLetter2Path = (window.baseUrl || "") + "assets/img/letters/" + $inputText.charAt(1).toUpperCase() + "-" + letter2Choice + ".png"
      $("#bagLetter2").attr("src", newLetter2Path) /*css({ background: "url(" + newLetter1Path + ") no-repeat", backgroundSize: "contain", backgroundPosition: "center" })*/
        /* $("#bagLetter2").css({ background: "url(" + newLetter2Path + ") no-repeat", backgroundSize: "contain", backgroundPosition: "center" })*/
      $("#tab-letter2").css({ background: "url(" + newLetter2Path + ") no-repeat", backgroundSize: "50%", backgroundPosition: "center" })
      $("#custombar-custom-info").val("Danny-Black / " + $inputText.charAt(0).toUpperCase() + "-" + letter1Choice + " / " + $inputText.charAt(1).toUpperCase() + "-" + letter2Choice)

    }

  })
})