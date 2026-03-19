import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCreateUser, useGetCallerUserProfile } from "../hooks/useQueries";

export default function ProfileSetupModal() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();
  const createUser = useCreateUser();
  const [name, setName] = useState("");

  const showModal =
    isAuthenticated && !isLoading && isFetched && userProfile === null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createUser.mutateAsync(name.trim());
      toast.success("Profile created! Welcome to InstaBoost 🎉");
    } catch {
      toast.error("Failed to create profile. Please try again.");
    }
  };

  return (
    <Dialog open={showModal}>
      <DialogContent
        className="bg-card border-border max-w-sm"
        data-ocid="profile_setup.dialog"
      >
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl ig-gradient flex items-center justify-center shadow-glow">
              <Instagram className="w-7 h-7 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center font-display text-xl">
            Welcome to InstaBoost!
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Enter your name to get started with your account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="username">Your Name</Label>
            <Input
              id="username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aditya"
              className="bg-input border-border"
              data-ocid="profile_setup.input"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            disabled={!name.trim() || createUser.isPending}
            className="w-full ig-gradient text-white border-0 shadow-glow hover:opacity-90"
            data-ocid="profile_setup.submit_button"
          >
            {createUser.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Get Started
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
