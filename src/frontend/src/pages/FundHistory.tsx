import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { PlusCircle, Wallet } from "lucide-react";
import { motion } from "motion/react";
import { FundRequestStatus } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetFundHistory } from "../hooks/useQueries";

const statusColors: Record<FundRequestStatus, string> = {
  [FundRequestStatus.pending]: "bg-warning/20 text-warning border-warning/30",
  [FundRequestStatus.approved]: "bg-success/20 text-success border-success/30",
  [FundRequestStatus.rejected]:
    "bg-destructive/20 text-destructive border-destructive/30",
};

export default function FundHistory() {
  const { identity } = useInternetIdentity();
  const { data: requests, isLoading } = useGetFundHistory();

  if (!identity) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Please login to view fund history.
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

  const sorted = requests
    ? [...requests].sort((a, b) => Number(b.timestamp - a.timestamp))
    : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-display font-bold text-3xl">Fund History</h1>
          <Link to="/add-funds">
            <Button
              size="sm"
              className="ig-gradient text-white border-0"
              data-ocid="fund_history.add_funds.button"
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Add Funds
            </Button>
          </Link>
        </div>
        <p className="text-muted-foreground mb-8">
          All your fund top-up requests
        </p>

        {isLoading ? (
          <div className="space-y-3" data-ocid="fund_history.loading_state">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-20 w-full" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <Card
            className="bg-card border-border"
            data-ocid="fund_history.empty_state"
          >
            <CardContent className="py-16 text-center">
              <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display font-bold text-xl mb-2">
                No fund requests yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Add funds to your wallet to start buying services.
              </p>
              <Link to="/add-funds">
                <Button
                  className="ig-gradient text-white border-0"
                  data-ocid="fund_history.add_funds_empty.button"
                >
                  Add Funds
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {sorted.map((req, i) => (
              <motion.div
                key={String(req.id)}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className="bg-card border-border"
                  data-ocid={`fund_history.item.${i + 1}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl ig-gradient flex items-center justify-center text-white flex-shrink-0">
                          <Wallet className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold">₹{Number(req.amount)}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            UTR: {req.utr}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(
                              Number(req.timestamp) / 1_000_000,
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={statusColors[req.status]}>
                        {req.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
