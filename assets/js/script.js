$(document).ready(function() {
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

$(document).on('input', '.js-input', function(evt) {
  setState({
    letters: $(this).val()
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

function render() {
  // reset
  $('.js-letters').html('')
  $('.js-tab').html('')
  $('.js-tab').removeClass('active')
  $('.js-swatch').removeClass('active')
  $('.js-add-letter').hide()
  $('.js-palette').hide()

  // render letters
  if( state.letters.length > 0 ) {
    var letter1 = letter({ letter: state.letters[0], material: state.materials[0], index: 0})
    $('.js-letters').append(letter1)
    $('.js-tab:eq(0)').append(letter1.clone())
  }
  if( state.letters.length > 1 ) {
    var letter2 = letter({ letter: state.letters[1], material: state.materials[1], index: 1})
    $('.js-letters').append(letter2)
    $('.js-tab:eq(1)').append(letter2.clone())
  }

  // show add button
  if( state.letters.length < 2 ) {
    $('.js-add-letter').show()
  }

  // show letter palette
  if( state.editing ) {
    $('.js-palette').show()
  }

  // render active tab
  $(`.js-tab[data-index=${state.activeLetter}]`).addClass('active')

  // render active swatch
  $(`.js-swatch[data-color=${state.materials[state.activeLetter]}]`).addClass('active')
  updateCustomInfo()
}

function letter(props) {
  var alt = `${props.letter} in ${props.material}`
  var src = `${window.baseUrl || ''}assets/img/letters/${props.letter.toUpperCase()}-${props.material}.png`;
  return $(`
    <img src="${src}" alt="${alt}" class="js-letter" data-index="${props.index}"/>
  `)
}
