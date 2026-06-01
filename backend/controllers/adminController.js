import User from '../models/User.js';

const formatUserList = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
  isBlocked: user.isBlocked,
  profileComplete: user.profileComplete,
  createdAt: user.createdAt,
});

export const getAllUsers = async (req, res) => {
  try {
    const { search, role, status, page = 1, limit = 10 } = req.query;
    const query = { role: { $ne: 'admin' } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status === 'blocked') query.isBlocked = true;
    if (status === 'active') query.isBlocked = false;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password -emailVerificationToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      users: users.map(formatUserList),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot block admin accounts.' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: user.isBlocked ? 'User blocked successfully.' : 'User unblocked successfully.',
      user: formatUserList(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const blockedUsers = await User.countDocuments({ role: 'user', isBlocked: true });
    const verifiedUsers = await User.countDocuments({ role: 'user', isEmailVerified: true });

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers: totalUsers - blockedUsers,
        blockedUsers,
        verifiedUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
