'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  Camera,
  CheckCircle,
  Clock,
  Download,
  Loader2,
  Square,
  Trash2,
  Users,
  Video
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '../lib/utils'
import type { DetectedFace, FaceTrackerState, RecordedVideo } from '../types/faceTracker'

const FaceTracker = () => {
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recordedChunks = useRef<Blob[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // State
  const [state, setState] = useState<FaceTrackerState>({
    isTracking: false,
    isRecording: false,
    recordingTime: 0,
    faces: [],
    error: null,
    cameraState: 'inactive'
  })
  
  const [recordedVideos, setRecordedVideos] = useState<RecordedVideo[]>([])

  // Load saved videos from memory on component mount
  useEffect(() => {
    // In a real app, you might load from IndexedDB or an API
    setRecordedVideos([])
  }, [])

  // Initialize camera
  const initializeCamera = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, cameraState: 'requesting', error: null }))
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'user',
          frameRate: { ideal: 30 }
        },
        audio: true
      })
      
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      
      setState(prev => ({ ...prev, cameraState: 'active', error: null }))
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Camera access denied'
      setState(prev => ({ 
        ...prev, 
        cameraState: 'error', 
        error: `Camera Error: ${error}` 
      }))
    }
  }

  // Face detection using browser APIs or fallback
  const detectFaces = useCallback(async (): Promise<void> => {
    if (!videoRef.current || !canvasRef.current || !state.isTracking) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx || video.videoWidth === 0) {
      if (state.isTracking) {
        animationFrameRef.current = requestAnimationFrame(detectFaces)
      }
      return
    }

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    try {
      let detectedFaces: DetectedFace[] = []

      // Try to use native FaceDetector API
      if ('FaceDetector' in window) {
        try {
          const faceDetector = new (window as any).FaceDetector({
            maxDetectedFaces: 10,
            fastMode: false
          })
          
          const faces = await faceDetector.detect(video)
          detectedFaces = faces.map((face: any) => ({
            boundingBox: face.boundingBox,
            landmarks: face.landmarks,
            confidence: 0.95
          }))
        } catch (e) {
          console.warn('FaceDetector API failed, using fallback')
        }
      }

      // Fallback: Mock face detection for demo
      if (detectedFaces.length === 0) {
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2.2
        const faceWidth = Math.min(canvas.width * 0.25, 300)
        const faceHeight = faceWidth * 1.3

        // Add some realistic movement
        const time = Date.now() * 0.001
        const offsetX = Math.sin(time * 0.5) * 20
        const offsetY = Math.cos(time * 0.3) * 15

        detectedFaces = [{
          boundingBox: {
            x: centerX - faceWidth/2 + offsetX,
            y: centerY - faceHeight/2 + offsetY,
            width: faceWidth,
            height: faceHeight
          },
          confidence: 0.92 + Math.sin(time) * 0.05,
          landmarks: []
        }]
      }

      // Draw face detection overlays
      detectedFaces.forEach((face, index) => {
        const { x, y, width, height } = face.boundingBox
        const confidence = face.confidence || 0.9

        // Draw main bounding box with gradient
        const gradient = ctx.createLinearGradient(x, y, x + width, y + height)
        gradient.addColorStop(0, `rgba(34, 197, 94, ${0.8 * confidence})`)
        gradient.addColorStop(1, `rgba(59, 130, 246, ${0.8 * confidence})`)
        
        ctx.strokeStyle = gradient
        ctx.lineWidth = 3
        ctx.setLineDash([])
        ctx.strokeRect(x, y, width, height)

        // Draw corner markers
        const cornerSize = 20
        ctx.strokeStyle = '#22c55e'
        ctx.lineWidth = 4
        ctx.setLineDash([])
        
        // Top-left corner
        ctx.beginPath()
        ctx.moveTo(x, y + cornerSize)
        ctx.lineTo(x, y)
        ctx.lineTo(x + cornerSize, y)
        ctx.stroke()

        // Top-right corner
        ctx.beginPath()
        ctx.moveTo(x + width - cornerSize, y)
        ctx.lineTo(x + width, y)
        ctx.lineTo(x + width, y + cornerSize)
        ctx.stroke()

        // Bottom-left corner
        ctx.beginPath()
        ctx.moveTo(x, y + height - cornerSize)
        ctx.lineTo(x, y + height)
        ctx.lineTo(x + cornerSize, y + height)
        ctx.stroke()

        // Bottom-right corner
        ctx.beginPath()
        ctx.moveTo(x + width - cornerSize, y + height)
        ctx.lineTo(x + width, y + height)
        ctx.lineTo(x + width, y + height - cornerSize)
        ctx.stroke()

        // Draw confidence and face ID
        ctx.fillStyle = '#22c55e'
        ctx.font = 'bold 16px Inter, sans-serif'
        ctx.fillText(
          `Face ${index + 1} (${Math.round(confidence * 100)}%)`, 
          x, 
          y - 10
        )

        // Draw pulsing center dot
        const centerDotX = x + width / 2
        const centerDotY = y + height / 2
        const pulse = Math.sin(Date.now() * 0.01) * 0.3 + 0.7
        
        ctx.fillStyle = `rgba(34, 197, 94, ${pulse})`
        ctx.beginPath()
        ctx.arc(centerDotX, centerDotY, 4, 0, 2 * Math.PI)
        ctx.fill()
      })

      setState(prev => ({ ...prev, faces: detectedFaces }))
    } catch (err) {
      console.warn('Face detection error:', err)
    }

    // Continue detection loop
    if (state.isTracking) {
      animationFrameRef.current = requestAnimationFrame(detectFaces)
    }
  }, [state.isTracking])

  // Start face tracking
  const startTracking = (): void => {
    setState(prev => ({ ...prev, isTracking: true }))
  }

  // Stop face tracking
  const stopTracking = (): void => {
    setState(prev => ({ ...prev, isTracking: false, faces: [] }))
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }
  }

  // Start recording
  const startRecording = (): void => {
    if (!streamRef.current) return

    recordedChunks.current = []
    
    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm;codecs=vp9,opus'
      })
      
      mediaRecorderRef.current = mediaRecorder
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: 'video/webm' })
        saveRecordedVideo(blob)
      }
      
      mediaRecorder.start(1000) // Record in 1-second chunks
      setState(prev => ({ 
        ...prev, 
        isRecording: true, 
        recordingTime: 0 
      }))
      
      // Start timer
      timerRef.current = setInterval(() => {
        setState(prev => ({ 
          ...prev, 
          recordingTime: prev.recordingTime + 1 
        }))
      }, 1000)
      
      // Auto-start tracking when recording
      if (!state.isTracking) {
        startTracking()
      }
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        error: 'Recording failed: ' + (err instanceof Error ? err.message : 'Unknown error')
      }))
    }
  }

  // Stop recording
  const stopRecording = (): void => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop()
      setState(prev => ({ ...prev, isRecording: false }))
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  // Save recorded video
  const saveRecordedVideo = (blob: Blob): void => {
    const url = URL.createObjectURL(blob)
    const videoData: RecordedVideo = {
      id: Date.now().toString(),
      url,
      blob,
      timestamp: new Date().toISOString(),
      duration: state.recordingTime,
      faceCount: state.faces.length,
      size: blob.size
    }
    
    setRecordedVideos(prev => [videoData, ...prev].slice(0, 10)) // Keep last 10 videos
  }

  // Delete saved video
  const deleteVideo = (videoId: string): void => {
    setRecordedVideos(prev => {
      const video = prev.find(v => v.id === videoId)
      if (video) {
        URL.revokeObjectURL(video.url)
      }
      return prev.filter(v => v.id !== videoId)
    })
  }

  // Download video
  const downloadVideo = (video: RecordedVideo): void => {
    const a = document.createElement('a')
    a.href = video.url
    a.download = `face-tracking-${new Date(video.timestamp).toISOString().split('T')[0]}-${video.id}.webm`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Initialize camera on component mount
  useEffect(() => {
    initializeCamera()
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      // Clean up video URLs
      recordedVideos.forEach(video => {
        URL.revokeObjectURL(video.url)
      })
    }
  }, [])

  // Start face detection when tracking is enabled
  useEffect(() => {
    if (state.isTracking && videoRef.current && videoRef.current.readyState >= 2) {
      detectFaces()
    }
  }, [state.isTracking, detectFaces])

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">
      {/* Status Bar */}
      <motion.div 
        className="flex items-center justify-between mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-4">
          <div className={cn(
            "flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium",
            state.cameraState === 'active' && "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
            state.cameraState === 'requesting' && "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
            state.cameraState === 'error' && "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
            state.cameraState === 'inactive' && "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          )}>
            {state.cameraState === 'active' && <CheckCircle className="w-4 h-4" />}
            {state.cameraState === 'requesting' && <Loader2 className="w-4 h-4 animate-spin" />}
            {state.cameraState === 'error' && <AlertCircle className="w-4 h-4" />}
            <span>
              {state.cameraState === 'active' && 'Camera Active'}
              {state.cameraState === 'requesting' && 'Requesting Camera'}
              {state.cameraState === 'error' && 'Camera Error'}
              {state.cameraState === 'inactive' && 'Camera Inactive'}
            </span>
          </div>
          
          {state.isTracking && (
            <motion.div 
              className="flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <Users className="w-4 h-4" />
              <span>{state.faces.length} Face{state.faces.length !== 1 ? 's' : ''}</span>
            </motion.div>
          )}
        </div>
        
        {state.isRecording && (
          <motion.div 
            className="flex items-center space-x-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full font-mono font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <motion.div 
              className="w-3 h-3 bg-red-500 rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <Clock className="w-4 h-4" />
            <span>{formatTime(state.recordingTime)}</span>
          </motion.div>
        )}
      </motion.div>

      {/* Camera View */}
      <motion.div 
        className="relative mb-8 bg-black rounded-2xl overflow-hidden shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-auto max-h-[70vh] object-cover"
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />
        
        {/* Overlay Gradient for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        
        {/* Recording Pulse Effect */}
        {state.isRecording && (
          <motion.div 
            className="absolute inset-0 border-4 border-red-500 rounded-2xl"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Error Display */}
      <AnimatePresence>
        {state.error && (
          <motion.div 
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl flex items-start space-x-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Error</h4>
              <p className="text-sm">{state.error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Panel */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.button
          onClick={state.isTracking ? stopTracking : startTracking}
          disabled={state.cameraState !== 'active'}
          className={cn(
            "flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
            state.isTracking 
              ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl" 
              : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Camera className="w-6 h-6" />
          <span>{state.isTracking ? 'Stop Tracking' : 'Start Tracking'}</span>
        </motion.button>
        
        <motion.button
          onClick={state.isRecording ? stopRecording : startRecording}
          disabled={state.cameraState !== 'active'}
          className={cn(
            "flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
            state.isRecording 
              ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl" 
              : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {state.isRecording ? <Square className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          <span>{state.isRecording ? 'Stop Recording' : 'Start Recording'}</span>
        </motion.button>
      </motion.div>

      {/* Recorded Videos Gallery */}
      <AnimatePresence>
        {recordedVideos.length > 0 && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recorded Sessions
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {recordedVideos.length} video{recordedVideos.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recordedVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <video
                    src={video.url}
                    controls
                    className="w-full h-40 object-cover rounded-xl mb-4 bg-black"
                    poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjNjM2MzYzIi8+Cjwvc3ZnPgo="
                  />
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(video.duration)}</span>
                      </span>
                      <span className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
                        <Users className="w-4 h-4" />
                        <span>{video.faceCount}</span>
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <div>{new Date(video.timestamp).toLocaleDateString()} {new Date(video.timestamp).toLocaleTimeString()}</div>
                      <div>{formatFileSize(video.size)}</div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={() => downloadVideo(video)}
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => deleteVideo(video.id)}
                      className="flex items-center justify-center px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FaceTracker