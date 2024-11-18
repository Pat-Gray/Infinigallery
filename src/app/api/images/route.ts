import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q');
    const page = searchParams.get('page') || '1';

    if (!searchQuery) {
      return NextResponse.json({ error: 'No search terms provided' }, { status: 400 });
    }

    const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
    const url = new URL('https://api.unsplash.com/search/photos');
    
    url.searchParams.append('query', searchQuery);
    url.searchParams.append('per_page', '30');
    url.searchParams.append('page', page);
    url.searchParams.append('order_by', 'relevant');
    
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });

    if (!response.ok) {
      console.error('Unsplash API error:', response.status, await response.text());
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data.results || []);

  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}