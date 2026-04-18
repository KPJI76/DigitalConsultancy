import { useState } from 'react'
import { useContent } from '../../../contexts/ContentContext'
import { Plus, Edit2, Trash2, Eye, EyeOff, Youtube, Search, X, Save, Clock, Play } from 'lucide-react'

const emptyVideo = {
  title: '',
  description: '',
  youtubeUrl: '',
  thumbnail: '',
  category: 'SAP',
  date: new Date().toISOString().split('T')[0] ?? '',
  duration: '10:00',
  published: false,
}

const VideoManager = () => {
  const { content, addVideo, updateVideo, deleteVideo, toggleVideoPublish } = useContent()
  const [isEditing, setIsEditing] = useState(false)
  const [editingVideo, setEditingVideo] = useState<typeof emptyVideo>(emptyVideo)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const handleAdd = () => {
    setEditingVideo(emptyVideo)
    setEditingId(null)
    setIsEditing(true)
  }

  const handleEdit = (video: typeof content.videos[0]) => {
    setEditingVideo({
      title: video.title,
      description: video.description,
      youtubeUrl: video.youtubeUrl,
      thumbnail: video.thumbnail,
      category: video.category,
      date: video.date,
      duration: video.duration,
      published: video.published,
    })
    setEditingId(video.id)
    setIsEditing(true)
  }

  const handleSave = () => {
    if (!editingVideo.title || !editingVideo.youtubeUrl) {
      alert('Title and YouTube URL are required')
      return
    }

    if (editingId) {
      updateVideo(editingId, editingVideo)
    } else {
      addVideo(editingVideo)
    }
    setIsEditing(false)
    setEditingVideo(emptyVideo)
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      deleteVideo(id)
    }
  }

  const filteredVideos = content.videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getYoutubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    const id = match?.[2]
    return id && id.length === 11 ? id : null
  }

  const getYoutubeThumbnail = (url: string): string | null => {
    const videoId = getYoutubeVideoId(url)
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Youtube className="text-red-500" />
            YouTube Videos
          </h3>
          <p className="text-white/50 text-sm mt-1">Manage your video content</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-cyan text-navy font-semibold rounded-lg hover:bg-white transition-all"
        >
          <Plus size={18} />
          Add Video
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search videos..."
          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/50 text-sm">Total Videos</p>
          <p className="text-2xl font-bold text-white">{content.videos.length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/50 text-sm">Published</p>
          <p className="text-2xl font-bold text-green-400">{content.videos.filter(v => v.published).length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/50 text-sm">Drafts</p>
          <p className="text-2xl font-bold text-yellow-400">{content.videos.filter(v => !v.published).length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/50 text-sm">Total Views</p>
          <p className="text-2xl font-bold text-cyan">{content.videos.reduce((sum, v) => sum + v.views, 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Videos List */}
      <div className="space-y-3">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className={`bg-white/5 border rounded-xl p-4 transition-all ${
              video.published ? 'border-white/10' : 'border-yellow-500/30 bg-yellow-500/5'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Thumbnail */}
              <div className="w-full lg:w-40 aspect-video bg-navy rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                {getYoutubeThumbnail(video.youtubeUrl) ? (
                  <img
                    src={getYoutubeThumbnail(video.youtubeUrl)!}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Play size={24} className="text-white/30" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                    video.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {video.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="px-2 py-0.5 bg-cyan/10 text-cyan text-xs font-medium rounded">
                    {video.category}
                  </span>
                  <span className="flex items-center gap-1 text-white/40 text-xs">
                    <Clock size={12} />
                    {video.duration}
                  </span>
                </div>
                <h4 className="text-white font-medium truncate">{video.title}</h4>
                <p className="text-white/50 text-sm line-clamp-1 mt-1">{video.description}</p>
                <div className="flex items-center gap-4 mt-2 text-white/40 text-sm">
                  <span>{video.views} views</span>
                  <span>{video.likes} likes</span>
                  <span>{video.date}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleVideoPublish(video.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    video.published
                      ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                      : 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                  }`}
                  title={video.published ? 'Unpublish' : 'Publish'}
                >
                  {video.published ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button
                  onClick={() => handleEdit(video)}
                  className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                  title="Edit"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(video.id)}
                  className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredVideos.length === 0 && (
          <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl">
            <Youtube size={48} className="mx-auto text-white/20 mb-4" />
            <p className="text-white/50">No videos found</p>
            <button
              onClick={handleAdd}
              className="mt-4 text-cyan hover:text-white transition-colors"
            >
              Add your first video
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-navy border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                {editingId ? 'Edit Video' : 'Add New Video'}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Video Title *</label>
                <input
                  type="text"
                  value={editingVideo.title}
                  onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan"
                  placeholder="Enter video title"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">YouTube URL *</label>
                <input
                  type="url"
                  value={editingVideo.youtubeUrl}
                  onChange={(e) => setEditingVideo({ ...editingVideo, youtubeUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan"
                  placeholder="https://youtube.com/watch?v=..."
                />
                <p className="text-white/40 text-xs mt-1">Paste the full YouTube video URL</p>
              </div>

              {/* Thumbnail Preview */}
              {getYoutubeThumbnail(editingVideo.youtubeUrl) && (
                <div>
                  <label className="block text-sm text-white/60 mb-2">Thumbnail Preview</label>
                  <div className="aspect-video bg-navy rounded-lg overflow-hidden max-w-sm">
                    <img
                      src={getYoutubeThumbnail(editingVideo.youtubeUrl)!}
                      alt="Video thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Category</label>
                  <select
                    value={editingVideo.category}
                    onChange={(e) => setEditingVideo({ ...editingVideo, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan"
                  >
                    <option value="SAP" className="bg-navy">SAP</option>
                    <option value="Salesforce" className="bg-navy">Salesforce</option>
                    <option value="AI & Technology" className="bg-navy">AI & Technology</option>
                    <option value="Tutorial" className="bg-navy">Tutorial</option>
                    <option value="Case Study" className="bg-navy">Case Study</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Duration</label>
                  <input
                    type="text"
                    value={editingVideo.duration}
                    onChange={(e) => setEditingVideo({ ...editingVideo, duration: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan"
                    placeholder="10:00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Date</label>
                  <input
                    type="date"
                    value={editingVideo.date}
                    onChange={(e) => setEditingVideo({ ...editingVideo, date: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Thumbnail Label</label>
                  <input
                    type="text"
                    value={editingVideo.thumbnail}
                    onChange={(e) => setEditingVideo({ ...editingVideo, thumbnail: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan"
                    placeholder="Video thumbnail text"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Description</label>
                <textarea
                  value={editingVideo.description}
                  onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan resize-none"
                  placeholder="Enter video description"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                <input
                  type="checkbox"
                  id="published"
                  checked={editingVideo.published}
                  onChange={(e) => setEditingVideo({ ...editingVideo, published: e.target.checked })}
                  className="w-5 h-5 rounded border-white/20 bg-white/5 text-cyan focus:ring-cyan"
                />
                <label htmlFor="published" className="text-white cursor-pointer">
                  Publish immediately
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-white/70 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-cyan text-navy font-semibold rounded-lg hover:bg-white transition-all"
              >
                <Save size={18} />
                {editingId ? 'Update Video' : 'Add Video'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoManager
