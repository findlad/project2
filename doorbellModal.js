const closeModalButton = document.getElementById("closeModalButton");
const modal = document.getElementById("modalBox");
modal.style.display = "flex";

// Clear the previous chart, if any
const modalContent = document.querySelector(".modal-content");
modalContent.innerHTML = '<canvas id="graph"></canvas>';

closeModalButton.addEventListener("click", () => {
  modal.style.display = "none";
});
