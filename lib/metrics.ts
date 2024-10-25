export function euclideanDistance(vec1: number[], vec2: number[]): number {
  const maxLength = Math.max(vec1.length, vec2.length);
  let sum = 0;
  
  for (let i = 0; i < maxLength; i++) {
    const diff = (vec1[i] || 0) - (vec2[i] || 0);
    sum += diff * diff;
  }
  
  return Math.sqrt(sum);
}

export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  const maxLength = Math.max(vec1.length, vec2.length);
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  for (let i = 0; i < maxLength; i++) {
    const v1 = vec1[i] || 0;
    const v2 = vec2[i] || 0;
    dotProduct += v1 * v2;
    norm1 += v1 * v1;
    norm2 += v2 * v2;
  }
  
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}