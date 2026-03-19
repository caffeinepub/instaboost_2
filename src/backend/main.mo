import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type Service = {
    #views10k;
    #likes1k;
    #followers10k;
    #followers1k;
    #comments100;
    #repost;
  };

  public type FundRequestStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type OrderStatus = {
    #pending;
    #processing;
    #completed;
  };

  public type FundRequest = {
    id : Nat;
    user : Principal;
    amount : Int;
    utr : Text;
    status : FundRequestStatus;
    timestamp : Time.Time;
  };

  public type Order = {
    id : Nat;
    user : Principal;
    service : Service;
    link : Text;
    amount : Int;
    status : OrderStatus;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
    balance : Int; // Balance in paise
  };

  // State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();
  let fundRequests = List.empty<FundRequest>();
  let orders = List.empty<Order>();
  var nextFundRequestId = 1;
  var nextOrderId = 1;

  // Service pricing in paise
  func getServicePrice(service : Service) : Int {
    switch (service) {
      case (#views10k) { 2000 };
      case (#likes1k) { 1200 };
      case (#followers10k) { 59900 };
      case (#followers1k) { 2800 };
      case (#comments100) { 5000 };
      case (#repost) { 0 };
    };
  };

  // Profile management functions (required by instructions)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // User functions
  public shared ({ caller }) func requestFunds(amount : Int, utr : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can request funds");
    };

    let fundRequest : FundRequest = {
      id = nextFundRequestId;
      user = caller;
      amount;
      utr;
      status = #pending;
      timestamp = Time.now();
    };

    fundRequests.add(fundRequest);
    nextFundRequestId += 1;
  };

  public shared ({ caller }) func placeOrder(service : Service, link : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    let profile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) { profile };
    };

    let price = getServicePrice(service);
    if (profile.balance < price) {
      Runtime.trap("Insufficient balance");
    };

    let order : Order = {
      id = nextOrderId;
      user = caller;
      service;
      link;
      amount = price;
      status = #pending;
      timestamp = Time.now();
    };

    orders.add(order);
    nextOrderId += 1;

    let updatedProfile : UserProfile = {
      name = profile.name;
      balance = profile.balance - price;
    };
    userProfiles.add(caller, updatedProfile);
  };

  public query ({ caller }) func getBalance() : async Int {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view balance");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) { profile.balance };
    };
  };

  public query ({ caller }) func getOrderHistory() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view order history");
    };

    orders.values().toArray().filter(
      func(order) {
        order.user == caller;
      }
    );
  };

  public query ({ caller }) func getFundRequestHistory() : async [FundRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view fund request history");
    };

    fundRequests.toArray().filter(
      func(fundRequest) {
        fundRequest.user == caller;
      }
    );
  };

  // Admin functions
  public query ({ caller }) func getAllFundRequests() : async [FundRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all fund requests");
    };
    fundRequests.toArray();
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.toArray();
  };

  public shared ({ caller }) func processFundRequest(id : Nat, approve : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can process fund requests");
    };

    let fundRequestsArray = fundRequests.toArray();
    let updatedRequests = fundRequestsArray.map(
      func(fundRequest) {
        if (fundRequest.id == id) {
          {
            id = fundRequest.id;
            user = fundRequest.user;
            amount = fundRequest.amount;
            utr = fundRequest.utr;
            status = if (approve) { #approved } else {
              #rejected;
            };
            timestamp = fundRequest.timestamp;
          };
        } else { fundRequest };
      }
    );

    fundRequests.clear();
    for (request in updatedRequests.values()) {
      fundRequests.add(request);
    };

    if (approve) {
      for (fundRequest in updatedRequests.values()) {
        if (fundRequest.id == id) {
          let profile = switch (userProfiles.get(fundRequest.user)) {
            case (null) { Runtime.trap("User profile not found") };
            case (?profile) { profile };
          };

          let updatedProfile : UserProfile = {
            name = profile.name;
            balance = profile.balance + fundRequest.amount;
          };
          userProfiles.add(fundRequest.user, updatedProfile);
        };
      };
    };
  };

  // User creation (legacy function, kept for compatibility)
  public shared ({ caller }) func createUser(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };

    if (userProfiles.containsKey(caller)) {
      Runtime.trap("User already exists");
    };

    let profile : UserProfile = {
      name;
      balance = 0;
    };
    userProfiles.add(caller, profile);
  };
};
