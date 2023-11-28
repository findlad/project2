// Initialize Swiper
var swiper = new Swiper(".swiper-container", {
  slidesPerView: 5,
  spaceBetween: 5,
  loop: true,
  centeredSlides: true, // Center the active slide
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  on: {
    init: function () {
      // Set the initial size of the centered slide
      this.slides[this.activeIndex].style.transform = "scale(1.2)";
    },
    slideChangeTransitionEnd: function () {
      // Reset the size of all slides
      for (var i = 0; i < this.slides.length; i++) {
        this.slides[i].style.transform = "";
      }
      // Set the size of the centered slide
      this.slides[this.activeIndex].style.transform = "scale(1.2)";
    },
  },
});
