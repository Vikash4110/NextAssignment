export interface DetectedFace {
  boundingBox: {
    x: number
    y: number
    width: number
    height: number
  }
  confidence?: number
  landmarks?: any[]
}

export interface RecordedVideo {
  id: string
  url: string
  blob: Blob
  timestamp: string
  duration: number
  faceCount: number
  size: number
}

export type CameraState = 'inactive' | 'requesting' | 'active' | 'error'

export interface FaceTrackerState {
  isTracking: boolean
  isRecording: boolean
  recordingTime: number
  faces: DetectedFace[]
  error: string | null
  cameraState: CameraState
}