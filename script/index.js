/* Toggle between hiding and showing the dropdown content */
function myFunction(id) {
    // Récupère l'élément du dropdown correspondant à l'ID fourni
    var dropdown = document.getElementById(id);

    // Vérifie si le dropdown est déjà ouvert
    var isAlreadyOpen = dropdown.classList.contains("show");

    // Ferme tous les dropdowns ouverts
    closeAllDropdowns();

    // Si le dropdown n'était pas déjà ouvert, l'ouvre
    if (!isAlreadyOpen) {
        dropdown.classList.toggle("show");
    }
}

function closeAllDropdowns() {
    // Récupère tous les éléments ayant la classe "dropdown-content"
    var dropdowns = document.getElementsByClassName("dropdown-content");

    // Parcourt les éléments et enlève la classe "show" si elle est présente
    for (var i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains("show")) {
            openDropdown.classList.remove("show");
        }
    }
}


  
  function filterFunction() {
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
      txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }


  // Fonction pour récupérer les données JSON et générer les cartes de recettes
async function fetchRecipes() {
    try {
        const response = await fetch('data/recipe.json');
        if (!response.ok) throw new Error('Erreur de chargement des recettes');
        const recipes = await response.json();

        // Parcourt des recettes et création des cartes
        recipes.forEach(createRecipeCard);
    } catch (error) {
        console.error('Erreur :', error);
    }
}

// Appel de la fonction fetchRecipes dans le code principal
fetchRecipes();
