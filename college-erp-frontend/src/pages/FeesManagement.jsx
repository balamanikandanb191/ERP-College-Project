import React, { useState, useEffect, useMemo } from 'react';
import { 
  IndianRupee, 
  Users, 
  FileText, 
  Activity, 
  Search, 
  AlertTriangle, 
  TrendingUp, 
  Plus, 
  X, 
  Edit2, 
  CheckCircle, 
  CreditCard, 
  DollarSign, 
  ArrowUpRight, 
  AlertCircle, 
  ShieldCheck, 
  Printer, 
  Percent,
  Calendar,
  Trash2,
  Copy,
  Gift,
  Scale,
  Lock,
  Eye,
  Archive,
  BookOpen
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import toast from 'react-hot-toast';

// Seed structures by Admission Year with full breakdown
const SEED_ADMISSION_YEAR_FEE_STRUCTURES = [
  {
    id: 'struct-2023-cse',
    admissionYear: '2023',
    name: 'CSE B.Tech baseline fee (2023 Admitted)',
    department: 'Computer Science',
    year: 'III',
    semester: '6',
    // Academic Fees
    tuitionFee: 60000,
    labFee: 7000,
    libraryFee: 1500,
    examFee: 2500,
    semesterFee: 5000,
    developmentFee: 3000,
    universityFee: 2000,
    recordFee: 500,
    // Hostel Fees
    hostelAdmission: 5000,
    roomRent: 15000,
    messFee: 10000,
    electricity: 3000,
    laundry: 1000,
    hostelMaintenance: 1000,
    // Transport Fees
    busRouteFee: 10000,
    gpsFee: 1000,
    transportMaintenance: 1000,
    // Examination Fees
    internalExam: 1000,
    externalExam: 1500,
    hallTicket: 500,
    revaluationFee: 1000,
    arrearFee: 500,
    // Penalties & Fines
    latePaymentFine: 1000,
    attendanceFine: 500,
    libraryFine: 200,
    disciplineFine: 1000,
    hostelFine: 500,
    // Optional Services
    placementTrainingFee: 4000,
    certificationFee: 2000,
    industrialVisitFee: 1500,
    workshopFee: 1000,
    GST: 18,
    status: 'Active'
  },
  {
    id: 'struct-2024-cse',
    admissionYear: '2024',
    name: 'CSE B.Tech baseline fee (2024 Admitted)',
    department: 'Computer Science',
    year: 'II',
    semester: '4',
    tuitionFee: 65000,
    labFee: 8000,
    libraryFee: 2000,
    examFee: 3000,
    semesterFee: 6000,
    developmentFee: 4000,
    universityFee: 2500,
    recordFee: 600,
    hostelAdmission: 6000,
    roomRent: 16000,
    messFee: 11000,
    electricity: 3500,
    laundry: 1200,
    hostelMaintenance: 1200,
    busRouteFee: 11000,
    gpsFee: 1200,
    transportMaintenance: 1200,
    internalExam: 1200,
    externalExam: 1800,
    hallTicket: 600,
    revaluationFee: 1200,
    arrearFee: 600,
    latePaymentFine: 1200,
    attendanceFine: 600,
    libraryFine: 300,
    disciplineFine: 1200,
    hostelFine: 600,
    placementTrainingFee: 5000,
    certificationFee: 2500,
    industrialVisitFee: 1800,
    workshopFee: 1200,
    GST: 18,
    status: 'Active'
  },
  {
    id: 'struct-2024-it',
    admissionYear: '2024',
    name: 'IT B.Tech baseline fee (2024 Admitted)',
    department: 'Information Technology',
    year: 'II',
    semester: '4',
    tuitionFee: 60000,
    labFee: 7000,
    libraryFee: 2000,
    examFee: 3000,
    semesterFee: 5500,
    developmentFee: 3500,
    universityFee: 2500,
    recordFee: 600,
    hostelAdmission: 6000,
    roomRent: 16000,
    messFee: 11000,
    electricity: 3500,
    laundry: 1200,
    hostelMaintenance: 1200,
    busRouteFee: 11000,
    gpsFee: 1200,
    transportMaintenance: 1200,
    internalExam: 1200,
    externalExam: 1800,
    hallTicket: 600,
    revaluationFee: 1200,
    arrearFee: 600,
    latePaymentFine: 1200,
    attendanceFine: 600,
    libraryFine: 300,
    disciplineFine: 1200,
    hostelFine: 600,
    placementTrainingFee: 4000,
    certificationFee: 2000,
    industrialVisitFee: 1500,
    workshopFee: 1000,
    GST: 18,
    status: 'Active'
  },
  {
    id: 'struct-2025-ece',
    admissionYear: '2025',
    name: 'ECE B.Tech baseline fee (2025 Admitted)',
    department: 'Electronics',
    year: 'I',
    semester: '2',
    tuitionFee: 70000,
    labFee: 5000,
    libraryFee: 2000,
    examFee: 3500,
    semesterFee: 7000,
    developmentFee: 5000,
    universityFee: 3000,
    recordFee: 700,
    hostelAdmission: 7000,
    roomRent: 18000,
    messFee: 12000,
    electricity: 4000,
    laundry: 1500,
    hostelMaintenance: 1500,
    busRouteFee: 12000,
    gpsFee: 1500,
    transportMaintenance: 1500,
    internalExam: 1500,
    externalExam: 2000,
    hallTicket: 700,
    revaluationFee: 1500,
    arrearFee: 700,
    latePaymentFine: 1500,
    attendanceFine: 700,
    libraryFine: 400,
    disciplineFine: 1500,
    hostelFine: 700,
    placementTrainingFee: 5000,
    certificationFee: 3000,
    industrialVisitFee: 2000,
    workshopFee: 1500,
    GST: 18,
    status: 'Active'
  }
];

// Seed student registry
const SEED_STUDENT_FEE_REGISTRY = [
  {
    id: 'stud-fee-1',
    rollNo: 'CSE2301',
    studentName: 'Aarav Mehta',
    department: 'Computer Science',
    admissionYear: '2023',
    year: 'III',
    semester: '6',
    hostelStudent: true,
    transportStudent: false,
    installmentPlan: '3 Installments',
    installmentPaidCount: 2,
    installmentTotalCount: 3,
    paidAmount: 80000
  },
  {
    id: 'stud-fee-2',
    rollNo: 'IT2405',
    studentName: 'Neha Nair',
    department: 'Information Technology',
    admissionYear: '2024',
    year: 'II',
    semester: '4',
    hostelStudent: false,
    transportStudent: true,
    installmentPlan: 'None',
    installmentPaidCount: 0,
    installmentTotalCount: 0,
    paidAmount: 104430
  },
  {
    id: 'stud-fee-3',
    rollNo: 'ECE2511',
    studentName: 'Rohan Verma',
    department: 'Electronics',
    admissionYear: '2025',
    year: 'I',
    semester: '2',
    hostelStudent: true,
    transportStudent: false,
    installmentPlan: '2 Installments',
    installmentPaidCount: 0,
    installmentTotalCount: 2,
    paidAmount: 0
  },
  {
    id: 'stud-fee-4',
    rollNo: 'CSE2424',
    studentName: 'Kriti Sen',
    department: 'Computer Science',
    admissionYear: '2024',
    year: 'II',
    semester: '4',
    hostelStudent: false,
    transportStudent: true,
    installmentPlan: '2 Installments',
    installmentPaidCount: 1,
    installmentTotalCount: 2,
    paidAmount: 50000
  }
];

// Seed scholarship registry
const SEED_SCHOLARSHIP_REGISTRY = [
  {
    id: 'sch-1',
    rollNo: 'CSE2301',
    scholarshipType: 'Merit Scholarship',
    scholarshipCategory: 'Merit',
    scholarshipProvider: 'College Management',
    scholarshipReason: 'Top academic performance',
    scholarshipPercentage: 20,
    scholarshipAmount: 12000,
    approvalStatus: 'Approved',
    approvedBy: 'Principal Office',
    approvalDate: '2025-08-15',
    validityPeriod: '2025-2026',
    renewalStatus: 'Active'
  },
  {
    id: 'sch-2',
    rollNo: 'ECE2511',
    scholarshipType: 'Sports Quota Scholarship',
    scholarshipCategory: 'Sports Quota',
    scholarshipProvider: 'State Sports Authority',
    scholarshipReason: 'Sports achievement',
    scholarshipPercentage: 50,
    scholarshipAmount: 35000,
    approvalStatus: 'Approved',
    approvedBy: 'Physical Director',
    approvalDate: '2026-01-10',
    validityPeriod: '2026-2027',
    renewalStatus: 'Active'
  }
];

// Seed fine registry
const SEED_FINE_REGISTRY = [
  {
    fineId: 'fine-1',
    rollNo: 'IT2405',
    fineType: 'Library Fine',
    fineAmount: 1200,
    fineReason: 'Library book overdue',
    fineDate: '2026-05-01',
    dueDate: '2026-05-15',
    issuedBy: 'Chief Librarian',
    status: 'Pending',
    appealStatus: 'None'
  },
  {
    fineId: 'fine-2',
    rollNo: 'ECE2511',
    fineType: 'Late Fee Fine',
    fineAmount: 2500,
    fineReason: 'Late semester payment',
    fineDate: '2026-05-05',
    dueDate: '2026-05-20',
    issuedBy: 'Accounts Officer',
    status: 'Pending',
    appealStatus: 'Appealed'
  },
  {
    fineId: 'fine-3',
    rollNo: 'CSE2424',
    fineType: 'Attendance Shortage Fine',
    fineAmount: 1800,
    fineReason: 'Attendance below threshold',
    fineDate: '2026-05-03',
    dueDate: '2026-05-18',
    issuedBy: 'HOD CSE',
    status: 'Pending',
    appealStatus: 'None'
  }
];

// Seed transactions
const SEED_FEE_TRANSACTIONS = [
  {
    id: 'tx-1',
    rollNo: 'CSE2301',
    studentName: 'Aarav Mehta',
    amount: 40000,
    paymentMode: 'UPI',
    referenceId: 'UPI9849204910',
    date: '2026-05-10',
    remarks: '1st Installment Payment'
  },
  {
    id: 'tx-2',
    rollNo: 'CSE2301',
    studentName: 'Aarav Mehta',
    amount: 40000,
    paymentMode: 'Net Banking',
    referenceId: 'NET9820491024',
    date: '2026-05-15',
    remarks: '2nd Installment Payment'
  },
  {
    id: 'tx-3',
    rollNo: 'IT2405',
    studentName: 'Neha Nair',
    amount: 104430,
    paymentMode: 'Credit Card',
    referenceId: 'CC2039581024',
    date: '2026-05-12',
    remarks: 'Full Fees Payment'
  },
  {
    id: 'tx-4',
    rollNo: 'CSE2424',
    studentName: 'Kriti Sen',
    amount: 50000,
    paymentMode: 'Debit Card',
    referenceId: 'DC8930491024',
    date: '2026-05-08',
    remarks: '1st Installment Payment'
  }
];

const SCHOLARSHIP_CATEGORIES = [
  'Merit',
  'Government',
  'Sports Quota',
  'First Graduate',
  'Minority',
  'SC/ST',
  'BC/MBC',
  'Financial Hardship',
  'Staff Child Concession',
  'Alumni',
  'Single Parent Support',
  'Disability Support'
];

const FINE_TYPES = [
  'Late Fee Fine',
  'Library Fine',
  'Attendance Shortage Fine',
  'Discipline Fine',
  'Hostel Damage Fine',
  'Transport Fine',
  'Lab Equipment Fine',
  'Malpractice Fine',
  'ID Card Fine'
];

const INITIAL_DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Electrical & Electronics',
  'Mechanical',
  'Civil',
  'MBA',
  'BCA',
  'MCA'
];

