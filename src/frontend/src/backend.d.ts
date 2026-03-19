import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface FundRequest {
    id: bigint;
    utr: string;
    status: FundRequestStatus;
    user: Principal;
    timestamp: Time;
    amount: bigint;
}
export interface Order {
    id: bigint;
    service: Service;
    status: OrderStatus;
    link: string;
    user: Principal;
    timestamp: Time;
    amount: bigint;
}
export interface UserProfile {
    balance: bigint;
    name: string;
}
export enum FundRequestStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum OrderStatus {
    pending = "pending",
    completed = "completed",
    processing = "processing"
}
export enum Service {
    repost = "repost",
    likes1k = "likes1k",
    views10k = "views10k",
    followers10k = "followers10k",
    comments100 = "comments100",
    followers1k = "followers1k"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createUser(name: string): Promise<void>;
    getAllFundRequests(): Promise<Array<FundRequest>>;
    getAllOrders(): Promise<Array<Order>>;
    getBalance(): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFundRequestHistory(): Promise<Array<FundRequest>>;
    getOrderHistory(): Promise<Array<Order>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(service: Service, link: string): Promise<void>;
    processFundRequest(id: bigint, approve: boolean): Promise<void>;
    requestFunds(amount: bigint, utr: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
