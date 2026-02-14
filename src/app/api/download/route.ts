import { NextRequest, NextResponse } from 'next/server'

// Platform detection patterns
const platformPatterns: Record<string, RegExp[]> = {
  YouTube: [
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i,
    /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/.+/i,
  ],
  Instagram: [
    /^(https?:\/\/)?(www\.)?instagram\.com\/(p|reel|reels|tv)\/.+/i,
    /^(https?:\/\/)?(www\.)?instagram\.com\/stories\/.+/i,
  ],
  TikTok: [
    /^(https?:\/\/)?(www\.)?(tiktok\.com|vm\.tiktok\.com)\/.+/i,
  ],
  Twitter: [
    /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/\w+\/status\/.+/i,
  ],
  Facebook: [
    /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch|m\.facebook\.com)\/.+/i,
  ],
  SoundCloud: [
    /^(https?:\/\/)?(www\.)?soundcloud\.com\/.+/i,
  ],
  Spotify: [
    /^(https?:\/\/)?(open\.)?spotify\.com\/(track|album|playlist|artist)\/.+/i,
  ],
  Pinterest: [
    /^(https?:\/\/)?(www\.)?(pinterest\.com|pin\.it)\/.+/i,
  ],
  Vimeo: [
    /^(https?:\/\/)?(www\.)?vimeo\.com\/.+/i,
  ],
  Dailymotion: [
    /^(https?:\/\/)?(www\.)?dailymotion\.com\/.+/i,
    /^(https?:\/\/)?(www\.)?dai\.ly\/.+/i,
  ],
}

