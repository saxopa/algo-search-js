// Variable globale pour stocker les recettes
let recipes = [];

let recipefilterded = [];

// AJOUT: Variable pour stocker le terme de recherche actuel
let currentSearchTerm = "";

// Stockage des filtres actifs
let activeFilters = {
  ingredients: [],
  ustensils: [],
  appliance: null, // Correction: changer [] en null pour un seul appareil
};

// Création du container pour les filtres actifs
const filterContainer = document.createElement("div");
filterContainer.id = "active-filters-container";
document.querySelector("#container-filtre").after(filterContainer);

function displayActiveFilters() {
  const filterContainer = document.getElementById("active-filters-container");
  filterContainer.innerHTML = "";

  // Affichage des ingrédients avec méthodes fonctionnelles
  activeFilters.ingredients.forEach(ingredient => {
    const filterTag = document.createElement("span");
    filterTag.classList.add("filter-tag");
    filterTag.innerHTML = `${ingredient} <span class="remove-filter">×</span>`;

    filterTag.querySelector(".remove-filter").addEventListener("click", () => {
      activeFilters.ingredients = activeFilters.ingredients.filter(item => item !== ingredient);
      applySearchAndFilters();
      displayActiveFilters();
    });
    filterContainer.appendChild(filterTag);
  });

  // Affichage des ustensiles avec méthodes fonctionnelles
  activeFilters.ustensils.forEach(ustensil => {
    const filterTag = document.createElement("span");
    filterTag.classList.add("filter-tag");
    filterTag.innerHTML = `${ustensil} <span class="remove-filter">×</span>`;

    filterTag.querySelector(".remove-filter").addEventListener("click", () => {
      activeFilters.ustensils = activeFilters.ustensils.filter(item => item !== ustensil);
      applySearchAndFilters();
      displayActiveFilters();
    });
    filterContainer.appendChild(filterTag);
  });

  // Affichage de l'appareil
  if (activeFilters.appliance) {
    const filterTag = document.createElement("span");
    filterTag.classList.add("filter-tag");
    filterTag.innerHTML = `${activeFilters.appliance} <span class="remove-filter">×</span>`;

    filterTag.querySelector(".remove-filter").addEventListener("click", () => {
      activeFilters.appliance = null;
      applySearchAndFilters();
      displayActiveFilters();
    });
    filterContainer.appendChild(filterTag);
  }
}

async function fetchRecipes() {
  const response = await fetch("data/recipe.json");
  if (!response.ok) throw new Error("Erreur de chargement des recettes");
  recipes = await response.json();
  const uniqueElements = extractUniqueElements(recipes);
  populateDropdowns(uniqueElements);
  displayRecipes(recipes);
  recipefilterded = recipes;
  try {
   
  } catch (error) {
    console.error("Erreur :", error);
  }
}

function extractUniqueElements(recipes) {
  // Extraction des ingrédients uniques
  const ingredients = recipes
    .map(recipe => recipe.ingredients.map(ing => ing.ingredient))
    .reduce((acc, curr) => acc.concat(curr), [])
    .filter((ingredient, index, arr) => arr.indexOf(ingredient) === index)
    .sort();

  // Extraction des ustensiles uniques avec normalisation
  const ustensils = recipes
    .map(recipe => recipe.ustensils)
    .reduce((acc, curr) => acc.concat(curr), [])
    .map(ustensil => ustensil.toLowerCase().charAt(0).toUpperCase() + ustensil.toLowerCase().slice(1))
    .filter((ustensil, index, arr) => arr.indexOf(ustensil) === index)
    .sort();

  // Extraction des appareils uniques
  const appliances = recipes
    .map(recipe => recipe.appliance)
    .filter((appliance, index, arr) => arr.indexOf(appliance) === index)
    .sort();

  return {
    ingredients,
    ustensils,
    appliances,
  };
}

