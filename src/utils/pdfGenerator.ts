import { jsPDF } from 'jspdf';
import { User } from '../types/hrms';

export const generateSalarySlipPDF = (user: User, monthYear: string = 'August 2026') => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Colors
  const primaryColor = '#2563eb'; // Blue-600
  const darkColor = '#0f172a';    // Slate-900
  const lightBg = '#f8fafc';      // Slate-50

  // Header Banner
  doc.setFillColor(37, 99, 235); // Blue-600
  doc.rect(0, 0, 210, 32, 'F');

  // Title text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('DAYFLOW HRMS', 15, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('OFFICIAL PAYROLL SALARY SLIP', 15, 25);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(monthYear.toUpperCase(), 160, 20);

  // Company Info Box
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Dayflow Technologies Inc. • 100 Innovation Way, Suite 400 • San Francisco, CA', 15, 38);

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(15, 42, 195, 42);

  // Employee Details Card
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 47, 180, 36, 3, 3, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235);
  doc.text('EMPLOYEE DETAILS', 20, 55);

  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'normal');

  doc.text(`Employee Name: ${user.name}`, 20, 63);
  doc.text(`Employee ID: ${user.employeeId}`, 20, 70);
  doc.text(`Designation: ${user.jobTitle}`, 20, 77);

  doc.text(`Department: ${user.department}`, 110, 63);
  doc.text(`Email: ${user.email}`, 110, 70);
  doc.text(`Joining Date: ${user.joinDate}`, 110, 77);

  // Earnings & Deductions Table Header
  const tableStartY = 92;

  // Header background
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.rect(15, tableStartY, 180, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('EARNINGS & ALLOWANCES', 20, tableStartY + 5.5);
  doc.text('AMOUNT ($)', 80, tableStartY + 5.5);
  doc.text('DEDUCTIONS & TAXES', 110, tableStartY + 5.5);
  doc.text('AMOUNT ($)', 170, tableStartY + 5.5);

  // Salary Rows
  const s = user.salary;
  const rows = [
    { earnLabel: 'Basic Salary', earnVal: s.basic, dedLabel: 'Income Tax & Deductions', dedVal: s.deductions },
    { earnLabel: 'House Rent Allowance (HRA)', earnVal: s.hra, dedLabel: 'Provident Fund / Insurance', dedVal: 0 },
    { earnLabel: 'Special Allowances', earnVal: s.allowances, dedLabel: 'Other Adjustments', dedVal: 0 },
  ];

  let currentY = tableStartY + 8;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);

  rows.forEach((row, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, currentY, 180, 8, 'F');
    }

    doc.text(row.earnLabel, 20, currentY + 5.5);
    doc.text(`$${row.earnVal.toLocaleString()}`, 80, currentY + 5.5);

    doc.text(row.dedLabel, 110, currentY + 5.5);
    doc.text(`$${row.dedVal.toLocaleString()}`, 170, currentY + 5.5);

    currentY += 8;
  });

  // Totals Line
  doc.setDrawColor(226, 232, 240);
  doc.line(15, currentY + 2, 195, currentY + 2);

  const totalGross = s.basic + s.hra + s.allowances;

  doc.setFont('helvetica', 'bold');
  doc.text('Gross Earnings:', 20, currentY + 9);
  doc.text(`$${totalGross.toLocaleString()}`, 80, currentY + 9);

  doc.text('Total Deductions:', 110, currentY + 9);
  doc.text(`$${s.deductions.toLocaleString()}`, 170, currentY + 9);

  // Net Salary Highlight Card
  const netY = currentY + 16;
  doc.setFillColor(239, 246, 255); // Blue-50
  doc.setDrawColor(191, 219, 254); // Blue-200
  doc.roundedRect(15, netY, 180, 22, 3, 3, 'FD');

  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138); // Blue-900
  doc.text('NET TAKE-HOME PAYABLE:', 20, netY + 13);

  doc.setFontSize(16);
  doc.setTextColor(37, 99, 235);
  doc.text(`$${s.netPay.toLocaleString()} USD`, 125, netY + 14);

  // Footer Signatures & Disclaimer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('This is a system-generated document from Dayflow HRMS. No physical signature is required.', 15, 270);
  doc.text('Confidential • Authorized Personnel Only', 145, 270);

  // Trigger Save PDF Download
  doc.save(`Dayflow_SalarySlip_${user.employeeId}_${user.name.replace(/\s+/g, '_')}.pdf`);
};
