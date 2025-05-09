// Variable globale pour stocker les recettes
let recipes = [];

let recipefilterded = [];

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

  // Affichage des ingrédients
  activeFilters.ingredients.forEach((ingredient) => {
    const filterTag = document.createElement("span");
    filterTag.classList.add("filter-tag");
    filterTag.innerHTML = `${ingredient} <span class="remove-filter">×</span>`;

    filterTag.querySelector(".remove-filter").addEventListener("click", () => {
      activeFilters.ingredients = activeFilters.ingredients.filter(
        (item) => item !== ingredient
      );
      applyFilters();
      displayActiveFilters();
    });
    filterContainer.appendChild(filterTag);
  });

  // Affichage des ustensiles
  activeFilters.ustensils.forEach((ustensil) => {
    const filterTag = document.createElement("span");
    filterTag.classList.add("filter-tag");
    filterTag.innerHTML = `${ustensil} <span class="remove-filter">×</span>`;

    filterTag.querySelector(".remove-filter").addEventListener("click", () => {
      activeFilters.ustensils = activeFilters.ustensils.filter(
        (item) => item !== ustensil
      );
      applyFilters();
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
      applyFilters();
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
  const ingredients = new Set();
  const ustensils = new Set();
  const appliances = new Set();

  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ing) => ingredients.add(ing.ingredient));
    // Normaliser les ustensiles en minuscules pour éviter les doublons comme "Économe" et "économe"
    recipe.ustensils.forEach((ust) => {
      // Convertir en minuscules et capitaliser la première lettre pour uniformiser
      const normalizedUst = ust.toLowerCase().charAt(0).toUpperCase() + ust.toLowerCase().slice(1);
      ustensils.add(normalizedUst);
    });
    appliances.add(recipe.appliance);
  });

  return {
    ingredients: [...ingredients].sort(),
    ustensils: [...ustensils].sort(),
    appliances: [...appliances].sort(),
  };
}

