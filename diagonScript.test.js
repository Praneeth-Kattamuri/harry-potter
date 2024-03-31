
const findSimilarPotions = require('./successScript');


const allIngredients = [
    { potionSlug: 'potion1', ingredients: 'ingredient1, ingredient2' },
    { potionSlug: 'potion2', ingredients: 'ingredient2, ingredient3' },
    { potionSlug: 'potion3', ingredients: 'ingredient3, ingredient4' },
];

describe('findSimilarPotions function', () => {
    test('should return an array of similar potions', () => {
        const potionNames = ['potion1', 'potion2'];

        const similarPotions = findSimilarPotions(potionNames, allIngredients);

        expect(similarPotions).toEqual(['potion3']);
    });

    test('should return an empty array if no similar potions found', () => {
        const potionNames = ['potion1', 'potion3'];

        const similarPotions = findSimilarPotions(potionNames, allIngredients);

        expect(similarPotions).toEqual(['potion2']);
    });

    test('should handle empty input', () => {
        const potionNames = [];

        const similarPotions = findSimilarPotions(potionNames, allIngredients);

        expect(similarPotions).toEqual([]);
    });
});
