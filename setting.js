function myFunction(event) {
    // Get the ID of the dropdown content corresponding to the clicked button
    var dropdownId = event.currentTarget.getAttribute('aria-controls');
  
    // Toggle the "show" class on the correct dropdown content
    document.getElementById(dropdownId).classList.toggle("show");
  }
  
  // Close the dropdown if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
  



























