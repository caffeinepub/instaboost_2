import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Repeat2,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { Service } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { SERVICE_INFO } from "../hooks/useQueries";

const serviceIcons: Record<Service, React.ReactNode> = {
  [Service.views10k]: <Eye className="w-6 h-6" />,
  [Service.likes1k]: <Heart className="w-6 h-6" />,
  [Service.followers10k]: <Users className="w-6 h-6" />,
  [Service.followers1k]: <Users className="w-6 h-6" />,
  [Service.comments100]: <MessageCircle className="w-6 h-6" />,
  [Service.repost]: <Repeat2 className="w-6 h-6" />,
};

const services = [
  Service.followers10k,
  Service.followers1k,
  Service.views10k,
  Service.likes1k,
  Service.comments100,
  Service.repost,
];

export default function LandingPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative py-20 px-4 text-center">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(ellipse, oklch(0.68 0.27 295), oklch(0.68 0.27 350), transparent)",
            }}
          />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              className="mb-6 ig-gradient text-white border-0 px-4 py-1.5 text-sm"
              data-ocid="landing.badge"
            >
              <Zap className="w-3.5 h-3.5 mr-1" /> Instant Delivery · Real
              Results
            </Badge>
            <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl leading-tight mb-6">
              Boost Your
              <span className="ig-gradient-text block">Instagram Growth</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              Get real followers, likes, views, and comments at unbeatable
              prices. Starting from just ₹12.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button
                    size="lg"
                    className="ig-gradient text-white border-0 shadow-glow hover:opacity-90 px-8"
                    data-ocid="landing.dashboard.button"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" /> Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Button
                  size="lg"
                  onClick={() => login()}
                  disabled={loginStatus === "logging-in"}
                  className="ig-gradient text-white border-0 shadow-glow hover:opacity-90 px-8"
                  data-ocid="landing.login.button"
                >
                  {loginStatus === "logging-in"
                    ? "Connecting..."
                    : "Get Started Free"}
                </Button>
              )}
              <a href="#services">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border hover:border-primary/50 px-8"
                  data-ocid="landing.services.button"
                >
                  View Packages
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto"
          >
            {[
              { label: "Orders Delivered", value: "50K+" },
              { label: "Happy Users", value: "10K+" },
              { label: "Avg Delivery", value: "< 5 min" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display font-bold text-2xl ig-gradient-text">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-3">
              Our Packages
            </h2>
            <p className="text-muted-foreground">
              Affordable plans to grow your Instagram presence
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => {
              const info = SERVICE_INFO[service];
              return (
                <motion.div
                  key={service}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Card
                    className="ig-border bg-card hover:shadow-glow transition-all duration-300 group h-full"
                    data-ocid={`services.item.${i + 1}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="w-12 h-12 rounded-xl ig-gradient flex items-center justify-center text-white mb-4 shadow-glow group-hover:scale-110 transition-transform">
                        {serviceIcons[service]}
                      </div>
                      <CardTitle className="font-display text-xl">
                        {info.label}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {info.description}
                      </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-end justify-between mb-5">
                        {info.price === 0 ? (
                          <span className="font-display font-bold text-3xl text-success">
                            FREE
                          </span>
                        ) : (
                          <div>
                            <span className="font-display font-bold text-3xl ig-gradient-text">
                              ₹{info.price}
                            </span>
                            <span className="text-muted-foreground text-sm ml-1">
                              /order
                            </span>
                          </div>
                        )}
                        {service === Service.followers10k && (
                          <Badge className="bg-accent/20 text-accent border-accent/30">
                            Best Value
                          </Badge>
                        )}
                      </div>
                      {isAuthenticated ? (
                        <Link to="/place-order" search={{ service }}>
                          <Button
                            className="w-full ig-gradient text-white border-0 hover:opacity-90"
                            data-ocid={`services.buy.button.${i + 1}`}
                          >
                            Buy Now
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          className="w-full ig-gradient text-white border-0 hover:opacity-90"
                          onClick={() => login()}
                          data-ocid={`services.buy.button.${i + 1}`}
                        >
                          Login to Buy
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust features */}
      <section className="py-16 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            {
              icon: <Zap className="w-8 h-8" />,
              title: "Instant Start",
              desc: "Orders begin within minutes of payment",
            },
            {
              icon: <Shield className="w-8 h-8" />,
              title: "Safe & Secure",
              desc: "100% safe for your Instagram account",
            },
            {
              icon: <Clock className="w-8 h-8" />,
              title: "5 Min Payment",
              desc: "Fund confirmation in just 5 minutes via UPI",
            },
          ].map((f) => (
            <div key={f.title} className="space-y-3">
              <div className="w-16 h-16 rounded-2xl ig-gradient flex items-center justify-center text-white mx-auto shadow-glow">
                {f.icon}
              </div>
              <h3 className="font-display font-bold text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
