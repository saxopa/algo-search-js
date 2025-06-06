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

  // Affichage des ingrédients avec boucle native
  for (let i = 0; i < activeFilters.ingredients.length; i++) {
    const ingredient = activeFilters.ingredients[i];
    const filterTag = document.createElement("span");
    filterTag.classList.add("filter-tag");
    filterTag.innerHTML = `${ingredient} <span class="remove-filter">×</span>`;

    filterTag.querySelector(".remove-filter").addEventListener("click", () => {
      // Suppression avec boucle native
      const newIngredients = [];
      for (let j = 0; j < activeFilters.ingredients.length; j++) {
        if (activeFilters.ingredients[j] !== ingredient) {
          newIngredients.push(activeFilters.ingredients[j]);
        }
      }
      activeFilters.ingredients = newIngredients;
      applySearchAndFilters();
      displayActiveFilters();
    });
    filterContainer.appendChild(filterTag);
  }

  // Affichage des ustensiles avec boucle native
  for (let i = 0; i < activeFilters.ustensils.length; i++) {
    const ustensil = activeFilters.ustensils[i];
    const filterTag = document.createElement("span");
    filterTag.classList.add("filter-tag");
    filterTag.innerHTML = `${ustensil} <span class="remove-filter">×</span>`;

    filterTag.querySelector(".remove-filter").addEventListener("click", () => {
      // Suppression avec boucle native
      const newUstensils = [];
      for (let j = 0; j < activeFilters.ustensils.length; j++) {
        if (activeFilters.ustensils[j] !== ustensil) {
          newUstensils.push(activeFilters.ustensils[j]);
        }
      }
      activeFilters.ustensils = newUstensils;
      applySearchAndFilters();
      displayActiveFilters();
    });
    filterContainer.appendChild(filterTag);
  }

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
  const ingredients = [];
  const ustensils = [];
  const appliances = [];

  // Utilisation de boucles natives au lieu de forEach
  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    
    // Traitement des ingrédients
    for (let j = 0; j < recipe.ingredients.length; j++) {
      const ingredient = recipe.ingredients[j].ingredient;
      let found = false;
      for (let k = 0; k < ingredients.length; k++) {
        if (ingredients[k] === ingredient) {
          found = true;
          break;
        }
      }
      if (!found) {
        ingredients.push(ingredient);
      }
    }
    
    // Traitement des ustensiles avec normalisation
    for (let j = 0; j < recipe.ustensils.length; j++) {
      const normalizedUst = recipe.ustensils[j].toLowerCase().charAt(0).toUpperCase() + 
                           recipe.ustensils[j].toLowerCase().slice(1);
      let found = false;
      for (let k = 0; k < ustensils.length; k++) {
        if (ustensils[k] === normalizedUst) {
          found = true;
          break;
        }
      }
      if (!found) {
        ustensils.push(normalizedUst);
      }
    }
    
    // Traitement des appareils
    let found = false;
    for (let j = 0; j < appliances.length; j++) {
      if (appliances[j] === recipe.appliance) {
        found = true;
        break;
      }
    }
    if (!found) {
      appliances.push(recipe.appliance);
    }
  }

  // Tri avec boucles natives (bubble sort)
  function sortArray(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
    return arr;
  }

  return {
    ingredients: sortArray(ingredients),
    ustensils: sortArray(ustensils),
    appliances: sortArray(appliances),
  };
}

