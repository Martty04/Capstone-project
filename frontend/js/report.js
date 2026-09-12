const categories = document.querySelectorAll(".cat");
const continueButton = document.getElementById("continueReport");

let selectedCategory = "Fire";


// ================================
// SELECT CATEGORY
// ================================

categories.forEach((category) => {

    category.addEventListener("click", () => {

        categories.forEach((item) => {
            item.classList.remove("active");
        });

        category.classList.add("active");

        selectedCategory = category.dataset.category;

    });

});


// ================================
// CONTINUE TO DETAILS
// ================================

continueButton.addEventListener("click", () => {

    // Save selected category
    sessionStorage.setItem(
        "reportCategory",
        selectedCategory
    );

    window.location.href = "report-details.html";

});


function selectCategory(category) {
    localStorage.setItem("reportCategory", category);

    window.location.href = "report-location.html";
}


