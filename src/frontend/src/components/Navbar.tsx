import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Instagram, LogOut, Menu, Shield, Wallet, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetBalance, useIsAdmin } from "../hooks/useQueries";

export default function Navbar() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const qc = useQueryClient();
  const isAuthenticated = !!identity;
  const { data: balance } = useGetBalance();
  const { data: isAdmin } = useIsAdmin();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      qc.clear();
    } else {
      try {
        await login();
      } catch (e: any) {
        if (e?.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const balanceDisplay = balance !== undefined ? `₹${Number(balance)}` : null;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 group"
          data-ocid="nav.link"
        >
          <div className="w-8 h-8 rounded-lg ig-gradient flex items-center justify-center shadow-glow">
            <Instagram className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg ig-gradient-text">
            InstaBoost
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className="px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                data-ocid="nav.dashboard.link"
              >
                Dashboard
              </Link>
              <Link
                to="/orders"
                className="px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                data-ocid="nav.orders.link"
              >
                Orders
              </Link>
              <Link
                to="/funds"
                className="px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                data-ocid="nav.funds.link"
              >
                Fund History
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  data-ocid="nav.admin.link"
                >
                  <Shield className="w-3.5 h-3.5 inline mr-1" />
                  Admin
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && balanceDisplay && (
            <Link to="/add-funds" data-ocid="nav.balance.button">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border text-sm font-semibold hover:border-primary/50 transition-colors">
                <Wallet className="w-3.5 h-3.5 text-primary" />
                <span className="ig-gradient-text">{balanceDisplay}</span>
              </div>
            </Link>
          )}
          <Button
            onClick={handleAuth}
            disabled={loginStatus === "logging-in"}
            size="sm"
            className={
              isAuthenticated
                ? "bg-muted hover:bg-secondary text-foreground border border-border"
                : "ig-gradient text-white border-0 shadow-glow hover:opacity-90 transition-opacity"
            }
            data-ocid="nav.auth.button"
          >
            {isAuthenticated ? (
              <>
                <LogOut className="w-3.5 h-3.5 mr-1" />
                Logout
              </>
            ) : loginStatus === "logging-in" ? (
              "Connecting..."
            ) : (
              "Login"
            )}
          </Button>
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {balanceDisplay && (
                <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold">
                  <Wallet className="w-4 h-4 text-primary" />
                  Balance:{" "}
                  <span className="ig-gradient-text">{balanceDisplay}</span>
                </div>
              )}
              <Link
                to="/dashboard"
                className="px-3 py-2 rounded-md text-sm hover:bg-muted"
                onClick={() => setMenuOpen(false)}
                data-ocid="nav.mobile.dashboard.link"
              >
                Dashboard
              </Link>
              <Link
                to="/add-funds"
                className="px-3 py-2 rounded-md text-sm hover:bg-muted"
                onClick={() => setMenuOpen(false)}
                data-ocid="nav.mobile.addfunds.link"
              >
                Add Funds
              </Link>
              <Link
                to="/orders"
                className="px-3 py-2 rounded-md text-sm hover:bg-muted"
                onClick={() => setMenuOpen(false)}
                data-ocid="nav.mobile.orders.link"
              >
                Orders
              </Link>
              <Link
                to="/funds"
                className="px-3 py-2 rounded-md text-sm hover:bg-muted"
                onClick={() => setMenuOpen(false)}
                data-ocid="nav.mobile.funds.link"
              >
                Fund History
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="px-3 py-2 rounded-md text-sm hover:bg-muted"
                  onClick={() => setMenuOpen(false)}
                  data-ocid="nav.mobile.admin.link"
                >
                  <Shield className="w-3.5 h-3.5 inline mr-1" />
                  Admin
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
