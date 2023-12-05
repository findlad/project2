window.onkeydown = function (e) {
  if (e.keyCode === 37) {
    document.getElementById("navigate-left").click();
    console.log(e.keyCode);
  }
  if (e.keyCode === 39) {
    document.getElementById("navigate-right").click();
    console.log(e.keyCode);
  }
  if (e.keyCode === 38) {
    document.getElementById("callsupport").click();
    console.log(e.keyCode);
  }
  if (e.keyCode === 40) {
    document.getElementById(" ").click();
    console.log(e.keyCode);
  }
  if (e.keyCode === 13) {
    document
      .getElementsByClass("swiper tranding-slider")
      [swiper.clickedIndex].click();
    console.log(e.keyCode);
  }
};
