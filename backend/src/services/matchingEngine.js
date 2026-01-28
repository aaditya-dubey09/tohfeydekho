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

  // 6. Expert rating (Weight: 0.5)
  score += (product.expert_rating / 5) * 0.5;

  return score;
};

const getRecommendations = async (quizData) => {
  // Initial filtering: Relation and Budget
  const products = await Product.find({
    is_visible: true,
    $or: [
      { relation_tags: quizData.relation },
      { relation_tags: 'universal' }
    ],
    budget_range: quizData.budget_segment
  });

  const scoredProducts = products.map(product => ({
    product,
    score: calculateScore(product, quizData)
  }));

  // Sort by score descending and take top 9
  return scoredProducts
    .sort((a, b) => b.score - a.score)
    .slice(0, 9)
    .map(item => ({
      ...item.product.toObject(),
      match_score: item.score.toFixed(1)
    }));
};

export { getRecommendations };
