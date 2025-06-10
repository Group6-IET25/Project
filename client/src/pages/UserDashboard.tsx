// Full version with persistent state using localStorage
import { useState, useRef, useCallback, useEffect } from "react"
import Webcam from "react-webcam"
import {
  Settings,
  Info,
  LogOut,
  X,
  Camera,
  StopCircle,
  AlertTriangle,
  Clock,
  Shield,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import AccidentNotification from "@/components/accident-notification"
import { motion } from "framer-motion"

export default function UserDashboard() {
  const [isRecording, setIsRecording] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [hasPermission, setHasPermission] = useState(null)
  const [showDangerAlert, setShowDangerAlert] = useState(() => {
    return JSON.parse(localStorage.getItem("showDangerAlert") || "false")
  })
  const [showConfirmation, setShowConfirmation] = useState(() => {
    return JSON.parse(localStorage.getItem("showConfirmation") || "false")
  })
  const [showSafeConfirm, setShowSafeConfirm] = useState(false)
  const [alertMessage, setAlertMessage] = useState(
    "Our system has detected a potential safety concern. Please confirm if assistance is needed."
  )
  const [timeRemaining, setTimeRemaining] = useState(() => {
    return parseInt(localStorage.getItem("timeRemaining") || "120", 10)
  })
  const [timerActive, setTimerActive] = useState(() => {
    return JSON.parse(localStorage.getItem("timerActive") || "false")
  })
  const [accident, setAccident] = useState(() => {
    return localStorage.getItem("accidentId") || null
  })

  const webcamRef = useRef(null)
  const frameInterval = useRef(null)
  const timerRef = useRef(null)
  const openTimeoutRef = useRef(null)
  const streamRef = useRef(null)
  const token = localStorage.getItem("jwt")

  const offscreenCanvas = useRef(null)
  const offscreenCtx = useRef(null)

  useEffect(() => {
    localStorage.setItem("showDangerAlert", JSON.stringify(showDangerAlert))
  }, [showDangerAlert])

  useEffect(() => {
    localStorage.setItem("showConfirmation", JSON.stringify(showConfirmation))
  }, [showConfirmation])

  useEffect(() => {
    localStorage.setItem("timeRemaining", timeRemaining.toString())
  }, [timeRemaining])

  useEffect(() => {
    localStorage.setItem("timerActive", JSON.stringify(timerActive))
  }, [timerActive])

  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 320
    canvas.height = 240
    offscreenCanvas.current = canvas
    offscreenCtx.current = canvas.getContext('2d')
  }, [])

  useEffect(() => {
    return () => {
      if (frameInterval.current) clearInterval(frameInterval.current)
      if (timerRef.current) clearInterval(timerRef.current)
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current)
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    }
  }, [])

  useEffect(() => {
    if (showConfirmation && timerActive) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            handleEmergencyTimeout()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timerRef.current)
    }
  }, [showConfirmation, timerActive])

  const cleanupCamera = () => {
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current)
    if (frameInterval.current) clearInterval(frameInterval.current)
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    const video = webcamRef.current?.video
    if (video && video.srcObject) {
      (video.srcObject as MediaStream).getTracks().forEach(t => t.stop())
      video.srcObject = null
    }
  }

  const simulateDangerDetection = () => {
    handleDangerResponse()
  }

  const checkCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      setHasPermission(true)
      streamRef.current = stream
      return stream
    } catch (err) {
      setHasPermission(false)
      console.error("Error accessing camera:", err)
      return null
    }
  }, [])

  const startRecording = () => {
    setIsRecording(true)
    frameInterval.current = setInterval(() => {
      const imageSrc = webcamRef.current?.getScreenshot()
      if (imageSrc) sendFrameToBackend(imageSrc)
    }, 200)
  }

  const stopRecording = () => {
    setIsRecording(false)
    if (frameInterval.current) clearInterval(frameInterval.current)
  }

  const handleEmergencyTimeout = () => {
    setShowConfirmation(false)
    setTimerActive(false)
    setAlertMessage("Connecting you to medical services now.")
    setCameraOpen(false)
    cleanupCamera()
  }

  const sendEmergencySignal = () => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/monitor/user/response`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ latitude, longitude, token })
        })
        const data = await res.json()
        localStorage.setItem("accidentId", data.accidentId)
        setAccident(data.accidentId)
      } catch (err) {
        console.error("Error sending emergency signal:", err)
      }
    })
  }

  const sendFrameToBackend = async (dataUrl) => {
    if (!offscreenCanvas.current || !offscreenCtx.current) return
    const img = new Image()
    img.onload = () => {
      offscreenCtx.current.drawImage(img, 0, 0, offscreenCanvas.current.width, offscreenCanvas.current.height)
      offscreenCanvas.current.toBlob(async blob => {
        if (!blob) return
        const formData = new FormData()
        formData.append('frame', blob, `frame-${Date.now()}.jpg`)
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/monitor/user/upload`, { method: "POST", body: formData })
          const result = await res.json()
          if (result.accident === true) {
            simulateDangerDetection()
            stopRecording()
          }
        } catch (err) {
          console.error("Error sending frame:", err)
        }
      }, 'image/jpeg')
    }
    img.src = dataUrl
  }

  const handleDangerResponse = () => {
    setShowDangerAlert(true)
    if (isRecording) stopRecording()
    setShowConfirmation(true)
    setTimeRemaining(120)
    setTimerActive(true)
  }

  const handleConfirmation = (confirmed) => {
    setShowConfirmation(false)
    setTimerActive(false)
    if (confirmed) sendEmergencySignal()
    if (timerRef.current) clearInterval(timerRef.current)
    setCameraOpen(false)
    cleanupCamera()
    if (!confirmed) setShowDangerAlert(false)
  }

  const handleSafeClick = () => setShowSafeConfirm(true)

  const handleOpenCamera = async () => {
    const stream = await checkCameraPermission()
    if (stream) {
      setCameraOpen(true)
      openTimeoutRef.current = setTimeout(() => startRecording(), 1000)
    }
  }

  const formatTimeRemaining = () => {
    const m = Math.floor(timeRemaining / 60)
    const s = timeRemaining % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const dismissNotification = () => {
    setShowDangerAlert(false)
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50">
      {/* Header with user profile */}
      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur shadow-sm">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-teal-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
              Acciense
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback className="bg-teal-100 text-teal-800">U</AvatarFallback>
                </Avatar>
                <ChevronDown className="ml-1 h-4 w-4 text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-slate-200 shadow-lg">
              <DropdownMenuLabel className="font-medium text-slate-800">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100" />
              {/* <DropdownMenuItem className="text-slate-700 hover:bg-slate-50">
                <Settings className="mr-2 h-4 w-4 text-slate-500" />
                <span>Settings</span>
              </DropdownMenuItem> */}
              {/* <DropdownMenuItem className="text-slate-700 hover:bg-slate-50">
                <Info className="mr-2 h-4 w-4 text-slate-500" />
                <span>Info</span>
              </DropdownMenuItem> */}
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem 
                   className="text-slate-700 hover:bg-slate-50"  
                    onClick={() => {
                    localStorage.removeItem("jwt"); // Replace 'yourKey' with your actual key, e.g., "authToken"
                    window.location.reload(); // Optional: reload or redirect after logout
                  }}>

                <LogOut className="mr-2 h-4 w-4 text-slate-500" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-8">
        <div className="flex flex-col items-center justify-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-800">
              Safety Monitoring System
            </h2>
            <p className="mt-2 text-slate-600 max-w-md">
              Keep yourself protected with real-time accident detection and emergency response
            </p>
          </motion.div>

          {showDangerAlert && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md"
            >
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <AlertTitle className="text-red-800">Potential Danger Detected</AlertTitle>
                <AlertDescription className="text-red-700">
                  {alertMessage}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
         
          <div className="flex flex-col items-center gap-6 w-full max-w-md">
            {!showDangerAlert && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <Button 
                  onClick={handleOpenCamera} 
                  size="lg"
                  className="w-full h-14 bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 shadow-lg"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Start Monitoring
                </Button>
              </motion.div>
            )}
            
            <div className="w-full">
              {accident && showDangerAlert && (
                <AccidentNotification 
                  accidentId={accident} 
                  onDismiss={dismissNotification} 
                />
              )}
            </div>
          </div>

          {isRecording && (
            <div className="flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full">
              <div className="h-2 w-2 rounded-full bg-teal-600 animate-pulse"></div>
              <span className="text-sm font-medium text-teal-800">Active monitoring</span>
            </div>
          )}
        </div>
      </main>

      {/* Camera Dialog */}
      <Dialog
        open={cameraOpen}
        onOpenChange={(open) => {
          if (!open) cleanupCamera()
          setCameraOpen(open)
        }}
      >
        <DialogContent className="sm:max-w-[850px] p-0 bg-white rounded-xl shadow-xl overflow-hidden border-0">
          <div className="relative flex flex-col sm:flex-row">
            {/* <DialogClose asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-4 right-4 z-10 rounded-full bg-white/90 backdrop-blur"
              >
                <X className="h-5 w-5 text-slate-700" />
              </Button>
            </DialogClose> */}

            {hasPermission === false ? (
              <div className="w-full p-10 text-center text-slate-500">
                <AlertTriangle className="h-10 w-10 mx-auto mb-4 text-red-500" />
                <p>Camera permission denied. Please enable access in your browser settings.</p>
              </div>
            ) : (
              hasPermission === true && (
                <>
                  <div className="w-full sm:w-3/4 bg-black flex items-center justify-center">
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      className="w-full h-full object-cover aspect-video"
                    />
                  </div>
                  <div className="w-full sm:w-1/4 p-6 flex flex-col justify-center items-center space-y-4 bg-slate-50">
                    {!isRecording ? (
                      <Button 
                        onClick={startRecording} 
                        className="w-full bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600"
                      >
                        Start Monitoring
                      </Button>
                    ) : (
                      <Button 
                        onClick={stopRecording} 
                        variant="destructive" 
                        className="w-full"
                      >
                        <StopCircle className="h-4 w-4 mr-2" />
                        Stop Monitoring
                      </Button>
                    )}
                    <div className="text-center text-sm text-slate-500 mt-4">
                      {isRecording ? (
                        <p>Monitoring your safety in real-time</p>
                      ) : (
                        <p>Ready to begin monitoring</p>
                      )}
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Emergency Confirmation Modal */}
      <Dialog
        open={showConfirmation}
        onOpenChange={(open) => {
          if (!open) {
            // Optionally, you can decide whether to allow closing by outside click.
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px] rounded-xl border-0 shadow-xl">
          <DialogHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-red-600">
              Emergency Alert
            </DialogTitle>
            <DialogDescription className="text-slate-600 pt-2">
              {alertMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium text-slate-700">
                Automatic alert in: <span className="font-bold text-red-600">{formatTimeRemaining()}</span>
              </span>
            </div>
            <Progress 
              value={(timeRemaining / 120) * 100} 
              className="h-2 bg-slate-100" 
              
            />
          </div>
          <DialogFooter className="flex sm:justify-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleSafeClick} 
              className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              No, I'm Safe
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleConfirmation(true)} 
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Yes, Need Help
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Safe Confirmation Dialog ("Are you sure?") */}
      <Dialog
        open={showSafeConfirm}
        onOpenChange={(open) => {
          if (!open) setShowSafeConfirm(false)
        }}
      >
        <DialogContent className="sm:max-w-[350px] rounded-xl border-0 shadow-xl">
          <DialogHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 mb-4">
              <AlertTriangle className="h-6 w-6 text-teal-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-800">
              Are you sure?
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              If you are really safe, press confirm to resume monitoring.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowSafeConfirm(false)}
              className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowSafeConfirm(false)
                handleConfirmation(false)
              }}
              className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600"
            >
              Confirm Safe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}