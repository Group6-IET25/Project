"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
// import Image from "iamge"
import { motion } from "framer-motion"
import { ArrowRight, Shield, Clock, Menu, X, ChevronRight, Users, Award, CheckCircle, Phone, ShieldCheck, HeartPulse, Hospital, Radar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMobile } from "@/hooks/use-mobile"

export default function Home() {
  const isMobile = useMobile()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Floating Contact Button */}
      {/* <div className="fixed bottom-6 right-6 z-50">
        <Button size="lg" className="rounded-full h-14 w-14 bg-teal-600 hover:bg-teal-700 shadow-lg">
          <Phone className="h-6 w-6" />
          <span className="sr-only">Contact Us</span>
        </Button>
      </div> */}

      {/* Navbar */}
      <header
        className={`sticky top-0 z-40 w-full backdrop-blur transition-all duration-300 ${
          scrolled ? "bg-white/80 shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-teal-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
              AcciSense
            </span>
          </div>

          {/* Desktop Navigation */}
       

          <div className="hidden md:flex items-center gap-4">
            <Link to="/home">
              <Button variant="outline" className="rounded-full px-6">
                Log In
              </Button>
            </Link>
            <Link to="/home">
              <Button className="rounded-full px-6 bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 border-0">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-white shadow-lg z-50 border-t">
            <div className="container py-4 flex flex-col gap-4">
              <Link
                to="#features"
                className="text-sm font-medium p-2 hover:bg-slate-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="#how-it-works"
                className="text-sm font-medium p-2 hover:bg-slate-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                to="#testimonials"
                className="text-sm font-medium p-2 hover:bg-slate-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </Link>
              {/* <Link
                to="#pricing"
                className="text-sm font-medium p-2 hover:bg-slate-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link> */}
              <Link
                to="#faq"
                className="text-sm font-medium p-2 hover:bg-slate-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                to="#blog"
                className="text-sm font-medium p-2 hover:bg-slate-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Link to="/home" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link to="/home" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-teal-600 to-emerald-500">Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white to-teal-50 pt-20 pb-32">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 right-0 h-[500px] overflow-hidden z-0">
            <div className="absolute -top-[300px] -left-[100px] w-[600px] h-[600px] rounded-full bg-teal-100/30 blur-3xl"></div>
            <div className="absolute -top-[200px] -right-[300px] w-[800px] h-[800px] rounded-full bg-emerald-100/40 blur-3xl"></div>
          </div>

          <div className="container relative z-10">
            <motion.div
              className="flex flex-col items-center text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
               variants={fadeIn}
            >
              <Badge className="mb-4 bg-teal-100 text-teal-800 hover:bg-teal-100 px-4 py-1">
                Revolutionary Technology
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-gray-900 via-teal-800 to-emerald-700 bg-clip-text text-transparent">
                Accident Detection in Real-Time
              </h1>
              <p className="max-w-[800px] text-lg md:text-xl text-slate-600 mb-8">
                Our AI-powered system uses your mobile camera to detect accidents instantly and alert nearby hospitals,
                reducing emergency response time by and potentially saving thousands of lives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* <Link to="/signup">
                  <Button
                    size="lg"
                    className="rounded-full px-8 py-6 text-base bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 border-0 shadow-lg"
                  >
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link> */}
                {/* <Link to="#how-it-works">
                  <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-base">
                    Watch Demo
                  </Button>
                </Link> */}
              </div>
            </motion.div>

            <motion.div
              className="relative mt-12 mx-auto max-w-5xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-200">
                {/* <Image
                  src="/placeholder.svg?height=600&width=1200"
                  alt="AcciSense in action"
                  width={1200}
                  height={600}
                  className="w-full h-auto"
                  priority
                /> */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-6 md:p-8 text-white">
                    <h3 className="text-xl md:text-2xl font-bold mb-2">See how it works</h3>
                    <p className="text-white/80 max-w-lg">
                      Our AI technology detects accidents in real-time and immediately alerts emergency services.
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Stats Cards */}
              {/* <div className="absolute -bottom-16 -right-8 md:right-0 w-64 h-32 bg-white rounded-lg shadow-xl p-4 border border-slate-100 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="bg-teal-100 rounded-full p-3">
                    <Clock className="h-6 w-6 text-teal-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-2xl">50%</h4>
                    <p className="text-sm text-slate-500">Faster Response</p>
                  </div>
                </div>
              </div> */}

              {/* <div className="absolute -bottom-16 left-8 md:left-12 w-64 h-32 bg-white rounded-lg shadow-xl p-4 border border-slate-100 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 rounded-full p-3">
                    <Users className="h-6 w-6 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-2xl">10,000+</h4>
                    <p className="text-sm text-slate-500">Lives Saved</p>
                  </div>
                </div>
              </div> */}
            </motion.div>

            {/* Trusted By Section */}
            {/* <div className="mt-32 text-center">
              <p className="text-sm font-medium text-slate-500 mb-6">
                TRUSTED BY LEADING HOSPITALS & EMERGENCY SERVICES
              </p>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
                <div className="w-24 h-12 relative grayscale hover:grayscale-0 transition-all">
                  <Image src="/placeholder.svg?height=48&width=96" alt="Hospital 1" fill className="object-contain" />
                </div>
                <div className="w-24 h-12 relative grayscale hover:grayscale-0 transition-all">
                  <Image src="/placeholder.svg?height=48&width=96" alt="Hospital 2" fill className="object-contain" />
                </div>
                <div className="w-24 h-12 relative grayscale hover:grayscale-0 transition-all">
                  <Image src="/placeholder.svg?height=48&width=96" alt="Hospital 3" fill className="object-contain" />
                </div>
                <div className="w-24 h-12 relative grayscale hover:grayscale-0 transition-all">
                  <Image src="/placeholder.svg?height=48&width=96" alt="Hospital 4" fill className="object-contain" />
                </div>
                <div className="w-24 h-12 relative grayscale hover:grayscale-0 transition-all">
                  <Image src="/placeholder.svg?height=48&width=96" alt="Hospital 5" fill className="object-contain" />
                </div>
              </div>
            </div> */}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 md:py-32">
          <div className="container">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <Badge className="mb-4 bg-slate-100 text-slate-800 hover:bg-slate-100 px-4 py-1">Powerful Features</Badge>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Advanced Technology for <span className="text-teal-600">Life-Saving</span> Results
              </h2>
              <p className="max-w-[800px] mx-auto text-slate-600 text-lg">
                Our cutting-edge accident detection system combines AI, computer vision, and real-time alerts to create
                a seamless emergency response solution.
              </p>
            </motion.div>

            <Tabs defaultValue="detection" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-2xl grid-cols-3">
                  <TabsTrigger value="detection">Detection</TabsTrigger>
                  <TabsTrigger value="notification">Notification</TabsTrigger>
                  <TabsTrigger value="response">Response</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="detection" className="mt-0">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="order-2 md:order-1">
                    <h3 className="text-2xl font-bold mb-4">Real-Time Accident Detection</h3>
                    <p className="text-slate-600 mb-6">
                      Our advanced AI algorithms analyze video feeds from your mobile camera in real-time, detecting
                      accidents with accuracy in various conditions.
                    </p>
                    <ul className="space-y-3">
                      {[
                        "Low false positive rate",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="order-1 md:order-2 relative">
                    <div className="relative rounded-xl overflow-hidden shadow-lg border border-slate-200">
                      {/* <Image
                        src="/placeholder.svg?height=400&width=600"
                        alt="AI Detection Technology"
                        width={600}
                        height={400}
                        className="w-full h-auto"
                      /> */}
                    </div>
                    {/* <div className="absolute -bottom-6 -left-6 bg-teal-600 text-white p-4 rounded-lg shadow-lg hidden md:block">
                      <p className="font-bold">94% Accuracy</p>
                      <p className="text-sm text-teal-100">In real-world testing</p>
                    </div> */}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notification" className="mt-0">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="order-2 md:order-1">
                    <h3 className="text-2xl font-bold mb-4">Instant Hospital Notifications</h3>
                    <p className="text-slate-600 mb-6">
                      When an accident is detected, our system instantly sends detailed notifications to multiple nearby
                      hospitals and emergency services.
                    </p>
                    <ul className="space-y-3">
                      {[
                        "Simultaneous alerts to multiple hospitals",
                        "GPS location data included",
                        "Automatic follow-up system",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="order-1 md:order-2 relative">
                    <div className="relative rounded-xl overflow-hidden shadow-lg border border-slate-200">
                      {/* <Image
                        src="/placeholder.svg?height=400&width=600"
                        alt="Notification System"
                        width={600}
                        height={400}
                        className="w-full h-auto"
                      /> */}
                    </div>
                    {/* <div className="absolute -bottom-6 -left-6 bg-emerald-600 text-white p-4 rounded-lg shadow-lg hidden md:block">
                      <p className="font-bold">&lt; 3 seconds</p>
                      <p className="text-sm text-emerald-100">Average alert time</p>
                    </div> */}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="response" className="mt-0">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="order-2 md:order-1">
                    <h3 className="text-2xl font-bold mb-4">Optimized Emergency Response</h3>
                    <p className="text-slate-600 mb-6">
                      Our system coordinates with emergency services to ensure the fastest possible response time, with
                      smart routing and real-time updates.
                    </p>
                    <ul className="space-y-3">
                      {[
                        "Real-time status updates",
                        "Automated medical record preparation",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="order-1 md:order-2 relative">
                    <div className="relative rounded-xl overflow-hidden shadow-lg border border-slate-200">
                      {/* <Image
                        src="/placeholder.svg?height=400&width=600"
                        alt="Emergency Response System"
                        width={600}
                        height={400}
                        className="w-full h-auto"
                      /> */}
                    </div>
                    {/* <div className="absolute -bottom-6 -left-6 bg-teal-600 text-white p-4 rounded-lg shadow-lg hidden md:block">
                      <p className="font-bold">50% Faster</p>
                      <p className="text-sm text-teal-100">Emergency response</p>
                    </div> */}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-slate-50 py-24 md:py-32 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-teal-100/30 blur-3xl -z-10"></div>
          <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-emerald-100/20 blur-3xl -z-10"></div>

          <div className="container">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <Badge className="mb-4 bg-teal-100 text-teal-800 hover:bg-teal-100 px-4 py-1">Simple Process</Badge>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                How AcciSense <span className="text-teal-600">Works</span>
              </h2>
              <p className="max-w-[800px] mx-auto text-slate-600 text-lg">
                Our intuitive system is designed to be simple to use while providing powerful protection when accidents
                occur.
              </p>
            </motion.div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-teal-200 hidden md:block"></div>

              <motion.div
                className="space-y-24"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                {/* Step 1 */}
                <motion.div className="relative grid md:grid-cols-2 gap-8 items-center" variants={fadeIn}>
                  <div className="md:text-right">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-700 mb-4">
                        1
                      </div>
                      <h3 className="text-2xl font-bold mb-3">Create Your Account</h3>
                      <p className="text-slate-600">
                        Sign up for AcciSense and create your profile with emergency contacts and relevant medical
                        information.
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-teal-600 rounded-full z-10 hidden md:block"></div>
                    <div className="rounded-xl overflow-hidden shadow-lg">
                    </div>
                  </div>
                </motion.div>

                {/* Step 2 */}
                <motion.div className="relative grid md:grid-cols-2 gap-8 items-center" variants={fadeIn}>
                  <div className="order-2 md:order-1">
                    <div className="rounded-xl overflow-hidden shadow-lg">
                    </div>
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-teal-600 rounded-full z-10 hidden md:block"></div>
                  </div>
                  <div className="order-1 md:order-2">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-700 mb-4">
                        2
                      </div>
                      <h3 className="text-2xl font-bold mb-3">Activate Your Camera</h3>
                      <p className="text-slate-600">
                        Open the AcciSense app and activate your mobile camera. Our system will run in the
                        background while you drive.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Step 3 */}
                <motion.div className="relative grid md:grid-cols-2 gap-8 items-center" variants={fadeIn}>
                  <div className="md:text-right">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-700 mb-4">
                        3
                      </div>
                      <h3 className="text-2xl font-bold mb-3">Automatic Detection</h3>
                      <p className="text-slate-600">
                        Our AI system continuously monitors for accidents. If one is detected, the system immediately
                        springs into action.
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-teal-600 rounded-full z-10 hidden md:block"></div>
                    <div className="rounded-xl overflow-hidden shadow-lg">
                    </div>
                  </div>
                </motion.div>

                {/* Step 4 */}
                <motion.div className="relative grid md:grid-cols-2 gap-8 items-center" variants={fadeIn}>
                  <div className="order-2 md:order-1">
                    <div className="rounded-xl overflow-hidden shadow-lg">
                    </div>
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-teal-600 rounded-full z-10 hidden md:block"></div>
                  </div>
                  <div className="order-1 md:order-2">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-700 mb-4">
                        4
                      </div>
                      <h3 className="text-2xl font-bold mb-3">Instant Hospital Alerts</h3>
                      <p className="text-slate-600">
                        Multiple nearby hospitals receive instant notifications with your location.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Step 5 */}
                <motion.div className="relative grid md:grid-cols-2 gap-8 items-center" variants={fadeIn}>
                  <div className="md:text-right">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-700 mb-4">
                        5
                      </div>
                      <h3 className="text-2xl font-bold mb-3">Rapid Emergency Response</h3>
                      <p className="text-slate-600">
                        Emergency services are dispatched to your location with all the information they need to provide
                        immediate assistance.
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-teal-600 rounded-full z-10 hidden md:block"></div>
                    <div className="rounded-xl overflow-hidden shadow-lg">
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
      <section className="py-4 md:py-12 bg-slate-50">
        <div className="container">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Badge className="mb-4 bg-teal-100 text-teal-800 px-4 py-1">
              Real Results
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Making a <span className="text-teal-600">Difference</span>
            </h2>
            <p className="max-w-[700px] mx-auto text-slate-600 text-lg">
              Our smart technology is transforming emergency response systems and making the world a safer place—one alert at a time.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <Card className="p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 bg-white rounded-2xl border-0">
              <div className="flex justify-center mb-4">
                <ShieldCheck className="h-10 w-10 text-teal-600" />
              </div>
              <CardDescription className="text-base font-medium text-slate-700">
                Faster and more secure emergency responses
              </CardDescription>
            </Card>

            <Card className="p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 bg-white rounded-2xl border-0">
              <div className="flex justify-center mb-4">
                <HeartPulse className="h-10 w-10 text-teal-600" />
              </div>
              <CardDescription className="text-base font-medium text-slate-700">
                Life-saving alerts delivered in real time
              </CardDescription>
            </Card>

            <Card className="p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 bg-white rounded-2xl border-0">
              <div className="flex justify-center mb-4">
                <Hospital className="h-10 w-10 text-teal-600" />
              </div>
              <CardDescription className="text-base font-medium text-slate-700">
                Collaborations with medical institutions
              </CardDescription>
            </Card>

            <Card className="p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 bg-white rounded-2xl border-0">
              <div className="flex justify-center mb-4">
                <Radar className="h-10 w-10 text-teal-600" />
              </div>
              <CardDescription className="text-base font-medium text-slate-700">
                Intelligent accident detection
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="bg-gradient-to-b from-slate-50 to-white py-24 md:py-32 relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-teal-100/20 blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-emerald-100/30 blur-3xl -z-10"></div>

          {/* <div className="container">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <Badge className="mb-4 bg-teal-100 text-teal-800 hover:bg-teal-100 px-4 py-1">Success Stories</Badge>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                What Our <span className="text-teal-600">Users Say</span>
              </h2>
              <p className="max-w-[800px] mx-auto text-slate-600 text-lg">
                Hear from hospitals, emergency services, and individuals who have experienced the power of
                AcciSense.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Dr. Sarah Johnson" />
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">Dr. Sarah Johnson</CardTitle>
                      <CardDescription>Emergency Medicine Director</CardDescription>
                    </div>
                  </div>
                  <div className="flex text-amber-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">
                    "AcciSense has revolutionized our emergency response system. We're now able to dispatch teams
                    up to 50% faster, which has directly contributed to saving countless lives."
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg?height=48&width=48" alt="James Rodriguez" />
                      <AvatarFallback>JR</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">James Rodriguez</CardTitle>
                      <CardDescription>Accident Survivor</CardDescription>
                    </div>
                  </div>
                  <div className="flex text-amber-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">
                    "I was in a serious car accident last year. AcciSense detected the crash immediately and
                    alerted emergency services. The doctors told me that those saved minutes were crucial to my
                    recovery."
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Captain Michael Chen" />
                      <AvatarFallback>MC</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">Captain Michael Chen</CardTitle>
                      <CardDescription>Emergency Services Coordinator</CardDescription>
                    </div>
                  </div>
                  <div className="flex text-amber-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">
                    "The detailed information we receive from AcciSense allows us to prepare properly before
                    arriving at the scene. It's a game-changer for emergency response coordination."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div> */}
        </section>

        {/* FAQ Section */}
        <section id="faq" className="bg-slate-50 py-24 md:py-32">
          <div className="container">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <Badge className="mb-4 bg-teal-100 text-teal-800 hover:bg-teal-100 px-4 py-1">FAQ</Badge>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Frequently Asked <span className="text-teal-600">Questions</span>
              </h2>
              <p className="max-w-[800px] mx-auto text-slate-600 text-lg">
                Find answers to common questions about AcciSense.
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How does AcciSense detect accidents?</AccordionTrigger>
                  <AccordionContent>
                    AcciSense uses advanced AI and computer vision algorithms to analyze video feeds from your
                    mobile camera in real-time. The system is trained to recognize various types of accidents and can
                    detect crashes, falls, and other emergency situations.
                  </AccordionContent>
                </AccordionItem>

  

                <AccordionItem value="item-2">
                  <AccordionTrigger>How quickly are hospitals notified after an accident?</AccordionTrigger>
                  <AccordionContent>
                    Hospitals receive notifications within seconds of an accident being detected. Our system has an
                    average alert time of less than 3 seconds from detection to notification delivery.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Does AcciSense work without an internet connection?</AccordionTrigger>
                  <AccordionContent>
                    AcciSense requires an internet connection to send notifications to hospitals. However, the
                    accident detection can not function without internet.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>How does AcciSense protect my privacy?</AccordionTrigger>
                  <AccordionContent>
                    We take privacy seriously. AcciSense only processes video data for accident detection and does
                    not store video footage. Your personal information is encrypted and only shared with
                    emergency services in the event of an accident.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="bg-gradient-to-r from-teal-600 to-emerald-500 py-24 md:py-32 text-white relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-[300px] -left-[300px] w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute -bottom-[200px] -right-[200px] w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl"></div>
          </div>

          <div className="container relative z-10">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                Ready to Transform Emergency Response?
              </h2>
              <p className="text-teal-50 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                Join thousands of users who are already making a difference with AcciSense. Sign up today and
                experience the peace of mind that comes with knowing you're protected.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* <Link to="/">
                  <Button
                    size="lg"
                    className="rounded-full px-8 py-6 text-base bg-white text-teal-600 hover:bg-teal-50 shadow-lg"
                  >
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link> */}
                {/* <Link to="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 py-6 text-base border-white text-white hover:bg-white/10"
                  >
                    Contact Sales
                  </Button>
                </Link> */}
              </div>
              <div className="mt-12 flex items-center justify-center gap-8">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span className="font-medium">Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">24/7 Support</span>
                </div>
                {/* <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span className="font-medium">Award-Winning</span>
                </div> */}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-7 w-7 text-teal-400" />
                <span className="text-2xl font-bold">AcciSense</span>
              </div>
              <p className="text-slate-400 mb-6">
                Using mobile cameras to detect accidents and instantly alert nearby hospitals for faster emergency
                response.
              </p>
              <div className="flex gap-4">
                <Link to="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link to="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link to="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link to="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </div>

            {/* <div>
              <h3 className="font-bold text-lg mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="#features" className="text-slate-400 hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="#how-it-works" className="text-slate-400 hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="#pricing" className="text-slate-400 hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/case-studies" className="text-slate-400 hover:text-white transition-colors">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link to="/documentation" className="text-slate-400 hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div> */}

            {/* <div>
              <h3 className="font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
               
                <li>
                  <Link to="#blog" className="text-slate-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/press" className="text-slate-400 hover:text-white transition-colors">
                    Press
                  </Link>
                </li>
                <li>
                  <Link to="/partners" className="text-slate-400 hover:text-white transition-colors">
                    Partners
                  </Link>
                </li>
              </ul>
            </div> */}

            {/* <div>
              <h3 className="font-bold text-lg mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/help" className="text-slate-400 hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="#faq" className="text-slate-400 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="text-slate-400 hover:text-white transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link to="/status" className="text-slate-400 hover:text-white transition-colors">
                    Status
                  </Link>
                </li>
              </ul>
            </div> */}
          </div>

          {/* <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} AcciSense. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/terms" className="text-slate-500 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-slate-500 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="text-slate-500 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div> */}
        </div>
      </footer>
    </div>
  )
}
