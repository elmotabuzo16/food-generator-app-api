import bcrypt from 'bcryptjs';

// 8#762YyJ1Ww9
const users = [
  {
    name: 'Admin User',
    username: 'adminuser',
    email: 'admin@example.com',
    password: bcrypt.hashSync('8#762YyJ1Ww9', 10),
    profile: 'test',
    isAdmin: true,
  },
];

export default users;
