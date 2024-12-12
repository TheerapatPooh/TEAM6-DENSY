import { User } from "@prisma/client";

export const users: User[] = [
  {
    id: 1,
    username: 'admin',
    email: null,
    password: '$2b$10$u12eV.JL3fcFkBF1gloNp.EOEyMRmNh6t9wPyp6OLaZV25Jc3f6kK',
    role: 'admin',
    department: null,
    createdAt: new Date('2024-10-06T16:49:43.000Z'),
    active: true
  },
  {
    id: 2,
    username: 'johnDoe',
    email: null,
    password: '$2b$10$L73TPSodzlpLeFsp68DSXeBC10xyRX8QpHzvruzaxXmqN71Z8dA/K',
    role: 'inspector',
    department: null,
    createdAt: new Date('2024-10-06T09:50:18.955Z'),
    active: true
  },
  {
    id: 3,
    username: 'jameSmith',
    email: null,
    password: '$2b$10$ie9w6UV.fquwZiKYYYbxhOmiGZl4KDC3cfMZDd0zk8IlEKY6R9ORm',
    role: 'inspector',
    department: null,
    createdAt: new Date('2024-10-06T10:27:09.916Z'),
    active: true
  },
  {
    id: 4,
    username: 'supervisor2',
    email: 'supervisor2@example.com',
    password: '$2b$10$xz9VijvJ0YCmWMpOnnFW2eX/LHpgY03IXgFxZT5O9jyhs1IhViQBm',
    role: 'supervisor',
    department: 'IT',
    createdAt: new Date('2024-10-06T09:51:09.771Z'),
    active: true
  },
  {
    id: 5,
    username: 'supervisor3',
    email: 'supervisor3@example.com',
    password: '$2b$10$T53hUAU2Xuri80R4WtJbWOzwIJwnTRfmZ6EpDSe7ok0pVrelK3jGe',
    role: 'supervisor',
    department: 'Maintenance',
    createdAt: new Date('2024-10-06T09:51:12.275Z'),
    active: true
  },
  {
    id: 6,
    username: 'supervisor4',
    email: 'supervisor4@example.com',
    password: '$2b$10$tP0hx2pwwlH2iSPu00JAOu7CJkGTYRrky0j/uXvWsNpcifXOV0bP.',
    role: 'supervisor',
    department: 'Customer Service',
    createdAt: new Date('2024-10-06T09:51:14.185Z'),
    active: true
  },
  {
    id: 7,
    username: 'supervisor5',
    email: 'supervisor5@example.com',
    password: '$2b$10$BzySkzw5M.stGf6gIVFM3.NyzxOMlpb2G4OzDjD9Ai.SnGS93WU6K',
    role: 'supervisor',
    department: 'Quality Control',
    createdAt: new Date('2024-10-06T09:51:28.164Z'),
    active: true
  },
  {
    id: 8,
    username: 'supervisor6',
    email: 'supervisor6@example.com',
    password: '$2b$10$ie9w6UV.fquwZiKYYYbxhOmiGZl4KDC3cfMZDd0zk8IlEKY6R9ORm',
    role: 'supervisor',
    department: 'R&D',
    createdAt: new Date('2024-10-06T10:27:09.916Z'),
    active: true
  },
  {
    id: 9,
    username: 'supervisor7',
    email: 'supervisor7@example.com',
    password: '$2b$10$ie9w6UV.fquwZiKYYYbxhOmiGZl4KDC3cfMZDd0zk8IlEKY6R9ORm',
    role: 'supervisor',
    department: 'R&D',
    createdAt: new Date('2024-10-06T10:27:09.916Z'),
    active: true
  },
  {
    id: 10,
    username: 'supervisor8',
    email: 'supervisor8@example.com',
    password: '$2b$10$ie9w6UV.fquwZiKYYYbxhOmiGZl4KDC3cfMZDd0zk8IlEKY6R9ORm',
    role: 'supervisor',
    department: 'R&D',
    createdAt: new Date('2024-10-06T10:27:09.916Z'),
    active: true
  },
  {
    id: 11,
    username: 'supervisor9',
    email: 'supervisor9@example.com',
    password: '$2b$10$ie9w6UV.fquwZiKYYYbxhOmiGZl4KDC3cfMZDd0zk8IlEKY6R9ORm',
    role: 'supervisor',
    department: 'R&D',
    createdAt: new Date('2024-10-06T10:27:09.916Z'),
    active: true
  },
  {
    id: 12,
    username: 'supervisor10',
    email: 'supervisor10@example.com',
    password: '$2b$10$ie9w6UV.fquwZiKYYYbxhOmiGZl4KDC3cfMZDd0zk8IlEKY6R9ORm',
    role: 'supervisor',
    department: 'R&D',
    createdAt: new Date('2024-10-06T10:27:09.916Z'),
    active: true
  },
  {
    id: 13,
    username: 'supervisor11',
    email: 'supervisor11@example.com',
    password: '$2b$10$ie9w6UV.fquwZiKYYYbxhOmiGZl4KDC3cfMZDd0zk8IlEKY6R9ORm',
    role: 'supervisor',
    department: 'R&D',
    createdAt: new Date('2024-10-06T10:27:09.916Z'),
    active: true
  },
  {
    id: 14,
    username: 'supervisor12',
    email: 'supervisor12@example.com',
    password: '$2b$10$ie9w6UV.fquwZiKYYYbxhOmiGZl4KDC3cfMZDd0zk8IlEKY6R9ORm',
    role: 'supervisor',
    department: 'R&D',
    createdAt: new Date('2024-10-06T10:27:09.916Z'),
    active: true
  },
  {
    id: 15,
    username: 'supervisor13',
    email: 'supervisor13@example.com',
    password: '$2b$10$ie9w6UV.fquwZiKYYYbxhOmiGZl4KDC3cfMZDd0zk8IlEKY6R9ORm',
    role: 'supervisor',
    department: 'R&D',
    createdAt: new Date('2024-10-06T10:27:09.916Z'),
    active: true
  },
  {
    id: 16,
    username: 'supervisor14',
    email: 'supervisor14@example.com',
    password: '$2b$10$ie9w6UV.fquwZiKYYYbxhOmiGZl4KDC3cfMZDd0zk8IlEKY6R9ORm',
    role: 'supervisor',
    department: 'R&D',
    createdAt: new Date('2024-10-06T10:27:09.916Z'),
    active: true
  },
  {
    id: 17,
    username: 'supervisor15',
    email: 'supervisor15@example.com',
    password: '$2b$10$ie9w6UV.fquwZiKYYYbxhOmiGZl4KDC3cfMZDd0zk8IlEKY6R9ORm',
    role: 'supervisor',
    department: 'R&D',
    createdAt: new Date('2024-10-06T10:27:09.916Z'),
    active: true
  },
  {
    id: 18,
    username: 'supervisor16',
    email: 'supervisor16@example.com',
    password: '$2b$10$ie9w6UV.fquwZiKYYYbxhOmiGZl4KDC3cfMZDd0zk8IlEKY6R9ORm',
    role: 'supervisor',
    department: 'R&D',
    createdAt: new Date('2024-10-06T10:27:09.916Z'),
    active: true
  },
  {
    id: 19,
    username: 'supervisor17',
    email: 'supervisor17@example.com',
    password: '$2b$10$ie9w6UV.fquwZiKYYYbxhOmiGZl4KDC3cfMZDd0zk8IlEKY6R9ORm',
    role: 'supervisor',
    department: 'R&D',
    createdAt: new Date('2024-10-06T10:27:09.916Z'),
    active: true
  },
  {
    id: 20,
    username: 'supervisor18',
    email: 'supervisor18@example.com',
    password: '$2b$10$ie9w6UV.fquwZiKYYYbxhOmiGZl4KDC3cfMZDd0zk8IlEKY6R9ORm',
    role: 'supervisor',
    department: 'R&D',
    createdAt: new Date('2024-10-06T10:27:09.916Z'),
    active: true
  },
  {
    id: 21,
    username: 'supervisor19',
    email: 'supervisor19@example.com',
    password: '$2b$10$ie9w6UV.fquwZiKYYYbxhOmiGZl4KDC3cfMZDd0zk8IlEKY6R9ORm',
    role: 'supervisor',
    department: 'R&D',
    createdAt: new Date('2024-10-06T10:27:09.916Z'),
    active: true
  },
];
