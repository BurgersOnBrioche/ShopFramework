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

function render() {
  console.log('rendering')

  // reset
  $('.js-letters').html('')
  $('.js-tab').html('')
  $('.js-tab').removeClass('active')
  $('.js-swatch').removeClass('active')

  // render
  if( state.letters.length > 0 ) {
    var letter1 = letter({ letter: state.letters[0], material: state.materials[0]})
    $('.js-letters').append(letter1)
    $('.js-tab:eq(0)').append(letter1.clone())
  }
  if( state.letters.length > 1 ) {
    var letter2 = letter({ letter: state.letters[1], material: state.materials[1]})
    $('.js-letters').append(letter2)
    $('.js-tab:eq(1)').append(letter2.clone())
  }

  $(`.js-tab[data-index=${state.activeLetter}]`).addClass('active')
  $(`.js-swatch[data-color=${state.materials[state.activeLetter]}]`).addClass('active')
  updateCustomInfo()
}

function letter(props) {
  var alt = `${props.letter} in ${props.material}`
  var src = `${window.baseUrl || ''}assets/img/letters/${props.letter.toUpperCase()}-${props.material}.png`;
  return $(`<img src="${src}" alt="${alt}"/>`)
}
