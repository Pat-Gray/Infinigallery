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

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getRedditToken() {
  // Return cached token if still valid (expires in 1 hour)
  if (cachedToken && tokenExpiry > Date.now()) {
    return cachedToken;
  }

  const auth = Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64');
  const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const tokenData = await tokenResponse.json();
  cachedToken = tokenData.access_token;
  tokenExpiry = Date.now() + (55 * 60 * 1000); // Set expiry to 55 minutes
  return cachedToken;
}

async function fetchWithRetry(url: string, options: RequestInit, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      
      // If token might be expired, clear cache and retry
      if (response.status === 403) {
        cachedToken = null;
        // Wait a bit before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      
      throw new Error(`Reddit API request failed: ${response.status}`);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries reached');
}

export async function GET() {
  try {
    const token = await getRedditToken();
    
    const response = await fetchWithRetry(
      'https://oauth.reddit.com/r/all/top.json?limit=100&t=day',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Agent': 'Mozilla/5.0 (compatible; Infinigallery/1.0; +http://localhost:3000)'
        }
      }
    );

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