import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Authentication</CardTitle>
          <CardDescription className="text-center">Sign in or create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="user-type" className="mb-4">Select Account Type</Label>
            <Select 
              value={userType} 
              onValueChange={(value: "user" | "hospital") => setUserType(value)}
            >
              <SelectTrigger id="user-type">
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="hospital">Hospital</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs 
            defaultValue="signin" 
            className="w-full"
            onValueChange={(value: "signin" | "signup") => setActiveTab(value)}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              {userType === "user" ? (
                <UserSignInForm handleSubmit={handleSubmit} formRef={formRef}/>
              ) : (
                <HospitalSignInForm handleSubmit={handleSubmit} formRef={formRef}/>
              )}
            </TabsContent>

            <TabsContent value="signup">
              {userType === "user" ? (
                <UserSignUpForm handleSubmit={handleSubmit} formRef={formRef}/>
              ) : (
                <HospitalSignUpForm handleSubmit={handleSubmit} formRef={formRef}/>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link to="/hi" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/terms" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

function UserSignInForm({ formRef, handleSubmit }: { formRef: any, handleSubmit: any }) {
  return (
    <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
      <InputField label="Email" id="email" type="email" placeholder="Enter your email" />
      <InputField label="Password" id="password" type="password" placeholder="Enter your password" />
      <Button type="submit" className="w-full">Sign In</Button>
    </form>
  );
}

function UserSignUpForm({ formRef, handleSubmit }: { formRef: any, handleSubmit: any }) {
  return (
    <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
      <InputField label="Name" id="name" placeholder="Enter your name" />
      <InputField label="Email" id="email" type="email" placeholder="Enter your email" />
      <InputField label="password" id="password" placeholder="Enter your Password" />
      <InputField label="Personal Phone Number" id="personalContact" type="tel" placeholder="Enter your phone number" />
      <InputField label="Family Phone Number" id="familyContact" type="tel" placeholder="Enter family phone number" />
      <InputField label="Address" id="address" placeholder="Enter your address" />
      <Button type="submit" className="w-full">Sign Up</Button>
    </form>
  );
}

function HospitalSignInForm({ formRef, handleSubmit }: { formRef: any, handleSubmit: any }) {
  return (
    <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
      <InputField label="Email" id="email" type="email" placeholder="Enter hospital email" />
      <InputField label="Password" id="password" type="password" placeholder="Enter password" />
      <Button type="submit" className="w-full">Sign In</Button>
    </form>
  );
}

function HospitalSignUpForm({ formRef, handleSubmit }: { formRef: any, handleSubmit: any }) {
  return (
    <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
      <InputField label="Hospital Name" id="name" placeholder="Enter hospital name" />
      <InputField label="Email" id="email" type="email" placeholder="Enter hospital email" />
      <InputField label="Password" id="password" type="password" placeholder="Enter hospital Password" />
      <InputField label="Address" id="address" placeholder="Enter hospital address" />
      <InputField label="Phone Number" id="contact" type="tel" placeholder="Enter hospital phone number" />
      <Button type="submit" className="w-full">Sign Up</Button>
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
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} type={type} placeholder={placeholder} />
    </div>
  );
}
