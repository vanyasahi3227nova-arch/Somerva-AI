'use client'

/**
 * usePoseTracking — MediaPipe integration scaffold
 *
 * This hook will integrate with @mediapipe/tasks-vision (PoseLandmarker)
 * to detect body landmarks from a live video stream.
 *
 * When implemented, it will:
 * 1. Load the MediaPipe WASM + model from CDN or local
 * 2. Accept a videoRef pointing to the live camera stream
 * 3. Run requestAnimationFrame detection loop
 * 4. Emit normalized landmark positions (0–1 coordinates)
 * 5. Feed those into poseAnalysis.ts for scoring
 *
 * DO NOT implement yet — scaffold only.
 */

import { useRef, useCallback } from 'react'

export interface PoseLandmark {
  x: number
  y: number
  z: number
  visibility: number
}

export interface PoseTrackingResult {
  landmarks: PoseLandmark[]
  timestamp: number
}

export interface UsePoseTrackingOptions {
  onResult: (result: PoseTrackingResult) => void
  videoRef: React.RefObject<HTMLVideoElement>
}

export function usePoseTracking(_options: UsePoseTrackingOptions) {
  const rafRef = useRef<number | null>(null)

  const startTracking = useCallback(() => {
    // TODO: Initialize MediaPipe PoseLandmarker
    // const vision = await FilesetResolver.forVisionTasks(...)
    // const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {...})
    // Then start rAF loop calling poseLandmarker.detectForVideo(video, ts)
    console.warn('[usePoseTracking] MediaPipe not yet integrated. Scaffold only.')
  }, [])

  const stopTracking = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  return { startTracking, stopTracking, isTracking: false }
}
