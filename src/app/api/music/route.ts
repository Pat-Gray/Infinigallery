import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q');

    if (!searchQuery) {
      return NextResponse.json({ error: 'No search terms provided' }, { status: 400 });
    }

    // Deezer search API endpoint
    const url = new URL('https://api.deezer.com/search');
    url.searchParams.append('q', searchQuery);
    url.searchParams.append('limit', '1'); // Get one track that matches
    url.searchParams.append('order', 'RANKING'); // Get most relevant

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data.data[0] || null);

  } catch (error) {
    console.error('Error fetching music:', error);
    return NextResponse.json(
      { error: 'Failed to fetch music' },
      { status: 500 }
    );
  }
} 