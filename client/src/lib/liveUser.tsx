import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, Bell } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react'
import {motion} from 'framer-motion'

function LiveUser() {

      const [accidentNotifications, setAccidentNotifications] = useState([
      {
        _id: "1",
        userId: {
          _id: "user1",
          name: "John Doe",
          personalContact: "+1 (555) 123-4567",
          familyContact: "+1 (555) 987-6543",
          address: "123 Main St, Anytown, USA"
        },
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
        status: "pending"
      },
      {
        _id: "2",
        userId: {
          _id: "user2",
          name: "Jane Smith",
          personalContact: "+1 (555) 234-5678",
          familyContact: "+1 (555) 876-5432",
          address: "456 Oak Ave, Somewhere, USA"
        },
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
        status: "pending"
      },
      {
        _id: "3",
        userId: {
          _id: "user3",
          name: "Robert Johnson",
          personalContact: "+1 (555) 345-6789",
          familyContact: "+1 (555) 765-4321",
          address: "789 Pine Rd, Nowhere, USA"
        },
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        status: "responded"
      }
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
          const res = await fetch("http://192.168.81.204:5000/api/monitor/healthcare/dashboard")
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
    
    useEffect(() => {
        // Initial fetch
        fetchNotifications()
        
        // Set up interval for refreshing every 5 seconds
        const intervalId = setInterval(fetchNotifications, 5000)
        
        // Clean up interval on component unmount
        return () => clearInterval(intervalId)
      }, [fetchNotifications])
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
                        <p className="text-sm text-slate-500">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Emergency
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
                          <Button size="sm" variant="outline" className="border-slate-200 text-slate-700">
                            View Location
                          </Button>
                          
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
                                    onClick={() => {
                                      // Add your response logic here
                                      console.log("Responding to:", currentNotification)
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
                          Respond Now
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

export default LiveUser;
