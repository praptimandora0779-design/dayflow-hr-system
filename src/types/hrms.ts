export type UserRole = 'ADMIN' | 'EMPLOYEE';

export interface SalaryStructure {
  basic: number;
  hra: number;
  allowances: number;
  deductions: number; // tax & PF percentage or flat amount
  netPay: number;
}

export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  jobTitle: string;
  joinDate: string;
  phone: string;
  address: string;
  photoUrl: string;
  salary: SalaryStructure;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE' | 'LATE';

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  checkIn?: string; // HH:mm:ss
  checkOut?: string; // HH:mm:ss
  status: AttendanceStatus;
  workHours?: number;
  notes?: string;
}

export type LeaveType = 'PAID' | 'SICK' | 'UNPAID';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  department: string;
  type: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  daysCount: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string; // YYYY-MM-DD
  adminComment?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface LeaveBalance {
  paid: { total: number; used: number };
  sick: { total: number; used: number };
  unpaid: { total: number; used: number };
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'LEAVE_APPROVAL' | 'ATTENDANCE_ALERT' | 'SYSTEM' | 'PAYROLL';
}
