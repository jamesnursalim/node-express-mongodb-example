const { User } = require('../../../models');

const userAttempts = {};

async function getEmail(email) {
  return User.findOne({ email: email });
}

function validateLoginAttempt(email, success) {
  if (success) {
    delete userAttempts[email];
  } else {
    if (userAttempts[email]) {
      userAttempts[email].attempts++;
      if (userAttempts[email].attempts >= 5) {
        throw new Error("403 Forbidden: Too many failed login attempts");
      }
    } else {
      userAttempts[email] = { attempts: 1, lastAttemptTime: Date.now() };
    }
  }
}

async function getUsers() {
  return User.find({});
}

async function getUser(id) {
  return User.findById(id);
}

async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

async function updatePassword(id, newPassword) {
  await User.findByIdAndUpdate(id, { password: newPassword });
}

async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

module.exports = {
  getEmail,
  getUser,
  createUser,
  updateUser,
  updatePassword,
  deleteUser,
  validateLoginAttempt,
  getUsers,
};