function populateDropdowns(uniqueElements) {
  const dropdowns = {
    ingredients: document.getElementById("myDropdowningredients"),
    ustensils: document.getElementById("myDropdownustensiles"),
    appliances: document.getElementById("myDropdownappareil"),
  };

  // Vider les dropdowns
  Object.values(dropdowns).forEach(dropdown => {
    if (dropdown) dropdown.innerHTML = "";
  });

  // Filtrer et ajouter les ingrédients
  uniqueElements.ingredients
    .filter(ingredient => !activeFilters.ingredients.includes(ingredient))
    .forEach(ingredient => {
      if (dropdowns.ingredients) {
        const a = document.createElement("a");
        a.innerHTML = ingredient;
        a.addEventListener("click", () => addFilter("ingredients", ingredient));
        dropdowns.ingredients.appendChild(a);
      }
    });

  // Filtrer et ajouter les ustensiles
  uniqueElements.ustensils
    .filter(ustensil => !activeFilters.ustensils.includes(ustensil))
    .forEach(ustensil => {
      if (dropdowns.ustensils) {
        const a = document.createElement("a");
        a.innerHTML = ustensil;
        a.addEventListener("click", () => addFilter("ustensils", ustensil));
        dropdowns.ustensils.appendChild(a);
      }
    });

  // Ajouter les appareils si aucun n'est sélectionné
  if (!activeFilters.appliance) {
    uniqueElements.appliances.forEach(appliance => {
      if (dropdowns.appliances) {
        const a = document.createElement("a");
        a.innerHTML = appliance;
        a.addEventListener("click", () => addFilter("appliance", appliance));
        dropdowns.appliances.appendChild(a);
      }
    });
  }
}

function openDropdowns(dropdownId) {
  closeAllDropdowns();
  document.getElementById(dropdownId).classList.toggle("show");
}

function closeAllDropdowns() {
  const dropdowns = document.getElementsByClassName("dropdown-content");
  Array.from(dropdowns).forEach(dropdown => {
    if (dropdown.classList.contains("show")) {
      dropdown.classList.remove("show");
    }
  });
}

function filterFunction(inputId, dropdownId) {
  const input = document.getElementById(inputId);
  const filter = input.value.toUpperCase();
  const dropdown = document.getElementById(dropdownId);
  
  if (dropdown) {
    dropdown.innerHTML = "";
    
    // Fonction de recherche d'ingrédients avec méthodes fonctionnelles
    if (dropdownId === "myDropdowningredients") {
      const uniqueIngredients = recipefilterded
        .map(recipe => recipe.ingredients.map(ing => ing.ingredient))
        .reduce((acc, curr) => acc.concat(curr), [])
        .filter(ingredient => 
          ingredient.toUpperCase().includes(filter) && 
          !activeFilters.ingredients.includes(ingredient)
        )
        .filter((ingredient, index, arr) => arr.indexOf(ingredient) === index)
        .sort();
      
      uniqueIngredients.forEach(ingredient => {
        const a = document.createElement("a");
        a.innerHTML = ingredient;
        a.addEventListener("click", () => addFilter("ingredients", ingredient));
        dropdown.appendChild(a);
      });
    }
    
    // Fonction de recherche d'ustensiles avec méthodes fonctionnelles
    if (dropdownId === "myDropdownustensiles") {
      const uniqueUstensils = recipefilterded
        .map(recipe => recipe.ustensils)
        .reduce((acc, curr) => acc.concat(curr), [])
        .filter(ustensil => ustensil.toUpperCase().includes(filter))
        .map(ustensil => ustensil.charAt(0).toUpperCase() + ustensil.slice(1).toLowerCase())
        .filter(ustensil => !activeFilters.ustensils.some(active => 
          active.toLowerCase() === ustensil.toLowerCase()
        ))
        .filter((ustensil, index, arr) => 
          arr.findIndex(u => u.toLowerCase() === ustensil.toLowerCase()) === index
        )
        .sort();
      
      uniqueUstensils.forEach(ustensil => {
        const a = document.createElement("a");
        a.innerHTML = ustensil;
        a.addEventListener("click", () => addFilter("ustensils", ustensil));
        dropdown.appendChild(a);
      });
    }
    
    // Fonction de recherche d'appareils avec méthodes fonctionnelles
    if (dropdownId === "myDropdownappareil") {
      if (!activeFilters.appliance) {
        const uniqueAppliances = recipefilterded
          .map(recipe => recipe.appliance)
          .filter(appliance => appliance.toUpperCase().includes(filter))
          .filter((appliance, index, arr) => arr.indexOf(appliance) === index)
          .sort();
        
        uniqueAppliances.forEach(appliance => {
          const a = document.createElement("a");
          a.innerHTML = appliance;
          a.addEventListener("click", () => addFilter("appliance", appliance));
          dropdown.appendChild(a);
        });
      }
    }
  }
}

