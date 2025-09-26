"use client"

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, Video, X, Check, AlertCircle } from "lucide-react"
import { toast } from "sonner"

const VIDEO_FORMATS = ['mp4', 'mov', 'avi', 'mkv', 'webm']
const MAX_FILE_SIZE = 1024 * 1024 * 1024 // 1GB

export default function VideoUpload({ 
  onUploadComplete, 
  onUploadError, 
  uploadUrl = '/api/admin/videos/upload/',
  className = "",
  showPreview = true
}) {
  const fileInputRef = useRef(null)
  const [videoFile, setVideoFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [videoPreview, setVideoPreview] = useState(null)
  const [uploadedData, setUploadedData] = useState(null)

  const handleFileSelect = (file) => {
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
    setUploadedData(null)
    
    // Create preview URL
    if (showPreview) {
      const previewUrl = URL.createObjectURL(file)
      setVideoPreview(previewUrl)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    const videoFile = files.find(file => VIDEO_FORMATS.includes(file.name.split('.').pop().toLowerCase()))
    
    if (videoFile) {
      handleFileSelect(videoFile)
    }
  }

  const uploadVideo = async () => {
    if (!videoFile) return
    
    const formData = new FormData()
    formData.append('video_file', videoFile)
    
    try {
      setIsUploading(true)
      setUploadStatus('Uploading video to Cloudinary...')
      setUploadProgress(0)
      
      // Simulate progress (in real implementation, you'd track actual progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + Math.random() * 10
        })
      }, 200)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${uploadUrl}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: formData
      })
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      if (!response.ok) {
        throw new Error('Video upload failed')
      }
      
      const result = await response.json()
      setUploadStatus('Video uploaded successfully!')
      setUploadedData(result.data)
      
      if (onUploadComplete) {
        onUploadComplete(result.data)
      }
      
      return result.data
      
    } catch (error) {
      console.error('Video upload error:', error)
      setUploadStatus('Upload failed')
      toast.error('Failed to upload video. Please try again.')
      
      if (onUploadError) {
        onUploadError(error)
      }
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  const removeVideo = () => {
    setVideoFile(null)
    setVideoPreview(null)
    setUploadedData(null)
    setUploadProgress(0)
    setUploadStatus('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
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
            {showPreview && videoPreview && (
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
        onChange={(e) => handleFileSelect(e.target.files[0])}
        className="hidden"
      />

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{uploadStatus}</span>
            <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {/* Upload Status */}
      {uploadStatus && !isUploading && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          {uploadedData ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          <span className="text-sm font-medium text-green-700">{uploadStatus}</span>
        </div>
      )}

      {/* Upload Button */}
      {videoFile && !uploadedData && !isUploading && (
        <Button onClick={uploadVideo} className="w-full">
          <Upload className="mr-2 h-4 w-4" />
          Upload Video
        </Button>
      )}
    </div>
  )
}
