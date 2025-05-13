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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
        const res = await fetch("http://192.168.81.204:5000/api/monitor/user/response", {
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
          const res = await fetch("http://192.168.81.204:5000/api/monitor/user/upload", { method: "POST", body: formData })
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
    <div className="min-h-screen bg-background">
      {/* Header with user profile */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between p-4">
          <h1 className="text-xl font-bold">Safety Dashboard</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Info className="mr-2 h-4 w-4" />
                <span>Info</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-10">
        <div className="flex flex-col items-center justify-center space-y-6">
          <h2 className="text-2xl font-bold">Safety Monitoring System</h2>

          {showDangerAlert && (
            <Alert variant="destructive" className="max-w-md">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Potential Danger Detected</AlertTitle>
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          )}
         
          <div className="flex gap-4">
            {!showDangerAlert && (<Button onClick={handleOpenCamera} className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Start Monitoring
            </Button>)}
            
            <div className="flex-col items-center justify-center p-4 md:p-24 bg-white">
              {accident && showDangerAlert && (
                <AccidentNotification accidentId={accident} onDismiss={dismissNotification} />
              )}
            </div>
          </div>

          {isRecording && (
            <div className="flex items-center gap-2 text-green-600">
              <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse"></div>
              <span>Monitoring active</span>
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
        <DialogContent className="sm:max-w-[850px] p-0 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative flex flex-col sm:flex-row">
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="absolute top-3 right-3 z-10">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>

            {hasPermission === false ? (
              <div className="w-full p-10 text-center text-gray-500">
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
                      className="w-full h-full object-cover aspect-video rounded-l-xl"
                    />
                  </div>
                  <div className="w-full sm:w-1/4 p-6 flex flex-col justify-center items-center space-y-4 bg-gray-50">
                    {!isRecording ? (
                      <Button onClick={startRecording} className="w-full">
                        Start Monitoring
                      </Button>
                    ) : (
                      <Button onClick={stopRecording} variant="destructive" className="w-full">
                        Stop Monitoring
                      </Button>
                    )}
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-red-600 flex items-center justify-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Emergency Confirmation
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              {alertMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">
                Automatic emergency signal in:{" "}
                <span className="text-red-500">{formatTimeRemaining()}</span>
              </span>
            </div>
            <Progress value={(timeRemaining / 120) * 100} className="h-2" />
          </div>
          <DialogFooter className="flex sm:justify-center gap-4">
            <Button variant="outline" onClick={handleSafeClick} className="flex-1">
              No, I'm Safe
            </Button>
            <Button variant="destructive" onClick={() => handleConfirmation(true)} className="flex-1">
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
        <DialogContent className="sm:max-w-[300px]">
          <DialogHeader>
            <DialogTitle className="text-center">Are you sure?</DialogTitle>
            <DialogDescription className="text-center">
              If you are really safe, press confirm to resume monitoring.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => {
                // Cancel the safe confirmation: keep the emergency modal active.
                setShowSafeConfirm(false)
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowSafeConfirm(false)
                handleConfirmation(false)
              }}
              className="flex-1"
            >
              Yes, I'm Safe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}