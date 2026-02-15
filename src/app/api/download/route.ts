import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'

function formatDuration(seconds: number): string {
  if (!seconds) return '-'
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(hrs > 0 ? 2 : 1, '0')}:${secs.toString().padStart(2, '0')}`
}

function formatSize(bytes: number): string {
  if (!bytes) return 'Unknown'
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}

async function getYTMetadata(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const child = spawn('yt-dlp', [
      '--dump-json',
      '--no-playlist',
      '--no-warnings',
      url
    ]);

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data;
    });

    child.stderr.on('data', (data) => {
      stderr += data;
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`yt-dlp exited with code ${code}: ${stderr}`));
        return;
      }
      try {
        resolve(JSON.parse(stdout));
      } catch (err) {
        reject(new Error('Failed to parse yt-dlp output'));
      }
    });
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL tidak boleh kosong' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { success: false, error: 'Format URL tidak valid' },
        { status: 400 }
      )
    }

    try {
      const info = await getYTMetadata(url);

      // Map formats to download options
      const options = info.formats
        .filter((f: any) => f.url && (f.vcodec !== 'none' || f.acodec !== 'none'))
        .map((f: any) => ({
          quality: f.format_note || f.resolution || (f.vcodec === 'none' ? 'Audio Only' : f.height ? `${f.height}p` : 'Standard'),
          format: f.ext,
          size: formatSize(f.filesize || f.filesize_approx),
          url: f.url,
          vcodec: f.vcodec,
          acodec: f.acodec
        }))
        .filter((f: any) => {
            // Prefer formats with both video and audio, or audio only
            return (f.vcodec !== 'none' && f.acodec !== 'none') || (f.vcodec === 'none' && f.acodec !== 'none')
        })
        .sort((a: any, b: any) => {
            // Sort: Video+Audio first, then Audio only
            if (a.vcodec !== 'none' && b.vcodec === 'none') return -1
            if (a.vcodec === 'none' && b.vcodec !== 'none') return 1
            return 0
        })

      // Take unique qualities
      const uniqueOptions: any[] = []
      const seenQualities = new Set()

      for (const opt of options) {
          const key = `${opt.quality}-${opt.format}`
          if (!seenQualities.has(key)) {
              uniqueOptions.push({
                  quality: opt.quality,
                  format: opt.format,
                  size: opt.size,
                  url: opt.url
              })
              seenQualities.add(key)
          }
          if (uniqueOptions.length >= 8) break
      }

      // If no combined formats found, try to at least provide the best video and best audio
      if (uniqueOptions.length === 0 && info.formats.length > 0) {
          const best = info.formats[info.formats.length - 1]
          uniqueOptions.push({
              quality: best.format_note || 'Best Available',
              format: best.ext,
              size: formatSize(best.filesize || best.filesize_approx),
              url: best.url
          })
      }

      return NextResponse.json({
        success: true,
        platform: info.extractor_key,
        title: info.title,
        thumbnail: info.thumbnail,
        duration: formatDuration(info.duration),
        options: uniqueOptions,
      })
    } catch (err: any) {
      console.error('yt-dlp error:', err)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Gagal mengambil informasi video. Platform mungkin tidak didukung atau link salah.'
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Download API error:', error)
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan saat memproses permintaan' },
      { status: 500 }
    )
  }
}
