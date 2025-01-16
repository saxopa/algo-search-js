function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.classList.add('card');
    
    const content = `
        <img src="./assets/img-plat/${recipe.image}" alt="${recipe.name}" />
        <figcaption>
          <h2 class="recipe-name">${recipe.name}</h2>
          <h3>RECETTE</h3>
          <p id="recette-info">${recipe.description}</p>
          <h3>INGRÉDIENTS</h3>
          <div id="container-ingredients">
            ${recipe.ingredients.map(ingredient => `
              <div class="card-ingredientdose">
                <h class="ingredient-name">${ingredient.ingredient}</h>
                <p class="dose-ingredient">
                  ${ingredient.quantity || ""} ${ingredient.unit || ""}
                </p>
              </div>
            `).join('')}
          </div>
        </figcaption>
    `;
    
    card.innerHTML = content;
    document.getElementById('container-card').appendChild(card);
}

function displayRecipes(recipes) {
    const container = document.getElementById('container-card');
    container.innerHTML = '';
    recipes.forEach(createRecipeCard);
}
