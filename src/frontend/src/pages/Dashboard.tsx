import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Eye,
  Heart,
  MessageCircle,
  PlusCircle,
  Repeat2,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { OrderStatus, Service } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  SERVICE_INFO,
  useGetBalance,
  useGetCallerUserProfile,
  useGetOrderHistory,
} from "../hooks/useQueries";

const serviceIcons: Record<Service, React.ReactNode> = {
  [Service.views10k]: <Eye className="w-5 h-5" />,
  [Service.likes1k]: <Heart className="w-5 h-5" />,
  [Service.followers10k]: <Users className="w-5 h-5" />,
  [Service.followers1k]: <Users className="w-5 h-5" />,
  [Service.comments100]: <MessageCircle className="w-5 h-5" />,
  [Service.repost]: <Repeat2 className="w-5 h-5" />,
};

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.pending]: "bg-warning/20 text-warning border-warning/30",
  [OrderStatus.processing]: "bg-primary/20 text-primary border-primary/30",
  [OrderStatus.completed]: "bg-success/20 text-success border-success/30",
};

const quickServices = [
  Service.followers1k,
  Service.views10k,
  Service.likes1k,
  Service.comments100,
  Service.followers10k,
  Service.repost,
];

export default function Dashboard() {
  const { identity } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();
  const { data: balance, isLoading: balanceLoading } = useGetBalance();
  const { data: orders, isLoading: ordersLoading } = useGetOrderHistory();

  if (!identity) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="dashboard.error_state"
      >
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Please login to access your dashboard.
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

  const recentOrders = orders
    ? [...orders].sort((a, b) => Number(b.timestamp - a.timestamp)).slice(0, 3)
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display font-bold text-3xl sm:text-4xl mb-1">
          Welcome back{profile ? `, ${profile.name}` : ""}! 👋
        </h1>
        <p className="text-muted-foreground">
          Manage your Instagram growth campaigns
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="ig-gradient rounded-2xl p-6 sm:p-8 shadow-glow relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 20%, white, transparent)",
            }}
          />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-white/70 text-sm font-medium mb-1">
                Wallet Balance
              </p>
              {balanceLoading ? (
                <Skeleton
                  className="h-12 w-32 bg-white/20"
                  data-ocid="dashboard.balance.loading_state"
                />
              ) : (
                <p
                  className="font-display font-bold text-5xl text-white"
                  data-ocid="dashboard.balance.card"
                >
                  ₹{Number(balance ?? 0)}
                </p>
              )}
              <p className="text-white/60 text-sm mt-1">Available to spend</p>
            </div>
            <Link to="/add-funds">
              <Button
                size="lg"
                className="bg-white text-primary font-bold hover:bg-white/90 shadow-lg"
                data-ocid="dashboard.add_funds.button"
              >
                <PlusCircle className="w-4 h-4 mr-2" /> Add Funds
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-xl">Quick Order</h2>
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            data-ocid="dashboard.all_services.link"
          >
            All services <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickServices.map((service, i) => {
            const info = SERVICE_INFO[service];
            return (
              <Link key={service} to="/place-order" search={{ service }}>
                <Card
                  className="ig-border bg-card hover:shadow-glow transition-all group cursor-pointer h-full"
                  data-ocid={`dashboard.quick_order.item.${i + 1}`}
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 rounded-xl ig-gradient flex items-center justify-center text-white mx-auto mb-3 group-hover:scale-110 transition-transform">
                      {serviceIcons[service]}
                    </div>
                    <p className="text-xs font-semibold text-foreground leading-tight">
                      {info.label}
                    </p>
                    <p className="text-xs mt-1 font-bold ig-gradient-text">
                      {info.price === 0 ? "FREE" : `₹${info.price}`}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-xl">Recent Orders</h2>
          <Link
            to="/orders"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            data-ocid="dashboard.all_orders.link"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {ordersLoading ? (
          <div className="space-y-3" data-ocid="dashboard.orders.loading_state">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-16 w-full" />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <Card
            className="bg-card border-border"
            data-ocid="dashboard.orders.empty_state"
          >
            <CardContent className="py-12 text-center">
              <TrendingUp className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                No orders yet. Place your first order!
              </p>
              <Link to="/place-order" search={{ service: Service.followers1k }}>
                <Button className="mt-4 ig-gradient text-white border-0">
                  Place Order
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order, i) => (
              <Card
                key={String(order.id)}
                className="bg-card border-border"
                data-ocid={`dashboard.order.item.${i + 1}`}
              >
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl ig-gradient flex items-center justify-center text-white flex-shrink-0">
                      {serviceIcons[order.service]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {SERVICE_INFO[order.service].label}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {order.link}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-bold text-sm">
                      ₹{Number(order.amount)}
                    </span>
                    <Badge className={statusColors[order.status]}>
                      {order.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
