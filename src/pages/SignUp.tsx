import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const SignUp = () => {
  const navigate = useNavigate();
  const { togglePreviewAuth } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Create an account</h1>
          <p className="text-muted-foreground">Start predicting on Predito today</p>
        </div>

        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            // Auth handled by backend/Privy integration
            togglePreviewAuth();
            navigate("/");
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
            />
          </div>

          <Button type="submit" className="w-full">
            Continue with Email
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link to="/signin" className="text-primary hover:text-primary-hover font-medium">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SignUp;