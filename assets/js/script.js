$(document).ready(function() {
  // hide contact us form
  var interval = setInterval(function() {
    var contactUs = $('body').find('img[src*="icf.improvely.com"]')
    if( !contactUs.length ) { return; }
    contactUs.hide()
    clearInterval(interval)
  }, 200)

  fetch((window.baseUrl || '') + '/assets/html/custombar.html').then(function(response) {
    return response.text()
  }).then(function(html) {
    html = html.replace(/assets\/img\//g, (window.baseUrl || '') + 'assets/img/')
    $('#custombar').before(html).remove()
    render()
  })
})

var state = {
  letters:      '',
  materials:    ['white', 'white'],
  activeLetter: 0,
  editing:      false,
}

var lastState = Object.assign({}, state);

$(document).on('input', '.js-input', function(evt) {
  var letters = state.letters.split('')
  letters.splice(state.activeLetter, 1, $(this).val())

  setState({
    letters: letters.join(''),
  })
})
$(document).on('click', '.js-swatch-link', function(evt) {
  var materials = state.materials.concat([]);
  materials[state.activeLetter] = $(this).data('color')

  setState({
    materials: materials
  })
})
$(document).on('click', '.js-tab', function(evt) {
  setState({
    activeLetter: $(this).data('index'),
  })
})
$(document).on('click', '.js-letter', function(evt) {
  setState({
    editing: true,
    activeLetter: $(this).data('index'),
  })
})
$(document).on('click', '.js-add-letter', function(evt) {
  setState({
    editing: true,
    activeLetter: state.letters.length,
  })
})
$(document).on('click', '.js-close-palette', function(evt) {
  setState({
    editing: false,
  })
})
$(document).on('focus', '.js-input', function(evt) {
  $(this).select()
})
$(document).on('click', '.js-input', function(evt) {
  $(this).select()
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
  $('.js-preview-letter').html('')
  $('.js-tab').removeClass('active')
  $('.js-swatch').removeClass('active')
  $('.js-add-letter').hide()
  $('.js-palette').hide()

  // render letters in bag and preview
  if( state.letters.length > 0 ) {
    var letter1 = letter({ letter: state.letters[0], material: state.materials[0], index: 0})
    $('.js-letters').append(letter1)
    $('.js-tab:eq(0)').append(letter1.clone())
    if( state.activeLetter === 0 ) {
      $('.js-preview-letter').append(letter1.clone())
    }
  }
  if( state.letters.length > 1 ) {
    var letter2 = letter({ letter: state.letters[1], material: state.materials[1], index: 1})
    $('.js-letters').append(letter2)
    $('.js-tab:eq(1)').append(letter2.clone())
    if( state.activeLetter === 1 ) {
      $('.js-preview-letter').append(letter2.clone())
    }
  }

  // show add button
  if( state.letters.length < 2 ) {
    $('.js-add-letter').show()
  }

  // show letter palette
  if( state.editing ) {
    $('.js-palette').show()
  }

  // select input if we're showing a new input
  if( state.editing !== lastState.editing || (state.activeLetter !== lastState.activeLetter && state.activeLetter === state.letters.length) ) {
    $('.js-input').select()
  }


  // render active tab
  $(`.js-tab[data-index=${state.activeLetter}]`).addClass('active')

  // render active swatch
  $(`.js-swatch[data-color=${state.materials[state.activeLetter]}]`).addClass('active')

  // set value of input to the last value we read
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
