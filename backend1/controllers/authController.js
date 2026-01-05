const user = require('../models/User');

const login = async (req, res) => {
	try {
		const { email, password, type } = req.body;

		const user = await user.findOne({ email, password, type });

		if (!user) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		res.json({
			success: true,
			user: {
				id: user._id.toString(),
				name: user.name,
				email: user.email,
				type: user.type,
				accountNumber: user.accountNumber,
				bankSecret: user.bankSecret,
				bankSetup: !!user.accountNumber
			}
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const register = async (req, res) => {
  try {
    const { email, password, name, type } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const newUser = await User.create({ email, password, name, type });
    
    res.json({
      success: true,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        type: newUser.type
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login, register };