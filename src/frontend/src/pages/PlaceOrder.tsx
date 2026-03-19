import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useSearch } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Loader2,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Service } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  SERVICE_INFO,
  useGetBalance,
  usePlaceOrder,
} from "../hooks/useQueries";

const allServices = [
  Service.followers1k,
  Service.followers10k,
  Service.views10k,
  Service.likes1k,
  Service.comments100,
  Service.repost,
];

export default function PlaceOrder() {
  const { identity } = useInternetIdentity();
  const search = useSearch({ strict: false }) as { service?: Service };
  const [selectedService, setSelectedService] = useState<Service>(
    search.service ?? Service.followers1k,
  );
  const [link, setLink] = useState("");
  const [success, setSuccess] = useState(false);

  const { data: balance } = useGetBalance();
  const placeOrder = usePlaceOrder();

  if (!identity) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Please login to place an order.
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

  const info = SERVICE_INFO[selectedService];
  const balanceNum = Number(balance ?? 0);
  const canAfford = info.price === 0 || balanceNum >= info.price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link.trim()) {
      toast.error("Please enter your Instagram link");
      return;
    }
    if (!canAfford) {
      toast.error("Insufficient balance. Please add funds.");
      return;
    }
    try {
      await placeOrder.mutateAsync({
        service: selectedService,
        link: link.trim(),
      });
      setSuccess(true);
      toast.success("Order placed successfully! 🎉");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to place order. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-sm"
        >
          <div
            className="w-20 h-20 rounded-full bg-success/20 border-2 border-success flex items-center justify-center mx-auto mb-6"
            data-ocid="place_order.success_state"
          >
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="font-display font-bold text-2xl mb-3">
            Order Placed!
          </h2>
          <p className="text-muted-foreground mb-6">
            Your order has been received and will be processed shortly.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              className="border-border"
              onClick={() => {
                setSuccess(false);
                setLink("");
              }}
              data-ocid="place_order.new_order.button"
            >
              New Order
            </Button>
            <Link to="/orders">
              <Button className="ig-gradient text-white border-0">
                View Orders
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display font-bold text-3xl mb-2">Place Order</h1>
        <p className="text-muted-foreground mb-8">
          Select a service and provide your Instagram link.
        </p>

        <Card className="ig-border bg-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Service select */}
              <div className="space-y-2">
                <Label>Service</Label>
                <Select
                  value={selectedService}
                  onValueChange={(v) => setSelectedService(v as Service)}
                >
                  <SelectTrigger
                    className="bg-input border-border"
                    data-ocid="place_order.service.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {allServices.map((s) => (
                      <SelectItem key={s} value={s} className="hover:bg-muted">
                        {SERVICE_INFO[s].label} —{" "}
                        {SERVICE_INFO[s].price === 0
                          ? "FREE"
                          : `₹${SERVICE_INFO[s].price}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Link input */}
              <div className="space-y-2">
                <Label htmlFor="ig-link">
                  {info.linkType === "profile"
                    ? "Instagram Profile URL"
                    : "Instagram Post URL"}
                </Label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="ig-link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder={
                      info.linkType === "profile"
                        ? "https://instagram.com/yourusername"
                        : "https://instagram.com/p/..."
                    }
                    className="bg-input border-border pl-10 text-base"
                    data-ocid="place_order.link.input"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {info.linkType === "profile"
                    ? "Paste your Instagram profile link"
                    : "Paste the link to your Instagram post/reel"}
                </p>
              </div>

              {/* Price & Balance */}
              <div className="bg-muted rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service Price</span>
                  <span className="font-bold">
                    {info.price === 0 ? "FREE" : `₹${info.price}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Your Balance</span>
                  <span
                    className={`font-bold ${canAfford ? "text-success" : "text-destructive"}`}
                  >
                    ₹{balanceNum}
                  </span>
                </div>
                {!canAfford && (
                  <div
                    className="flex items-center gap-2 text-xs text-destructive pt-1"
                    data-ocid="place_order.balance.error_state"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    Insufficient balance.
                    <Link
                      to="/add-funds"
                      className="underline hover:no-underline"
                    >
                      Add funds →
                    </Link>
                  </div>
                )}
              </div>

              {/* Balance info */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Wallet className="w-3.5 h-3.5" />
                Balance after order: ₹{Math.max(0, balanceNum - info.price)}
              </div>

              <Button
                type="submit"
                disabled={placeOrder.isPending || !link.trim() || !canAfford}
                className="w-full ig-gradient text-white border-0 shadow-glow hover:opacity-90 text-base py-5"
                data-ocid="place_order.submit_button"
              >
                {placeOrder.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {placeOrder.isPending
                  ? "Processing..."
                  : `Confirm Order${info.price > 0 ? ` — ₹${info.price}` : " — FREE"}`}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
