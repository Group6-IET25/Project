import { useState, useRef, useCallback, useEffect } from "react"
import Webcam from "react-webcam"
import { Settings, Info, LogOut, X, Camera, StopCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function UserDashboard() {
  const [isRecording, setIsRecording] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const webcamRef = useRef<Webcam>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const frameInterval = useRef<NodeJS.Timeout | null>(null)

  // Function to handle camera permission
  const checkCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      setHasPermission(true)
      // Stop the stream immediately after checking permission
      stream.getTracks().forEach((track) => track.stop())
    } catch (err) {
      setHasPermission(false)
      console.error("Error accessing camera:", err)
    }
  }, [])

  // Start recording function
  const startRecording = useCallback(() => {
    setIsRecording(true)

    // Set up frame extraction at 5fps (every 200ms)
    frameInterval.current = setInterval(() => {
      const imageSrc = webcamRef.current?.getScreenshot()
      if (imageSrc) {
        // Here you would send the image to your backend
        console.log("Captured frame", imageSrc.slice(0, 50) + "...")

        // Example of how you might send to backend:
        // sendFrameToBackend(imageSrc);
      }
    }, 200) // 5fps = 1000ms/5 = 200ms
  }, [])

  // Stop recording function
  const stopRecording = useCallback(() => {
    setIsRecording(false)

    // Clear the frame extraction interval
    if (frameInterval.current) {
      clearInterval(frameInterval.current)
      frameInterval.current = null
    }
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (frameInterval.current) {
        clearInterval(frameInterval.current)
      }
    }
  }, [])

  // Function to handle opening the camera
  const handleOpenCamera = () => {
    checkCameraPermission()
    setCameraOpen(true)
  }

  // Function to close camera and clean up
  const handleCloseCamera = () => {
    if (isRecording) {
      stopRecording()
    }
    setCameraOpen(false)
  }

  // Example function to send frames to backend (would be implemented based on your API)
  const sendFrameToBackend = (imageSrc: string) => {
    // Implementation would depend on your backend API
    fetch("/api/frames", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ frame: imageSrc }),
    })
      .then((response) => response.json())
      .then((data) => console.log("Success:", data))
      .catch((error) => console.error("Error:", error))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with user profile */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between p-4">
          <h1 className="text-xl font-bold">Dashboard</h1>

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
          <h2 className="text-2xl font-bold">Welcome to your Dashboard</h2>
          <p className="text-muted-foreground">Click the button below to start recording</p>

          <Button onClick={handleOpenCamera} className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Start Recording
          </Button>
        </div>
      </main>

      {/* Camera Dialog */}
      <Dialog open={cameraOpen} onOpenChange={setCameraOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 bg-blue-500">
          <div className="relative">
            {/* Cut button in upper left */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 left-2 z-10 bg-white/20 hover:bg-white/40 text-white"
              onClick={handleCloseCamera}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>

            {hasPermission === false && (
              <div className="p-6 text-center text-white">
                <p>Camera permission denied. Please allow camera access to use this feature.</p>
                <Button onClick={checkCameraPermission} className="mt-4">
                  Request Permission
                </Button>
              </div>
            )}

            {hasPermission === true && (
              <div className="flex flex-col items-center">
                <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-auto" />

                <div className="p-4 flex justify-center gap-4">
                  {!isRecording ? (
                    <Button onClick={startRecording} className="bg-red-500 hover:bg-red-600 text-white">
                      Start Recording
                    </Button>
                  ) : (
                    <Button onClick={stopRecording} variant="destructive" className="flex items-center gap-2">
                      <StopCircle className="h-4 w-4" />
                      Stop Recording
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleCloseCamera}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

