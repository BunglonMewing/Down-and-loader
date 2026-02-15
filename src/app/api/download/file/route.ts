import { NextRequest } from 'next/server'
import { spawn } from 'child_process'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  const filename = searchParams.get('filename') || 'video.mp4'

  if (!url) {
    return new Response('Missing URL', { status: 400 })
  }

  // We use yt-dlp to stream the content because it handles headers, cookies, and throttling better than a simple fetch
  // Especially for YouTube which blocks direct server-side fetches
  try {
    const child = spawn('yt-dlp', [
      '-o', '-',
      '--no-playlist',
      '--no-warnings',
      url
    ]);

    const headers = new Headers()
    headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`)
    headers.set('Content-Type', 'application/octet-stream')

    // Create a ReadableStream from the child process stdout
    const stream = new ReadableStream({
      start(controller) {
        child.stdout.on('data', (data) => {
          controller.enqueue(data);
        });
        child.stdout.on('end', () => {
          controller.close();
        });
        child.on('error', (err) => {
          controller.error(err);
        });
      },
      cancel() {
        child.kill();
      }
    });

    return new Response(stream, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error('Download proxy error:', error)
    return new Response('Failed to download video', { status: 500 })
  }
}
