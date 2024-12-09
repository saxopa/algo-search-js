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



// Fonction pour filtrer les éléments d'un menu déroulant
function filterFunction(dropdownId) {
  // Récupérer l'élément de saisie
  var input = document.getElementById("myInput");
  if (!input) return; // Sortir si l'élément de saisie n'existe pas

  // Récupérer le menu déroulant spécifique
  var dropdown = document.getElementById(dropdownId);
  if (!dropdown) return; // Sortir si le menu déroulant n'existe pas

  // Obtenir la valeur du filtre et la convertir en majuscules
  var filter = input.value.toUpperCase();

  // Récupérer tous les liens dans le menu déroulant
  var links = dropdown.getElementsByTagName("a");
  
  // Parcourir tous les liens et les masquer/afficher en fonction du filtre
  for (var i = 0; i < links.length; i++) {
      // Obtenir le texte du lien
      var txtValue = links[i].textContent || links[i].innerText;
      
      // Vérifier si le texte correspond au filtre
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
          // Afficher le lien s'il correspond
          links[i].style.display = "";
      } else {
          // Masquer le lien s'il ne correspond pas
          links[i].style.display = "none";
      }
  }
}

// Ajouter un écouteur d'événements une fois le DOM chargé
document.addEventListener('DOMContentLoaded', () => {
  // Récupérer l'élément de saisie de recherche
  const input = document.getElementById('myInput');
  if (input) {
      // Ajouter un écouteur d'événements sur la saisie
      input.addEventListener('input', function() {
          // Filtrer chaque menu déroulant lorsque le contenu de l'input change
          filterFunction('myDropdowningredients');
          filterFunction('myDropdownustensiles');
          filterFunction('myDropdownappreil');
      });
  }
});

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



// Fonction pour remplir les dropdowns
function populateDropdowns(uniqueElements) {
  // Remplir le dropdown des ingrédients
  const ingredientsDropdown = document.getElementById('myDropdowningredients');
  uniqueElements.ingredients.forEach(ingredient => {
      const a = document.createElement('a');
      a.textContent = ingredient;
      ingredientsDropdown.appendChild(a);
  });
  
  // Remplir le dropdown des ustensiles
  const ustensilsDropdown = document.getElementById('myDropdownustensiles');
  uniqueElements.ustensils.forEach(ustensil => {
      const a = document.createElement('a');
      a.textContent = ustensil;
      ustensilsDropdown.appendChild(a);
  });
  
  // Remplir le dropdown des appareils
  const appliancesDropdown = document.getElementById('myDropdownappreil');
  uniqueElements.appliances.forEach(appliance => {
      const a = document.createElement('a');
      a.textContent = appliance;
      appliancesDropdown.appendChild(a);
  });
}



// Modification de la fonction fetchRecipes
async function fetchRecipes() {
  try {
      const response = await fetch('data/recipe.json');
      if (!response.ok) throw new Error('Erreur de chargement des recettes');
      const recipes = await response.json();
      
      // Extraction des éléments uniques
      const uniqueElements = extractUniqueElements(recipes);
      
      // Remplissage des dropdowns
      populateDropdowns(uniqueElements);
      
      // Création des cartes de recettes
      recipes.forEach(createRecipeCard);
  } catch (error) {
      console.error('Erreur :', error);
  }
}


// Fonction pour extraire les éléments uniques ( ingredients, ustensiles, appareils)
function extractUniqueElements(recipes) {
  const ingredients = new Set();
  const ustensils = new Set();
  const appliances = new Set();
  
  recipes.forEach(recipe => {
      // Extraction des ingrédients
      recipe.ingredients.forEach(ing => {
          ingredients.add(ing.ingredient);
      });
      
      // Extraction des ustensiles
      recipe.ustensils.forEach(ust => {
          ustensils.add(ust);
      });
      
      // Extraction des appareils
      appliances.add(recipe.appliance);
  });
  
  return {
      ingredients: [...ingredients].sort(),
      ustensils: [...ustensils].sort(),
      appliances: [...appliances].sort()
  };
}




// Event listener to ensure DOM is loaded before running script
document.addEventListener('DOMContentLoaded', () => {
    // Add event listener for input filtering
    const input = document.getElementById('myInput');
    if (input) {
      input.addEventListener('input', filterFunction);
    }
  
    // Fetch and populate recipes
    fetchRecipes();
  });
