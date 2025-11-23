import { NextResponse } from 'next/server';

// Proxy OPTIONS (preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Proxy POST to external API
export async function POST(request: Request) {
  try {
    const body = await request.text(); // forward raw body
    const targetUrl = 'http://vunph.id.vn/api/login';

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('content-type') || 'application/json',
      },
      body,
    });

    // preserve content type from upstream
    const contentType = res.headers.get('content-type') || 'application/json';
    const text = await res.text();

    return new NextResponse(text, {
      status: res.status,
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (err: any) {
    return new NextResponse(JSON.stringify({ message: 'Proxy error: ' + (err?.message || 'Unknown') }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
