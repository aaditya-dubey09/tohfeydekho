import Product from '../models/Product.model.js';

const calculateScore = (product, quizData) => {
  let score = 0;

  // 1. Relation match (Weight: 3.0)
  if (product.relation_tags.includes(quizData.relation) || product.relation_tags.includes('universal')) {
    score += 3.0;
  }

  // 2. Occasion match (Weight: 2.0)
  if (product.occasion_tags.includes(quizData.occasion)) {
    score += 2.0;
  }

  // 3. Budget match (Weight: 1.5)
  if (product.budget_range === quizData.budget_segment) {
    score += 1.5;
  }

  // 4. Emotion match (Weight: 2.0)
  if (product.emotion_tags.includes(quizData.emotion)) {
    score += 2.0;
  }

  // 5. Personality match (Weight: 1.0)
  const personalityMatches = product.personality_tags.filter(tag =>
    quizData.personality_traits.includes(tag)
  ).length;
  if (personalityMatches > 0) {
    score += 1.0;
  }
  // TODO: Consider removing expert rating from scoring criteria in future iterations after asking stakeholders.
  // 6. Expert rating (Weight: 0.5)
  score += (product.expert_rating / 5) * 0.5;

  return score;
};

const getRecommendations = async (quizData) => {
  console.log('=== MATCHING ENGINE START ===');
  console.log('Quiz data received:', quizData);
  
  // More lenient initial filtering: just get visible products
  // We'll score them all and let the best ones rise to the top
  const products = await Product.find({
    is_visible: true
  });

  console.log('Total visible products found:', products.length);

  if (products.length === 0) {
    console.log('WARNING: No visible products in database!');
    return {
      products: [],
      matchType: 'none',
      noPerfectMatch: true
    };
  }

  const scoredProducts = products.map(product => ({
    product,
    score: calculateScore(product, quizData)
  }));

  console.log('Sample scores:', scoredProducts.slice(0, 3).map(sp => ({
    name: sp.product.name,
    score: sp.score,
    relation_tags: sp.product.relation_tags,
    budget_range: sp.product.budget_range
  })));

  const toScoredProducts = (items) => items.map(item => ({
    ...item.product.toObject(),
    match_score: item.score.toFixed(1)
  }));

  // Sort by score descending and return ALL matching products (minimum score threshold: 1.0)
  const recommendations = scoredProducts
    .filter(item => item.score >= 1.0)  // At least some match
    .sort((a, b) => b.score - a.score); // Higher to lower score

  if (recommendations.length > 0) {
    console.log('=== MATCHING ENGINE END ===');
    console.log('Recommendations count:', recommendations.length);
    return {
      products: toScoredProducts(recommendations),
      matchType: 'recommendations',
      noPerfectMatch: false
    };
  }

  // No direct recommendations; return closest matches with any score > 0
  const closestMatches = scoredProducts
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (closestMatches.length > 0) {
    console.log('=== MATCHING ENGINE END ===');
    console.log('Closest matches count:', closestMatches.length);
    return {
      products: toScoredProducts(closestMatches),
      matchType: 'closest',
      noPerfectMatch: false
    };
  }

  // No matches at all; return all visible products as fallback
  console.log('=== MATCHING ENGINE END ===');
  console.log('No matches found; returning fallback products:', products.length);
  return {
    products: products.map(product => ({
      ...product.toObject(),
      match_score: null
    })),
    matchType: 'fallback',
    noPerfectMatch: true
  };
};

export { getRecommendations };