function populateDropdowns(uniqueElements) {
  // Correction: vérification des IDs corrects
  const dropdowns = {
    ingredients: document.getElementById("myDropdowningredients"),
    ustensils: document.getElementById("myDropdownustensiles"),
    appliances: document.getElementById("myDropdownappareil"),
  };

  Object.values(dropdowns).forEach((dropdown) => {
    if (!dropdown) return;
    dropdown.innerHTML = "";
  });

  // Filtrer les ingrédients qui ne sont pas déjà sélectionnés
  uniqueElements.ingredients
    .filter(i => !activeFilters.ingredients.includes(i))
    .forEach((ingredient) => {
      if (dropdowns.ingredients) {
        const a = document.createElement("a");
        a.innerHTML = ingredient;
        a.addEventListener("click", () => addFilter("ingredients", ingredient));
        dropdowns.ingredients.appendChild(a);
      }
  });

  // Filtrer les ustensiles qui ne sont pas déjà sélectionnés
  uniqueElements.ustensils
    .filter(u => !activeFilters.ustensils.includes(u))
    .forEach((ustensil) => {
      if (dropdowns.ustensils) {
        const a = document.createElement("a");
        a.innerHTML = ustensil;
        a.addEventListener("click", () => addFilter("ustensils", ustensil));
        dropdowns.ustensils.appendChild(a);
      }
  });

  // Filtrer les appareils si aucun n'est déjà sélectionné
  // Correction: ne pas ajouter d'appareils si un est déjà sélectionné
  if (!activeFilters.appliance) {
    uniqueElements.appliances.forEach((appliance) => {
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
  Array.from(dropdowns).forEach((dropdown) => {
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
    
    // Correction: Fonction de recherche d'ingrédients
    if (dropdownId === "myDropdowningredients") {
      const uniqueIngredients = new Set();
      
      // Collecter tous les ingrédients qui correspondent au filtre et ne sont pas déjà sélectionnés
      recipes.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
          if (
            ingredient.ingredient.toUpperCase().includes(filter) && 
            !activeFilters.ingredients.includes(ingredient.ingredient)
          ) {
            uniqueIngredients.add(ingredient.ingredient);
          }
        });
      });
      
      // Ajouter les ingrédients uniques au dropdown
      [...uniqueIngredients].sort().forEach((ingredient) => {
        const a = document.createElement("a");
        a.innerHTML = ingredient;
        a.addEventListener("click", () => addFilter("ingredients", ingredient));
        dropdown.appendChild(a);
      });
    }
    
    // Correction: Fonction de recherche d'ustensiles
    if (dropdownId === "myDropdownustensiles") {
      // Utiliser un Map pour normaliser les ustensiles et éviter les doublons comme "Économe" et "économe"
      const ustensilMap = new Map();
      
      recipes.forEach((recipe) => {
        recipe.ustensils.forEach((ustensil) => {
          if (ustensil.toUpperCase().includes(filter)) {
            // Clé en minuscules pour comparaison insensible à la casse
            const key = ustensil.toLowerCase();
            // Normaliser le format: première lettre en majuscule, reste en minuscules
            const normalizedUstensil = ustensil.charAt(0).toUpperCase() + ustensil.slice(1).toLowerCase();
            
            if (!activeFilters.ustensils.some(u => u.toLowerCase() === key)) {
              ustensilMap.set(key, normalizedUstensil);
            }
          }
        });
      });
      
      // Convertir Map en tableau et trier
      [...ustensilMap.values()].sort().forEach((ustensil) => {
        const a = document.createElement("a");
        a.innerHTML = ustensil;
        a.addEventListener("click", () => addFilter("ustensils", ustensil));
        dropdown.appendChild(a);
      });
    }
    
    // Correction: Fonction de recherche d'appareils
    if (dropdownId === "myDropdownappareil") {
      // Ne pas afficher d'appareils si un est déjà sélectionné
      if (!activeFilters.appliance) {
        const uniqueAppliances = new Set();
        
        recipes.forEach((recipe) => {
          if (recipe.appliance.toUpperCase().includes(filter)) {
            uniqueAppliances.add(recipe.appliance);
          }
        });
        
        [...uniqueAppliances].sort().forEach((appliance) => {
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
  } else if (!activeFilters[type].includes(value)) {
    activeFilters[type].push(value);
  }
  applyFilters();
  displayActiveFilters();
}

async function applyFilters() {
  const filteredRecipes = recipes.filter((recipe) => {
    // Vérifie si tous les ingrédients sélectionnés sont dans la recette
    const ingredientsMatch =
      activeFilters.ingredients.length === 0 ||
      activeFilters.ingredients.every((ing) =>
        recipe.ingredients.some(
          (ri) => ri.ingredient.toLowerCase() === ing.toLowerCase()
        )
      );

    // Vérifie si tous les ustensiles sélectionnés sont dans la recette
    // Normaliser les ustensiles avant comparaison
    const ustensilsMatch =
      activeFilters.ustensils.length === 0 ||
      activeFilters.ustensils.every((ust) => {
        const normalizedUst = ust.toLowerCase();
        return recipe.ustensils.some((ru) => ru.toLowerCase() === normalizedUst);
      });

    // Correction: vérification correcte de l'appareil
    const applianceMatch = 
      !activeFilters.appliance || 
      recipe.appliance.toLowerCase() === activeFilters.appliance.toLowerCase();
    
    return ingredientsMatch && ustensilsMatch && applianceMatch;
  });

  const uniqueElements = extractUniqueElements(filteredRecipes);
  populateDropdowns(uniqueElements);
  displayRecipes(filteredRecipes);
  recipefilterded = filteredRecipes;
}

//fonction de recherche de recettes avec boucles natives
function searchRecipesNativeLoops(searchTerm) {
  if (!recipes || !recipes.length) return [];

  const searchInput = searchTerm.toLowerCase();
  const results = [];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
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
        break; // Sort de la boucle des ingrédients si un match est trouvé
      }
    }
    
    if (isAdded) continue;
    
    // Vérifie les ustensiles
    for (let j = 0; j < recipe.ustensils.length; j++) {
      const ustensil = recipe.ustensils[j];
      if (ustensil.toLowerCase().includes(searchInput)) {
        results.push(recipe);
        isAdded = true;
        break; // Sort de la boucle des ustensiles si un match est trouvé
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
      if (searchTerm.length >= 3) {
        const results = searchRecipesNativeLoops(searchTerm);
        displayRecipes(results);
      }
    });

    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value;
      if (searchTerm.length >= 3) {
        const results = searchRecipesNativeLoops(searchTerm);
        displayRecipes(results);
      } else if (searchTerm.length === 0) {
        displayRecipes(recipes);
      }
    });
  }

  window.addEventListener("click", (event) => {
    if (!event.target.matches(".dropbtn") && !event.target.matches("input[type='text']")) {
      closeAllDropdowns();
    }
  });
});