function populateDropdowns(uniqueElements) {
  const dropdowns = {
    ingredients: document.getElementById("myDropdowningredients"),
    ustensils: document.getElementById("myDropdownustensiles"),
    appliances: document.getElementById("myDropdownappareil"),
  };

  // Vider les dropdowns avec boucle native
  const dropdownValues = [dropdowns.ingredients, dropdowns.ustensils, dropdowns.appliances];
  for (let i = 0; i < dropdownValues.length; i++) {
    if (dropdownValues[i]) {
      dropdownValues[i].innerHTML = "";
    }
  }

  // Filtrer et ajouter les ingrédients avec boucles natives
  for (let i = 0; i < uniqueElements.ingredients.length; i++) {
    const ingredient = uniqueElements.ingredients[i];
    let isIncluded = false;
    for (let j = 0; j < activeFilters.ingredients.length; j++) {
      if (activeFilters.ingredients[j] === ingredient) {
        isIncluded = true;
        break;
      }
    }
    if (!isIncluded && dropdowns.ingredients) {
      const a = document.createElement("a");
      a.innerHTML = ingredient;
      a.addEventListener("click", () => addFilter("ingredients", ingredient));
      dropdowns.ingredients.appendChild(a);
    }
  }

  // Filtrer et ajouter les ustensiles avec boucles natives
  for (let i = 0; i < uniqueElements.ustensils.length; i++) {
    const ustensil = uniqueElements.ustensils[i];
    let isIncluded = false;
    for (let j = 0; j < activeFilters.ustensils.length; j++) {
      if (activeFilters.ustensils[j] === ustensil) {
        isIncluded = true;
        break;
      }
    }
    if (!isIncluded && dropdowns.ustensils) {
      const a = document.createElement("a");
      a.innerHTML = ustensil;
      a.addEventListener("click", () => addFilter("ustensils", ustensil));
      dropdowns.ustensils.appendChild(a);
    }
  }

  // Ajouter les appareils si aucun n'est sélectionné
  if (!activeFilters.appliance) {
    for (let i = 0; i < uniqueElements.appliances.length; i++) {
      const appliance = uniqueElements.appliances[i];
      if (dropdowns.appliances) {
        const a = document.createElement("a");
        a.innerHTML = appliance;
        a.addEventListener("click", () => addFilter("appliance", appliance));
        dropdowns.appliances.appendChild(a);
      }
    }
  }
}

function openDropdowns(dropdownId) {
  closeAllDropdowns();
  document.getElementById(dropdownId).classList.toggle("show");
}

function closeAllDropdowns() {
  const dropdowns = document.getElementsByClassName("dropdown-content");
  for (let i = 0; i < dropdowns.length; i++) {
    if (dropdowns[i].classList.contains("show")) {
      dropdowns[i].classList.remove("show");
    }
  }
}

