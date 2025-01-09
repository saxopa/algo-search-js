// Stocke l'état des filtres sélectionnés par l'utilisateur
let activeFilters = {
    ingredients: [], // Liste des ingrédients sélectionnés
    ustensils: [],  // Liste des ustensiles sélectionnés
    appliance: null // Appareil sélectionné (un seul possible)
};
//Ajout du Container HTML pour les filtres actifs
const filterContainer = document.createElement('div');
filterContainer.id = 'active-filters-container';
document.querySelector('#container-filtre').after(filterContainer);

function displayActiveFilters() {
    const filterContainer = document.getElementById('active-filters-container');
    filterContainer.innerHTML = '';
    
    // Afficher les ingrédients actifs
    activeFilters.ingredients.forEach(ingredient => {
        const filterTag = document.createElement('span');
        filterTag.classList.add('filter-tag');
        filterTag.innerHTML = `${ingredient} <button class="remove-filter">×</button>`;
        
        filterTag.querySelector('.remove-filter').addEventListener('click', () => {
            activeFilters.ingredients = activeFilters.ingredients.filter(i => i !== ingredient);
            applyFilters();
            displayRecipes()
            displayActiveFilters();
            
        });
        
        filterContainer.appendChild(filterTag);
    });
    
    // Afficher l'appareil actif
    if (activeFilters.appliance) {
        const filterTag = document.createElement('span');
        filterTag.classList.add('filter-tag');
        filterTag.innerHTML = `${activeFilters.appliance} <button class="remove-filter">×</button>`;
        
        filterTag.querySelector('.remove-filter').addEventListener('click', () => {
            activeFilters.appliance = null;
            applyFilters();
            displayActiveFilters();
            
        });
        
        filterContainer.appendChild(filterTag);
    }

    if (activeFilters.ustensils) {
        const filterTag = document.createElement('span');
        filterTag.classList.add('filter-tag');
        filterTag.innerHTML = `${activeFilters.ustensils} <button class="remove-filter">×</button>`;
        
        filterTag.querySelector('.remove-filter').addEventListener('click', () => {
            activeFilters.ustensils = null;
            applyFilters();
            displayActiveFilters();
        });
        
        filterContainer.appendChild(filterTag);
    }
}


// Charge les recettes depuis le fichier JSON et initialise l'interface
async function fetchRecipes() {
    try {
        const response = await fetch('data/recipe.json');
        if (!response.ok) throw new Error('Erreur de chargement des recettes');
        const recipes = await response.json();
        const uniqueElements = extractUniqueElements(recipes);
        populateDropdowns(uniqueElements);
        displayRecipes(recipes);
    } catch (error) {
        console.error('Erreur :', error);
    }
}

// Extrait les listes uniques d'ingrédients, ustensiles et appareils de toutes les recettes
function extractUniqueElements(recipes) {
    const ingredients = new Set();
    const ustensils = new Set();
    const appliances = new Set();

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ing => ingredients.add(ing.ingredient));
        recipe.ustensils.forEach(ust => ustensils.add(ust));
        appliances.add(recipe.appliance);
    });

    // Retourne les listes triées par ordre alphabétique
    return {
        ingredients: [...ingredients].sort(),
        ustensils: [...ustensils].sort(),
        appliances: [...appliances].sort()
    };
}

function populateDropdowns(uniqueElements) {
    // Sélectionne les conteneurs dropdown
    const ingredientsDropdown = document.getElementById('myDropdowningredients');
    const ustensilsDropdown = document.getElementById('myDropdownustensiles');
    const appliancesDropdown = document.getElementById('myDropdownappreil');
    
    // Sauvegarde les champs de recherche existants
    const searchInputs = {};
    ['ingredients', 'ustensiles', 'appreil'].forEach(type => {
        const input = document.querySelector(`#myDropdown${type} input`);
        if (input) {
            searchInputs[type] = input;
        }
    });
    
    // Vide les conteneurs
    ingredientsDropdown.innerHTML = '';
    ustensilsDropdown.innerHTML = '';
    appliancesDropdown.innerHTML = '';
    
    // Restaure les champs de recherche
    Object.entries(searchInputs).forEach(([type, input]) => {
        document.querySelector(`#myDropdown${type}`).prepend(input);
    });
    
    // Ajoute les nouveaux éléments
    uniqueElements.ingredients.forEach(ingredient => {
        const a = document.createElement('a');
        a.textContent = ingredient;
        a.addEventListener('click', () => addFilter('ingredients', ingredient));
        ingredientsDropdown.appendChild(a);
    });
    
    uniqueElements.ustensils.forEach(ustensil => {
        const a = document.createElement('a');
        a.textContent = ustensil;
        a.addEventListener('click', () => addFilter('ustensils', ustensil));
        ustensilsDropdown.appendChild(a);
    });
    
    uniqueElements.appliances.forEach(appliance => {
        const a = document.createElement('a');
        a.textContent = appliance;
        a.addEventListener('click', () => addFilter('appliance', appliance));
        appliancesDropdown.appendChild(a);
    });
}


// Gère l'ouverture/fermeture des menus déroulants
function myFunction(dropdownId) {
    closeAllDropdowns();
    document.getElementById(dropdownId).classList.toggle("show");
}

// Ferme tous les menus déroulants ouverts
function closeAllDropdowns() {
    const dropdowns = document.getElementsByClassName("dropdown-content");

    Array.from(dropdowns).forEach(dropdown => {
        if (dropdown.classList.contains("show")) {
            dropdown.classList.remove("show");
        }
    });
}

// Filtre les éléments dans les menus déroulants selon la recherche
function filterFunction() {
    const input = document.getElementById("myInput");
    const filter = input.value.toUpperCase();
    const dropdowns = document.getElementsByClassName("dropdown-content");
    input.addEventListener('click', (e) => e.stopPropagation());


    Array.from(dropdowns).forEach(dropdown => {
        const links = dropdown.getElementsByTagName("a");
        Array.from(links).forEach(link => {
            const txtValue = link.textContent || link.innerText;
            link.style.display = txtValue.toUpperCase().includes(filter) ? "" : "none";
        });
    });

}



// Ajoute un nouveau filtre à la sélection active
function addFilter(type, value) {
    if (type === 'appliance') {
        activeFilters.appliance = value;
    } else if (!activeFilters[type].includes(value)) {
        activeFilters[type].push(value);
    }
    applyFilters();
    displayActiveFilters(); // Affiche les filtres actifs
}

// Applique les filtres sélectionnés aux recettes
async function applyFilters() {
    const response = await fetch('data/recipe.json');
    const recipes = await response.json();
    
    
    // Filtre les recettes selon les critères sélectionnés
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
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    fetchRecipes();
    
    // Ajoute l'écouteur d'événements pour la recherche
    const searchInput = document.getElementById('myInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterFunction);
        searchInput.addEventListener('click', (e) => e.stopPropagation());
    }

    // Ferme les menus déroulants lors d'un clic en dehors
    window.addEventListener('click', (event) => {
        if (!event.target.matches('.dropbtn' )) {
            closeAllDropdowns();

        }
    });
});

