import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { log } from "console";

export default function AuthCard() {
  const [userType, setUserType] = useState<"user" | "hospital">("user");
  const [formData, setFormData] = useState({});
  const formRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the page from refreshing
    if (formRef.current) {
      const formDataObj = Object.fromEntries(new FormData(formRef.current).entries());
      console.log("Form Data from FormData API:", formDataObj);
      setFormData(formDataObj); // Update state asynchronously
      navigate('/home')
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
            <Select value={userType} onValueChange={(value: "user" | "hospital") => setUserType(value)}>
              <SelectTrigger id="user-type">
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="hospital">Hospital</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              {userType === "user" ? <UserSignInForm handleSubmit={handleSubmit} formRef={formRef}/> : <HospitalSignInForm handleSubmit={handleSubmit} formRef={formRef}/>}
            </TabsContent>

            <TabsContent value="signup">
              {userType === "user" ? <UserSignUpForm handleSubmit={handleSubmit} formRef={formRef}/> : <HospitalSignUpForm handleSubmit={handleSubmit} formRef={formRef}/>}
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
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

function UserSignInForm({formRef,  handleSubmit }) {
  return (
    <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
      <InputField label="Email" id="user-email" type="email" placeholder="Enter your email" />
      <InputField label="Password" id="user-password" type="password" placeholder="Enter your password" />
      <Button type="submit" className="w-full">Sign In</Button>
    </form>
  );
}

function UserSignUpForm({ formRef , handleSubmit }) {
  return (
    <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
      <InputField label="Name" id="user-name" placeholder="Enter your name" />
      <InputField label="Email" id="user-signup-email" type="email" placeholder="Enter your email" />
      <InputField label="Phone Number" id="user-phone" type="tel" placeholder="Enter your phone number" />
      <InputField label="Family Phone Number" id="user-family-phone" type="tel" placeholder="Enter family phone number" />
      <InputField label="Address" id="user-address" placeholder="Enter your address" />
      <Button type="submit" className="w-full">Sign Up</Button>
    </form>
  );
}

function HospitalSignInForm({formRef,  handleSubmit }) {
  return (
    <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
      <InputField label="Hospital Email" id="hospital-email" type="email" placeholder="Enter hospital email" />
      <InputField label="Password" id="hospital-password" type="password" placeholder="Enter password" />
      <Button type="submit" className="w-full">Sign In</Button>
    </form>
  );
}

function HospitalSignUpForm({formRef,  handleSubmit }) {
  return (
    <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
      <InputField label="Hospital Name" id="hospital-name" placeholder="Enter hospital name" />
      <InputField label="Address" id="hospital-address" placeholder="Enter hospital address" />
      <InputField label="Phone Number" id="hospital-number" type="tel" placeholder="Enter hospital phone number" />
      <InputField label="Email" id="hospital-signup-email" type="email" placeholder="Enter hospital email" />
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
