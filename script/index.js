// Variable globale pour stocker les recettes
let recipes = [];

// Stockage des filtres actifs
let activeFilters = {
    ingredients: [],
    ustensils: [],
    appliance: null
};

// Création du container pour les filtres actifs
const filterContainer = document.createElement('div');
filterContainer.id = 'active-filters-container';
document.querySelector('#container-filtre').after(filterContainer);

// Fonction pour afficher les filtres actifs
function displayActiveFilters() {
    const filterContainer = document.getElementById('active-filters-container');
    filterContainer.innerHTML = '';
    
    // Affichage des ingrédients
    activeFilters.ingredients.forEach(ingredient => {
        const filterTag = document.createElement('span');
        filterTag.classList.add('filter-tag');
        filterTag.innerHTML = `${ingredient} <span class="remove-filter">×</span>`;
        
        filterTag.querySelector('.remove-filter').addEventListener('click', () => {
            activeFilters.ingredients = activeFilters.ingredients.filter(item => item !== ingredient);
            applyFilters();
            displayActiveFilters();
        });
        filterContainer.appendChild(filterTag);
    });

    // Affichage des ustensiles
    activeFilters.ustensils.forEach(ustensil => {
        const filterTag = document.createElement('span');
        filterTag.classList.add('filter-tag');
        filterTag.innerHTML = `${ustensil} <span class="remove-filter">×</span>`;
        
        filterTag.querySelector('.remove-filter').addEventListener('click', () => {
            activeFilters.ustensils = activeFilters.ustensils.filter(item => item !== ustensil);
            applyFilters();
            displayActiveFilters();
        });
        filterContainer.appendChild(filterTag);
    });

    // Affichage de l'appareil
    if (activeFilters.appliance) {
        const filterTag = document.createElement('span');
        filterTag.classList.add('filter-tag');
        filterTag.innerHTML = `${activeFilters.appliance} <span class="remove-filter">×</span>`;
        
        filterTag.querySelector('.remove-filter').addEventListener('click', () => {
            activeFilters.appliance = null;
            applyFilters();
            displayActiveFilters();
        });
        filterContainer.appendChild(filterTag);
    }
}

// Fonction pour récupérer les recettes depuis le fichier JSON
async function fetchRecipes() {
    try {
        const response = await fetch('data/recipe.json');
        if (!response.ok) throw new Error('Erreur de chargement des recettes');
        recipes = await response.json();
        const uniqueElements = extractUniqueElements(recipes);
        populateDropdowns(uniqueElements);
        displayRecipes(recipes);
        displayRecipeCount(recipes.length);
    } catch (error) {
        console.error('Erreur :', error);
    }
}

// Fonction pour extraire les éléments uniques (ingrédients, ustensiles, appareils)
function extractUniqueElements(recipes) {
    const ingredients = new Set();
    const ustensils = new Set();
    const appliances = new Set();
    
    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ing => ingredients.add(ing.ingredient));
        recipe.ustensils.forEach(ust => ustensils.add(ust));
        appliances.add(recipe.appliance);
    });

    return {
        ingredients: [...ingredients].sort(),
        ustensils: [...ustensils].sort(),
        appliances: [...appliances].sort()
    };
}

// Fonction pour remplir les dropdowns avec les éléments uniques
function populateDropdowns(uniqueElements) {
    const dropdowns = {
        ingredients: document.getElementById('myDropdowningredients'),
        ustensils: document.getElementById('myDropdownustensiles'),
        appliances: document.getElementById('myDropdownappreil')
    };

    Object.values(dropdowns).forEach(dropdown => {
        if (!dropdown) return;
        dropdown.innerHTML = '';
    });

    uniqueElements.ingredients.forEach(ingredient => {
        if (dropdowns.ingredients && !activeFilters.ingredients.includes(ingredient)) {
            const a = document.createElement('a');
            a.textContent = ingredient;
            a.addEventListener('click', () => addFilter('ingredients', ingredient));
            dropdowns.ingredients.appendChild(a);
        }
    });

    uniqueElements.ustensils.forEach(ustensil => {
        if (dropdowns.ustensils && !activeFilters.ustensils.includes(ustensil)) {
            const a = document.createElement('a');
            a.textContent = ustensil;
            a.addEventListener('click', () => addFilter('ustensils', ustensil));
            dropdowns.ustensils.appendChild(a);
        }
    });

    uniqueElements.appliances.forEach(appliance => {
        if (dropdowns.appliances && activeFilters.appliance !== appliance) {
            const a = document.createElement('a');
            a.textContent = appliance;
            a.addEventListener('click', () => addFilter('appliance', appliance));
            dropdowns.appliances.appendChild(a);
        }
    });
}

// Fonction pour ouvrir/fermer les dropdowns
function myFunction(dropdownId) {
    closeAllDropdowns();
    document.getElementById(dropdownId).classList.toggle("show");
}

