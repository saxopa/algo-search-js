// Variable globale pour stocker les recettes
let recipes = [];

// Stockage des filtres actifs
let activeFilters = {
  ingredients: [],
  ustensils: [],
  appliance: [],
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
    recipe.ustensils.forEach((ust) => ustensils.add(ust));
    appliances.add(recipe.appliance);
  });

  return {
    ingredients: [...ingredients].sort(),
    ustensils: [...ustensils].sort(),
    appliances: [...appliances].sort(),
  };
}

function populateDropdowns(uniqueElements) {
  const dropdowns = {
    ingredients: document.getElementById("myDropdowningredients"),
    ustensils: document.getElementById("myDropdownustensiles"),
    appliances: document.getElementById("myDropdownappareil"),
  };

  Object.values(dropdowns).forEach((dropdown) => {
    if (!dropdown) return;
    dropdown.innerHTML = "";
  });


  uniqueElements.ingredients.filter(i=> !activeFilters.ingredients.includes(i)).forEach((ingredient) => {
    if (dropdowns.ingredients) {
      const a = document.createElement("a");
      a.innerHTML = ingredient;
      a.addEventListener("click", () => addFilter("ingredients", ingredient));
      dropdowns.ingredients.appendChild(a);
    }
  });

  console.log(activeFilters)
  console.log(uniqueElements.appliances)

  uniqueElements.appliances.filter(i=> !activeFilters.appliances?.includes(i)).forEach((appliance) => {
    if (dropdowns.appliances) {
      const a = document.createElement("a");
      a.innerHTML = appliance;
      a.addEventListener("click", () => addFilter("ingredients", appliance));
      dropdowns.appliances.appendChild(a);
    }
  });  uniqueElements.ustensils.forEach((ustensil) => {
    if (dropdowns.ustensils) {
      const a = document.createElement("a");
      a.innerHTML = ustensil;
      a.addEventListener("click", () => addFilter("ingredients", ustensil));
      dropdowns.ustensils.appendChild(a);
    }
  });
  uniqueElements.ustensils.forEach((ustensil) => {
    if (dropdowns.ustensils) {
      const a = document.createElement("a");
      a.innerHTML = ustensil;
      a.addEventListener("click", () => addFilter("ustensils", ustensil));
      dropdowns.ustensils.appendChild(a);
    }
  });

  uniqueElements.appliances.forEach((appliance) => {
    if (dropdowns.appliances) {
      const a = document.createElement("a");
      a.innerHTML = appliance;
      a.addEventListener("click", () => addFilter("appliance", appliance));
      dropdowns.appliances.appendChild(a);
    }
  });
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
    const links = dropdown.getElementsByTagName("a");
    Array.from(links).forEach((link) => {
      const txtValue = link.innerHTML || link.innerText;
      link.style.display = txtValue.toUpperCase().includes(filter)
        ? ""
        : "none";
    });
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
    const ingredientsMatch =
      activeFilters.ingredients.length === 0 ||
      activeFilters.ingredients.every((ing) =>
        recipe.ingredients.some(
          (ri) => ri.ingredient.toLowerCase() === ing.toLowerCase()
        )
      );

    const ustensilsMatch =
      activeFilters.ustensils.length === 0 ||
      activeFilters.ustensils.every((ust) =>
        recipe.ustensils.some((ru) => ru.toLowerCase() === ust.toLowerCase())
      );

    const applianceMatch =
      !activeFilters.appliance ||
      recipe.appliance.toLowerCase() === activeFilters.appliance.toLowerCase();

    return ingredientsMatch && ustensilsMatch && applianceMatch;
  });

  const uniqueElements = extractUniqueElements(filteredRecipes);
  populateDropdowns(uniqueElements);
  displayRecipes(filteredRecipes);
}


//fonction de recherche de recettes avec boucles natives
function searchRecipesNativeLoops(searchTerm) {
  if (!recipes || !recipes.length) return [];

  const searchInput = searchTerm.toLowerCase();
  const results = [];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];

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
        break; // Sort de la boucle des ingrédients si un match est trouvé
      }
    }
    // Vérifie les ustensiles
    for (let j = 0; j < recipe.ustensils.length; j++) {
      const ustensil = recipe.ustensils[j];
      if (ustensil.toLowerCase().includes(searchInput)) {
        results.push(recipe);
        break; // Sort de la boucle des ustensiles si un match est trouvé
      }
    }
    // Vérifie l'appareil
    if (recipe.appliance.toLowerCase().includes(searchInput)) {
      results.push(recipe);
      continue;
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