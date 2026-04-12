import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Play, Clock, Eye, Heart, X, Youtube, Calendar } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useContent } from '../contexts/ContentContext'

const Videos = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [selectedVideo, setSelectedVideo] = useState<ReturnType<typeof useContent>['content']['videos'][0] | null>(null)
  const { user, isAuthenticated } = useAuth()
  const { getPublishedVideos, incrementVideoViews, incrementVideoLikes } = useContent()
  const publishedVideos = getPublishedVideos()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headerItems = headerRef.current?.querySelectorAll('.reveal-item')
      if (headerItems?.length) {
        gsap.fromTo(headerItems, { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: headerRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }})
      }
      const cards = gridRef.current?.querySelectorAll('.video-card')
      if (cards) {
        cards.forEach((card, index) => {
          gsap.fromTo(card, { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, delay: index * 0.1, ease: 'power3.out',
              scrollTrigger: { trigger: gridRef.current, start: 'top 75%', toggleActions: 'play none none reverse' }})
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleVideoClick = (video: typeof publishedVideos[0]) => {
    setSelectedVideo(video)
    incrementVideoViews(video.id)
  }

  const handleLike = (e: React.MouseEvent, videoId: string) => {
    e.stopPropagation()
    if (!isAuthenticated) { alert('Please sign in to like videos'); return }
    incrementVideoLikes(videoId)
  }

  const isLiked = (videoId: string) => user?.likedArticles?.includes(videoId) || false

  const getYoutubeEmbedUrl = (url: string) => {
    // Extract video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : url
  }

  const getYoutubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const getYoutubeThumbnail = (url: string): string | null => {
    const videoId = getYoutubeVideoId(url)
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
  }

  return (
    <section id="videos" ref={sectionRef} className="relative py-24 lg:py-32 bg-navy overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/95 to-navy" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan/10 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-16">
          <span className="reveal-item inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 text-red-400 text-sm font-medium rounded-full mb-6">
            <Youtube size={16} />
            Video Content
          </span>
          <h2 className="reveal-item text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Latest <span className="text-cyan">Videos</span>
          </h2>
          <p className="reveal-item text-lg text-white/60 max-w-2xl mx-auto">
            Watch in-depth tutorials, guides, and insights on SAP, Salesforce, and AI technologies.
          </p>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {publishedVideos.map((video) => (
            <div
              key={video.id}
              className="video-card group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-cyan/50 transition-all cursor-pointer"
              onClick={() => handleVideoClick(video)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-navy to-navy/80 overflow-hidden">
                {getYoutubeThumbnail(video.youtubeUrl) ? (
                  <img
                    src={getYoutubeThumbnail(video.youtubeUrl)!}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to mqdefault if maxresdefault fails
                      const videoId = getYoutubeVideoId(video.youtubeUrl)
                      if (videoId) {
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                      }
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/30 text-sm">{video.thumbnail}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-cyan/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play size={28} className="text-navy ml-1" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 rounded text-xs text-white/80 flex items-center gap-1">
                  <Clock size={12} />
                  {video.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2 py-0.5 bg-cyan/10 text-cyan text-xs font-medium rounded">
                    {video.category}
                  </span>
                  <span className="flex items-center gap-1 text-white/40 text-xs">
                    <Calendar size={12} />
                    {video.date}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan transition-colors line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-white/50 text-sm line-clamp-2 mb-4">
                  {video.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-white/40 text-sm">
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {video.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={14} />
                      {video.likes}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleLike(e, video.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all ${
                      isLiked(video.id)
                        ? 'bg-pink-500/20 text-pink-400'
                        : 'bg-white/5 text-white/40 hover:text-pink-400 hover:bg-pink-500/10'
                    }`}
                  >
                    <Heart size={14} className={isLiked(video.id) ? 'fill-pink-400' : ''} />
                    Like
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {publishedVideos.length === 0 && (
          <div className="text-center py-16">
            <Youtube size={48} className="mx-auto text-white/20 mb-4" />
            <p className="text-white/50">No videos available yet. Check back soon!</p>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onClick={() => setSelectedVideo(null)}>
          <div className="w-full max-w-4xl bg-navy border border-white/10 rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Video Player */}
            <div className="relative aspect-video bg-black">
              <iframe
                src={getYoutubeEmbedUrl(selectedVideo.youtubeUrl)}
                title={selectedVideo.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            {/* Video Info */}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-cyan/10 text-cyan text-xs font-medium rounded-full">
                  {selectedVideo.category}
                </span>
                <span className="flex items-center gap-1 text-white/40 text-xs">
                  <Calendar size={12} />
                  {selectedVideo.date}
                </span>
                <span className="flex items-center gap-1 text-white/40 text-xs">
                  <Clock size={12} />
                  {selectedVideo.duration}
                </span>
              </div>
              <h2 className="text-xl lg:text-2xl font-bold text-white mb-3">{selectedVideo.title}</h2>
              <p className="text-white/60 mb-4">{selectedVideo.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-4 text-white/50 text-sm">
                  <span className="flex items-center gap-1">
                    <Eye size={16} />
                    {selectedVideo.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart size={16} />
                    {selectedVideo.likes} likes
                  </span>
                </div>
                <button
                  onClick={(e) => handleLike(e, selectedVideo.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isLiked(selectedVideo.id)
                      ? 'bg-pink-500/20 text-pink-400'
                      : 'bg-white/5 text-white/60 hover:text-pink-400'
                  }`}
                >
                  <Heart size={18} className={isLiked(selectedVideo.id) ? 'fill-pink-400' : ''} />
                  {isLiked(selectedVideo.id) ? 'Liked' : 'Like'}
                </button>
              </div>
            </div>
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default Videos