// Mock data for each platform
const mockData: Record<string, {
  titles: string[]
  thumbnails: string[]
  durations: string[]
  baseOptions: Array<{ quality: string; format: string; size: string }>
}> = {
  YouTube: {
    titles: [
      'Cara Membuat Website Modern dengan Next.js',
      'Tutorial React untuk Pemula - Lengkap',
      'Tips Produktivitas untuk Developer',
    ],
    thumbnails: [
      'https://picsum.photos/seed/yt1/640/360',
      'https://picsum.photos/seed/yt2/640/360',
      'https://picsum.photos/seed/yt3/640/360',
    ],
    durations: ['10:30', '25:45', '1:15:00'],
    baseOptions: [
      { quality: '2160p (4K)', format: 'mp4', size: '850MB' },
      { quality: '1080p', format: 'mp4', size: '250MB' },
      { quality: '720p', format: 'mp4', size: '120MB' },
      { quality: '480p', format: 'mp4', size: '60MB' },
      { quality: '360p', format: 'mp4', size: '35MB' },
      { quality: 'Audio Only', format: 'mp3', size: '8MB' },
    ],
  },
  Instagram: {
    titles: [
      'Reel Viral: Tips Fotografi',
      'Story Highlights - Travelling',
      'Post: Kuliner Nusantara',
    ],
    thumbnails: [
      'https://picsum.photos/seed/ig1/640/640',
      'https://picsum.photos/seed/ig2/640/640',
      'https://picsum.photos/seed/ig3/640/640',
    ],
    durations: ['0:30', '0:15', '1:00'],
    baseOptions: [
      { quality: 'HD', format: 'mp4', size: '25MB' },
      { quality: 'SD', format: 'mp4', size: '12MB' },
      { quality: 'Story Size', format: 'mp4', size: '15MB' },
    ],
  },
  TikTok: {
    titles: [
      'Dance Challenge Terbaru 2024',
      'Life Hack yang Wajib Kamu Tahu',
      'Tutorial Makeup Simple',
    ],
    thumbnails: [
      'https://picsum.photos/seed/tt1/640/640',
      'https://picsum.photos/seed/tt2/640/640',
      'https://picsum.photos/seed/tt3/640/640',
    ],
    durations: ['0:15', '0:30', '1:00'],
    baseOptions: [
      { quality: 'No Watermark', format: 'mp4', size: '8MB' },
      { quality: 'With Watermark', format: 'mp4', size: '10MB' },
      { quality: 'Audio Only', format: 'mp3', size: '2MB' },
    ],
  },
  Twitter: {
    titles: [
      'Thread: Tips Kerja Remote',
      'Video Viral: Kucing Lucu',
      'Breaking News Update',
    ],
    thumbnails: [
      'https://picsum.photos/seed/tw1/640/360',
      'https://picsum.photos/seed/tw2/640/360',
      'https://picsum.photos/seed/tw3/640/360',
    ],
    durations: ['0:45', '1:30', '2:15'],
    baseOptions: [
      { quality: 'HD', format: 'mp4', size: '18MB' },
      { quality: 'SD', format: 'mp4', size: '8MB' },
      { quality: 'GIF', format: 'gif', size: '5MB' },
    ],
  },
  Facebook: {
    titles: [
      'Video Dokumenter: Keindahan Indonesia',
      'Live Stream: Konser Musik',
      'Reels: Tips Memasak',
    ],
    thumbnails: [
      'https://picsum.photos/seed/fb1/640/360',
      'https://picsum.photos/seed/fb2/640/360',
      'https://picsum.photos/seed/fb3/640/360',
    ],
    durations: ['15:30', '1:45:00', '0:45'],
    baseOptions: [
      { quality: 'HD', format: 'mp4', size: '180MB' },
      { quality: 'SD', format: 'mp4', size: '75MB' },
      { quality: 'Audio Only', format: 'mp3', size: '12MB' },
    ],
  },
  SoundCloud: {
    titles: [
      'Mixtape: Chill Beats 2024',
      'Podcast: Teknologi Masa Depan',
      'Original Song - Indie Artist',
    ],
    thumbnails: [
      'https://picsum.photos/seed/sc1/500/500',
      'https://picsum.photos/seed/sc2/500/500',
      'https://picsum.photos/seed/sc3/500/500',
    ],
    durations: ['45:00', '1:20:00', '3:45'],
    baseOptions: [
      { quality: '320kbps', format: 'mp3', size: '15MB' },
      { quality: '256kbps', format: 'mp3', size: '12MB' },
      { quality: '128kbps', format: 'mp3', size: '6MB' },
    ],
  },
  Spotify: {
    titles: [
      'Top Hits Indonesia 2024',
      'Podcast: Motivasi Harian',
      'Album: Musik Relaksasi',
    ],
    thumbnails: [
      'https://picsum.photos/seed/sp1/640/640',
      'https://picsum.photos/seed/sp2/640/640',
      'https://picsum.photos/seed/sp3/640/640',
    ],
    durations: ['3:45', '25:00', '4:30'],
    baseOptions: [
      { quality: 'High (320kbps)', format: 'mp3', size: '8MB' },
      { quality: 'Medium (160kbps)', format: 'mp3', size: '4MB' },
      { quality: 'Low (96kbps)', format: 'mp3', size: '2MB' },
    ],
  },
  Pinterest: {
    titles: [
      'DIY Home Decor Ideas',
      'Recipe: Healthy Smoothie Bowl',
      'Travel Photography Tips',
    ],
    thumbnails: [
      'https://picsum.photos/seed/pi1/640/960',
      'https://picsum.photos/seed/pi2/640/960',
      'https://picsum.photos/seed/pi3/640/960',
    ],
    durations: ['-', '-', '-'],
    baseOptions: [
      { quality: 'Original', format: 'png', size: '5MB' },
      { quality: 'Large', format: 'jpg', size: '2MB' },
      { quality: 'Medium', format: 'jpg', size: '500KB' },
    ],
  },
  Vimeo: {
    titles: [
      'Short Film: The Journey',
      'Documentary: Ocean Life',
      'Music Video: Indie Band',
    ],
    thumbnails: [
      'https://picsum.photos/seed/vm1/640/360',
      'https://picsum.photos/seed/vm2/640/360',
      'https://picsum.photos/seed/vm3/640/360',
    ],
    durations: ['12:30', '45:00', '4:15'],
    baseOptions: [
      { quality: '4K', format: 'mp4', size: '2GB' },
      { quality: '1080p', format: 'mp4', size: '500MB' },
      { quality: '720p', format: 'mp4', size: '250MB' },
      { quality: 'SD', format: 'mp4', size: '100MB' },
    ],
  },
  Dailymotion: {
    titles: [
      'Gaming Highlights: Best Moments',
      'Music Cover: Popular Songs',
      'Vlog: Daily Life',
    ],
    thumbnails: [
      'https://picsum.photos/seed/dm1/640/360',
      'https://picsum.photos/seed/dm2/640/360',
      'https://picsum.photos/seed/dm3/640/360',
    ],
    durations: ['8:45', '5:30', '15:00'],
    baseOptions: [
      { quality: '1080p', format: 'mp4', size: '200MB' },
      { quality: '720p', format: 'mp4', size: '100MB' },
      { quality: '480p', format: 'mp4', size: '50MB' },
      { quality: 'Audio Only', format: 'mp3', size: '10MB' },
    ],
  },
}

function detectPlatform(url: string): string | null {
  for (const [platform, patterns] of Object.entries(platformPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(url)) {
        return platform
      }
    }
  }
  return null
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
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

    const platform = detectPlatform(url)

    if (!platform) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Platform tidak didukung. Pastikan URL dari platform yang didukung.' 
        },
        { status: 400 }
      )
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const platformData = mockData[platform]
    const randomIndex = Math.floor(Math.random() * platformData.titles.length)

    return NextResponse.json({
      success: true,
      platform,
      title: platformData.titles[randomIndex],
      thumbnail: platformData.thumbnails[randomIndex],
      duration: platformData.durations[randomIndex],
      options: platformData.baseOptions,
    })
  } catch (error) {
    console.error('Download API error:', error)
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan saat memproses permintaan' },
      { status: 500 }
    )
  }
}
