import { useState } from 'react'
import { useContent } from '../../../contexts/ContentContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog'
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Eye, 
  EyeOff,
  Calendar,
  Clock,
  Tag,
  Search,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react'

const emptyArticle = {
  title: '',
  excerpt: '',
  content: '',
  category: '',
  date: new Date().toISOString().split('T')[0] ?? '',
  readTime: '5 min read',
  image: '',
  tags: [] as string[],
  published: false,
}

const ArticlesManager = () => {
  const { content, addArticle, updateArticle, deleteArticle, toggleArticlePublish } = useContent()
  const [searchQuery, setSearchQuery] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editingArticle, setEditingArticle] = useState<typeof emptyArticle>(emptyArticle)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const getArticleUrl = (slug: string) => {
    return `${window.location.origin}${import.meta.env.BASE_URL}article/${slug}`
  }

  const copyArticleLink = (slug: string, id: string) => {
    const url = getArticleUrl(slug)
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredArticles = content.articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleNew = () => {
    setEditingArticle(emptyArticle)
    setEditingId(null)
    setIsEditing(true)
  }

  const handleEdit = (article: typeof content.articles[0]) => {
    setEditingArticle({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      date: article.date,
      readTime: article.readTime,
      image: article.image,
      tags: [...article.tags],
      published: article.published,
    })
    setEditingId(article.id)
    setIsEditing(true)
  }

  const handleSave = () => {
    if (editingId) {
      updateArticle(editingId, editingArticle)
    } else {
      addArticle(editingArticle)
    }
    setIsEditing(false)
    setEditingArticle(emptyArticle)
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      deleteArticle(id)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !editingArticle.tags.includes(tagInput.trim())) {
      setEditingArticle({
        ...editingArticle,
        tags: [...editingArticle.tags, tagInput.trim()],
      })
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setEditingArticle({
      ...editingArticle,
      tags: editingArticle.tags.filter(t => t !== tag),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Articles Manager</h2>
          <p className="text-white/60">Create, edit, and manage your blog articles.</p>
        </div>
        <Button
          onClick={handleNew}
          className="bg-cyan text-navy hover:bg-white"
        >
          <Plus size={18} className="mr-2" />
          New Article
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles..."
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
        />
      </div>

      {/* Articles List */}
      <div className="space-y-3">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:border-white/20 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-white font-medium">{article.title}</h3>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  article.published 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-orange/20 text-orange'
                }`}>
                  {article.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-white/40">
                <span>{article.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {article.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye size={12} /> {article.views}
                </span>
                <span className="flex items-center gap-1">
                  <Tag size={12} /> {article.tags.length}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {article.published && (
                <>
                  <button
                    onClick={() => copyArticleLink(article.slug, article.id)}
                    className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 hover:bg-blue-500/20"
                    title="Copy shareable link"
                  >
                    {copiedId === article.id ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  <a
                    href={getArticleUrl(article.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 hover:bg-purple-500/20"
                    title="View article"
                  >
                    <ExternalLink size={16} />
                  </a>
                </>
              )}
              <button
                onClick={() => toggleArticlePublish(article.id)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  article.published
                    ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                    : 'bg-orange/10 text-orange hover:bg-orange/20'
                }`}
                title={article.published ? 'Unpublish' : 'Publish'}
              >
                {article.published ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button
                onClick={() => handleEdit(article)}
                className="w-9 h-9 rounded-lg bg-cyan/10 flex items-center justify-center text-cyan hover:bg-cyan/20"
                title="Edit"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(article.id)}
                className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-navy border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingId ? 'Edit Article' : 'New Article'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={editingArticle.title}
                onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                placeholder="Article title"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
              />
            </div>

            {/* Category & Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={editingArticle.category}
                  onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                  placeholder="e.g., AI & Technology"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={editingArticle.date}
                  onChange={(e) => setEditingArticle({ ...editingArticle, date: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
                />
              </div>
            </div>

            {/* Read Time & Image */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock size={14} /> Read Time
                </Label>
                <Input
                  value={editingArticle.readTime}
                  onChange={(e) => setEditingArticle({ ...editingArticle, readTime: e.target.value })}
                  placeholder="e.g., 8 min read"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
                />
              </div>
              <div className="space-y-2">
                <Label>Image Description</Label>
                <Input
                  value={editingArticle.image}
                  onChange={(e) => setEditingArticle({ ...editingArticle, image: e.target.value })}
                  placeholder="e.g., AI visualization"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea
                value={editingArticle.excerpt}
                onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                placeholder="Brief summary of the article..."
                rows={2}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label>Content (HTML)</Label>
              <Textarea
                value={editingArticle.content}
                onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                placeholder="<p>Your article content here...</p>"
                rows={10}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan font-mono text-sm"
              />
              <p className="text-white/40 text-xs">Supports HTML tags: &lt;p&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;li&gt;, etc.</p>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add a tag and press Enter"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
                />
                <Button
                  type="button"
                  onClick={addTag}
                  variant="outline"
                  className="border-cyan text-cyan hover:bg-cyan hover:text-navy"
                >
                  <Plus size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {editingArticle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-cyan/20 text-cyan rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Published */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                checked={editingArticle.published}
                onChange={(e) => setEditingArticle({ ...editingArticle, published: e.target.checked })}
                className="w-5 h-5 rounded border-white/30 bg-white/5 text-cyan focus:ring-cyan"
              />
              <Label htmlFor="published" className="cursor-pointer">
                Publish immediately
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-cyan text-navy hover:bg-white"
            >
              {editingId ? 'Save Changes' : 'Create Article'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ArticlesManager
