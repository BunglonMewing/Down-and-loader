'use client'

import { useState, useCallback } from 'react'
import { 
  Download, 
  Youtube, 
  Instagram, 
  Music, 
  Video, 
  Image as ImageIcon,
  ClipboardPaste,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  FileVideo,
  FileAudio,
  FileImage,
  Clock,
  HardDrive
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

// Platform configuration
const platforms = [
  { name: 'YouTube', icon: Youtube, color: 'text-red-500', bgColor: 'bg-red-500/10 hover:bg-red-500/20' },
  { name: 'Instagram', icon: Instagram, color: 'text-pink-500', bgColor: 'bg-pink-500/10 hover:bg-pink-500/20' },
  { name: 'TikTok', icon: Music, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10 hover:bg-cyan-500/20' },
  { name: 'Twitter/X', icon: Video, color: 'text-sky-500', bgColor: 'bg-sky-500/10 hover:bg-sky-500/20' },
  { name: 'Facebook', icon: Video, color: 'text-blue-600', bgColor: 'bg-blue-600/10 hover:bg-blue-600/20' },
  { name: 'SoundCloud', icon: Music, color: 'text-orange-500', bgColor: 'bg-orange-500/10 hover:bg-orange-500/20' },
  { name: 'Spotify', icon: Music, color: 'text-green-500', bgColor: 'bg-green-500/10 hover:bg-green-500/20' },
  { name: 'Pinterest', icon: ImageIcon, color: 'text-red-600', bgColor: 'bg-red-600/10 hover:bg-red-600/20' },
  { name: 'Vimeo', icon: Video, color: 'text-blue-500', bgColor: 'bg-blue-500/10 hover:bg-blue-500/20' },
  { name: 'Dailymotion', icon: Video, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10 hover:bg-indigo-500/20' },
]

interface DownloadOption {
  quality: string
  format: string
  size: string
  url: string
}

interface DownloadResult {
  success: boolean
  platform?: string
  title?: string
  thumbnail?: string
  duration?: string
  options?: DownloadOption[]
  error?: string
}

export default function Home() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<DownloadResult | null>(null)
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [downloadComplete, setDownloadComplete] = useState<number | null>(null)

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text)
    } catch (err) {
      console.error('Failed to read clipboard')
    }
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim() || isLoading) return

    setIsLoading(true)
    setResult(null)
    setDownloadComplete(null)

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: 'Gagal menghubungi server. Silakan coba lagi.',
      })
    } finally {
      setIsLoading(false)
    }
  }, [url, isLoading])

  const handleDownload = useCallback((index: number) => {
    if (!result?.options?.[index]) return

    setDownloadingIndex(index)
    setDownloadProgress(0)
    setDownloadComplete(null)

    const option = result.options[index]

    // Simulate download progress then trigger actual download
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setDownloadingIndex(null)
          setDownloadComplete(index)

          // Use the proxy route to ensure cross-origin downloads work correctly
          const filename = `${result.title || 'video'}.${option.format}`
          const proxyUrl = `/api/download/file?url=${encodeURIComponent(option.url)}&filename=${encodeURIComponent(filename)}`

          const link = document.createElement('a')
          link.href = proxyUrl
          link.setAttribute('download', filename)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          return 100
        }
        return prev + Math.random() * 25
      })
    }, 150)
  }, [result])

  const getPlatformIcon = (platformName: string) => {
    const normalized = platformName.toLowerCase()
    const platform = platforms.find(p =>
      p.name.toLowerCase() === normalized ||
      normalized.includes(p.name.toLowerCase())
    )
    return platform?.icon || Video
  }

  const getPlatformColor = (platformName: string) => {
    const normalized = platformName.toLowerCase()
    const platform = platforms.find(p =>
      p.name.toLowerCase() === normalized ||
      normalized.includes(p.name.toLowerCase())
    )
    return platform?.color || 'text-gray-500'
  }

  const getFormatIcon = (format: string) => {
    if (['mp4', 'mov', 'avi', 'webm'].includes(format.toLowerCase())) return FileVideo
    if (['mp3', 'wav', 'flac', 'aac'].includes(format.toLowerCase())) return FileAudio
    if (['jpg', 'png', 'gif', 'webp'].includes(format.toLowerCase())) return FileImage
    return FileVideo
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-16 pb-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white/80">Gratis & Tanpa Batas</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Unduh Video & Musik
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Dari Semua Platform
              </span>
            </h1>
            
            <p className="text-lg text-white/60 max-w-2xl mx-auto mb-8">
              Download video, musik, dan gambar dari YouTube, Instagram, TikTok, 
              Twitter, Facebook, Spotify, dan platform lainnya dengan mudah dan cepat.
            </p>
          </div>
        </section>

        {/* Platform Icons */}
        <section className="pb-8 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              {platforms.map((platform) => {
                const Icon = platform.icon
                return (
                  <div
                    key={platform.name}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${platform.bgColor} backdrop-blur-sm border border-white/10 transition-all duration-300 cursor-default`}
                  >
                    <Icon className={`w-4 h-4 ${platform.color}`} />
                    <span className="text-sm text-white/80">{platform.name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Main Download Section */}
        <section className="pb-16 px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-white text-center">
                  Masukkan URL untuk Mengunduh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="url"
                        placeholder="Tempel link YouTube, Instagram, TikTok, dll..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400 focus:ring-purple-400/20"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePaste}
                      className="h-12 px-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <ClipboardPaste className="w-4 h-4 mr-2" />
                      Tempel
                    </Button>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={!url.trim() || isLoading}
                    className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium shadow-lg shadow-purple-500/25 transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5 mr-2" />
                        Analisis & Download
                      </>
                    )}
                  </Button>
                </form>

                {/* Error Result */}
                {result && !result.success && (
                  <div className="mt-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <p className="text-red-200">{result.error}</p>
                    </div>
                  </div>
                )}

                {/* Success Result */}
                {result && result.success && (
                  <div className="mt-6 space-y-4">
                    {/* Video/Content Info */}
                    <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="relative w-32 h-20 md:w-40 md:h-24 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                        {result.thumbnail && (
                          <img
                            src={result.thumbnail}
                            alt={result.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        {result.duration && result.duration !== '-' && (
                          <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 rounded text-xs text-white flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {result.duration}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {(() => {
                            const PlatformIcon = getPlatformIcon(result.platform || '')
                            return (
                              <>
                                <PlatformIcon className={`w-4 h-4 ${getPlatformColor(result.platform || '')}`} />
                                <Badge variant="secondary" className="bg-white/10 text-white/80 border-white/10">
                                  {result.platform}
                                </Badge>
                              </>
                            )
                          })()}
                        </div>
                        <h3 className="text-white font-medium line-clamp-2">
                          {result.title}
                        </h3>
                      </div>
                    </div>

                    {/* Download Options */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-white/80 px-1">
                        Pilih Kualitas & Format:
                      </h4>
                      <div className="grid gap-2">
                        {result.options?.map((option, index) => {
                          const FormatIcon = getFormatIcon(option.format)
                          const isDownloading = downloadingIndex === index
                          const isComplete = downloadComplete === index

                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                  <FormatIcon className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-white font-medium">{option.quality}</span>
                                    <Badge variant="outline" className="text-xs border-white/20 text-white/60">
                                      .{option.format}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-1 text-sm text-white/50">
                                    <HardDrive className="w-3 h-3" />
                                    {option.size}
                                  </div>
                                </div>
                              </div>

                              <Button
                                onClick={() => handleDownload(index)}
                                disabled={isDownloading || downloadComplete !== null}
                                size="sm"
                                className={`
                                  min-w-[100px] h-9
                                  ${isComplete 
                                    ? 'bg-green-500 hover:bg-green-500 text-white' 
                                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                                  }
                                `}
                              >
                                {isDownloading ? (
                                  <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-xs">{Math.round(downloadProgress)}%</span>
                                  </div>
                                ) : isComplete ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                    Selesai
                                  </>
                                ) : (
                                  <>
                                    <Download className="w-4 h-4 mr-1" />
                                    Download
                                  </>
                                )}
                              </Button>
                            </div>
                          )
                        })}
                      </div>

                      {/* Progress Bar for Downloading */}
                      {downloadingIndex !== null && (
                        <div className="mt-3 px-1">
                          <Progress value={downloadProgress} className="h-1.5 bg-white/10" />
                          <p className="text-xs text-white/50 mt-1 text-center">
                            Sedang mengunduh... {Math.round(downloadProgress)}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features Section */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Download Cepat</h3>
                <p className="text-sm text-white/60">
                  Kecepatan download maksimal tanpa batasan
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Multi Platform</h3>
                <p className="text-sm text-white/60">
                  Mendukung 10+ platform populer
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Gratis Selamanya</h3>
                <p className="text-sm text-white/60">
                  Tanpa biaya, tanpa registrasi
                </p>
              </div>
            </div>

            {/* How to Use */}
            <div className="mt-12 p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">
                Cara Menggunakan
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Salin URL</h4>
                    <p className="text-sm text-white/60">
                      Salin link video atau musik dari platform favorit kamu
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Tempel & Analisis</h4>
                    <p className="text-sm text-white/60">
                      Tempel URL dan klik tombol untuk menganalisis
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Download</h4>
                    <p className="text-sm text-white/60">
                      Pilih kualitas dan format yang diinginkan, lalu download
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="mt-16 text-center text-white/40 text-sm">
              <p>© 2024 Universal Downloader. Semua hak dilindungi.</p>
              <p className="mt-2">
                Dibuat dengan ❤️ menggunakan Next.js & Tailwind CSS
              </p>
            </footer>
          </div>
        </section>
      </div>
    </div>
  )
}