function filterFunction(inputId, dropdownId) {
  const input = document.getElementById(inputId);
  const filter = input.value.toUpperCase();
  const dropdown = document.getElementById(dropdownId);
  
  if (dropdown) {
    dropdown.innerHTML = "";
    
    // Fonction de recherche d'ingrédients avec boucles natives
    if (dropdownId === "myDropdowningredients") {
      const uniqueIngredients = [];
      
      for (let i = 0; i < recipefilterded.length; i++) {
        const recipe = recipefilterded[i];
        for (let j = 0; j < recipe.ingredients.length; j++) {
          const ingredient = recipe.ingredients[j].ingredient;
          if (ingredient.toUpperCase().includes(filter)) {
            // Vérifier si pas déjà dans les filtres actifs
            let isInActiveFilters = false;
            for (let k = 0; k < activeFilters.ingredients.length; k++) {
              if (activeFilters.ingredients[k] === ingredient) {
                isInActiveFilters = true;
                break;
              }
            }
            
            // Vérifier si pas déjà dans uniqueIngredients
            let isInUnique = false;
            for (let k = 0; k < uniqueIngredients.length; k++) {
              if (uniqueIngredients[k] === ingredient) {
                isInUnique = true;
                break;
              }
            }
            
            if (!isInActiveFilters && !isInUnique) {
              uniqueIngredients.push(ingredient);
            }
          }
        }
      }
      
      // Tri des ingrédients
      for (let i = 0; i < uniqueIngredients.length - 1; i++) {
        for (let j = 0; j < uniqueIngredients.length - i - 1; j++) {
          if (uniqueIngredients[j] > uniqueIngredients[j + 1]) {
            const temp = uniqueIngredients[j];
            uniqueIngredients[j] = uniqueIngredients[j + 1];
            uniqueIngredients[j + 1] = temp;
          }
        }
      }
      
      // Ajouter au dropdown
      for (let i = 0; i < uniqueIngredients.length; i++) {
        const a = document.createElement("a");
        a.innerHTML = uniqueIngredients[i];
        a.addEventListener("click", () => addFilter("ingredients", uniqueIngredients[i]));
        dropdown.appendChild(a);
      }
    }
    
    // Fonction de recherche d'ustensiles avec boucles natives
    if (dropdownId === "myDropdownustensiles") {
      const ustensilMap = {};
      
      for (let i = 0; i < recipefilterded.length; i++) {
        const recipe = recipefilterded[i];
        for (let j = 0; j < recipe.ustensils.length; j++) {
          const ustensil = recipe.ustensils[j];
          if (ustensil.toUpperCase().includes(filter)) {
            const key = ustensil.toLowerCase();
            const normalizedUstensil = ustensil.charAt(0).toUpperCase() + ustensil.slice(1).toLowerCase();
            
            // Vérifier si pas dans les filtres actifs
            let isInActiveFilters = false;
            for (let k = 0; k < activeFilters.ustensils.length; k++) {
              if (activeFilters.ustensils[k].toLowerCase() === key) {
                isInActiveFilters = true;
                break;
              }
            }
            
            if (!isInActiveFilters) {
              ustensilMap[key] = normalizedUstensil;
            }
          }
        }
      }
      
      // Convertir en tableau et trier
      const ustensilArray = [];
      for (const key in ustensilMap) {
        ustensilArray.push(ustensilMap[key]);
      }
      
      for (let i = 0; i < ustensilArray.length - 1; i++) {
        for (let j = 0; j < ustensilArray.length - i - 1; j++) {
          if (ustensilArray[j] > ustensilArray[j + 1]) {
            const temp = ustensilArray[j];
            ustensilArray[j] = ustensilArray[j + 1];
            ustensilArray[j + 1] = temp;
          }
        }
      }
      
      for (let i = 0; i < ustensilArray.length; i++) {
        const a = document.createElement("a");
        a.innerHTML = ustensilArray[i];
        a.addEventListener("click", () => addFilter("ustensils", ustensilArray[i]));
        dropdown.appendChild(a);
      }
    }
    
    // Fonction de recherche d'appareils avec boucles natives
    if (dropdownId === "myDropdownappareil") {
      if (!activeFilters.appliance) {
        const uniqueAppliances = [];
        
        for (let i = 0; i < recipefilterded.length; i++) {
          const recipe = recipefilterded[i];
          if (recipe.appliance.toUpperCase().includes(filter)) {
            let found = false;
            for (let j = 0; j < uniqueAppliances.length; j++) {
              if (uniqueAppliances[j] === recipe.appliance) {
                found = true;
                break;
              }
            }
            if (!found) {
              uniqueAppliances.push(recipe.appliance);
            }
          }
        }
        
        // Tri des appareils
        for (let i = 0; i < uniqueAppliances.length - 1; i++) {
          for (let j = 0; j < uniqueAppliances.length - i - 1; j++) {
            if (uniqueAppliances[j] > uniqueAppliances[j + 1]) {
              const temp = uniqueAppliances[j];
              uniqueAppliances[j] = uniqueAppliances[j + 1];
              uniqueAppliances[j + 1] = temp;
            }
          }
        }
        
        for (let i = 0; i < uniqueAppliances.length; i++) {
          const a = document.createElement("a");
          a.innerHTML = uniqueAppliances[i];
          a.addEventListener("click", () => addFilter("appliance", uniqueAppliances[i]));
          dropdown.appendChild(a);
        }
      }
    }
  }
}

