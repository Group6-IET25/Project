import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export default function AuthCard() {
  const [userType, setUserType] = useState<"user" | "hospital">("user");
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [formData, setFormData] = useState({});
  const formRef = useRef<HTMLFormElement | null>(null);
  const navigate = useNavigate();

  // API call for user signup
  const handleUserSignup = async (data: any) => {
    console.log("data", data);
    
    try {
      const response = await fetch(`http://192.168.81.204:5000/api/auth/user/signup/`, {
        method: "POST",
        credentials : "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
       
      });

      // Process response (e.g., error handling or success message)
      const result = await response.json();
      if(result.error){
        throw new Error(result.error);
      }
      toast.success(result.message)
      localStorage.setItem("jwt", result.jwt)
       navigate('/userdashboard')
      console.log("User Signup Response:", result);
    } catch (error) {
      toast.error(error.message)
      console.error("Error during user signup:", error);
    }
  };

  // API call for user login
  const handleUserLogin = async (data: any) => {
    try {
      const response = await fetch(`http://192.168.81.204:5000/api/auth/user/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",  // Important for sending and receiving cookies
      });

      const result = await response.json();
      if(result.error){
        throw new Error(result.error);
      }
      localStorage.setItem("jwt", result.jwt)
      toast.success(result.message)
      navigate('/userdashboard')
      console.log("User Login Response:", result);
    } catch (error) {
      toast.error(error.message)
      console.error("Error during user login:", error);
    }
  };

  // API call for hospital signup
  const handleHospitalSignup = async (data: any) => {
    try {
      const response = await fetch(`http://192.168.81.204:5000/api/auth/healthcare/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",  // Important for sending and receiving cookies
      });
      const result = await response.json();
      if(result.error){
        throw new Error(result.error);
      }
      localStorage.setItem("jwt", result.jwt)
      toast.success(result.message)
      navigate('/hospitalDashboard')
      console.log("Hospital Signup Response:", result);
    } catch (error) {
      toast.error(error.message)
      console.error("Error during hospital signup:", error);
    }
  };

  // API call for hospital login
  const handleHospitalLogin = async (data: any) => {
    try {
      const response = await fetch(`http://192.168.81.204:5000/api/auth/healthcare/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",  // Important for sending and receiving cookies
      });
      const result = await response.json();
      if(result.error){
        throw new Error(result.error);
      }
      localStorage.setItem("jwt", result.jwt)
      toast.success(result.message)
      navigate('/hospitalDashboard')
      console.log("Hospital Login Response:", result);
    } catch (error) {
      toast.error(error.message)
      console.error("Error during hospital login:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the page from refreshing
    if (formRef.current) {
      const formDataObj = Object.fromEntries(new FormData(formRef.current).entries());
      console.log("Form Data from FormData API:", formDataObj);
      setFormData(formDataObj); // Update state asynchronously

      // Call the appropriate API based on the account type and active tab
      if (userType === "user" && activeTab === "signup") {
        await handleUserSignup(formDataObj);
      } else if (userType === "user" && activeTab === "signin") {
        await handleUserLogin(formDataObj);
      } else if (userType === "hospital" && activeTab === "signup") {
        await handleHospitalSignup(formDataObj);
      } else if (userType === "hospital" && activeTab === "signin") {
        await handleHospitalLogin(formDataObj);
      }
      // navigate('/home');
    }
  };

  useEffect(() => {
    console.log("Updated Form Data:", formData);
  }, [formData]);

   return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-b from-white to-teal-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="w-full border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-500 p-1"></div>
          <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-2">
              <Shield className="h-7 w-7 text-teal-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                AccidentShield
              </span>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">
              {activeTab === "signin" ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-slate-600">
              {activeTab === "signin" 
                ? "Sign in to access your account" 
                : "Join us to get started"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Label htmlFor="user-type" className="block text-sm font-medium text-slate-700 mb-2">
                Select Account Type
              </Label>
              <Select 
                value={userType} 
                onValueChange={(value: "user" | "hospital") => setUserType(value)}
              >
                <SelectTrigger id="user-type" className="w-full h-11">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user" className="hover:bg-teal-50">User</SelectItem>
                  <SelectItem value="hospital" className="hover:bg-teal-50">Hospital</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs 
              defaultValue="signin" 
              className="w-full"
              onValueChange={(value: "signin" | "signup") => setActiveTab(value)}
            >
              <TabsList className="grid w-full grid-cols-2 bg-slate-100 h-12">
                <TabsTrigger 
                  value="signin" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-teal-600"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-teal-600"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-6">
                {userType === "user" ? (
                  <UserSignInForm handleSubmit={handleSubmit} formRef={formRef}/>
                ) : (
                  <HospitalSignInForm handleSubmit={handleSubmit} formRef={formRef}/>
                )}
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                {userType === "user" ? (
                  <UserSignUpForm handleSubmit={handleSubmit} formRef={formRef}/>
                ) : (
                  <HospitalSignUpForm handleSubmit={handleSubmit} formRef={formRef}/>
                )}
              </TabsContent>
            </Tabs>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" className="w-full h-11">
              <svg className="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
                <path fillRule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clipRule="evenodd"/>
              </svg>
              Google
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-slate-500 text-center">
              {activeTab === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button 
                onClick={() => setActiveTab(activeTab === "signin" ? "signup" : "signin")}
                className="font-medium text-teal-600 hover:text-teal-500"
              >
                {activeTab === "signin" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

// Form components with updated styling
function UserSignInForm({ formRef, handleSubmit }: { formRef: any, handleSubmit: any }) {
  return (
    <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
      <InputField label="Email" id="email" type="email" placeholder="Enter your email" />
      <InputField label="Password" id="password" type="password" placeholder="Enter your password" />
      <div className="flex items-center justify-end">
        <Link to="/forgot-password" className="text-sm font-medium text-teal-600 hover:text-teal-500">
          Forgot password?
        </Link>
      </div>
      <Button 
        type="submit" 
        className="w-full h-11 bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600"
      >
        Sign In
      </Button>
    </form>
  );
}

function UserSignUpForm({ formRef, handleSubmit }: { formRef: any, handleSubmit: any }) {
  return (
    <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
      <InputField label="Name" id="name" placeholder="Enter your name" />
      <InputField label="Email" id="email" type="email" placeholder="Enter your email" />
      <InputField label="Password" id="password" type="password" placeholder="Enter your password" />
      <InputField label="Personal Phone Number" id="personalContact" type="tel" placeholder="Enter your phone number" />
      <InputField label="Family Phone Number" id="familyContact" type="tel" placeholder="Enter family phone number" />
      <InputField label="Address" id="address" placeholder="Enter your address" />
      <Button 
        type="submit" 
        className="w-full h-11 bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600"
      >
        Sign Up
      </Button>
    </form>
  );
}

function HospitalSignInForm({ formRef, handleSubmit }: { formRef: any, handleSubmit: any }) {
  return (
    <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
      <InputField label="Email" id="email" type="email" placeholder="Enter hospital email" />
      <InputField label="Password" id="password" type="password" placeholder="Enter password" />
      <div className="flex items-center justify-end">
        <Link to="/forgot-password" className="text-sm font-medium text-teal-600 hover:text-teal-500">
          Forgot password?
        </Link>
      </div>
      <Button 
        type="submit" 
        className="w-full h-11 bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600"
      >
        Sign In
      </Button>
    </form>
  );
}

function HospitalSignUpForm({ formRef, handleSubmit }: { formRef: any, handleSubmit: any }) {
  return (
    <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
      <InputField label="Hospital Name" id="name" placeholder="Enter hospital name" />
      <InputField label="Email" id="email" type="email" placeholder="Enter hospital email" />
      <InputField label="Password" id="password" type="password" placeholder="Enter hospital password" />
      <InputField label="Address" id="address" placeholder="Enter hospital address" />
      <InputField label="Phone Number" id="contact" type="tel" placeholder="Enter hospital phone number" />
      <Button 
        type="submit" 
        className="w-full h-11 bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600"
      >
        Sign Up
      </Button>
    </form>
  );
}

type InputFieldProps = {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
};

function InputField({ label, id, type = "text", placeholder }: InputFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </Label>
      <Input 
        id={id} 
        name={id} 
        type={type} 
        placeholder={placeholder}
        className="h-11 focus-visible:ring-teal-500"
      />
    </div>
  );
}