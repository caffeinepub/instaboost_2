import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";
import { CheckCircle, Clock, Copy, Loader2, Wallet } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useRequestFunds } from "../hooks/useQueries";

const UPI_ID = "adityahere777@fam";

export default function AddFunds() {
  const { identity } = useInternetIdentity();
  const [amount, setAmount] = useState("");
  const [utr, setUtr] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const requestFunds = useRequestFunds();

  if (!identity) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Please login to add funds.
          </p>
          <Link to="/">
            <Button className="ig-gradient text-white border-0">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    toast.success("UPI ID copied!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number.parseInt(amount, 10);
    if (!amt || amt < 1) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!utr.trim()) {
      toast.error("Please enter your UTR number");
      return;
    }
    try {
      await requestFunds.mutateAsync({ amount: BigInt(amt), utr: utr.trim() });
      setSubmitted(true);
      toast.success("Fund request submitted! Confirming within 5 minutes.");
    } catch {
      toast.error("Failed to submit request. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-sm"
        >
          <div
            className="w-20 h-20 rounded-full bg-success/20 border-2 border-success flex items-center justify-center mx-auto mb-6"
            data-ocid="add_funds.success_state"
          >
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="font-display font-bold text-2xl mb-3">
            Request Submitted!
          </h2>
          <p className="text-muted-foreground mb-6">
            Your fund request is being processed. Funds will be added within 5
            minutes.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/funds">
              <Button variant="outline" className="border-border">
                View History
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button className="ig-gradient text-white border-0">
                Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display font-bold text-3xl mb-2">Add Funds</h1>
        <p className="text-muted-foreground mb-8">
          Pay via UPI and submit your UTR to top up your wallet.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <Card className="ig-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <span className="w-6 h-6 rounded-full ig-gradient text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                Scan & Pay
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl overflow-hidden border border-border bg-white p-2">
                <img
                  src="/assets/uploads/IMG_1629-1-1.jpeg"
                  alt="Payment QR Code"
                  className="w-full h-48 object-contain rounded-lg"
                  data-ocid="add_funds.qr.card"
                />
              </div>
              <div className="flex items-center justify-between bg-muted rounded-lg px-3 py-2.5 border border-border">
                <div>
                  <p className="text-xs text-muted-foreground">UPI ID</p>
                  <p className="font-mono font-semibold text-sm text-foreground">
                    {UPI_ID}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopyUPI}
                  className="text-muted-foreground hover:text-foreground"
                  data-ocid="add_funds.copy_upi.button"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                <Clock className="w-3.5 h-3.5 text-warning flex-shrink-0" />
                Payment confirmed within 5 minutes
              </div>
            </CardContent>
          </Card>

          <Card className="ig-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <span className="w-6 h-6 rounded-full ig-gradient text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                Submit UTR
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount you paid"
                    className="bg-input border-border text-base"
                    data-ocid="add_funds.amount.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="utr">UTR Number</Label>
                  <Input
                    id="utr"
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    placeholder="Paste your UTR / Transaction ID"
                    className="bg-input border-border text-base font-mono"
                    data-ocid="add_funds.utr.input"
                  />
                  <p className="text-xs text-muted-foreground">
                    Found in your UPI app after payment
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={requestFunds.isPending || !amount || !utr}
                  className="w-full ig-gradient text-white border-0 shadow-glow hover:opacity-90 mt-2"
                  data-ocid="add_funds.submit_button"
                >
                  {requestFunds.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Wallet className="w-4 h-4 mr-2" />
                  )}
                  Submit Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-3">
            Quick select amount:
          </p>
          <div className="flex flex-wrap gap-2">
            {[20, 28, 50, 100, 200, 599].map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAmount(String(a))}
                className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                  amount === String(a)
                    ? "ig-gradient text-white border-transparent"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
                data-ocid="add_funds.quick_amount.button"
              >
                ₹{a}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
