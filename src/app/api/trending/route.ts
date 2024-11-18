import { NextResponse } from 'next/server';

// Extended stop words list
const stopWords = new Set([
  // Basic stop words
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'this', 'but', 'they', 'have', 'had', 'what', 'when',
  'where', 'who', 'which', 'why', 'how', 'all', 'any', 'both', 'each', 'few',
  'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'can', 'just', 'should', 'now',
  
  // Reddit-specific terms to filter
  'reddit', 'upvote', 'downvote', 'karma', 'post', 'thread', 'subreddit',
  
  // Common temporal words
  'today', 'yesterday', 'tomorrow', 'week', 'month', 'year', 'time', 'day',
  'morning', 'evening', 'night', 'ago', 'later', 'soon', 'never',
  
  // Common verbs
  'think', 'know', 'make', 'like', 'time', 'just', 'look', 'people', 'want',
  'first', 'well', 'way', 'even', 'new', 'good', 'take', 'year', 'into', 'last',
  'over', 'would', 'after',
  
  // Common internet terms
  'video', 'photo', 'picture', 'pic', 'update', 'post', 'website', 'online',
  'internet', 'web', 'click', 'link', 'site', 'tweet', 'share'
]);

function extractKeywords(titles: string[]): { word: string; count: number }[] {
  const wordFrequency = new Map<string, number>();

  titles.forEach(title => {
    const words = title.toLowerCase()
      .replace(/[^a-zA-Z\s]/g, '')
      .split(/\s+/)
      .filter(word => 
        word.length > 5 && // Filter out short words
        !stopWords.has(word) // Filter out stop words
      );

    words.forEach(word => {
      wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
    });
  });

  return Array.from(wordFrequency.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20); // Get top 20 keywords
}

export async function GET() {
  try {
    const response = await fetch(
      'https://www.reddit.com/r/all/top.json?limit=100&t=day',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Infinigallery/1.0; +http://localhost:3000)'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Reddit API request failed: ${response.status}`);
    }

    const data = await response.json();
    const titles = data.data.children.map((post: any) => post.data.title);
    const keywords = extractKeywords(titles);

    return NextResponse.json({ keywords });

  } catch (error) {
    console.error('Error fetching trending keywords:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending keywords' },
      { status: 500 }
    );
  }
} 