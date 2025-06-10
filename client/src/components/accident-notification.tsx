"use client"

import { useState, useEffect } from "react"
import { AlertCircle, X, Phone, Mail, MapPin } from "lucide-react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

interface Hospital {
  id?: string
  name: string
  address: string
  email: string
  contactNo: string
}

interface AccidentNotificationProps {
  accidentId: string
  onDismiss?: () => void
}

export default function AccidentNotification({
  accidentId,
  onDismiss,
}: AccidentNotificationProps) {
  const [hospital, setHospital] = useState<Hospital | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  let currentPollingTimeout: ReturnType<typeof setTimeout> | null = null

  useEffect(() => {
    // Try to hydrate from localStorage first
    const storedHospital = {
      name: localStorage.getItem("name"),
      address: localStorage.getItem("healthCare"),
      email: localStorage.getItem("email"),
      contactNo: localStorage.getItem("contact"),
    }

    if (
      storedHospital.name &&
      storedHospital.address &&
      storedHospital.email &&
      storedHospital.contactNo
    ) {
      setHospital(storedHospital as Hospital)
      setLoading(false)
    } else if (accidentId) {
      fetchHospitalData(accidentId)
    }
  }, [accidentId])

  const handleClear = () => {
     localStorage.removeItem("accidentId")
     localStorage.removeItem("healthCare")
     localStorage.removeItem("contact")
     localStorage.removeItem("email")
     localStorage.removeItem("name")
     localStorage.removeItem("timeRemaining")
  }

  const fetchHospitalData = async (accidentId: string): Promise<void> => {
    console.log(`Starting hospital data fetch for accident ID: ${accidentId}`)

    if (currentPollingTimeout) {
      clearTimeout(currentPollingTimeout)
      currentPollingTimeout = null
    }

    const startTime = Date.now()
    const MAX_DURATION = 10 * 60 * 1000 // 10 minutes

    const poll = async (): Promise<void> => {
    
       try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/monitor/user/track`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accidentId }),
        });


        
        const result = await response.json()
        const elapsed = Date.now() - startTime

        if (result.message &&
          elapsed < MAX_DURATION
        ) {
          console.log("Polling...")
          currentPollingTimeout = setTimeout(poll, 3000)
        } else if (result.error) {
          currentPollingTimeout = null
          setLoading(false)
          throw new Error(result.error)
        } else {
          console.log("Polling finished.")

          localStorage.setItem("healthCare", result.healthcareId.address)
          localStorage.setItem("contact", result.healthcareId.contact)
          localStorage.setItem("email", result.healthcareId.email)
          localStorage.setItem("name", result.healthcareId.name)

          setHospital({
            name: result.healthcareId.name,
            address: result.healthcareId.address,
            email: result.healthcareId.email,
            contactNo: result.healthcareId.contact,
          })

          setLoading(false)
          currentPollingTimeout = null
        }
      } catch (error) {
        console.error("Error fetching hospital data:", error)
        setError("Failed to fetch hospital information")
        setLoading(false)
        currentPollingTimeout = null
      }
    }

    poll()
  }

  if (loading) {
    return (
      <Card className="w-60 max-w-md mx-auto border-2 border-red-500 shadow-lg animate-pulse">
        <CardHeader className="bg-red-50 pb-2">
          <CardTitle className="text-red-700 flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            <span>Loading emergency information...</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="w-full max-w-md mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!hospital) return null

  return (
    <Card className="w-full max-w-md mx-auto border-2 border-red-500 shadow-lg">
      <CardHeader className="bg-red-50 pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-red-700 flex items-center">
          <AlertCircle className="mr-2 h-5 w-5" />
          <span>Accident Detected</span>
        </CardTitle>
        {onDismiss && (
         <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              handleClear()
              if (onDismiss) onDismiss()
            }}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{hospital.name}</h3>
          </div>
          {/* <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{hospital.address}</p>
          </div> */}
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-gray-500 flex-shrink-0" />
            <p className="text-sm">{hospital.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-gray-500 flex-shrink-0" />
            <p className="text-sm font-medium">{hospital.contactNo}</p>
          </div>
        </div>
      </CardContent>
      {/* <CardFooter className="bg-red-50">
        <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
          Contact Emergency Services
        </Button>
      </CardFooter> */}
    </Card>
  )
}
