import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import { CheckCircle, Loader2, Shield, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { FundRequestStatus, OrderStatus } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  SERVICE_INFO,
  useGetAllFundRequests,
  useGetAllOrders,
  useIsAdmin,
  useProcessFundRequest,
} from "../hooks/useQueries";

const statusBadge: Record<FundRequestStatus, string> = {
  [FundRequestStatus.pending]: "bg-warning/20 text-warning border-warning/30",
  [FundRequestStatus.approved]: "bg-success/20 text-success border-success/30",
  [FundRequestStatus.rejected]:
    "bg-destructive/20 text-destructive border-destructive/30",
};

const orderStatusBadge: Record<OrderStatus, string> = {
  [OrderStatus.pending]: "bg-warning/20 text-warning border-warning/30",
  [OrderStatus.processing]: "bg-primary/20 text-primary border-primary/30",
  [OrderStatus.completed]: "bg-success/20 text-success border-success/30",
};

export default function AdminPanel() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: fundRequests, isLoading: frLoading } = useGetAllFundRequests();
  const { data: allOrders, isLoading: ordersLoading } = useGetAllOrders();
  const processMutation = useProcessFundRequest();

  if (!identity) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Please login to access admin panel.
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

  if (adminLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="admin.error_state"
      >
        <div className="text-center">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display font-bold text-2xl mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            You don't have admin privileges.
          </p>
        </div>
      </div>
    );
  }

  const pendingRequests =
    fundRequests?.filter((r) => r.status === FundRequestStatus.pending) ?? [];
  const allRequestsSorted = fundRequests
    ? [...fundRequests].sort((a, b) => Number(b.timestamp - a.timestamp))
    : [];
  const allOrdersSorted = allOrders
    ? [...allOrders].sort((a, b) => Number(b.timestamp - a.timestamp))
    : [];

  const handleProcess = async (id: bigint, approve: boolean) => {
    try {
      await processMutation.mutateAsync({ id, approve });
      toast.success(
        approve ? "Fund request approved!" : "Fund request rejected.",
      );
    } catch {
      toast.error("Failed to process request.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl ig-gradient flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl">Admin Panel</h1>
            <p className="text-muted-foreground text-sm">
              Manage fund requests and orders
            </p>
          </div>
          {pendingRequests.length > 0 && (
            <Badge className="bg-warning/20 text-warning border-warning/30 ml-auto">
              {pendingRequests.length} pending
            </Badge>
          )}
        </div>

        <Tabs defaultValue="fund-requests" className="w-full">
          <TabsList
            className="bg-muted border border-border mb-6"
            data-ocid="admin.tabs"
          >
            <TabsTrigger
              value="fund-requests"
              className="data-[state=active]:ig-gradient data-[state=active]:text-white"
              data-ocid="admin.fund_requests.tab"
            >
              Fund Requests
              {pendingRequests.length > 0 && (
                <span className="ml-2 w-5 h-5 rounded-full bg-warning text-background text-xs font-bold flex items-center justify-center">
                  {pendingRequests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="all-orders"
              className="data-[state=active]:ig-gradient data-[state=active]:text-white"
              data-ocid="admin.all_orders.tab"
            >
              All Orders
            </TabsTrigger>
          </TabsList>

          {/* Fund Requests Tab */}
          <TabsContent value="fund-requests">
            {frLoading ? (
              <div
                className="space-y-3"
                data-ocid="admin.fund_requests.loading_state"
              >
                {[1, 2, 3].map((n) => (
                  <Skeleton key={n} className="h-16 w-full" />
                ))}
              </div>
            ) : allRequestsSorted.length === 0 ? (
              <Card
                className="bg-card border-border"
                data-ocid="admin.fund_requests.empty_state"
              >
                <CardContent className="py-12 text-center text-muted-foreground">
                  No fund requests yet.
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table data-ocid="admin.fund_requests.table">
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground">
                          User
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Amount
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          UTR
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Time
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Status
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allRequestsSorted.map((req, i) => (
                        <TableRow
                          key={String(req.id)}
                          className="border-border hover:bg-muted/30"
                          data-ocid={`admin.fund_request.row.${i + 1}`}
                        >
                          <TableCell className="font-mono text-xs text-muted-foreground max-w-[100px] truncate">
                            {req.user.toString().slice(0, 12)}...
                          </TableCell>
                          <TableCell className="font-bold">
                            ₹{Number(req.amount)}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {req.utr}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(
                              Number(req.timestamp) / 1_000_000,
                            ).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge className={statusBadge[req.status]}>
                              {req.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {req.status === FundRequestStatus.pending ? (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="bg-success/20 text-success hover:bg-success/30 border border-success/30 h-7 px-3"
                                  onClick={() => handleProcess(req.id, true)}
                                  disabled={processMutation.isPending}
                                  data-ocid={`admin.approve.button.${i + 1}`}
                                >
                                  {processMutation.isPending ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                  )}
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/30 h-7 px-3"
                                  onClick={() => handleProcess(req.id, false)}
                                  disabled={processMutation.isPending}
                                  data-ocid={`admin.reject.button.${i + 1}`}
                                >
                                  <XCircle className="w-3.5 h-3.5 mr-1" />{" "}
                                  Reject
                                </Button>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                Processed
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* All Orders Tab */}
          <TabsContent value="all-orders">
            {ordersLoading ? (
              <div
                className="space-y-3"
                data-ocid="admin.all_orders.loading_state"
              >
                {[1, 2, 3].map((n) => (
                  <Skeleton key={n} className="h-16 w-full" />
                ))}
              </div>
            ) : allOrdersSorted.length === 0 ? (
              <Card
                className="bg-card border-border"
                data-ocid="admin.all_orders.empty_state"
              >
                <CardContent className="py-12 text-center text-muted-foreground">
                  No orders yet.
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table data-ocid="admin.orders.table">
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground">
                          User
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Service
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Link
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Amount
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Time
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allOrdersSorted.map((order, i) => (
                        <TableRow
                          key={String(order.id)}
                          className="border-border hover:bg-muted/30"
                          data-ocid={`admin.order.row.${i + 1}`}
                        >
                          <TableCell className="font-mono text-xs text-muted-foreground max-w-[100px] truncate">
                            {order.user.toString().slice(0, 12)}...
                          </TableCell>
                          <TableCell className="font-semibold text-sm">
                            {SERVICE_INFO[order.service].label}
                          </TableCell>
                          <TableCell className="max-w-[150px] truncate">
                            <a
                              href={order.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline"
                            >
                              {order.link}
                            </a>
                          </TableCell>
                          <TableCell className="font-bold">
                            ₹{Number(order.amount)}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(
                              Number(order.timestamp) / 1_000_000,
                            ).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge className={orderStatusBadge[order.status]}>
                              {order.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
