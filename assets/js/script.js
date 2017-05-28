$(document).ready(function() {
  fetch((window.baseUrl || '') + '/assets/html/custombar.html').then(function(response) {
    return response.text()
  }).then(function(html) {
    html = html.replace(/assets\/img\//g, (window.baseUrl || '') + 'assets/img/')
    $('#custombar').before(html).remove()
    render()
  })
})

<<<<<<< HEAD

function activate() {
  var el = {
    input: $('#letters-input'),
    letterTabs: $('.tab-letter-color-letter'),
    letterTab1: $('#tab-letter1'),
    letterTab2: $('#tab-letter2'),
    lettersWrapper: $('.tab-letter-wrapper'),
    swatch: $('.swatch-image-border'),
  }

  Object.keys(el).forEach(function(key) {
    if (!el[key].length) { console.warn(`No element present for ${key}`); }
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
=======
var state = {
  letters:      '',
  materials:    ['white', 'white'],
  activeLetter: 0,
}
>>>>>>> 14ace05629027f424516a5bb9b8ef56dc6d3e998

$(document).on('input', '.js-input', function(evt) {
  setState({
    letters: $(this).val()
  })
})
$(document).on('click', '.js-swatch-link', function(evt) {
  var materials = state.materials.concat([]);
  materials[state.activeLetter] = $(this).data('color')

<<<<<<< HEAD
  el.letterTab1.on('click', function() {

    el.swatch.removeClass('active')
    el.swatch.each(function() {
      if ($(this).data("material-swatch") == letter1Choice) {
        $(this).addClass("active")
      }
    })
=======
  setState({
    materials: materials
>>>>>>> 14ace05629027f424516a5bb9b8ef56dc6d3e998
  })
})
$(document).on('click', '.js-tab', function(evt) {
  setState({
    activeLetter: $(this).data('index')
  })
})

function setState(newState) {
  state = Object.assign({}, state, newState)
  render()
}

function updateCustomInfo() {
  var productDescription = 'Danny-Black'
  if( state.letters.length > 0 ) {
    productDescription += ` / ${state.letters[0].toUpperCase()}-${state.materials[0]}`
  }
  if( state.letters.length > 1 ) {
    productDescription += ` / ${state.letters[1].toUpperCase()}-${state.materials[1]}`
  }

  $("#custombar-custom-info").val(productDescription);
}

<<<<<<< HEAD
    updateCustomInfo()
  })

  function renderLetter(index, letter, swatch) {
    var height = $(".letters-wrapper").height()
    var letterPath = (window.baseUrl || "") + "assets/img/letters/" + letter.toUpperCase() + "-" + swatch + ".png"
    $("#tab-letter" + index).css({ background: "url(" + letterPath + ") no-repeat", backgroundSize: "contain", backgroundPosition: "center" })
    $("#bagLetter" + index).attr("src", letterPath)
    $("#bagLetter" + index).show().css({ height: height })
=======
function render() {
  // reset
  $('.js-letters').html('')
  $('.js-tab').html('')
  $('.js-tab').removeClass('active')
  $('.js-swatch').removeClass('active')

  // render letters
  if( state.letters.length > 0 ) {
    var letter1 = letter({ letter: state.letters[0], material: state.materials[0]})
    $('.js-letters').append(letter1)
    $('.js-tab:eq(0)').append(letter1.clone())
  }
  if( state.letters.length > 1 ) {
    var letter2 = letter({ letter: state.letters[1], material: state.materials[1]})
    $('.js-letters').append(letter2)
    $('.js-tab:eq(1)').append(letter2.clone())
>>>>>>> 14ace05629027f424516a5bb9b8ef56dc6d3e998
  }

  // render active tab
  $(`.js-tab[data-index=${state.activeLetter}]`).addClass('active')

  // render active swatch
  $(`.js-swatch[data-color=${state.materials[state.activeLetter]}]`).addClass('active')
  updateCustomInfo()
}

<<<<<<< HEAD
    if (text.length > 1) {
      $("#custombar-custom-info").val("Danny-Black / " + text[0].toUpperCase() + "-" + letter1Choice + " / " + text[1].toUpperCase() + "-" + letter2Choice)
    } else {
      $("#custombar-custom-info").val("Danny-Black / " + text[0].toUpperCase() + "-" + letter1Choice)
    }
  }
}
=======
function letter(props) {
  var alt = `${props.letter} in ${props.material}`
  var src = `${window.baseUrl || ''}assets/img/letters/${props.letter.toUpperCase()}-${props.material}.png`;
  return $(`<img src="${src}" alt="${alt}"/>`)
}
>>>>>>> 14ace05629027f424516a5bb9b8ef56dc6d3e998
