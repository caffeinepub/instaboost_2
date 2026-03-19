import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  Eye,
  Heart,
  MessageCircle,
  Repeat2,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { OrderStatus, Service } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { SERVICE_INFO, useGetOrderHistory } from "../hooks/useQueries";

const serviceIcons: Record<Service, React.ReactNode> = {
  [Service.views10k]: <Eye className="w-4 h-4" />,
  [Service.likes1k]: <Heart className="w-4 h-4" />,
  [Service.followers10k]: <Users className="w-4 h-4" />,
  [Service.followers1k]: <Users className="w-4 h-4" />,
  [Service.comments100]: <MessageCircle className="w-4 h-4" />,
  [Service.repost]: <Repeat2 className="w-4 h-4" />,
};

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.pending]: "bg-warning/20 text-warning border-warning/30",
  [OrderStatus.processing]: "bg-primary/20 text-primary border-primary/30",
  [OrderStatus.completed]: "bg-success/20 text-success border-success/30",
};

export default function OrderHistory() {
  const { identity } = useInternetIdentity();
  const { data: orders, isLoading } = useGetOrderHistory();

  if (!identity) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Please login to view orders.
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

  const sorted = orders
    ? [...orders].sort((a, b) => Number(b.timestamp - a.timestamp))
    : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display font-bold text-3xl mb-2">Order History</h1>
        <p className="text-muted-foreground mb-8">
          Track all your Instagram growth orders
        </p>

        {isLoading ? (
          <div className="space-y-3" data-ocid="orders.loading_state">
            {[1, 2, 3, 4].map((n) => (
              <Skeleton key={n} className="h-20 w-full" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <Card
            className="bg-card border-border"
            data-ocid="orders.empty_state"
          >
            <CardContent className="py-16 text-center">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display font-bold text-xl mb-2">
                No orders yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Place your first order to grow your Instagram!
              </p>
              <Link to="/place-order" search={{ service: Service.followers1k }}>
                <Button className="ig-gradient text-white border-0">
                  Place Order
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {sorted.map((order, i) => (
              <motion.div
                key={String(order.id)}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className="bg-card border-border hover:border-border/80 transition-colors"
                  data-ocid={`orders.item.${i + 1}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl ig-gradient flex items-center justify-center text-white flex-shrink-0">
                          {serviceIcons[order.service]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold">
                            {SERVICE_INFO[order.service].label}
                          </p>
                          <a
                            href={order.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline truncate block max-w-[200px] sm:max-w-none"
                          >
                            {order.link}
                          </a>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(
                              Number(order.timestamp) / 1_000_000,
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Badge className={statusColors[order.status]}>
                          {order.status}
                        </Badge>
                        <span className="font-bold text-sm">
                          ₹{Number(order.amount)}
                        </span>
                      </div>
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