function addFilter(type, value) {
  if (type === "appliance") {
    activeFilters.appliance = value;
  } else {
    // Vérifier si la valeur n'est pas déjà présente avec boucle native
    let found = false;
    for (let i = 0; i < activeFilters[type].length; i++) {
      if (activeFilters[type][i] === value) {
        found = true;
        break;
      }
    }
    if (!found) {
      activeFilters[type].push(value);
    }
  }
  applySearchAndFilters();
  displayActiveFilters();
}

// Fonction de filtrage avec boucles natives
function applyFiltersToRecipes(recipesToFilter) {
  const results = [];
  
  for (let i = 0; i < recipesToFilter.length; i++) {
    const recipe = recipesToFilter[i];
    
    // Vérification des ingrédients
    let ingredientsMatch = true;
    if (activeFilters.ingredients.length > 0) {
      for (let j = 0; j < activeFilters.ingredients.length; j++) {
        const requiredIngredient = activeFilters.ingredients[j];
        let found = false;
        for (let k = 0; k < recipe.ingredients.length; k++) {
          if (recipe.ingredients[k].ingredient.toLowerCase() === requiredIngredient.toLowerCase()) {
            found = true;
            break;
          }
        }
        if (!found) {
          ingredientsMatch = false;
          break;
        }
      }
    }

    // Vérification des ustensiles
    let ustensilsMatch = true;
    if (activeFilters.ustensils.length > 0) {
      for (let j = 0; j < activeFilters.ustensils.length; j++) {
        const requiredUstensil = activeFilters.ustensils[j].toLowerCase();
        let found = false;
        for (let k = 0; k < recipe.ustensils.length; k++) {
          if (recipe.ustensils[k].toLowerCase() === requiredUstensil) {
            found = true;
            break;
          }
        }
        if (!found) {
          ustensilsMatch = false;
          break;
        }
      }
    }
    
    // Vérification de l'appareil
    const applianceMatch = !activeFilters.appliance || 
      recipe.appliance.toLowerCase() === activeFilters.appliance.toLowerCase();
    
    if (ingredientsMatch && ustensilsMatch && applianceMatch) {
      results.push(recipe);
    }
  }
  
  return results;
}

async function applyFilters() {
  applySearchAndFilters();
}

// Fonction principale qui combine recherche et filtres
function applySearchAndFilters() {
  let recipesToDisplay = recipes;
  
  // Appliquer la recherche si un terme est présent
  if (currentSearchTerm && currentSearchTerm.length >= 3) {
    recipesToDisplay = searchRecipesNativeLoops(currentSearchTerm, recipesToDisplay);
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

// Fonction de recherche avec boucles natives
function searchRecipesNativeLoops(searchTerm, recipesToSearch = recipes) {
  if (!recipesToSearch || !recipesToSearch.length) return [];

  const searchInput = searchTerm.toLowerCase();
  const results = [];

  for (let i = 0; i < recipesToSearch.length; i++) {
    const recipe = recipesToSearch[i];
    let isAdded = false;

    // Vérifie le nom
    if (recipe.name.toLowerCase().includes(searchInput)) {
      results.push(recipe);
      continue;
    }

    // Vérifie la description
    if (recipe.description.toLowerCase().includes(searchInput)) {
      results.push(recipe);
      continue;
    }

    // Vérifie les ingrédients
    for (let j = 0; j < recipe.ingredients.length; j++) {
      const ingredient = recipe.ingredients[j];
      if (ingredient.ingredient.toLowerCase().includes(searchInput)) {
        results.push(recipe);
        isAdded = true;
        break;
      }
    }
    
    if (isAdded) continue;
    
    // Vérifie les ustensiles
    for (let j = 0; j < recipe.ustensils.length; j++) {
      const ustensil = recipe.ustensils[j];
      if (ustensil.toLowerCase().includes(searchInput)) {
        results.push(recipe);
        isAdded = true;
        break;
      }
    }
    
    if (isAdded) continue;
    
    // Vérifie l'appareil
    if (recipe.appliance.toLowerCase().includes(searchInput)) {
      results.push(recipe);
    }
  }

  return results;
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
