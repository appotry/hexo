$(document).ready(function () {
  try {
    $("#banner").ripples({
      resolution: 512,
      dropRadius: 10, //px
      perturbance: 0.04,
    });
    $("#banner .carousel-item").ripples({
      resolution: 512,
      dropRadius: 10, //px
      perturbance: 0.04,
    });
  } catch (e) {
    $(".error").show().text(e);
  }
});
