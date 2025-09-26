"use client"

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Upload, 
  Video, 
  Image, 
  X, 
  Check, 
  AlertCircle,
  Loader2,
  Plus,
  BookOpen,
  DollarSign,
  Clock
} from "lucide-react"
import { toast } from "sonner"

const VIDEO_FORMATS = ['mp4', 'mov', 'avi', 'mkv', 'webm']
const MAX_FILE_SIZE = 1024 * 1024 * 1024 // 1GB

export default function CourseCreateClientPage() {
  const router = useRouter()
  const fileInputRef = useRef(null)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: 0,
    is_free: false,
    duration_hours: 0,
    level: 'beginner',
    tags: '',
    video_source: 'upload'
  })
  
  // Video upload state
  const [videoFile, setVideoFile] = useState(null)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [videoPreview, setVideoPreview] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  
  // Form validation
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle file selection
  const handleVideoFileSelect = (file) => {
    if (!file) return
    
    // Validate file
    const fileExtension = file.name.split('.').pop().toLowerCase()
    if (!VIDEO_FORMATS.includes(fileExtension)) {
      toast.error(`Invalid file format. Supported formats: ${VIDEO_FORMATS.join(', ')}`)
      return
    }
    
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size cannot exceed 1GB')
      return
    }
    
    setVideoFile(file)
    setErrors({ ...errors, video: null })
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setVideoPreview(previewUrl)
  }

  const handleThumbnailFileSelect = (file) => {
    if (!file) return
    
    // Validate image file
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }
    
    setThumbnailFile(file)
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setThumbnailPreview(previewUrl)
  }

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    const videoFile = files.find(file => VIDEO_FORMATS.includes(file.name.split('.').pop().toLowerCase()))
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (videoFile) {
      handleVideoFileSelect(videoFile)
    }
    if (imageFile) {
      handleThumbnailFileSelect(imageFile)
    }
  }

  // Upload video to backend
  const uploadVideo = async () => {
    if (!videoFile) return null
    
    const formData = new FormData()
    formData.append('video_file', videoFile)
    
    try {
      setIsUploading(true)
      setUploadStatus('Uploading video to Cloudinary...')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/videos/upload/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Video upload failed')
      }
      
      const result = await response.json()
      setUploadStatus('Video uploaded successfully!')
      return result.data
      
    } catch (error) {
      console.error('Video upload error:', error)
      toast.error('Failed to upload video. Please try again.')
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  // Upload thumbnail to backend
  const uploadThumbnail = async () => {
    if (!thumbnailFile) return null
    
    const formData = new FormData()
    formData.append('image_file', thumbnailFile)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/images/upload/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Thumbnail upload failed')
      }
      
      const result = await response.json()
      return result.data
      
    } catch (error) {
      console.error('Thumbnail upload error:', error)
      toast.error('Failed to upload thumbnail. Course will use auto-generated thumbnail.')
      return null
    }
  }

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})
    
    try {
      // Validate form
      const newErrors = {}
      if (!formData.title.trim()) newErrors.title = 'Course title is required'
      if (!formData.description.trim()) newErrors.description = 'Course description is required'
      if (!formData.category) newErrors.category = 'Course category is required'
      if (!videoFile && formData.video_source === 'upload') newErrors.video = 'Video file is required'
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }
      
      // Upload files
      let videoData = null
      let thumbnailData = null
      
      if (videoFile) {
        videoData = await uploadVideo()
      }
      
      if (thumbnailFile) {
        thumbnailData = await uploadThumbnail()
      }
      
      // Prepare course data
      const courseData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        duration_hours: parseFloat(formData.duration_hours) || 0,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        video_file: videoData?.url || null,
        thumbnail: thumbnailData?.url || null,
        video_public_id: videoData?.public_id || null,
        thumbnail_public_id: thumbnailData?.public_id || null
      }
      
      // Create course
      setUploadStatus('Creating course...')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/courses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(courseData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to create course')
      }
      
      const result = await response.json()
      toast.success('Course created successfully!')
      router.push('/admin/courses')
      
    } catch (error) {
      console.error('Course creation error:', error)
      toast.error(error.message || 'Failed to create course')
    } finally {
      setIsSubmitting(false)
    }
  }

  const removeVideo = () => {
    setVideoFile(null)
    setVideoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeThumbnail = () => {
    setThumbnailFile(null)
    setThumbnailPreview(null)
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Course</h1>
        <p className="text-gray-600">Upload videos and create comprehensive NCLEX courses for your students.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Course Information
            </CardTitle>
            <CardDescription>Basic details about your course</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., NCLEX-RN Fundamentals"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rn-prep">NCLEX-RN Preparation</SelectItem>
                    <SelectItem value="pn-prep">NCLEX-PN Preparation</SelectItem>
                    <SelectItem value="fundamentals">Nursing Fundamentals</SelectItem>
                    <SelectItem value="pharmacology">Pharmacology</SelectItem>
                    <SelectItem value="medical-surgical">Medical-Surgical Nursing</SelectItem>
                    <SelectItem value="pediatrics">Pediatric Nursing</SelectItem>
                    <SelectItem value="maternity">Maternity Nursing</SelectItem>
                    <SelectItem value="psychiatric">Psychiatric Nursing</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Course Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what students will learn in this course..."
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration_hours">Duration (Hours)</Label>
                <Input
                  id="duration_hours"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.duration_hours}
                  onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="level">Difficulty Level</Label>
                <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="NCLEX, nursing, fundamentals"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Course Video
            </CardTitle>
            <CardDescription>Upload your course introduction video</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Video File *</Label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {videoFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <Video className="h-8 w-8 text-green-500" />
                      <span className="font-medium text-green-700">{videoFile.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeVideo()
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Size: {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                    {videoPreview && (
                      <video
                        src={videoPreview}
                        controls
                        className="max-w-md mx-auto rounded-lg"
                        style={{ maxHeight: '200px' }}
                      />
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">Drop your video here</p>
                      <p className="text-sm text-gray-500">or click to browse files</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      Supports: {VIDEO_FORMATS.join(', ')} • Max size: 1GB
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept={VIDEO_FORMATS.map(format => `.${format}`).join(',')}
                onChange={(e) => handleVideoFileSelect(e.target.files[0])}
                className="hidden"
              />
              {errors.video && <p className="text-sm text-red-500">{errors.video}</p>}
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{uploadStatus}</span>
                  <span className="text-sm text-gray-500">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Thumbnail Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Course Thumbnail
            </CardTitle>
            <CardDescription>Optional: Upload a custom thumbnail (auto-generated if not provided)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Thumbnail Image</Label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('thumbnail-input')?.click()}
              >
                {thumbnailFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <Image className="h-6 w-6 text-green-500" />
                      <span className="font-medium text-green-700">{thumbnailFile.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeThumbnail()
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {thumbnailPreview && (
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="max-w-xs mx-auto rounded-lg"
                        style={{ maxHeight: '150px' }}
                      />
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Image className="h-8 w-8 text-gray-400 mx-auto" />
                    <div>
                      <p className="font-medium text-gray-700">Drop thumbnail here</p>
                      <p className="text-sm text-gray-500">or click to browse</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      Supports: JPG, PNG, GIF • Max size: 10MB
                    </p>
                  </div>
                )}
              </div>
              <input
                id="thumbnail-input"
                type="file"
                accept="image/*"
                onChange={(e) => handleThumbnailFileSelect(e.target.files[0])}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing
            </CardTitle>
            <CardDescription>Set the course price and availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_free"
                checked={formData.is_free}
                onChange={(e) => setFormData({ ...formData, is_free: e.target.checked, price: e.target.checked ? 0 : formData.price })}
                className="rounded"
              />
              <Label htmlFor="is_free">Make this course free</Label>
            </div>
            
            {!formData.is_free && (
              <div className="space-y-2">
                <Label htmlFor="price">Price (NGN)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="100"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="min-w-[120px]"
          >
            {isSubmitting || isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUploading ? 'Uploading...' : 'Creating...'}
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Course
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Upload Status */}
      {uploadStatus && (
        <Alert className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadStatus}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
