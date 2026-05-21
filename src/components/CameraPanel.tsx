'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, CameraOff, RefreshCw, Lock } from 'lucide-react'
import { SessionState } from './SessionControls'

type CameraStatus = 'idle' | 'requesting' | 'granted' | 'denied'

interface CameraPanelProps {
  sessionState: SessionState
  exerciseName: string
  /** When false, camera access is blocked until preview is completed */
  cameraAllowed?: boolean
}

export function CameraPanel({
  sessionState,
  exerciseName,
  cameraAllowed = false,
}: CameraPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('idle')
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = useCallback(async () => {
    if (!cameraAllowed) return
    setCameraStatus('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraStatus('granted')
    } catch {
      setCameraStatus('denied')
    }
  }, [cameraAllowed])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) videoRef.current.srcObject = null
    setCameraStatus('idle')
  }, [])

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  useEffect(() => {
    if (!cameraAllowed) {
      stopCamera()
    }
  }, [cameraAllowed, stopCamera])

  const isActive = sessionState === 'active' || sessionState === 'paused'

  return (
    <motion.div
      layout
      className="relative bg-[#1A1A16] rounded-3xl overflow-hidden"
      style={{ aspectRatio: '16/10' }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
        style={{ display: cameraStatus === 'granted' ? 'block' : 'none' }}
      />

      <AnimatePresence mode="wait">
        {cameraStatus === 'idle' && !cameraAllowed && (
          <motion.div
            key="gated"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center"
            >
              <Camera size={28} className="text-white/50" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-xs"
            >
              <p className="font-display text-xl text-white/80 font-light mb-1">Preview first</p>
              <p className="font-body text-sm text-white/40 leading-relaxed">
                Complete the exercise preview, then you can connect your camera for live guidance.
              </p>
            </motion.div>
          </motion.div>
        )}

        {cameraStatus === 'idle' && cameraAllowed && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8"
          >
            <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center">
              <Camera size={28} className="text-white/60" />
            </div>
            <motion.div className="text-center">
              <p className="font-display text-xl text-white/80 font-light mb-1">Ready when you are</p>
              <p className="font-body text-sm text-white/40">
                Enable your camera to begin posture guidance
              </p>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: 'rgba(122,158,110,0.9)' }}
              whileTap={{ scale: 0.97 }}
              onClick={startCamera}
              className="flex items-center gap-2 px-6 py-2.5 bg-sage-500/80 text-white rounded-xl font-body text-sm font-medium"
            >
              <Camera size={15} />
              Enable Camera
            </motion.button>
          </motion.div>
        )}

        {cameraStatus === 'requesting' && (
          <motion.div
            key="requesting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            >
              <RefreshCw size={28} className="text-white/60" />
            </motion.div>
            <p className="font-body text-sm text-white/50">Requesting camera access…</p>
          </motion.div>
        )}

        {cameraStatus === 'denied' && cameraAllowed && (
          <motion.div
            key="denied"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8"
          >
            <motion.div className="w-14 h-14 rounded-3xl bg-warm-100/10 flex items-center justify-center">
              <Lock size={24} className="text-warm-300" />
            </motion.div>
            <motion.div className="text-center">
              <p className="font-display text-lg text-white/70 font-light mb-1">Camera access needed</p>
              <p className="font-body text-xs text-white/35 max-w-xs leading-relaxed">
                We could not reach your camera. Check that Somerva is allowed to use the camera in your browser
                settings, then try again. You can still read the guidance below without the camera.
              </p>
            </motion.div>
            <button
              type="button"
              onClick={startCamera}
              className="font-body text-xs text-sage-400 underline underline-offset-2 hover:text-sage-300"
            >
              Try again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {cameraStatus === 'granted' && (
        <div className="absolute inset-0 pointer-events-none">
          {[
            'top-4 left-4 border-t-2 border-l-2',
            'top-4 right-4 border-t-2 border-r-2',
            'bottom-4 left-4 border-b-2 border-l-2',
            'bottom-4 right-4 border-b-2 border-r-2',
          ].map((cls, i) => (
            <div
              key={i}
              className={`absolute w-6 h-6 ${cls} border-white/30 rounded-sm`}
            />
          ))}

          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/30 backdrop-blur-sm rounded-full">
              <motion.div
                animate={isActive ? { opacity: [1, 0.3, 1] } : { opacity: 0.4 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-sage-400' : 'bg-white/40'}`}
              />
              <span className="font-body text-xs text-white/70">
                {isActive ? `Observing · ${exerciseName}` : 'Session paused'}
              </span>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="px-3 py-2 bg-black/20 backdrop-blur-sm rounded-xl text-center">
              <span className="font-body text-xs text-white/40">
                Pose tracking · AI feedback · Ready for MediaPipe integration
              </span>
            </div>
          </div>

          <div className="absolute bottom-16 right-4 pointer-events-auto">
            <button
              type="button"
              onClick={stopCamera}
              className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
            >
              <CameraOff size={14} className="text-white/60" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
