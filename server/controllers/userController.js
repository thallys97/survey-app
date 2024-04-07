
const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).send('Erro ao buscar usuários');
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).send('Erro ao atualizar o role do usuário');
  }
};
