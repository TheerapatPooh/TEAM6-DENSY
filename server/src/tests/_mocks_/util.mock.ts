export const userMock = {
    id: 1,
    username: "testuser",
    email: "test@gmail.com",
    password: "hashedPassword",
    role: "inspector",
    department: "Electronic",
    createdAt: new Date(),
    active: true,
};

export const decodeMock = { userId: 1, role: "inspector" };

export const allNotificationMock = [
    {
        "id": 22,
        "message": "patrol_assigned-2025-01-11T17:00:00.000Z",
        "read": false,
        "timestamp": "2025-01-12T15:09:36.718Z",
        "type": "request",
        "url": "/patrol/11/detail",
        "userId": 3
    },
    {
        "id": 18,
        "message": "start_patrol",
        "read": false,
        "timestamp": "2025-01-12T13:58:29.753Z",
        "type": "information",
        "url": "/patrol/9/detail",
        "userId": 3
    },
    {
        "id": 16,
        "message": "patrol_assigned-2025-01-11T17:00:00.000Z",
        "read": false,
        "timestamp": "2025-01-12T13:57:26.036Z",
        "type": "request",
        "url": "/patrol/10/detail",
        "userId": 3
    }
];

export const notificationMock = {
    id: 1,
    message: "notification test",
    read: false,
    timestamp: new Date("2025-01-12T15:09:36.718Z"), 
    type: "request",
    url: '/patrol/3',
    userId: 3,
};

export const createNotificationMock = {
    "email": "",
};

export const updateNotificationMock = {
    id: 1,
    message: "notification test",
    read: true,
    timestamp: new Date("2025-01-12T15:09:36.718Z"), 
    type: "request",
    url: '/patrol/3',
    userId: 3,
};

