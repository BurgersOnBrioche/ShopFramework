$(document).ready(function() {
  fetch((window.baseUrl || '') + '/assets/html/custombar.html').then(function(response) {
    return response.text()
  }).then(function(html) {
    html = html.replace(/assets\/img\//g, (window.baseUrl || '') + 'assets/img/')
    $('#custombar').before(html).remove()
    activate()
  })
})

function activate() {
  var el = {
    input:          $('#letters-input'),
    letterTabs:     $('.tab-letter-color-letter'),
    letterTab1:     $('#tab-letter1'),
    letterTab2:     $('#tab-letter2'),
    lettersWrapper: $('.tab-letter-wrapper.active'),
    swatch:         $('.swatch-image-border'),
  }

  Object.keys(el).forEach(function(key) {
    if( !el[key].length ) { console.warn(`No element present for ${key}`); }
  })

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

  var letter1Choice = "black"
  var letter2Choice = "black"

  el.letterTabs.on('click', function() {
    el.letterTabs.removeClass("active")
    el.lettersWrapper.removeClass('active')
    $(this).addClass("active")
    $(this).parent().addClass('active')
  })

  el.letterTab1.on('click', function() {
    el.swatch.removeClass('active')
    el.swatch.each(function() {
      if ($(this).data("material-swatch") == letter1Choice) {
        $(this).addClass("active")
      }
    })
  })

  el.letterTab2.on('click', function() {
    el.swatch.removeClass('active')
    el.swatch.each(function() {
      if ($(this).data("material-swatch") == letter2Choice) {
        $(this).addClass("active")
      }
    })
  })

  el.input.on("input", function() {
    var $inputText = $(this).val()

    if( $inputText.length > 0 ) {
      $("#bagLetter2").hide()
      renderLetter(1, $inputText.charAt(0), letter1Choice)
      if ($inputText.length > 1) {
        renderLetter(2, $inputText.charAt(1), letter2Choice)
        $("input").blur()
      }
      updateCustomInfo()
    } else {
      $("#tab-letter1").html("")
      $("#tab-letter2").html("")
      $("#bagLetter1").css({ display: "none" })
      $("#bagLetter2").css({ display: "none" })
    }
  })

  el.swatch.on('click', function() {
    el.swatch.removeClass("active")
    $(this).addClass("active")
    var text = el.input.val()

    if ($("#tab-letter1").hasClass("active")) {
      letter1Choice = $(this).data("material-swatch")
      renderLetter(1, text.charAt(0).toUpperCase(), letter1Choice)
    } else if ($("#tab-letter2").hasClass("active")) {
      letter2Choice = $(this).data("material-swatch")
      renderLetter(2, text.charAt(1).toUpperCase(), letter2Choice)
    } else {
      console.warn('Unknown letter active')
    }

    updateCustomInfo()
  })

  function renderLetter(index, letter, swatch) {
    var height     = $(".letters-wrapper").height()
    var letterPath = (window.baseUrl || "") + "assets/img/letters/" + letter.toUpperCase() + "-" + swatch + ".png"
    $("#tab-letter"+index).css({ background: "url(" + letterPath + ") no-repeat", backgroundSize: "contain", backgroundPosition: "center" })
    $("#bagLetter"+index).attr("src", letterPath)
    $("#bagLetter"+index).show().css({ height: height })
  }

  function updateCustomInfo() {
    var text = el.input.val()

    if( !text.length ) { return; }

    if (text.length > 1) {
      $("#custombar-custom-info").val("Danny-Black / " + text[0].toUpperCase() + "-" + letter1Choice + " / " + text[1].toUpperCase() + "-" + letter2Choice)
    } else {
      $("#custombar-custom-info").val("Danny-Black / " + text[0].toUpperCase() + "-" + letter1Choice)
    }
  }
}
