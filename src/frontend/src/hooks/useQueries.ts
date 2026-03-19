import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type FundRequest,
  type Order,
  Service,
  type UserProfile,
  UserRole,
} from "../backend";
import { useActor } from "./useActor";

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetBalance() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["balance"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getBalance();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useGetOrderHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orderHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrderHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFundHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<FundRequest[]>({
    queryKey: ["fundHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFundRequestHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllFundRequests() {
  const { actor, isFetching } = useActor();
  return useQuery<FundRequest[]>({
    queryKey: ["allFundRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFundRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["allOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateUser() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.createUser(name);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["currentUserProfile"] });
      qc.invalidateQueries({ queryKey: ["balance"] });
    },
  });
}

export function useRequestFunds() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ amount, utr }: { amount: bigint; utr: string }) => {
      if (!actor) throw new Error("Not connected");
      await actor.requestFunds(amount, utr);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["fundHistory"] });
      qc.invalidateQueries({ queryKey: ["balance"] });
    },
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      service,
      link,
    }: { service: Service; link: string }) => {
      if (!actor) throw new Error("Not connected");
      await actor.placeOrder(service, link);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orderHistory"] });
      qc.invalidateQueries({ queryKey: ["balance"] });
    },
  });
}

export function useProcessFundRequest() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, approve }: { id: bigint; approve: boolean }) => {
      if (!actor) throw new Error("Not connected");
      await actor.processFundRequest(id, approve);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allFundRequests"] });
    },
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export const SERVICE_INFO: Record<
  Service,
  {
    label: string;
    price: number;
    description: string;
    linkType: "profile" | "post" | "any";
  }
> = {
  [Service.views10k]: {
    label: "10,000 Views",
    price: 20,
    description: "Boost your reel/video views",
    linkType: "post",
  },
  [Service.likes1k]: {
    label: "1,000 Likes",
    price: 12,
    description: "Get instant post likes",
    linkType: "post",
  },
  [Service.followers10k]: {
    label: "10,000 Followers",
    price: 599,
    description: "Grow your following fast",
    linkType: "profile",
  },
  [Service.followers1k]: {
    label: "1,000 Followers",
    price: 28,
    description: "Steady follower growth",
    linkType: "profile",
  },
  [Service.comments100]: {
    label: "100 Comments",
    price: 50,
    description: "Real-looking engagement",
    linkType: "post",
  },
  [Service.repost]: {
    label: "Repost",
    price: 0,
    description: "Free repost service",
    linkType: "post",
  },
};
