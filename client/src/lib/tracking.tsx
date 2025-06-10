import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, Bell } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react'
import {motion} from 'framer-motion'
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { log } from 'console';
const token = localStorage.getItem("jwt")
//Priority 
//Live Patients route 

function Patients() {
      const location = useLocation();
      const [accidentNotifications, setAccidentNotifications] = useState([
     
    ])
      const [isLoading, setIsLoading] = useState(false)
      const [error, setError] = useState(null)
      // Add this state at the top of your component
    const [showResponseDialog, setShowResponseDialog] = useState(false)
    const [currentNotification, setCurrentNotification] = useState(null)
    
    
    // Modify your Respond Now button click handler
    const handleRespondClick = (notification) => {
      setCurrentNotification(notification)
      setShowResponseDialog(true)
    }
    
    const fetchNotifications = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/monitor/healthcare/currentlyHelping`, {
             method : "POST",
              headers: { "Content-Type": "application/json" },
               body : JSON.stringify({token})
          })
          if (!res.ok) throw new Error('Failed to fetch notifications')
          const data = await res.json()
          setAccidentNotifications(data)
        } catch (err) {
          console.error("Failed to fetch accident notifications:", err)
          setError(err.message)
        } finally {
          setIsLoading(false)
        }
      }, [])

      const userReachedHospital = async (accidentId) => {
        if (!accidentId) {
          toast.error("Missing accidentId or token")
          return
        }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/monitor/healthcare/markDone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accidentId})
      })

      console.log("res",res);
      
      if (!res.ok) {
        throw new Error("Failed to mark response")
      }
     setAccidentNotifications(prev => prev.filter(notification => notification._id !== accidentId));

      toast.success("Process successfully completed")
    } catch (err) {
      toast.error(err.message)
      console.error("Error confirming response:", err)
    }
  }


useEffect(() => {
  if (location.pathname === "/hospitaldashboard/trackingPatients") {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 10000);

    return () => clearInterval(intervalId); // Cleanup when navigating away
  }
}, [location.pathname, fetchNotifications]);


  return (
    <div>
       <div className="p-6">
            {/* {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                Error fetching notifications: {error}
              </div>
            )} */}
            
            {accidentNotifications.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <Bell className="h-10 w-10 mb-4 text-slate-400" />
                <p className="text-lg">No accident notifications yet</p>
                <p className="text-sm mt-1">Notifications will appear here when detected</p>
              </div>
            )}

            <div className="grid gap-6">
              {accidentNotifications.map((notification) => (
                <motion.div
                  key={notification.userId?._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="w-full border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-slate-800">
                          {notification.userId?.name}
                        </CardTitle>
                        {/* <p className="text-sm text-slate-500">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p> */}
                      </div>
                      <div className="bg-green-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Helping
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                          <div>
                            <p className="text-sm font-medium text-slate-600">Patient Mobile</p>
                            <p className="text-sm text-slate-800">
                              {notification.userId?.personalContact}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-600">Family Contact</p>
                            <p className="text-sm text-slate-800">
                              {notification.userId?.familyContact}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-600">Address</p>
                            <p className="text-sm text-slate-800">
                              {notification.userId?.address}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                        
                           <a
                             href={notification.accidentLocation}
                            target="_blank"
                            rel="noopener noreferrer">
                            <Button size="sm" variant="outline" className="border-slate-200 text-slate-700" >
                              View Location
                            </Button>
                          </a>
                          
                            <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
                              <DialogContent className="sm:max-w-[425px] rounded-xl border-0 shadow-xl">
                                <DialogHeader className="text-center">
                                  <DialogClose asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="absolute top-4 right-4 rounded-full"
                                    >
                                    </Button>
                                  </DialogClose>
                                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 mb-4">
                                    <AlertTriangle className="h-6 w-6 text-teal-600" />
                                  </div>
                                  <DialogTitle className="text-xl font-bold text-slate-800">
                                    Confirm Response
                                  </DialogTitle>
                                  <DialogDescription className="text-slate-600">
                                    Are you sure you want to respond to {currentNotification?.userId?.name}'s emergency?
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="flex sm:justify-center gap-3">
                                  <Button
                                    variant="outline"
                                    onClick={() => setShowResponseDialog(false)}
                                    className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={async() => {
                                      // Add your response logic here
                                      console.log("Responding to:", currentNotification)
                                      await userReachedHospital(currentNotification?._id)
                                      setShowResponseDialog(false)
                                    }}
                                    className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600"
                                  >
                                    Confirm
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                         <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600"
                          onClick={() => handleRespondClick(notification)}
                        >
                          Mark Done
                        </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
    </div>
  )
}

export default Patients;
