$(document).ready(function() {
  // hide contact us form
  if( !window.location.href.match(/localhost/) ) {
    var interval = setInterval(function() {
      var contactUs = $('body').find('img[src*="icf.improvely.com"]')
      if( !contactUs.length ) { return; }
      contactUs.hide()
      clearInterval(interval)
    }, 200)
  }

  fetch((window.baseUrl || '') + '/assets/html/custombar.html').then(function(response) {
    return response.text()
  }).then(function(html) {
    html = html.replace(/assets\/img\//g, (window.baseUrl || '') + 'assets/img/')
    $('#custombar').before(html).remove()
    render()
  })
})

var state = {
  bag:          'black',
  letters:      '',
  materials:    ['white', 'white'],
  activeLetter: 0,
  editing:      true,
  editingBag:   true,
}

var lastState = Object.assign({}, state);

//
// EVENT HANDLING
//

// tap bag to modify
$(document).on('click', '.js-bag', function(evt) {
  setState({
    editing:    true,
    editingBag: true,
  })
})

// input to change both letters
$(document).on('input', '.js-bag-input', function(evt) {
  setState({
    letters: $(this).val()
  })
})

// input to change a single letter
$(document).on('input', '.js-input', function(evt) {
  var letters = state.letters.split('')
  letters.splice(state.activeLetter, 1, $(this).val())

  setState({
    letters: letters.join(''),
  })
})
$(document).on('focus', '.js-input', function(evt) {
  $(this).select()
})
$(document).on('click', '.js-input', function(evt) {
  $(this).select()
})

// select material swatch for individual letter
$(document).on('click', '.js-swatch-link', function(evt) {
  var materials = state.materials.concat([])
  var color     = $(this).data('color')
  if( state.editingBag ) {
    materials = materials.map(function(m) { return color })
  } else {
    materials[state.activeLetter] = $(this).data('color')
  }

  setState({
    materials: materials
  })
})

// select bag type
$(document).on('click', '.js-bag-link', function(evt) {
  setState({
    bag: $(this).data('color')
  })
})

// remove individual letter from bag
$(document).on('click', '.js-remove-letter', function(evt) {
  var letters = state.letters.split('')
  letters.splice(state.activeLetter, 1)

  setState({
    letters: letters.join(''),
    editing: false,
  })
})


// edit individual letter
$(document).on('click', '.js-letter', function(evt) {
  evt.stopPropagation()

  setState({
    editing:      true,
    editingBag:   false,
    activeLetter: $(this).data('index'),
  })
})

// stop editing
$(document).on('click', '.js-close-palette', function(evt) {
  setState({
    editing: false,
    editingBag: false,
  })
})

function setState(newState) {
  lastState = Object.assign({}, state)
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

function render() {
  // reset
  $('.js-letters').html('')
  $('.js-tab').html('')
  $('.js-preview').html('')
  $('.js-tab').removeClass('active')
  $('.js-swatch').removeClass('active')
  $('.js-palette').hide()
  $('.js-bag-editor').hide()
  $('.js-letter-editor').hide()

  // render bag color
  $('.js-bag').css({backgroundImage: "url("+(window.baseUrl || '')+"assets/img/bags/danny-"+state.bag+".png)"})

  // render letters in bag and preview
  if( state.letters.length > 0 ) {
    var letter1 = letter({ letter: state.letters[0], material: state.materials[0], index: 0})
    $('.js-letters').append(letter1)
    $('.js-tab:eq(0)').append(letter1.clone())
    if( state.activeLetter === 0 ) {
      $('.js-preview').append(letter1.clone())
    }
  }
  if( state.letters.length > 1 ) {
    var letter2 = letter({ letter: state.letters[1], material: state.materials[1], index: 1})
    $('.js-letters').append(letter2)
    $('.js-tab:eq(1)').append(letter2.clone())
    if( state.activeLetter === 1 ) {
      $('.js-preview').append(letter2.clone())
    }
  }

  // show editor palette
  if( state.editing ) {
    $('.js-palette').show()

    if( state.editingBag ) {
      $('.js-bag-editor').show()
    } else {
      $('.js-letter-editor').show()
    }
  }

  // select input if we're showing a new input
  if( state.editing !== lastState.editing || (state.activeLetter !== lastState.activeLetter && state.activeLetter === state.letters.length) ) {
    $('.js-input').select()
  }

  // render active tab
  $(`.js-tab[data-index=${state.activeLetter}]`).addClass('active')

  // render active swatch
  $(`.js-swatch[data-color=${state.materials[state.activeLetter]}]`).addClass('active')

  // set value of inputs
  $('.js-bag-input').val(state.letters)
  $('.js-input').val(state.letters[state.activeLetter])

  // update shopify hidden input
  updateCustomInfo()
}

function letter(props) {
  var alt = `${props.letter} in ${props.material}`
  var src = `${window.baseUrl || ''}assets/img/letters/${props.letter.toUpperCase()}-${props.material}.png`;
  return $(`
    <img src="${src}" alt="${alt}" class="js-letter" data-index="${props.index}"/>
  `)
}

var imageCache = {}

function loadImage(src, cb) {
  if( !imageCache[src] ) {
    imageCache[src] = new Image
    imageCache[src].src = src
  }
  imageCache[src].onload = function() {
    imageCache[src].loaded = true
    cb()
  }
}