const FeesManagement = () => {
  const [activeView, setActiveView] = useState('dashboard'); // dashboard, structures, students

  // --- Centralised Single Source of Truth ---
  const [admissionYearFeeStructures, setAdmissionYearFeeStructures] = useState(() => {
    const cached = localStorage.getItem('edu_erp_admission_fee_structures');
    if (cached) return JSON.parse(cached);
    localStorage.setItem('edu_erp_admission_fee_structures', JSON.stringify(SEED_ADMISSION_YEAR_FEE_STRUCTURES));
    return SEED_ADMISSION_YEAR_FEE_STRUCTURES;
  });

  const [studentFeeRegistry, setStudentFeeRegistry] = useState(() => {
    const cached = localStorage.getItem('edu_erp_student_fee_registry_v2');
    if (cached) return JSON.parse(cached);
    localStorage.setItem('edu_erp_student_fee_registry_v2', JSON.stringify(SEED_STUDENT_FEE_REGISTRY));
    return SEED_STUDENT_FEE_REGISTRY;
  });

  const [scholarshipRegistry, setScholarshipRegistry] = useState(() => {
    const cached = localStorage.getItem('edu_erp_scholarship_registry');
    if (cached) return JSON.parse(cached);
    localStorage.setItem('edu_erp_scholarship_registry', JSON.stringify(SEED_SCHOLARSHIP_REGISTRY));
    return SEED_SCHOLARSHIP_REGISTRY;
  });

  const [fineRegistry, setFineRegistry] = useState(() => {
    const cached = localStorage.getItem('edu_erp_fine_registry');
    if (cached) return JSON.parse(cached);
    localStorage.setItem('edu_erp_fine_registry', JSON.stringify(SEED_FINE_REGISTRY));
    return SEED_FINE_REGISTRY;
  });

  const [feeTransactions, setFeeTransactions] = useState(() => {
    const cached = localStorage.getItem('edu_erp_fee_transactions_v2');
    if (cached) return JSON.parse(cached);
    localStorage.setItem('edu_erp_fee_transactions_v2', JSON.stringify(SEED_FEE_TRANSACTIONS));
    return SEED_FEE_TRANSACTIONS;
  });

  const [departmentsList, setDepartmentsList] = useState(() => {
    const cached = localStorage.getItem('edu_erp_departments_list');
    if (cached) return JSON.parse(cached);
    localStorage.setItem('edu_erp_departments_list', JSON.stringify(INITIAL_DEPARTMENTS));
    return INITIAL_DEPARTMENTS;
  });

  // Calculate detailed student registry dynamically (SINGLE SOURCE OF TRUTH Lookup Engine)
  const computedStudents = useMemo(() => {
    return (studentFeeRegistry ?? []).map(student => {
      // Look up baseline structure specifically by ADMISSION YEAR, department, and semester
      const structure = (admissionYearFeeStructures ?? []).find(s => 
        s.admissionYear === student.admissionYear &&
        s.department === student.department && 
        s.semester === student.semester
      ) || {
        tuitionFee: 60000,
        labFee: 5000,
        libraryFee: 2000,
        examFee: 2500,
        semesterFee: 3000,
        developmentFee: 2000,
        universityFee: 2000,
        recordFee: 500,
        hostelAdmission: 5000,
        roomRent: 15000,
        messFee: 10000,
        electricity: 3000,
        laundry: 1000,
        hostelMaintenance: 1000,
        busRouteFee: 10000,
        gpsFee: 1000,
        transportMaintenance: 1000,
        internalExam: 1000,
        externalExam: 1500,
        hallTicket: 500,
        revaluationFee: 1000,
        arrearFee: 500,
        latePaymentFine: 1000,
        attendanceFine: 500,
        libraryFine: 200,
        disciplineFine: 1000,
        hostelFine: 500,
        placementTrainingFee: 4000,
        certificationFee: 2000,
        industrialVisitFee: 1500,
        workshopFee: 1000,
        GST: 18,
        status: 'Active'
      };

      const academicSum = 
        Number(structure.tuitionFee ?? 0) + 
        Number(structure.labFee ?? 0) + 
        Number(structure.libraryFee ?? 0) + 
        Number(structure.examFee ?? 0) + 
        Number(structure.semesterFee ?? 0) + 
        Number(structure.developmentFee ?? 0) + 
        Number(structure.universityFee ?? 0) + 
        Number(structure.recordFee ?? 0);

      const examSum = 
        Number(structure.internalExam ?? 0) + 
        Number(structure.externalExam ?? 0) + 
        Number(structure.hallTicket ?? 0) + 
        Number(structure.revaluationFee ?? 0) + 
        Number(structure.arrearFee ?? 0);

      const optionalSum = 
        Number(structure.placementTrainingFee ?? 0) + 
        Number(structure.certificationFee ?? 0) + 
        Number(structure.industrialVisitFee ?? 0) + 
        Number(structure.workshopFee ?? 0);

      const hostelSum = student.hostelStudent ? (
        Number(structure.hostelAdmission ?? 0) + 
        Number(structure.roomRent ?? 0) + 
        Number(structure.messFee ?? 0) + 
        Number(structure.electricity ?? 0) + 
        Number(structure.laundry ?? 0) + 
        Number(structure.hostelMaintenance ?? 0)
      ) : 0;

      const transportSum = student.transportStudent ? (
        Number(structure.busRouteFee ?? 0) + 
        Number(structure.gpsFee ?? 0) + 
        Number(structure.transportMaintenance ?? 0)
      ) : 0;

      // Extract scholarship details
      const scholarships = (scholarshipRegistry ?? []).filter(sch => sch.rollNo === student.rollNo && sch.approvalStatus === 'Approved');
      const concessionAmount = scholarships.reduce((sum, sch) => sum + Number(sch.scholarshipAmount), 0);

      // Extract fine details
      const studentFines = (fineRegistry ?? []).filter(f => f.rollNo === student.rollNo && f.status === 'Pending');
      const fineAmount = studentFines.reduce((sum, f) => sum + Number(f.fineAmount), 0);

      const subtotal = academicSum + examSum + optionalSum + hostelSum + transportSum;
      const taxableSubtotal = Math.max(0, subtotal - concessionAmount);
      
      const gst = Math.round(taxableSubtotal * 0.18);
      const grandTotal = taxableSubtotal + gst + fineAmount;
      const paidAmount = Number(student.paidAmount ?? 0);
      const remainingBalance = Math.max(0, grandTotal - paidAmount);

      let status = 'Cleared';
      if (remainingBalance > 0) {
        if (studentFines.length > 0 || remainingBalance > (grandTotal * 0.2)) {
          status = 'Defaulter';
        } else {
          status = 'Partial';
        }
      }

      const examAdmitBlocked = status === 'Defaulter';

      const transportType = student.hostelStudent ? "Hostel" : (student.transportStudent ? "Bus" : "None");
      const scholarshipAmount = concessionAmount;
      const pendingAmount = remainingBalance;

      return {
        ...student,
        transportType,
        scholarshipAmount,
        pendingAmount,
        academicSum,
        examSum,
        optionalSum,
        hostelSum,
        transportSum,
        subtotal,
        concessionAmount,
        scholarships,
        fines: studentFines,
        gst,
        totalPayable: grandTotal,
        paidAmount,
        remainingBalance,
        status,
        examAdmitBlocked,
        rawStructure: structure
      };
    });
  }, [studentFeeRegistry, admissionYearFeeStructures, scholarshipRegistry, fineRegistry]);

  // --- Dedicated Computed Datasets for Drilldown Categories ---
  const hostelRevenueData = useMemo(() => {
    return (computedStudents ?? []).filter(student => student.transportType === "Hostel");
  }, [computedStudents]);

  const transportRevenueData = useMemo(() => {
    return (computedStudents ?? []).filter(student => student.transportType === "Bus");
  }, [computedStudents]);

  const scholarshipData = useMemo(() => {
    return (computedStudents ?? []).filter(student => student.scholarshipAmount > 0);
  }, [computedStudents]);

  const pendingFeeData = useMemo(() => {
    return (computedStudents ?? []).filter(student => student.pendingAmount > 0);
  }, [computedStudents]);

  // Derive pendingDefaulters dynamically
  const pendingDefaulters = useMemo(() => {
    return computedStudents.filter(s => s.status === 'Defaulter');
  }, [computedStudents]);

  // Sync blocked exams list to localStorage
  useEffect(() => {
    const blockedRolls = computedStudents.filter(s => s.examAdmitBlocked).map(s => s.rollNo);
    localStorage.setItem('edu_erp_blocked_exams', JSON.stringify(blockedRolls));
  }, [computedStudents]);

  // --- Storage Persisters ---
  const saveAdmissionYearFeeStructures = (updated) => {
    setAdmissionYearFeeStructures(updated);
    localStorage.setItem('edu_erp_admission_fee_structures', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const saveStudentFeeRegistry = (updated) => {
    setStudentFeeRegistry(updated);
    localStorage.setItem('edu_erp_student_fee_registry_v2', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const saveScholarshipRegistry = (updated) => {
    setScholarshipRegistry(updated);
    localStorage.setItem('edu_erp_scholarship_registry', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const saveFineRegistry = (updated) => {
    setFineRegistry(updated);
    localStorage.setItem('edu_erp_fine_registry', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const saveFeeTransactions = (updated) => {
    setFeeTransactions(updated);
    localStorage.setItem('edu_erp_fee_transactions_v2', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const handleAddFutureDept = () => {
    const name = window.prompt("Enter new department name (e.g. EEE, MBA):");
    if (name && name.trim()) {
      const updated = [...(departmentsList ?? []), name.trim()];
      setDepartmentsList(updated);
      localStorage.setItem('edu_erp_departments_list', JSON.stringify(updated));
      toast.success(`Department "${name.trim()}" added to selection registry.`);
    }
  };

  // --- Search and Filters ---
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    semester: '',
    status: '',
    admissionYear: '',
    hasScholarship: false,
    hasFine: false
  });

  const filteredStudents = useMemo(() => {
    return computedStudents.filter(s => {
      const matchSearch = s.studentName?.toLowerCase().includes(filters.search.toLowerCase()) ||
                          s.rollNo?.toLowerCase().includes(filters.search.toLowerCase());
      const matchDept = !filters.department || s.department === filters.department;
      const matchSem = !filters.semester || s.semester === filters.semester;
      const matchStatus = !filters.status || s.status === filters.status;
      const matchAdmissionYear = !filters.admissionYear || s.admissionYear === filters.admissionYear;
      const matchScholarship = !filters.hasScholarship || s.scholarships.length > 0;
      const matchFine = !filters.hasFine || s.fines.length > 0;

      return matchSearch && matchDept && matchSem && matchStatus && matchAdmissionYear && matchScholarship && matchFine;
    });
  }, [computedStudents, filters]);

  // --- KPI Card Count Derivations ---
  const kpiTotalStructures = admissionYearFeeStructures.length;
  
  const kpiTotalFeesCollected = useMemo(() => {
    return (feeTransactions ?? []).reduce((sum, tx) => sum + Number(tx.amount), 0);
  }, [feeTransactions]);

  const kpiPendingFees = useMemo(() => {
    return computedStudents.reduce((sum, s) => sum + s.remainingBalance, 0);
  }, [computedStudents]);

  const kpiStudentsClearedCount = useMemo(() => {
    return computedStudents.filter(s => s.status === 'Cleared').length;
  }, [computedStudents]);

  const kpiDefaultersCount = useMemo(() => {
    return pendingDefaulters.length;
  }, [pendingDefaulters]);

  const kpiScholarshipStudentsCount = useMemo(() => {
    return computedStudents.filter(s => s.scholarships.length > 0).length;
  }, [computedStudents]);

  const kpiHostelRevenue = useMemo(() => {
    return computedStudents.reduce((sum, s) => sum + s.hostelSum, 0);
  }, [computedStudents]);

  const kpiTransportRevenue = useMemo(() => {
    return computedStudents.reduce((sum, s) => sum + s.transportSum, 0);
  }, [computedStudents]);

  const kpiPendingFines = useMemo(() => {
    return (fineRegistry ?? []).filter(f => f.status === 'Pending').length;
  }, [fineRegistry]);

  const kpiInstallmentStudentsCount = useMemo(() => {
    return computedStudents.filter(s => s.installmentPlan && s.installmentPlan !== 'None').length;
  }, [computedStudents]);

  // --- Modal Controllers ---
  const [drilldownModal, setDrilldownModal] = useState({ isOpen: false, title: '', viewType: '', data: [] });
  const [structureModal, setStructureModal] = useState({ isOpen: false, mode: 'create', data: null });
  const [scholarshipModal, setScholarshipModal] = useState({ isOpen: false, student: null });
  const [fineModal, setFineModal] = useState({ isOpen: false, student: null });
  const [studentProfileModal, setStudentProfileModal] = useState({ isOpen: false, student: null });
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, student: null });

  // --- Form States (Detailed Breakdown Mapped) ---
  const [structForm, setStructForm] = useState({
    name: '',
    admissionYear: '2024',
    department: 'Computer Science',
    year: 'II',
    semester: '4',
    // Academic Fees
    tuitionFee: 65000,
    labFee: 8000,
    libraryFee: 2000,
    examFee: 3000,
    semesterFee: 6000,
    developmentFee: 4000,
    universityFee: 2500,
    recordFee: 600,
    // Hostel Fees
    hostelAdmission: 6000,
    roomRent: 16000,
    messFee: 11000,
    electricity: 3500,
    laundry: 1200,
    hostelMaintenance: 1200,
    // Transport Fees
    busRouteFee: 11000,
    gpsFee: 1200,
    transportMaintenance: 1200,
    // Examination Fees
    internalExam: 1200,
    externalExam: 1800,
    hallTicket: 600,
    revaluationFee: 1200,
    arrearFee: 600,
    // Penalties & Fines
    latePaymentFine: 1200,
    attendanceFine: 600,
    libraryFine: 300,
    disciplineFine: 1200,
    hostelFine: 600,
    // Optional Services
    placementTrainingFee: 5000,
    certificationFee: 2500,
    industrialVisitFee: 1800,
    workshopFee: 1200,
    GST: 18,
    status: 'Active'
  });

  const [scholarshipForm, setScholarshipForm] = useState({
    scholarshipType: 'Merit Scholarship',
    scholarshipCategory: 'Merit',
    scholarshipProvider: 'College Management',
    scholarshipReason: 'Top academic performance',
    scholarshipPercentage: 20,
    scholarshipAmount: 12000,
    validityPeriod: '2026-2027',
    renewalStatus: 'Active'
  });

  const [fineForm, setFineForm] = useState({
    fineType: 'Late Fee Fine',
    fineAmount: 1000,
    fineReason: 'Late semester payment',
    dueDate: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    paymentMode: 'UPI',
    referenceId: '',
    remarks: ''
  });

  // --- Modal Edit Tabs state ---
  const [modalTab, setModalTab] = useState('academic');

  // --- Action Handlers ---
  const handleSaveStructure = (e) => {
    e.preventDefault();
    const newId = structureModal.mode === 'edit' ? structureModal.data.id : `struct-${Date.now()}`;
    const newStruct = {
      ...structForm,
      id: newId,
      createdAt: new Date().toISOString()
    };

    let updated;
    if (structureModal.mode === 'edit') {
      updated = (admissionYearFeeStructures ?? []).map(s => s.id === structureModal.data.id ? newStruct : s);
      toast.success('Fee structure revised successfully!');
    } else {
      updated = [...(admissionYearFeeStructures ?? []), newStruct];
      toast.success('New admission fee structure created!');
    }
    saveAdmissionYearFeeStructures(updated);
    setStructureModal({ isOpen: false, mode: 'create', data: null });
  };

  const handleDuplicateStructure = (template) => {
    const duplicated = {
      ...template,
      id: `struct-${Date.now()}`,
      name: `${template.name} (Copy)`,
      admissionYear: (Number(template.admissionYear) + 1).toString(),
      createdAt: new Date().toISOString()
    };
    saveAdmissionYearFeeStructures([...(admissionYearFeeStructures ?? []), duplicated]);
    toast.success(`Duplicated structure template to year ${duplicated.admissionYear}!`);
  };

  const handleArchiveStructure = (id) => {
    const updated = (admissionYearFeeStructures ?? []).map(s => s.id === id ? { ...s, status: s.status === 'Archived' ? 'Active' : 'Archived' } : s);
    saveAdmissionYearFeeStructures(updated);
    toast.success('Fee structure status updated.');
  };

  const handleIssueScholarship = (e) => {
    e.preventDefault();
    const newSch = {
      id: `sch-${Date.now()}`,
      rollNo: scholarshipModal.student.rollNo,
      ...scholarshipForm,
      approvalStatus: 'Approved',
      approvedBy: 'Admin Board',
      approvalDate: new Date().toISOString().split('T')[0]
    };
    saveScholarshipRegistry([...(scholarshipRegistry ?? []), newSch]);
    setScholarshipModal({ isOpen: false, student: null });
    toast.success(`Scholarship approved for ${scholarshipModal.student.studentName}!`);
  };

  const handleIssueFine = (e) => {
    e.preventDefault();
    const newFine = {
      fineId: `fine-${Date.now()}`,
      rollNo: fineModal.student.rollNo,
      ...fineForm,
      fineDate: new Date().toISOString().split('T')[0],
      issuedBy: 'Accounts Officer',
      status: 'Pending',
      appealStatus: 'None'
    };
    saveFineRegistry([...(fineRegistry ?? []), newFine]);
    setFineModal({ isOpen: false, student: null });
    toast.success(`Fine issued to ${fineModal.student.studentName}!`);
  };

  const handleCollectPayment = (e) => {
    e.preventDefault();
    const student = paymentModal.student;
    const amountPaid = Number(paymentForm.amount);

    if (amountPaid <= 0 || amountPaid > student.remainingBalance) {
      toast.error('Invalid payment amount entered.');
      return;
    }

    // Record Transaction
    const newTx = {
      id: `tx-${Date.now()}`,
      rollNo: student.rollNo,
      studentName: student.studentName,
      amount: amountPaid,
      paymentMode: paymentForm.paymentMode,
      referenceId: paymentForm.referenceId || `REF${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      remarks: paymentForm.remarks || 'Fee System Payment'
    };
    saveFeeTransactions([...(feeTransactions ?? []), newTx]);

    // Update paidAmount inside registry
    const updatedRegistry = (studentFeeRegistry ?? []).map(s => {
      if (s.rollNo === student.rollNo) {
        return {
          ...s,
          paidAmount: Number(s.paidAmount || 0) + amountPaid
        };
      }
      return s;
    });
    saveStudentFeeRegistry(updatedRegistry);

    // Auto clear fines if paid fully
    const studentFines = (fineRegistry ?? []).filter(f => f.rollNo === student.rollNo && f.status === 'Pending');
    if (studentFines.length > 0 && amountPaid >= studentFines.reduce((sum, f) => sum + f.fineAmount, 0)) {
      const updatedFines = (fineRegistry ?? []).map(f => f.rollNo === student.rollNo ? { ...f, status: 'Paid' } : f);
      saveFineRegistry(updatedFines);
    }

    setPaymentModal({ isOpen: false, student: null });
    toast.success(`Recorded payment of ₹${amountPaid.toLocaleString()}`);
  };

  const openDrilldown = ({ title, type, data }) => {
    // Debug Validation Requirement
    console.log({
      drilldownType: type,
      totalRecords: data?.length,
      records: data
    });

    setDrilldownModal({
      isOpen: true,
      title,
      viewType: type,
      data: data ?? []
    });
  };

  // --- Helper to get affected student count for batch locking ---
  const getAffectedStudentsCount = (struct) => {
    return computedStudents.filter(s => s.admissionYear === struct.admissionYear && s.department === struct.department).length;
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 Outfit-Font text-slate-800 antialiased selection:bg-emerald-500 selection:text-white animate-fade-in">
      
      {/* Hero Head Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white rounded-[40px] p-8 shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-600 border border-emerald-400 animate-pulse">
                Fixed Fee Architecture v3.0
              </span>
              <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Department-wise Allocation
              </span>
            </div>
            <h1 className="text-3xl xl:text-4xl font-black mt-2 tracking-tight text-white">
              Fee Configuration
            </h1>
            <p className="text-slate-400 text-xs font-semibold mt-1">
              Configure baseline academic structures department-wise for every admission batch. Old batches remain locked.
            </p>
          </div>

          <div className="flex gap-3 text-xs font-black uppercase tracking-wider">
            {['dashboard', 'structures', 'students'].map(v => (
              <button
                key={v}
                onClick={() => setActiveView(v)}
                className={`px-4 py-2.5 rounded-2xl transition-colors ${activeView === v ? 'bg-emerald-600 text-white shadow-md' : 'bg-white/5 hover:bg-white/10 text-slate-300'}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Synchronized KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {[
          { title: 'Admission Structures', value: kpiTotalStructures, color: 'bg-emerald-600', icon: FileText, action: () => openDrilldown({ title: 'Yearly Fee Structures', type: 'structures', data: admissionYearFeeStructures }) },
          { title: 'Total Collected', value: `₹${kpiTotalFeesCollected.toLocaleString()}`, color: 'bg-indigo-600', icon: CreditCard, action: () => openDrilldown({ title: 'Total Fees Collected', type: 'transactions', data: feeTransactions }) },
          { title: 'Pending Fees', value: `₹${kpiPendingFees.toLocaleString()}`, color: 'bg-rose-500', icon: AlertTriangle, action: () => openDrilldown({ title: 'Pending Fees', type: 'students', data: pendingFeeData }) },
          { title: 'Students Cleared', value: kpiStudentsClearedCount, color: 'bg-teal-500', icon: CheckCircle, action: () => openDrilldown({ title: 'Students Cleared', type: 'students', data: (computedStudents ?? []).filter(s => s.status === 'Cleared') }) },
          { title: 'Fee Defaulters', value: kpiDefaultersCount, color: 'bg-red-500', icon: AlertCircle, action: () => openDrilldown({ title: 'Fee Defaulters', type: 'students', data: (computedStudents ?? []).filter(s => s.status === 'Defaulter') }) },
          { title: 'Scholarships Awarded', value: kpiScholarshipStudentsCount, color: 'bg-purple-500', icon: Percent, action: () => openDrilldown({ title: 'Scholarship Students', type: 'students', data: scholarshipData }) },
          { title: 'Hostel Revenue', value: `₹${kpiHostelRevenue.toLocaleString()}`, color: 'bg-amber-500', icon: DollarSign, action: () => openDrilldown({ title: 'Hostel Revenue Allocations', type: 'students', data: hostelRevenueData }) },
          { title: 'Transport Revenue', value: `₹${kpiTransportRevenue.toLocaleString()}`, color: 'bg-cyan-600', icon: ArrowUpRight, action: () => openDrilldown({ title: 'Transport Revenue Allocations', type: 'students', data: transportRevenueData }) },
          { title: 'Pending Penalty Fines', value: kpiPendingFines, color: 'bg-orange-500', icon: Scale, action: () => openDrilldown({ title: 'Outstanding Fines Issued', type: 'fines', data: (fineRegistry ?? []).filter(f => f.status === 'Pending') }) },
          { title: 'Installment Plans', value: kpiInstallmentStudentsCount, color: 'bg-pink-600', icon: Calendar, action: () => openDrilldown({ title: 'Installments Active', type: 'students', data: (computedStudents ?? []).filter(s => s.installmentPlan !== 'None') }) }
        ].map((kpi, idx) => (
          <div 
            key={idx}
            onClick={kpi.action}
            className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className={`p-3 rounded-2xl ${kpi.color} text-white shadow-md`}>
                <kpi.icon size={18} />
              </div>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-50 text-slate-400">Sync</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.title}</p>
            <h3 className="text-xl xl:text-2xl font-black text-slate-900 mt-1">{kpi.value}</h3>
          </div>
        ))}
      </div>

      {/* Conditional View Panel */}
      {activeView === 'dashboard' && (
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Financial Revenue Overview</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={computedStudents.map(s => ({ name: s.studentName, amount: s.paidAmount }))}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700 }} />
                  <YAxis tick={{ fontSize: 9, fontWeight: 700 }} />
                  <ChartTooltip formatter={(v) => [`₹${v}`, 'Collected']} />
                  <Bar dataKey="amount" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={admissionYearFeeStructures.map(s => ({ name: s.department, rate: s.tuitionFee }))}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 8, fontWeight: 700 }} />
                  <YAxis tick={{ fontSize: 9, fontWeight: 700 }} />
                  <ChartTooltip formatter={(v) => [`₹${v}`, 'Tuition Base']} />
                  <Bar dataKey="rate" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeView === 'structures' && (
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-base font-black text-slate-800 uppercase tracking-wider">Admission batch Structures</h2>
              <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Fixed breakdown department configurations</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddFutureDept}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-black rounded-xl text-[10px] uppercase tracking-wider"
              >
                + Add Department
              </button>
              <button
                onClick={() => {
                  setStructForm({
                    name: '',
                    admissionYear: '2025',
                    department: 'Computer Science',
                    year: 'I',
                    semester: '1',
                    tuitionFee: 65000,
                    labFee: 8000,
                    libraryFee: 2000,
                    examFee: 3000,
                    semesterFee: 6000,
                    developmentFee: 4000,
                    universityFee: 2500,
                    recordFee: 600,
                    hostelAdmission: 6000,
                    roomRent: 16000,
                    messFee: 11000,
                    electricity: 3500,
                    laundry: 1200,
                    hostelMaintenance: 1200,
                    busRouteFee: 11000,
                    gpsFee: 1200,
                    transportMaintenance: 1200,
                    internalExam: 1200,
                    externalExam: 1800,
                    hallTicket: 600,
                    revaluationFee: 1200,
                    arrearFee: 600,
                    latePaymentFine: 1200,
                    attendanceFine: 600,
                    libraryFine: 300,
                    disciplineFine: 1200,
                    hostelFine: 600,
                    placementTrainingFee: 5000,
                    certificationFee: 2500,
                    industrialVisitFee: 1800,
                    workshopFee: 1200,
                    GST: 18,
                    status: 'Active'
                  });
                  setStructureModal({ isOpen: true, mode: 'create', data: null });
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl text-[10px] uppercase tracking-wider flex items-center gap-1.5"
              >
                <Plus size={14} /> New Structure
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {(admissionYearFeeStructures ?? []).map((struct, idx) => {
              const baseSum = 
                (struct.tuitionFee ?? 0) + 
                (struct.labFee ?? 0) + 
                (struct.libraryFee ?? 0) + 
                (struct.examFee ?? 0) + 
                (struct.semesterFee ?? 0) + 
                (struct.developmentFee ?? 0) + 
                (struct.universityFee ?? 0) + 
                (struct.recordFee ?? 0) +
                (struct.internalExam ?? 0) +
                (struct.externalExam ?? 0) +
                (struct.hallTicket ?? 0) +
                (struct.revaluationFee ?? 0) +
                (struct.arrearFee ?? 0) +
                (struct.placementTrainingFee ?? 0) +
                (struct.certificationFee ?? 0) +
                (struct.industrialVisitFee ?? 0) +
                (struct.workshopFee ?? 0);
              
              const affectedStudents = getAffectedStudentsCount(struct);

              return (
                <div key={struct.id || idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">{struct.name}</h4>
                        <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-indigo-100 text-indigo-700 rounded-md inline-block mt-2">
                          Admission Batch: {struct.admissionYear}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setStructForm({ ...struct });
                            setStructureModal({ isOpen: true, mode: 'edit', data: struct });
                          }}
                          className="p-1.5 hover:bg-slate-200 text-indigo-600 rounded-lg transition-colors"
                          title="Edit Structure"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDuplicateStructure(struct)}
                          className="p-1.5 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors"
                          title="Duplicate Structure"
                        >
                          <Copy size={13} />
                        </button>
                        <button
                          onClick={() => handleArchiveStructure(struct.id)}
                          className="p-1.5 hover:bg-slate-200 text-amber-600 rounded-lg transition-colors"
                          title={struct.status === 'Archived' ? 'Activate' : 'Archive'}
                        >
                          <Archive size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Batch locking badges block */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-slate-900 text-white flex items-center gap-1">
                        <Lock size={10} /> Locked Structure
                      </span>
                      <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-emerald-100 text-emerald-700">
                        Affected Students: {affectedStudents}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${struct.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                        {struct.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 font-bold mt-4 pt-4 border-t border-slate-200/55">
                      <div>Tuition Fee: <span>₹{struct.tuitionFee?.toLocaleString()}</span></div>
                      <div>Exam Fee: <span>₹{struct.examFee?.toLocaleString()}</span></div>
                      <div>Lab Fee: <span>₹{struct.labFee?.toLocaleString()}</span></div>
                      <div>Library Fee: <span>₹{struct.libraryFee?.toLocaleString()}</span></div>
                      <div>Semester Fee: <span>₹{struct.semesterFee?.toLocaleString()}</span></div>
                      <div>Development: <span>₹{struct.developmentFee?.toLocaleString()}</span></div>
                    </div>
                  </div>

                  <div className="text-[11px] font-black text-slate-400 pt-3 border-t border-slate-200/40 uppercase tracking-widest flex justify-between">
                    <span>Semester {struct.semester}</span>
                    <span className="text-emerald-600">Base total: ₹{baseSum.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeView === 'students' && (
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-base font-black text-slate-800 uppercase tracking-wider">Student Ledger Registry</h2>
              <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Select a student profile to view balance detail sheets, issue fines or scholarships</span>
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search roll no or student name..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="px-3 py-2 border border-slate-200 text-xs rounded-xl focus:outline-none bg-slate-50 w-full md:w-60"
              />
              <select
                value={filters.admissionYear}
                onChange={(e) => setFilters({ ...filters, admissionYear: e.target.value })}
                className="bg-slate-50 border border-slate-200 text-xs px-2 rounded-xl focus:outline-none"
              >
                <option value="">All Admission Years</option>
                <option value="2023">2023 Batch</option>
                <option value="2024">2024 Batch</option>
                <option value="2025">2025 Batch</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-widest font-black">
                  <th className="p-3">Admitted Batch</th>
                  <th className="p-3">Student RollNo & Name</th>
                  <th className="p-3">Expected Payable</th>
                  <th className="p-3">Paid Amount</th>
                  <th className="p-3">Outstanding Balance</th>
                  <th className="p-3">Scholarships</th>
                  <th className="p-3">Fines Pending</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60 font-medium">
                {(filteredStudents ?? []).map((student, idx) => (
                  <tr key={student.id || idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3">
                      <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-indigo-50 text-indigo-700 rounded-md">
                        {student.admissionYear} Batch
                      </span>
                    </td>
                    <td className="p-3">
                      <div 
                        onClick={() => setStudentProfileModal({ isOpen: true, student })}
                        className="font-black text-slate-800 text-sm cursor-pointer hover:text-emerald-600 transition-colors"
                      >
                        {student.studentName}
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 block mt-0.5">
                        {student.rollNo} • {student.department} Y{student.year} Sem {student.semester}
                      </span>
                    </td>
                    <td className="p-3 font-bold">₹{student.totalPayable.toLocaleString()}</td>
                    <td className="p-3 text-emerald-600 font-bold">₹{student.paidAmount.toLocaleString()}</td>
                    <td className="p-3 font-extrabold text-slate-900">₹{student.remainingBalance.toLocaleString()}</td>
                    <td className="p-3">
                      {student.scholarships.length > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[9px] font-black bg-purple-100 text-purple-700" title={student.scholarships.map(s => s.scholarshipReason).join(', ')}>
                          {student.scholarships[0].scholarshipCategory} (₹{student.concessionAmount.toLocaleString()})
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">None</span>
                      )}
                    </td>
                    <td className="p-3">
                      {student.fines.length > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[9px] font-black bg-rose-100 text-rose-700" title={student.fines.map(f => f.fineReason).join(', ')}>
                          {student.fines.length} Fines (₹{student.fines.reduce((sum, f) => sum + f.fineAmount, 0).toLocaleString()})
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">No fines</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setPaymentModal({ isOpen: true, student })}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-black rounded-lg text-[9px] uppercase tracking-wider transition-colors"
                          disabled={student.remainingBalance === 0}
                        >
                          Collect
                        </button>
                        <button
                          onClick={() => setScholarshipModal({ isOpen: true, student })}
                          className="p-1 hover:bg-slate-100 text-purple-500 rounded-lg"
                          title="Issue Scholarship"
                        >
                          <Gift size={13} />
                        </button>
                        <button
                          onClick={() => setFineModal({ isOpen: true, student })}
                          className="p-1 hover:bg-slate-100 text-rose-500 rounded-lg"
                          title="Issue Fine"
                        >
                          <Scale size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. DRILLDOWN MODAL */}
      {drilldownModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-5xl bg-white border border-slate-100 rounded-[32px] shadow-2xl overflow-hidden flex flex-col justify-between max-h-[85vh]">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">{drilldownModal.title} Drilldown</h3>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Synchronized live finance registry details
                </span>
              </div>
              <button onClick={() => setDrilldownModal({ isOpen: false, title: '', viewType: '', data: [] })} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-white">
              {(() => {
                if (drilldownModal.viewType === 'structures') {
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(drilldownModal.data ?? []).map((struct, idx) => (
                        <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                          <h4 className="font-extrabold text-slate-800 text-sm">{struct.name}</h4>
                          <div className="grid grid-cols-2 gap-2 text-[10px] mt-2 font-bold text-slate-600">
                            <div>Year: {struct.admissionYear}</div>
                            <div>Dept: {struct.department}</div>
                            <div>Tuition: ₹{struct.tuitionFee?.toLocaleString()}</div>
                            <div>Exam: ₹{struct.examFee?.toLocaleString()}</div>
                            <div>Lab: ₹{struct.labFee?.toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }

                if (drilldownModal.viewType === 'transactions') {
                  return (
                    <table className="w-full text-left text-xs font-semibold text-slate-600 border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-widest font-black">
                          <th className="p-3">Tx Date</th>
                          <th className="p-3">Ref ID</th>
                          <th className="p-3">Student Name</th>
                          <th className="p-3">Payment Mode</th>
                          <th className="p-3 text-right">Amount Paid</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {(drilldownModal.data ?? []).map((tx, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-3 font-bold text-indigo-600">{tx.date}</td>
                            <td className="p-3 font-mono">{tx.referenceId}</td>
                            <td className="p-3 font-bold text-slate-800">{tx.studentName} ({tx.rollNo})</td>
                            <td className="p-3">{tx.paymentMode}</td>
                            <td className="p-3 text-right text-emerald-600 font-extrabold">₹{tx.amount?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                }

                if (drilldownModal.viewType === 'fines') {
                  return (
                    <table className="w-full text-left text-xs font-semibold text-slate-600 border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-widest font-black">
                          <th className="p-3">Fine Type</th>
                          <th className="p-3">Student RollNo</th>
                          <th className="p-3">Reason for Fine</th>
                          <th className="p-3">Issued By</th>
                          <th className="p-3">Due Date</th>
                          <th className="p-3 text-right">Fine Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {(drilldownModal.data ?? []).map((f, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-3 font-bold text-rose-600">{f.fineType}</td>
                            <td className="p-3 font-mono">{f.rollNo}</td>
                            <td className="p-3 text-slate-800">{f.fineReason}</td>
                            <td className="p-3">{f.issuedBy}</td>
                            <td className="p-3">{f.dueDate || 'N/A'}</td>
                            <td className="p-3 text-right text-slate-900 font-extrabold">₹{f.fineAmount?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                }

                const filtered = drilldownModal.data ?? [];
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map((item, idx) => (
                      <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-sm">{item.studentName}</h4>
                            <span className="text-[10px] text-slate-400 font-bold">{item.rollNo} • Batch {item.admissionYear}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase text-white ${item.status === 'Cleared' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] pt-3 border-t border-slate-200/50 font-bold text-slate-600">
                          <div>Tuition: ₹{item.rawStructure.tuitionFee?.toLocaleString()}</div>
                          <div>Exam: ₹{item.rawStructure.examFee?.toLocaleString()}</div>
                          <div>GST Included: ₹{item.gst?.toLocaleString()}</div>
                          <div>Scholarship Deducted: ₹{item.concessionAmount?.toLocaleString()}</div>
                          {item.scholarships.length > 0 && (
                            <div className="col-span-2 text-purple-700">Reason for Scholarship: {item.scholarships[0].scholarshipReason}</div>
                          )}
                          {item.fines.length > 0 && (
                            <div className="col-span-2 text-rose-600">Reason for Fine: {item.fines[0].fineReason}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setDrilldownModal({ isOpen: false, title: '', filterFn: null, viewType: '' })}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. DETAILED BREAKDOWN STRUCTURE MODAL FORM */}
      {structureModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-4xl bg-white border border-slate-100 rounded-[32px] shadow-2xl overflow-hidden flex flex-col justify-between max-h-[90vh]">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                  {structureModal.mode === 'edit' ? 'Modify & Edit Detailed Fee Structure' : 'Allocate New Fee Structure'}
                </h3>
                <span className="text-[9px] text-rose-500 font-bold uppercase tracking-wider block mt-0.5">
                  ⚠️ Note: Older batches assigned to this admission year will remain locked.
                </span>
              </div>
              <button onClick={() => setStructureModal({ isOpen: false, mode: 'create', data: null })} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                <X size={18} />
              </button>
            </div>

            {/* Premium Tab Navigation inside Edit Modal */}
            <div className="flex bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider">
              {[
                { id: 'academic', name: 'Academic & Examination Fees' },
                { id: 'hostel', name: 'Hostel & Transport Fees' },
                { id: 'penalties', name: 'Penalties & Optional Services' },
                { id: 'batch', name: 'Batch Mappings & Settings' }
              ].map(tab => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setModalTab(tab.id)}
                  className={`px-5 py-3 border-r border-slate-100 transition-colors ${modalTab === tab.id ? 'bg-white text-emerald-600 border-b-2 border-b-emerald-500' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveStructure} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-semibold text-slate-600">
              {modalTab === 'academic' && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Academic Fees Breakdown</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="mb-1 block">Tuition Fee</label>
                      <input type="number" value={structForm.tuitionFee} onChange={(e) => setStructForm({ ...structForm, tuitionFee: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block">Lab Fee</label>
                      <input type="number" value={structForm.labFee} onChange={(e) => setStructForm({ ...structForm, labFee: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block">Library Fee</label>
                      <input type="number" value={structForm.libraryFee} onChange={(e) => setStructForm({ ...structForm, libraryFee: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block">Exam Fee</label>
                      <input type="number" value={structForm.examFee} onChange={(e) => setStructForm({ ...structForm, examFee: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block">Semester Fee</label>
                      <input type="number" value={structForm.semesterFee} onChange={(e) => setStructForm({ ...structForm, semesterFee: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block">Development Fee</label>
                      <input type="number" value={structForm.developmentFee} onChange={(e) => setStructForm({ ...structForm, developmentFee: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block">University Fee</label>
                      <input type="number" value={structForm.universityFee} onChange={(e) => setStructForm({ ...structForm, universityFee: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block">Record Book Fee</label>
                      <input type="number" value={structForm.recordFee} onChange={(e) => setStructForm({ ...structForm, recordFee: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                  </div>

                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider pt-4 border-t border-slate-100">Examination Fees Breakdown</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <div>
                      <label className="mb-1 block">Internal Exam</label>
                      <input type="number" value={structForm.internalExam} onChange={(e) => setStructForm({ ...structForm, internalExam: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block">External Exam</label>
                      <input type="number" value={structForm.externalExam} onChange={(e) => setStructForm({ ...structForm, externalExam: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block">Hall Ticket Fee</label>
                      <input type="number" value={structForm.hallTicket} onChange={(e) => setStructForm({ ...structForm, hallTicket: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block">Revaluation</label>
                      <input type="number" value={structForm.revaluationFee} onChange={(e) => setStructForm({ ...structForm, revaluationFee: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block">Arrear Fee</label>
                      <input type="number" value={structForm.arrearFee} onChange={(e) => setStructForm({ ...structForm, arrearFee: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {modalTab === 'hostel' && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Hostel Fees Breakdown</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="mb-1 block">Hostel Admission</label>
                      <input type="number" value={structForm.hostelAdmission} onChange={(e) => setStructForm({ ...structForm, hostelAdmission: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block">Room Rent</label>
                      <input type="number" value={structForm.roomRent} onChange={(e) => setStructForm({ ...structForm, roomRent: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block">Mess Fee</label>
                      <input type="number" value={structForm.messFee} onChange={(e) => setStructForm({ ...structForm, messFee: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block">Electricity</label>
                      <input type="number" value={structForm.electricity} onChange={(e) => setStructForm({ ...structForm, electricity: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block">Laundry Charges</label>
                      <input type="number" value={structForm.laundry} onChange={(e) => setStructForm({ ...structForm, laundry: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block">Maintenance</label>
                      <input type="number" value={structForm.hostelMaintenance} onChange={(e) => setStructForm({ ...structForm, hostelMaintenance: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                  </div>

                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider pt-4 border-t border-slate-100">Transport Fees Mappings</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="mb-1 block">Bus Route Fee</label>
                      <input type="number" value={structForm.busRouteFee} onChange={(e) => setStructForm({ ...structForm, busRouteFee: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block">GPS Tracking</label>
                      <input type="number" value={structForm.gpsFee} onChange={(e) => setStructForm({ ...structForm, gpsFee: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block">Transport Maintenance</label>
                      <input type="number" value={structForm.transportMaintenance} onChange={(e) => setStructForm({ ...structForm, transportMaintenance: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {modalTab === 'penalties' && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Late Penalty & Fine rules</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <div>
                      <label className="mb-1 block">Late Payment Fine</label>
                      <input type="number" value={structForm.latePaymentFine} onChange={(e) => setStructForm({ ...structForm, latePaymentFine: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block">Attendance Fine</label>
                      <input type="number" value={structForm.attendanceFine} onChange={(e) => setStructForm({ ...structForm, attendanceFine: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block">Library Fine</label>
                      <input type="number" value={structForm.libraryFine} onChange={(e) => setStructForm({ ...structForm, libraryFine: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block">Discipline Fine</label>
                      <input type="number" value={structForm.disciplineFine} onChange={(e) => setStructForm({ ...structForm, disciplineFine: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block">Hostel Penalty</label>
                      <input type="number" value={structForm.hostelFine} onChange={(e) => setStructForm({ ...structForm, hostelFine: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                  </div>

                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider pt-4 border-t border-slate-100">Optional Training & Services</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="mb-1 block">Placement Training</label>
                      <input type="number" value={structForm.placementTrainingFee} onChange={(e) => setStructForm({ ...structForm, placementTrainingFee: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block">Certification Courses</label>
                      <input type="number" value={structForm.certificationFee} onChange={(e) => setStructForm({ ...structForm, certificationFee: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block">Industrial Visit</label>
                      <input type="number" value={structForm.industrialVisitFee} onChange={(e) => setStructForm({ ...structForm, industrialVisitFee: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block">Workshops Fee</label>
                      <input type="number" value={structForm.workshopFee} onChange={(e) => setStructForm({ ...structForm, workshopFee: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {modalTab === 'batch' && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">General batch Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block">Structure Name</label>
                      <input type="text" required value={structForm.name} onChange={(e) => setStructForm({ ...structForm, name: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block">GST Rate (%)</label>
                      <input type="number" value={structForm.GST} onChange={(e) => setStructForm({ ...structForm, GST: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="mb-1 block">Admission Year Batch</label>
                      <select value={structForm.admissionYear} onChange={(e) => setStructForm({ ...structForm, admissionYear: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none">
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block">Department</label>
                      <select value={structForm.department} onChange={(e) => setStructForm({ ...structForm, department: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none">
                        {(departmentsList ?? []).map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block">Semester Mapped</label>
                      <input type="text" value={structForm.semester} onChange={(e) => setStructForm({ ...structForm, semester: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none" />
                    </div>
                  </div>
                </div>
              )}
            </form>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setStructureModal({ isOpen: false, mode: 'create', data: null })}
                className="px-5 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold uppercase tracking-wider text-[10px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveStructure}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl uppercase tracking-wider text-[10px]"
              >
                Save Fee Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. SCHOLARSHIP MODAL */}
      {scholarshipModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-xl bg-white border border-slate-100 rounded-[32px] shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Issue Scholarship Quota</h3>
                <span className="text-[9px] text-slate-400 font-bold mt-0.5">{scholarshipModal.student.studentName} ({scholarshipModal.student.rollNo})</span>
              </div>
              <button onClick={() => setScholarshipModal({ isOpen: false, student: null })} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleIssueScholarship} className="p-6 space-y-4 text-xs font-semibold text-slate-600">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase mb-1 block">Scholarship Category</label>
                  <select
                    value={scholarshipForm.scholarshipCategory}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, scholarshipCategory: e.target.value, scholarshipType: `${e.target.value} Scholarship` })}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none"
                  >
                    {SCHOLARSHIP_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase mb-1 block">Provider / Authority</label>
                  <input
                    type="text"
                    required
                    value={scholarshipForm.scholarshipProvider}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, scholarshipProvider: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-black uppercase mb-1 block">Reason for Scholarship</label>
                <select
                  value={scholarshipForm.scholarshipReason}
                  onChange={(e) => setScholarshipForm({ ...scholarshipForm, scholarshipReason: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none"
                >
                  <option value="Top academic performance">Top academic performance</option>
                  <option value="Financial hardship">Financial hardship</option>
                  <option value="Sports achievement">Sports achievement</option>
                  <option value="Government welfare scheme">Government welfare scheme</option>
                  <option value="Single parent support">Single parent support</option>
                  <option value="Physically challenged assistance">Physically challenged assistance</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase mb-1 block">Concession Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={scholarshipForm.scholarshipAmount}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, scholarshipAmount: Number(e.target.value) })}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase mb-1 block">Validity Year Range</label>
                  <input
                    type="text"
                    required
                    value={scholarshipForm.validityPeriod}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, validityPeriod: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none"
                    placeholder="e.g. 2026-2027"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setScholarshipModal({ isOpen: false, student: null })}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold uppercase tracking-wider text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl uppercase tracking-wider text-[10px]"
                >
                  Issue Scholarship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. FINE MODAL */}
      {fineModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-xl bg-white border border-slate-100 rounded-[32px] shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Issue Penalty Fine</h3>
                <span className="text-[9px] text-slate-400 font-bold mt-0.5">{fineModal.student.studentName} ({fineModal.student.rollNo})</span>
              </div>
              <button onClick={() => setFineModal({ isOpen: false, student: null })} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleIssueFine} className="p-6 space-y-4 text-xs font-semibold text-slate-600">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase mb-1 block">Fine Category</label>
                  <select
                    value={fineForm.fineType}
                    onChange={(e) => setFineForm({ ...fineForm, fineType: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none"
                  >
                    {FINE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase mb-1 block">Fine Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={fineForm.fineAmount}
                    onChange={(e) => setFineForm({ ...fineForm, fineAmount: Number(e.target.value) })}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-black uppercase mb-1 block">Reason for Fine</label>
                <select
                  value={fineForm.fineReason}
                  onChange={(e) => setFineForm({ ...fineForm, fineReason: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none"
                >
                  <option value="Late semester payment">Late semester payment</option>
                  <option value="Attendance below threshold">Attendance below threshold</option>
                  <option value="Library book overdue">Library book overdue</option>
                  <option value="Hostel property damage">Hostel property damage</option>
                  <option value="Discipline violation">Discipline violation</option>
                  <option value="Malpractice case">Malpractice case</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-black uppercase mb-1 block">Due Date</label>
                <input
                  type="date"
                  required
                  value={fineForm.dueDate}
                  onChange={(e) => setFineForm({ ...fineForm, dueDate: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setFineModal({ isOpen: false, student: null })}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold uppercase tracking-wider text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl uppercase tracking-wider text-[10px]"
                >
                  Issue Fine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. COLLECT PAYMENT MODAL */}
      {paymentModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-xl bg-white border border-slate-100 rounded-[32px] shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Record Fee Payment</h3>
                <span className="text-[9px] text-slate-400 font-bold mt-0.5">Collect due fees/fines for {paymentModal.student.studentName}</span>
              </div>
              <button onClick={() => setPaymentModal({ isOpen: false, student: null })} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCollectPayment} className="p-6 space-y-4 text-xs font-semibold text-slate-600">
              <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-600 space-y-2">
                <div className="flex justify-between">
                  <span>Grand Total due:</span>
                  <span>₹{paymentModal.student.totalPayable?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Paid amount:</span>
                  <span>₹{paymentModal.student.paidAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-rose-600 font-extrabold border-t border-slate-200/50 pt-2">
                  <span>Pending Balance:</span>
                  <span>₹{paymentModal.student.remainingBalance?.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-black uppercase mb-1 block">Payment Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:bg-white text-base font-black text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase mb-1 block">Payment Mode</label>
                  <select
                    value={paymentForm.paymentMode}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentMode: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash Receipt">Cash Receipt</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase mb-1 block">Reference Transaction ID</label>
                  <input
                    type="text"
                    value={paymentForm.referenceId}
                    onChange={(e) => setPaymentForm({ ...paymentForm, referenceId: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none"
                    placeholder="e.g. UPI8203951"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-black uppercase mb-1 block">Remarks</label>
                <input
                  type="text"
                  value={paymentForm.remarks}
                  onChange={(e) => setPaymentForm({ ...paymentForm, remarks: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none"
                  placeholder="e.g. Tuition fee part pay"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPaymentModal({ isOpen: false, student: null })}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold uppercase tracking-wider text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl uppercase tracking-wider text-[10px]"
                >
                  Collect Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 10. STUDENT PROFILE DETAIL DRAWER / MODAL */}
      {studentProfileModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-2xl bg-white border border-slate-100 rounded-[32px] shadow-2xl overflow-hidden flex flex-col justify-between max-h-[90vh]">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Student Financial Profile</h3>
                <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{studentProfileModal.student.studentName} ({studentProfileModal.student.rollNo})</span>
              </div>
              <button onClick={() => setStudentProfileModal({ isOpen: false, student: null })} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 font-semibold bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[9px] text-slate-400 font-black block">Admission Year</span>
                  <span className="font-extrabold text-slate-900 text-sm mt-1 block">{studentProfileModal.student.admissionYear} Batch</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[9px] text-slate-400 font-black block">Status</span>
                  <span className="font-extrabold text-slate-900 text-sm mt-1 block uppercase">{studentProfileModal.student.status}</span>
                </div>
              </div>

              <div>
                <h4 className="font-black text-slate-800 uppercase tracking-wider text-[10px] mb-2">Base Structure Mappings</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="border border-slate-100 p-2.5 rounded-xl">Tuition: ₹{studentProfileModal.student.rawStructure.tuitionFee?.toLocaleString()}</div>
                  <div className="border border-slate-100 p-2.5 rounded-xl">Exam: ₹{studentProfileModal.student.rawStructure.examFee?.toLocaleString()}</div>
                  <div className="border border-slate-100 p-2.5 rounded-xl">Lab: ₹{studentProfileModal.student.rawStructure.labFee?.toLocaleString()}</div>
                  <div className="border border-slate-100 p-2.5 rounded-xl">Placement: ₹{studentProfileModal.student.rawStructure.placementTrainingFee?.toLocaleString()}</div>
                  <div className="border border-slate-100 p-2.5 rounded-xl">Library: ₹{studentProfileModal.student.rawStructure.libraryFee?.toLocaleString()}</div>
                  <div className="border border-slate-100 p-2.5 rounded-xl">Misc: ₹{studentProfileModal.student.rawStructure.miscellaneousFee?.toLocaleString()}</div>
                </div>
              </div>

              {studentProfileModal.student.scholarships.length > 0 && (
                <div>
                  <h4 className="font-black text-slate-800 uppercase tracking-wider text-[10px] mb-2 text-purple-700">Active Scholarships</h4>
                  <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-2xl space-y-1">
                    <div>Type: <span className="font-bold">{studentProfileModal.student.scholarships[0].scholarshipType}</span></div>
                    <div>Reason for Scholarship: <span className="font-bold text-purple-700">{studentProfileModal.student.scholarships[0].scholarshipReason}</span></div>
                    <div>Provider: <span className="font-bold">{studentProfileModal.student.scholarships[0].scholarshipProvider}</span></div>
                    <div>Concession: <span className="font-black text-purple-800">₹{studentProfileModal.student.concessionAmount?.toLocaleString()}</span></div>
                  </div>
                </div>
              )}

              {studentProfileModal.student.fines.length > 0 && (
                <div>
                  <h4 className="font-black text-slate-800 uppercase tracking-wider text-[10px] mb-2 text-rose-700">Outstanding Fines</h4>
                  <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-2xl space-y-1">
                    <div>Fine Type: <span className="font-bold">{studentProfileModal.student.fines[0].fineType}</span></div>
                    <div>Reason for Fine: <span className="font-bold text-rose-700">{studentProfileModal.student.fines[0].fineReason}</span></div>
                    <div>Issued By: <span className="font-bold">{studentProfileModal.student.fines[0].issuedBy}</span></div>
                    <div>Amount Due: <span className="font-black text-rose-800">₹{studentProfileModal.student.fines.reduce((sum, f) => sum + f.fineAmount, 0).toLocaleString()}</span></div>
                  </div>
                </div>
              )}

              <div className="border-t border-slate-100 pt-4 text-slate-900 font-extrabold space-y-1 bg-slate-50/40 p-4 rounded-2xl">
                <div className="flex justify-between">
                  <span>Gross Subtotal:</span>
                  <span>₹{studentProfileModal.student.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-purple-700">
                  <span>Less Scholarship Concession:</span>
                  <span>- ₹{studentProfileModal.student.concessionAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST Amount:</span>
                  <span>₹{studentProfileModal.student.gst?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-rose-700">
                  <span>Outstanding Penalties:</span>
                  <span>₹{studentProfileModal.student.fines.reduce((sum, f) => sum + f.fineAmount, 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-black border-t border-slate-200 pt-2 mt-2">
                  <span>Grand Total due:</span>
                  <span>₹{studentProfileModal.student.totalPayable?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-black">
                  <span>Paid to date:</span>
                  <span>₹{studentProfileModal.student.paidAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-rose-600 font-black">
                  <span>Remaining Balance:</span>
                  <span>₹{studentProfileModal.student.remainingBalance?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setStudentProfileModal({ isOpen: false, student: null })}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FeesManagement;
