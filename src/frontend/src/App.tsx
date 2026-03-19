import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProfileSetupModal from "./components/ProfileSetupModal";
import AddFunds from "./pages/AddFunds";
import AdminPanel from "./pages/AdminPanel";
import Dashboard from "./pages/Dashboard";
import FundHistory from "./pages/FundHistory";
import LandingPage from "./pages/LandingPage";
import OrderHistory from "./pages/OrderHistory";
import PlaceOrder from "./pages/PlaceOrder";

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-body">
      <Navbar />
      <ProfileSetupModal />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster theme="dark" position="top-right" richColors />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard,
});
const addFundsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/add-funds",
  component: AddFunds,
});
const placeOrderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/place-order",
  component: PlaceOrder,
});
const orderHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders",
  component: OrderHistory,
});
const fundHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/funds",
  component: FundHistory,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPanel,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  addFundsRoute,
  placeOrderRoute,
  orderHistoryRoute,
  fundHistoryRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