// Fonction pour fermer tous les dropdowns
function closeAllDropdowns() {
    const dropdowns = document.getElementsByClassName("dropdown-content");
    Array.from(dropdowns).forEach(dropdown => {
        if (dropdown.classList.contains("show")) {
            dropdown.classList.remove("show");
        }
    });
}

// Fonction pour filtrer les éléments dans les dropdowns
function filterDropdown(dropdownId) {
    // Trouver l'input à l'intérieur du dropdown au lieu d'utiliser le sélecteur avec #
    const input = document.querySelector(`#${dropdownId} input`);
    const filter = input.value.toUpperCase();
    const dropdown = document.getElementById(dropdownId);
    const links = dropdown.getElementsByTagName("a");

    Array.from(links).forEach(link => {
        const txtValue = link.textContent || link.innerText;
        link.style.display = txtValue.toUpperCase().includes(filter) ? "" : "none";
    });
}
function openDropdowns(dropdownId) {
  closeAllDropdowns();
  document.getElementById(dropdownId).classList.toggle("show");
}
// Fonction pour ajouter un filtre
function addFilter(type, value) {
    if (type === 'appliance') {
        activeFilters.appliance = value;
    } else if (!activeFilters[type].includes(value)) {
        activeFilters[type].push(value);
    }
    applyFilters();
    displayActiveFilters();
}

// Fonction pour appliquer les filtres
function applyFilters() {
    const filteredRecipes = recipes.filter(recipe => {
        const ingredientsMatch = activeFilters.ingredients.length === 0 ||
            activeFilters.ingredients.every(ing =>
                recipe.ingredients.some(ri => ri.ingredient.toLowerCase() === ing.toLowerCase())
            );
            
        const ustensilsMatch = activeFilters.ustensils.length === 0 ||
            activeFilters.ustensils.every(ust =>
                recipe.ustensils.some(ru => ru.toLowerCase() === ust.toLowerCase())
            );
            
        const applianceMatch = !activeFilters.appliance ||
            recipe.appliance.toLowerCase() === activeFilters.appliance.toLowerCase();
            
        return ingredientsMatch && ustensilsMatch && applianceMatch;
    });

    const uniqueElements = extractUniqueElements(filteredRecipes);
    populateDropdowns(uniqueElements);
    displayRecipes(filteredRecipes);
    displayRecipeCount(filteredRecipes.length);
}

// Fonction pour rechercher des recettes
function searchRecipesBasic(searchTerm) {
    if (!recipes || !recipes.length) return [];
    
    const searchInput = searchTerm.toLowerCase();
    return recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchInput) ||
        recipe.description.toLowerCase().includes(searchInput) ||
        recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(searchInput))
    );
}

// Fonction pour afficher un message d'erreur
function displayErrorMessage(message) {
    const container = document.getElementById('container-card');
    container.innerHTML = `<p class="error-message">${message}</p>`;
    displayRecipeCount(0);
}

// Fonction pour afficher le nombre de recettes
function displayRecipeCount(count) {
    const countElement = document.getElementById('recipe-count');
    if (countElement) {
        countElement.textContent = `${count} recettes trouvées`;
    }
}

// Événement DOMContentLoaded pour initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
    fetchRecipes();
    
    const searchForm = document.getElementById('form-recherche-hero');
    const searchInput = document.getElementById('champ-recherche-recette');
    const filterInput = document.getElementById('myInput');
    
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchTerm = searchInput.value;
            if (searchTerm.length >= 3) {
                const results = searchRecipesBasic(searchTerm);
                const filteredResults = applyFiltersToResults(results);
                displayRecipes(filteredResults);
                displayRecipeCount(filteredResults.length);
            } else if (searchTerm.length === 0) {
                const filteredResults = applyFiltersToResults(recipes);
                displayRecipes(filteredResults);
                displayRecipeCount(filteredResults.length);
            } else {
                displayErrorMessage("Veuillez entrer au moins 3 caractères pour effectuer une recherche.");
            }
        });

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value;
            if (searchTerm.length >= 3) {
                const results = searchRecipesBasic(searchTerm);
                const filteredResults = applyFiltersToResults(results);
                displayRecipes(filteredResults);
                displayRecipeCount(filteredResults.length);
            } else if (searchTerm.length === 0) {
                const filteredResults = applyFiltersToResults(recipes);
                displayRecipes(filteredResults);
                displayRecipeCount(filteredResults.length);
            } else {
                displayErrorMessage("Veuillez entrer au moins 3 caractères pour effectuer une recherche.");
            }
        });
    }
    
    if (filterInput) {
        filterInput.addEventListener('input', filterDropdown);
        filterInput.addEventListener('click', (e) => e.stopPropagation());
    }

    window.addEventListener('click', (event) => {
        if (!event.target.matches('.dropbtn')) {
            closeAllDropdowns();
        }
    });
});

