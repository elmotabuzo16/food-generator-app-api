import bcrypt from 'bcryptjs';

// 8#762YyJ1Ww9
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('8#762YyJ1Ww9', 10),
    isAdmin: true,
  },
  {
    name: 'Test01',
    email: 'test01@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
];

export default users;
