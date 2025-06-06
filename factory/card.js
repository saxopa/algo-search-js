function displayRecipes(recipes) {
    const container = document.getElementById('container-card');
    container.innerHTML = '';
    
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        const card = document.createElement('div');
        card.classList.add('card');
        
        // Construction des ingrédients avec boucle native
        let ingredientsHTML = '';
        for (let j = 0; j < recipe.ingredients.length; j++) {
            const ingredient = recipe.ingredients[j];
            ingredientsHTML += `
                <div class="card-ingredientdose">
                    <h class="ingredient-name">${ingredient.ingredient}</h>
                    <p class="dose-ingredient">
                        ${ingredient.quantity || ""} ${ingredient.unit || ""}
                    </p>
                </div>
            `;
        }
        
        const content = `
            <img src="./assets/img-plat/${recipe.image}" alt="${recipe.name}" />
            <figcaption>
                <h2 class="recipe-name">${recipe.name}</h2>
                <h3>RECETTE</h3>
                <p id="recette-info">${recipe.description}</p>
                <h3>INGRÉDIENTS</h3>
                <div id="container-ingredients">
                    ${ingredientsHTML}
                </div>
            </figcaption>
        `;
        
        card.innerHTML = content;
        container.appendChild(card);
    }
}
