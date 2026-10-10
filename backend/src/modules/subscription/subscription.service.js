const Subscription = require("./subscription.model");
const User = require("../auth/auth.model");
const razorpay = require("../../config/razorpay");
const crypto = require("crypto");

const ensurePlanForUser = (plan, user) => {
  if (!["B2B", "COMPANY"].includes(user?.role)) {
    throw new Error("Subscriptions are available only for seller and company accounts");
  }
  if (plan.applicableRole !== user.role) {
    throw new Error("This subscription plan is not available for your account role");
  }
};

const archiveCurrentSubscription = (user) => {
  const current = user.subscription;
  if (!current?.startDate) return;

  user.subscriptionHistory.push({
    planId: current.planId,
    paymentStatus: current.paymentStatus,
    razorpayOrderId: current.razorpayOrderId,
    razorpayPaymentId: current.razorpayPaymentId,
    amount: current.amount,
    currency: current.currency,
    startDate: current.startDate,
    endDate: current.endDate,
    isActive: false
  });
};


exports.createOrder = async (userId, planId) => {

  const [plan, user] = await Promise.all([
    Subscription.findById(planId),
    User.findById(userId).select("role")
  ]);

  if (!plan || !plan.isActive) throw new Error("Plan not found");
  if (!user) throw new Error("User not found");
  ensurePlanForUser(plan, user);

  const options = {
    amount: plan.price * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`
  };

  const order = await razorpay.orders.create(options);

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    key: process.env.RAZORPAY_KEY_ID,
    plan
  };
};

exports.verifyPayment = async (
  userId,
  {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    planId
  }
) => {

  const body =
    razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic =
    expectedSignature === razorpay_signature;

  if (!isAuthentic) {
    throw new Error("Invalid payment signature");
  }

  const plan = await Subscription.findById(planId);

  if (!plan || !plan.isActive) {
    throw new Error("Plan not found");
  }

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  ensurePlanForUser(plan, user);

  const startDate = new Date();

  const endDate = new Date();

  endDate.setDate(
    startDate.getDate() + plan.duration
  );

  archiveCurrentSubscription(user);

  user.subscription = {
    planId: plan._id,

    paymentStatus: "PAID",

    razorpayOrderId: razorpay_order_id,

    razorpayPaymentId: razorpay_payment_id,

    razorpaySignature: razorpay_signature,

    amount: plan.price,

    currency: "INR",

    startDate,

    endDate,

    isActive: true
  };

  await user.save();

  return user;
};

// CREATE PLAN (ADMIN)
exports.createPlan = async (data) => {
  return await Subscription.create(data);
};

// GET ACTIVE PLANS FOR THE LOGGED-IN ROLE; ADMIN SEES EVERY ROLE.
exports.getPlans = async (user) => {
  const filter = {};
  if (["B2B", "COMPANY"].includes(user?.role)) {
    filter.isActive = true;
    filter.applicableRole = user.role;
  }
  return await Subscription.find(filter).sort({ applicableRole: 1, price: 1 });
};

// UPDATE PLAN
exports.updatePlan = async (id, data) => {
  return await Subscription.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

// DELETE PLAN
exports.deletePlan = async (id) => {
  return await Subscription.findByIdAndDelete(id);
};

// SUBSCRIBE USER
exports.subscribeUser = async (userId, planId) => {
  const [plan, user] = await Promise.all([
    Subscription.findById(planId),
    User.findById(userId)
  ]);
  if (!plan || !plan.isActive) throw new Error("Plan not found");
  if (!user) throw new Error("User not found");
  ensurePlanForUser(plan, user);

  if (user.subscription?.isActive) {
    throw new Error("User already has active subscription");
  }

  const startDate = new Date();
  const endDate = new Date();
  const totalDays = plan.duration + (plan.trialDays || 0);
  endDate.setDate(startDate.getDate() + totalDays);

  user.subscription = { planId, startDate, endDate, isActive: true };
  await user.save();
  return user;
};

// CANCEL SUBSCRIPTION
exports.cancelSubscription = async (userId) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      "subscription.isActive": false
    },
    { new: true }
  );
};

exports.activateTrial = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (!["B2B", "COMPANY"].includes(user.role)) {
    throw new Error("Trials are available only for seller and company accounts");
  }
  if (user.trialUsed) throw new Error("Trial already used");
  if (user.subscription?.isActive) throw new Error("User already has active subscription");

  const trialPlan = await Subscription.findOne({
    price: 0,
    isActive: true,
    applicableRole: user.role
  });
  if (!trialPlan) throw new Error(`Trial plan not found for ${user.role === "COMPANY" ? "company" : "seller"} accounts`);

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + trialPlan.duration);
  archiveCurrentSubscription(user);
  user.subscription = { planId: trialPlan._id, startDate, endDate, isActive: true };
  user.trialUsed = true;
  await user.save();
  return user;
};

exports.getSubscriptionHistory = async (userId) => {
  const user = await User.findById(userId)
    .select("subscription subscriptionHistory trialUsed")
    .populate("subscription.planId", "name type applicableRole price currency duration")
    .populate("subscriptionHistory.planId", "name type applicableRole price currency duration")
    .lean();

  if (!user) {
    throw new Error("User not found");
  }

  return {
    current: user.subscription,
    history: [...(user.subscriptionHistory || [])].sort(
      (a, b) => new Date(b.startDate || 0) - new Date(a.startDate || 0)
    ),
    trialUsed: user.trialUsed
  };
};
