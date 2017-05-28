$(document).ready(function() {
  fetch("./assets/js/letter-spacing.json").then(function(response) {

    response.json().then(function(data) {
      alert(data["A"]["left"])
    })
  })
})