function addFilter(type, value) {
  if (type === "appliance") {
    activeFilters.appliance = value;
  } else {
    if (!activeFilters[type].includes(value)) {
      activeFilters[type].push(value);
    }
  }
  applySearchAndFilters();
  displayActiveFilters();
}

// Fonction de filtrage avec méthodes fonctionnelles
function applyFiltersToRecipes(recipesToFilter) {
  return recipesToFilter.filter(recipe => {
    // Vérification des ingrédients
    const ingredientsMatch = activeFilters.ingredients.length === 0 || 
      activeFilters.ingredients.every(requiredIngredient =>
        recipe.ingredients.some(ing => 
          ing.ingredient.toLowerCase() === requiredIngredient.toLowerCase()
        )
      );

    // Vérification des ustensiles
    const ustensilsMatch = activeFilters.ustensils.length === 0 ||
      activeFilters.ustensils.every(requiredUstensil =>
        recipe.ustensils.some(ustensil => 
          ustensil.toLowerCase() === requiredUstensil.toLowerCase()
        )
      );
    
    // Vérification de l'appareil
    const applianceMatch = !activeFilters.appliance || 
      recipe.appliance.toLowerCase() === activeFilters.appliance.toLowerCase();
    
    return ingredientsMatch && ustensilsMatch && applianceMatch;
  });
}

async function applyFilters() {
  applySearchAndFilters();
}

// Fonction principale qui combine recherche et filtres
function applySearchAndFilters() {
  let recipesToDisplay = recipes;
  
  // Appliquer la recherche si un terme est présent
  if (currentSearchTerm && currentSearchTerm.length >= 3) {
    recipesToDisplay = searchRecipesFunctional(currentSearchTerm, recipesToDisplay);
  }
  
  // Appliquer les filtres
  recipesToDisplay = applyFiltersToRecipes(recipesToDisplay);
  
  // Mettre à jour les données et l'affichage
  recipefilterded = recipesToDisplay;
  
  // Mettre à jour les dropdowns
  const uniqueElements = extractUniqueElements(recipesToDisplay);
  populateDropdowns(uniqueElements);
  
  // Afficher les recettes
  displayRecipes(recipesToDisplay);
}

// Fonction de recherche avec méthodes fonctionnelles
function searchRecipesFunctional(searchTerm, recipesToSearch = recipes) {
  if (!recipesToSearch || !recipesToSearch.length) return [];

  const searchInput = searchTerm.toLowerCase();

  return recipesToSearch.filter(recipe => {
    // Vérifie le nom
    if (recipe.name.toLowerCase().includes(searchInput)) return true;

    // Vérifie la description
    if (recipe.description.toLowerCase().includes(searchInput)) return true;

    // Vérifie les ingrédients
    if (recipe.ingredients.some(ingredient => 
      ingredient.ingredient.toLowerCase().includes(searchInput)
    )) return true;
    
    // Vérifie les ustensiles
    if (recipe.ustensils.some(ustensil => 
      ustensil.toLowerCase().includes(searchInput)
    )) return true;
    
    // Vérifie l'appareil
    if (recipe.appliance.toLowerCase().includes(searchInput)) return true;

    return false;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchRecipes();

  const searchForm = document.getElementById("form-recherche-hero");
  const searchInput = document.getElementById("champ-recherche-recette");

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const searchTerm = searchInput.value;
      currentSearchTerm = searchTerm;
      if (searchTerm.length >= 3) {
        applySearchAndFilters();
      }
    });

    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value;
      currentSearchTerm = searchTerm;
      if (searchTerm.length >= 3) {
        applySearchAndFilters();
      } else if (searchTerm.length === 0) {
        currentSearchTerm = "";
        applySearchAndFilters();
      }
    });
  }

  window.addEventListener("click", (event) => {
    if (!event.target.matches(".dropbtn") && !event.target.matches("input[type='text']")) {
      closeAllDropdowns();
    }
  });
});