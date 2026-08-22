import { User, AttendanceRecord, LeaveRequest, NotificationItem } from '../types/hrms';
import { INITIAL_USERS, INITIAL_ATTENDANCE, INITIAL_LEAVES, INITIAL_NOTIFICATIONS } from './mockData';

const KEYS = {
  USERS: 'dayflow_users',
  ATTENDANCE: 'dayflow_attendance',
  LEAVES: 'dayflow_leaves',
  NOTIFICATIONS: 'dayflow_notifications',
  CURRENT_USER_ID: 'dayflow_current_user_id',
};

// Dispatch custom event to sync state instantly across views/components
const notifyStorageChange = () => {
  window.dispatchEvent(new Event('dayflow-storage-change'));
};

export const storageService = {
  // Initialize default data if not present
  initialize: () => {
    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(KEYS.ATTENDANCE)) {
      localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
    }
    if (!localStorage.getItem(KEYS.LEAVES)) {
      localStorage.setItem(KEYS.LEAVES, JSON.stringify(INITIAL_LEAVES));
    }
    if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(KEYS.CURRENT_USER_ID)) {
      localStorage.setItem(KEYS.CURRENT_USER_ID, 'usr_admin_1'); // Default demo as Admin
    }
  },

  // Reset to original seed dataset
  resetToSeed: () => {
    localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
    localStorage.setItem(KEYS.LEAVES, JSON.stringify(INITIAL_LEAVES));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(KEYS.CURRENT_USER_ID, 'usr_admin_1');
    notifyStorageChange();
  },

  // Users CRUD
  getUsers: (): User[] => {
    const raw = localStorage.getItem(KEYS.USERS);
    return raw ? JSON.parse(raw) : INITIAL_USERS;
  },

  getUserById: (id: string): User | undefined => {
    return storageService.getUsers().find((u) => u.id === id);
  },

  saveUser: (user: User) => {
    const users = storageService.getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    notifyStorageChange();
  },

  // Active User session
  getCurrentUserId: (): string => {
    return localStorage.getItem(KEYS.CURRENT_USER_ID) || 'usr_admin_1';
  },

  setCurrentUserId: (id: string) => {
    localStorage.setItem(KEYS.CURRENT_USER_ID, id);
    notifyStorageChange();
  },

  // Attendance CRUD
  getAttendance: (): AttendanceRecord[] => {
    const raw = localStorage.getItem(KEYS.ATTENDANCE);
    return raw ? JSON.parse(raw) : INITIAL_ATTENDANCE;
  },

  getUserAttendance: (userId: string): AttendanceRecord[] => {
    return storageService.getAttendance().filter((a) => a.userId === userId);
  },

  recordCheckIn: (userId: string) => {
    const attendance = storageService.getAttendance();
    const today = new Date().toISOString().split('T')[0];
    const timeNow = new Date().toTimeString().split(' ')[0];

    const existingIdx = attendance.findIndex((a) => a.userId === userId && a.date === today);
    if (existingIdx >= 0) {
      attendance[existingIdx].checkIn = timeNow;
      attendance[existingIdx].status = 'PRESENT';
    } else {
      attendance.unshift({
        id: `att_${Date.now()}`,
        userId,
        date: today,
        checkIn: timeNow,
        status: 'PRESENT',
        workHours: 0,
      });
    }

    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(attendance));
    notifyStorageChange();
  },

  recordCheckOut: (userId: string) => {
    const attendance = storageService.getAttendance();
    const today = new Date().toISOString().split('T')[0];
    const timeNow = new Date().toTimeString().split(' ')[0];

    const existingIdx = attendance.findIndex((a) => a.userId === userId && a.date === today);
    if (existingIdx >= 0 && attendance[existingIdx].checkIn) {
      attendance[existingIdx].checkOut = timeNow;

      // Estimate work hours
      const checkInTime = new Date(`${today}T${attendance[existingIdx].checkIn}`);
      const checkOutTime = new Date(`${today}T${timeNow}`);
      const diffMs = checkOutTime.getTime() - checkInTime.getTime();
      const hours = Math.max(0.5, parseFloat((diffMs / (1000 * 60 * 60)).toFixed(1)));
      attendance[existingIdx].workHours = hours;
    }

    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(attendance));
    notifyStorageChange();
  },

  saveAttendanceRecord: (record: AttendanceRecord) => {
    const attendance = storageService.getAttendance();
    const idx = attendance.findIndex((a) => a.id === record.id);
    if (idx >= 0) {
      attendance[idx] = record;
    } else {
      attendance.unshift(record);
    }
    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(attendance));
    notifyStorageChange();
  },

  // Leave Requests CRUD
  getLeaves: (): LeaveRequest[] => {
    const raw = localStorage.getItem(KEYS.LEAVES);
    return raw ? JSON.parse(raw) : INITIAL_LEAVES;
  },

  getUserLeaves: (userId: string): LeaveRequest[] => {
    return storageService.getLeaves().filter((l) => l.userId === userId);
  },

  createLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn'>): LeaveRequest => {
    const leaves = storageService.getLeaves();
    const newLeave: LeaveRequest = {
      ...request,
      id: `lve_req_${Date.now()}`,
      status: 'PENDING',
      appliedOn: new Date().toISOString().split('T')[0],
    };
    leaves.unshift(newLeave);
    localStorage.setItem(KEYS.LEAVES, JSON.stringify(leaves));

    // Also add notification for HR Admin
    storageService.addNotification({
      userId: 'usr_admin_1',
      title: 'New Leave Request',
      message: `${request.userName} applied for ${request.daysCount} day(s) ${request.type} Leave.`,
      type: 'LEAVE_APPROVAL',
    });

    notifyStorageChange();
    return newLeave;
  },

  updateLeaveStatus: (leaveId: string, status: 'APPROVED' | 'REJECTED', adminComment?: string, adminName: string = 'Sarah Jenkins') => {
    const leaves = storageService.getLeaves();
    const idx = leaves.findIndex((l) => l.id === leaveId);
    if (idx >= 0) {
      leaves[idx].status = status;
      leaves[idx].adminComment = adminComment;
      leaves[idx].reviewedBy = adminName;
      leaves[idx].reviewedAt = new Date().toISOString().split('T')[0];

      // Update attendance status if approved for current date
      if (status === 'APPROVED') {
        const leave = leaves[idx];
        const attendance = storageService.getAttendance();
        const start = new Date(leave.startDate);
        const end = new Date(leave.endDate);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          const attIdx = attendance.findIndex((a) => a.userId === leave.userId && a.date === dateStr);
          if (attIdx >= 0) {
            attendance[attIdx].status = 'LEAVE';
            attendance[attIdx].notes = `Approved ${leave.type} Leave`;
          } else {
            attendance.unshift({
              id: `att_lve_${Date.now()}_${dateStr}`,
              userId: leave.userId,
              date: dateStr,
              status: 'LEAVE',
              notes: `Approved ${leave.type} Leave`,
            });
          }
        }
        localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(attendance));
      }

      localStorage.setItem(KEYS.LEAVES, JSON.stringify(leaves));

      // Add notification for the employee
      storageService.addNotification({
        userId: leaves[idx].userId,
        title: `Leave Request ${status === 'APPROVED' ? 'Approved' : 'Rejected'}`,
        message: `Your leave request from ${leaves[idx].startDate} to ${leaves[idx].endDate} was ${status.toLowerCase()}${adminComment ? `: "${adminComment}"` : '.'}`,
        type: 'LEAVE_APPROVAL',
      });

      notifyStorageChange();
    }
  },

  // Notifications CRUD
  getNotifications: (userId?: string): NotificationItem[] => {
    const raw = localStorage.getItem(KEYS.NOTIFICATIONS);
    const list: NotificationItem[] = raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
    return userId ? list.filter((n) => n.userId === userId) : list;
  },

  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const notifications = storageService.getNotifications();
    const newNotif: NotificationItem = {
      ...item,
      id: `notif_${Date.now()}`,
      timestamp: new Date().toISOString().split('T')[0],
      read: false,
    };
    notifications.unshift(newNotif);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    notifyStorageChange();
  },

  markNotificationAsRead: (id: string) => {
    const notifications = storageService.getNotifications();
    const idx = notifications.findIndex((n) => n.id === id);
    if (idx >= 0) {
      notifications[idx].read = true;
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
      notifyStorageChange();
    }
  },

  markAllNotificationsAsRead: (userId: string) => {
    const notifications = storageService.getNotifications();
    notifications.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    notifyStorageChange();
  },
};
