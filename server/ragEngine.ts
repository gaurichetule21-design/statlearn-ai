export interface DocumentChunk {
  id: string;
  documentId: string;
  chunkIndex: number;
  text: string;
  wordCount: number;
  score?: number;
}

export function chunkText(text: string, documentId: string, chunkSize = 800, overlap = 150): DocumentChunk[] {
  const cleaned = text.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
  const chunks: DocumentChunk[] = [];
  
  if (!cleaned) return chunks;

  let start = 0;
  let chunkIndex = 0;

  while (start < cleaned.length) {
    let end = start + chunkSize;
    
    // Try to find a sentence or punctuation break
    if (end < cleaned.length) {
      const breakPoint = cleaned.lastIndexOf('.', end);
      if (breakPoint > start + chunkSize / 2) {
        end = breakPoint + 1;
      }
    } else {
      end = cleaned.length;
    }

    const chunkContent = cleaned.substring(start, end).trim();
    if (chunkContent.length > 30) {
      chunks.push({
        id: `${documentId}_chunk_${chunkIndex}`,
        documentId,
        chunkIndex,
        text: chunkContent,
        wordCount: chunkContent.split(/\s+/).length,
      });
      chunkIndex++;
    }

    start = end - overlap;
    if (start >= cleaned.length || end >= cleaned.length) break;
  }

  return chunks;
}

export function detectTopics(text: string): string[] {
  const commonStatisticalTopics = [
    'Sampling',
    'Survey Design',
    'National Accounts',
    'Gross Value Added (GVA)',
    'Price Statistics',
    'Consumer Price Index (CPI)',
    'Laspeyres Formula',
    'Labour Statistics',
    'PLFS',
    'Data Quality Frameworks',
    'Python',
    'SQL',
    'GIS & Spatial Analytics',
    'AI/ML',
    'Cybersecurity',
    'Data Privacy & DPDP',
  ];

  const lower = text.toLowerCase();
  const detected: string[] = [];

  for (const topic of commonStatisticalTopics) {
    const term = topic.toLowerCase();
    if (lower.includes(term)) {
      detected.push(topic);
    }
  }

  return detected.length > 0 ? detected : ['Statistical Methodology', 'Data Quality', 'Official Statistics'];
}

export function retrieveRelevantChunks(chunks: DocumentChunk[], queryOrTopic: string, limit = 4): DocumentChunk[] {
  if (!queryOrTopic || queryOrTopic.toLowerCase() === 'all' || queryOrTopic.toLowerCase() === 'auto') {
    return chunks.slice(0, limit);
  }

  const terms = queryOrTopic.toLowerCase().split(/\s+/).filter(t => t.length > 2);

  const scored = chunks.map(chunk => {
    const chunkLower = chunk.text.toLowerCase();
    let score = 0;

    for (const term of terms) {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      const matches = chunkLower.match(regex);
      if (matches) {
        score += matches.length * 3;
      } else if (chunkLower.includes(term)) {
        score += 1;
      }
    }

    return { ...chunk, score };
  });

  scored.sort((a, b) => (b.score || 0) - (a.score || 0));
  return scored.slice(0, limit);
}
