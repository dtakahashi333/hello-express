var multiOpen = document.querySelector("#multi-open");
var titles = document.querySelectorAll(".accordion>.title");
var descriptions = document.querySelectorAll(".accordion>.description");

titles.forEach(function (title) {
  title.addEventListener("click", function (e) {
    // Multi open behavior
    const description = this.nextElementSibling;
    this.classList.toggle("expanded");
    if (this.classList.contains("expanded")) {
      description.style.display = "flex";
    } else {
      description.style.display = "none";
    }
    if (!multiOpen.checked) {
      // Single open behavior
      // Close other descriptions than being expanded.
      const clickedElement = this;
      titles.forEach(function (title) {
        if (title !== clickedElement) {
          title.classList.remove("expanded");
          title.nextElementSibling.style.display = "none";
        }
      });
    }
  });
});
