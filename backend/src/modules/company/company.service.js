const User = require('../auth/auth.model');

exports.getDealers = userId => User.find({ role: 'B2B', company: userId })
  .select('firmName proprietorName mobile email gstNumber address categories location companyDealerStatus createdAt')
  .sort({ createdAt: -1 });

exports.assignDealer = async (userId, mobile) => {
  const dealer = await User.findOne({ role: 'B2B', mobile });
  if (!dealer) throw new Error('Registered B2B dealer not found');
  if (dealer.company && String(dealer.company) !== String(userId)) throw new Error('Dealer is already assigned to another company');
  dealer.company = userId;
  dealer.companyDealerStatus = 'ACTIVE';
  await dealer.save();
  return dealer;
};

exports.setDealerStatus = async (userId, dealerId, status) => {
  if (!['ACTIVE', 'SUSPENDED'].includes(status)) throw new Error('Invalid dealer status');
  const dealer = await User.findOneAndUpdate({ _id: dealerId, role: 'B2B', company: userId }, { companyDealerStatus: status }, { new: true });
  if (!dealer) throw new Error('Company dealer not found');
  return dealer;
};

exports.removeDealer = async (userId, dealerId) => {
  const dealer = await User.findOneAndUpdate({ _id: dealerId, role: 'B2B', company: userId }, { $set: { company: null, companyDealerStatus: 'ACTIVE' } }, { new: true });
  if (!dealer) throw new Error('Company dealer not found');
  return dealer;
};
