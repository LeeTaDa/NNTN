import { euclideanDistance, cosineSimilarity } from './metrics';

export interface TextCluster {
  centroid: number[];
  texts: string[];
  similarity: number;
}

export interface ClusteringMetrics {
  silhouetteScore: number;
  inertia: number;
  iterationCount: number;
}

export function preprocessText(text: string): number[] {
  const words = text.toLowerCase().split(/\s+/);
  const wordFreq: { [key: string]: number } = {};
  
  words.forEach(word => {
    if (word) wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  return Object.values(wordFreq);
}

export function kMeansClustering(
  texts: string[],
  k: number,
  maxIterations: number = 100
): { clusters: TextCluster[]; metrics: ClusteringMetrics } {
  const vectors = texts.map(preprocessText);
  let centroids = vectors.slice(0, k);
  let clusters: TextCluster[] = [];
  let iterationCount = 0;
  let prevInertia = Infinity;
  
  for (let iter = 0; iter < maxIterations; iter++) {
    clusters = Array.from({ length: k }, () => ({
      centroid: [],
      texts: [],
      similarity: 0
    }));
    
    // Assign points to clusters
    vectors.forEach((vector, idx) => {
      const distances = centroids.map(centroid => 
        cosineSimilarity(vector, centroid)
      );
      const clusterIdx = distances.indexOf(Math.max(...distances));
      clusters[clusterIdx].texts.push(texts[idx]);
    });
    
    // Update centroids
    let newCentroids = clusters.map(cluster => {
      if (cluster.texts.length === 0) return centroids[0];
      const vectors = cluster.texts.map(preprocessText);
      return vectors[0].map((_, dim) => 
        vectors.reduce((sum, vec) => sum + (vec[dim] || 0), 0) / vectors.length
      );
    });
    
    // Calculate inertia
    const inertia = clusters.reduce((sum, cluster, idx) => {
      const clusterVectors = cluster.texts.map(preprocessText);
      return sum + clusterVectors.reduce((s, vec) => 
        s + euclideanDistance(vec, newCentroids[idx]), 0
      );
    }, 0);
    
    if (Math.abs(prevInertia - inertia) < 0.001) break;
    
    prevInertia = inertia;
    centroids = newCentroids;
    iterationCount++;
  }
  
  const metrics: ClusteringMetrics = {
    silhouetteScore: calculateSilhouetteScore(clusters),
    inertia: prevInertia,
    iterationCount
  };
  
  return { clusters, metrics };
}

function calculateSilhouetteScore(clusters: TextCluster[]): number {
  // Simplified silhouette score calculation
  return clusters.reduce((score, cluster) => {
    if (cluster.texts.length < 2) return score;
    return score + cluster.similarity / clusters.length;
  }, 0);
}