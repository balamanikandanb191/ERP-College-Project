import React, { useState, useEffect } from 'react';
import { IndianRupee, Printer, Download, Clock, ChevronDown } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PaymentHistoryTable = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/fees/payments');
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fees API Error:', err.response?.data || err.message);
      toast.error('Failed to load payments', { id: 'payments-err' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const exportToCSV = () => {
    if (payments.length === 0) {
      toast.error('No payments to export');
      return;
    }
    const headers = ['Receipt No', 'Student Name', 'Reg No', 'Fee Structure', 'Amount Paid', 'Method', 'Transaction ID', 'Date'];
    const rows = payments.map(p => [
      p.receiptNumber,
      p.StudentFee?.Student?.fullName || 'N/A',
      p.StudentFee?.Student?.registerNumber || 'N/A',
      p.StudentFee?.FeeStructure?.title || 'N/A',
      p.amountPaid,
      p.paymentMethod || 'N/A',
      p.transactionId || 'N/A',
      new Date(p.paymentDate).toLocaleString()
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.map(val => `"${val}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Fee_Transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported successfully');
  };

  const exportToExcel = () => {
    if (payments.length === 0) {
      toast.error('No payments to export');
      return;
    }
    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8"/><style>table { border-collapse: collapse; } th, td { border: 1px solid #cbd5e1; padding: 8px; font-family: sans-serif; }</style></head>
      <body>
        <table>
          <thead>
            <tr style="background-color: #f1f5f9; font-weight: bold;">
              <th>Receipt No</th>
              <th>Student Name</th>
              <th>Reg No</th>
              <th>Fee Structure</th>
              <th>Amount Paid (INR)</th>
              <th>Payment Method</th>
              <th>Transaction ID</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
    `;
    payments.forEach(p => {
      html += `
        <tr>
          <td>${p.receiptNumber}</td>
          <td>${p.StudentFee?.Student?.fullName || 'N/A'}</td>
          <td>${p.StudentFee?.Student?.registerNumber || 'N/A'}</td>
          <td>${p.StudentFee?.FeeStructure?.title || 'N/A'}</td>
          <td>${p.amountPaid}</td>
          <td>${p.paymentMethod || 'N/A'}</td>
          <td>${p.transactionId || 'N/A'}</td>
          <td>${new Date(p.paymentDate).toLocaleString()}</td>
        </tr>
      `;
    });
    html += `
          </tbody>
        </table>
      </body>
      </html>
    `;
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Fee_Transactions_${Date.now()}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Excel file exported successfully');
  };

  const exportToWord = () => {
    if (payments.length === 0) {
      toast.error('No payments to export');
      return;
    }
    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8"/><style>body { font-family: sans-serif; } h2 { text-align: center; color: #1e293b; } table { width: 100%; border-collapse: collapse; margin-top: 20px; } th, td { border: 1px solid #cbd5e1; padding: 10px; font-size: 12px; } th { background-color: #f8fafc; }</style></head>
      <body>
        <h2>EduERP College - Fee Transactions Report</h2>
        <p style="text-align: center; font-size: 12px; color: #64748b;">Generated on: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              <th>Receipt No</th>
              <th>Student Name</th>
              <th>Reg No</th>
              <th>Fee Structure</th>
              <th>Amount Paid</th>
              <th>Method</th>
              <th>Transaction ID</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
    `;
    payments.forEach(p => {
      html += `
        <tr>
          <td><b>${p.receiptNumber}</b></td>
          <td>${p.StudentFee?.Student?.fullName || 'N/A'}</td>
          <td>${p.StudentFee?.Student?.registerNumber || 'N/A'}</td>
          <td>${p.StudentFee?.FeeStructure?.title || 'N/A'}</td>
          <td>INR ${p.amountPaid.toLocaleString()}</td>
          <td>${p.paymentMethod || 'N/A'}</td>
          <td>${p.transactionId || 'N/A'}</td>
          <td>${new Date(p.paymentDate).toLocaleString()}</td>
        </tr>
      `;
    });
    html += `
          </tbody>
        </table>
      </body>
      </html>
    `;
    const blob = new Blob([html], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Fee_Transactions_${Date.now()}.doc`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Word document exported successfully');
  };

  const exportToPDF = () => {
    if (payments.length === 0) {
      toast.error('No payments to export');
      return;
    }
    const printWindow = window.open('', '_blank', 'width=1000,height=800');
    if (!printWindow) {
      toast.error('Pop-up blocked! Please allow pop-ups to export reports.');
      return;
    }

    let tableRows = '';
    payments.forEach(p => {
      tableRows += `
        <tr>
          <td><strong>${p.receiptNumber}</strong></td>
          <td>
            <div style="font-weight: 600; color: #1e293b;">${p.StudentFee?.Student?.fullName || 'N/A'}</div>
            <div style="font-size: 11px; color: #64748b;">${p.StudentFee?.Student?.registerNumber || 'N/A'}</div>
          </td>
          <td>${p.StudentFee?.FeeStructure?.title || 'N/A'}</td>
          <td style="font-weight: 700; color: #059669;">₹${p.amountPaid.toLocaleString()}</td>
          <td>
            <div>${p.paymentMethod || 'N/A'}</div>
            <div style="font-size: 11px; color: #64748b;">Ref: ${p.transactionId || 'N/A'}</div>
          </td>
          <td style="font-size: 12px; color: #475569;">${new Date(p.paymentDate).toLocaleString()}</td>
        </tr>
      `;
    });

    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fee Transactions Report</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            color: #1e293b;
            padding: 30px;
            margin: 0;
            line-height: 1.5;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo-section h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            color: #0f172a;
          }
          .logo-section p {
            margin: 4px 0 0 0;
            font-size: 12px;
            color: #64748b;
          }
          .report-title {
            text-align: right;
          }
          .report-title h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 800;
            color: #059669;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .report-title p {
            margin: 4px 0 0 0;
            font-size: 12px;
            color: #64748b;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            margin-top: 20px;
          }
          th {
            background-color: #f8fafc;
            color: #475569;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            padding: 12px 14px;
            border-bottom: 2px solid #cbd5e1;
            border-top: 1px solid #e2e8f0;
          }
          td {
            padding: 14px;
            font-size: 13px;
            border-bottom: 1px solid #e2e8f0;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
          }
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-section">
            <h1>EduERP College</h1>
            <p>123 Academy Road, Education City</p>
          </div>
          <div class="report-title">
            <h2>Transactions Report</h2>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Receipt No</th>
              <th>Student Details</th>
              <th>Fee Structure</th>
              <th>Amount Paid</th>
              <th>Payment Details</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <div class="footer">
          <p>End of report. Generated automatically by EduERP Enterprise Suite.</p>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(reportHtml);
    printWindow.document.close();
  };

  const handlePrintReceipt = (p) => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      toast.error('Pop-up blocked! Please allow pop-ups to print receipts.');
      return;
    }

    const receiptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${p.receiptNumber}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            color: #1e293b;
            padding: 40px;
            margin: 0;
            line-height: 1.5;
          }
          .receipt-container {
            max-width: 700px;
            margin: 0 auto;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo-section h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.025em;
          }
          .logo-section p {
            margin: 4px 0 0 0;
            font-size: 12px;
            color: #64748b;
            font-weight: 500;
          }
          .receipt-title {
            text-align: right;
          }
          .receipt-title h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 700;
            color: #059669;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .receipt-title p {
            margin: 4px 0 0 0;
            font-size: 13px;
            color: #475569;
            font-weight: 600;
          }
          .details-grid {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 24px;
            margin-bottom: 30px;
          }
          .details-box {
            background-color: #f8fafc;
            border: 1px solid #f1f5f9;
            border-radius: 12px;
            padding: 20px;
          }
          .details-box h3 {
            margin: 0 0 12px 0;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #64748b;
          }
          .details-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 13px;
          }
          .details-row:last-child {
            margin-bottom: 0;
          }
          .details-label {
            color: #64748b;
            font-weight: 500;
          }
          .details-val {
            color: #0f172a;
            font-weight: 600;
          }
          .table-section {
            margin-bottom: 30px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          }
          th {
            background-color: #f8fafc;
            color: #475569;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            padding: 12px 16px;
            border-bottom: 2px solid #e2e8f0;
          }
          td {
            padding: 16px;
            font-size: 14px;
            border-bottom: 1px solid #f1f5f9;
          }
          .amount-col {
            text-align: right;
          }
          .total-box {
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 8px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            width: 250px;
            font-size: 14px;
          }
          .total-row.grand {
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
            border-top: 2px solid #e2e8f0;
            padding-top: 8px;
            margin-top: 4px;
          }
          .footer {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding-top: 30px;
            border-top: 1px dashed #e2e8f0;
          }
          .footer-note {
            font-size: 11px;
            color: #94a3b8;
            max-width: 300px;
          }
          .signature-box {
            text-align: center;
            width: 180px;
          }
          .signature-line {
            border-bottom: 1px solid #cbd5e1;
            margin-bottom: 8px;
            height: 40px;
          }
          .signature-title {
            font-size: 11px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
          }
          
          @media print {
            body {
              padding: 0;
            }
            .receipt-container {
              border: none;
              box-shadow: none;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <div class="logo-section">
              <h1>EduERP College</h1>
              <p>123 Academy Road, Education City</p>
            </div>
            <div class="receipt-title">
              <h2>Payment Receipt</h2>
              <p>Receipt No: ${p.receiptNumber}</p>
            </div>
          </div>
          
          <div class="details-grid">
            <div class="details-box">
              <h3>Student Information</h3>
              <div class="details-row">
                <span class="details-label">Name:</span>
                <span class="details-val">${p.StudentFee?.Student?.fullName || 'N/A'}</span>
              </div>
              <div class="details-row">
                <span class="details-label">Reg No:</span>
                <span class="details-val">${p.StudentFee?.Student?.registerNumber || 'N/A'}</span>
              </div>
              <div class="details-row">
                <span class="details-label">Course:</span>
                <span class="details-val">${p.StudentFee?.Student?.department || 'N/A'}</span>
              </div>
            </div>
            
            <div class="details-box">
              <h3>Payment Details</h3>
              <div class="details-row">
                <span class="details-label">Date:</span>
                <span class="details-val">${new Date(p.paymentDate).toLocaleDateString()}</span>
              </div>
              <div class="details-row">
                <span class="details-label">Payment Method:</span>
                <span class="details-val">${p.paymentMethod || 'N/A'}</span>
              </div>
              <div class="details-row">
                <span class="details-label">Transaction Ref:</span>
                <span class="details-val">${p.transactionId || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div class="table-section">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th class="amount-col">Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>${p.StudentFee?.FeeStructure?.title || 'Fee Payment'}</strong>
                    <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Part payment towards course fees</div>
                  </td>
                  <td class="amount-col" style="font-weight: 600;">₹${p.amountPaid.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="total-box">
            <div class="total-row">
              <span class="details-label">Total Amount Due:</span>
              <span class="details-val">₹${(p.StudentFee?.totalAmount || 0).toLocaleString()}</span>
            </div>
            <div class="total-row">
              <span class="details-label">Amount Paid:</span>
              <span class="details-val" style="color: #059669;">₹${(p.amountPaid || 0).toLocaleString()}</span>
            </div>
            <div class="total-row">
              <span class="details-label">Remaining Balance:</span>
              <span class="details-val" style="color: #e11d48;">₹${(p.StudentFee?.dueAmount || 0).toLocaleString()}</span>
            </div>
            <div class="total-row grand">
              <span>Paid Amount</span>
              <span>₹${p.amountPaid.toLocaleString()}</span>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-note">
              <p>This is an electronically generated receipt. No physical signature is required.</p>
              <p style="margin-top: 4px; font-weight: 500;">Thank you for your payment!</p>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <span class="signature-title">Authorized Signatory</span>
            </div>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(receiptHtml);
    printWindow.document.close();
  };

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading payment history...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><IndianRupee className="text-emerald-600" size={20} /> Transaction History ({payments.length})</h2>
        <div className="relative">
          <button 
            onClick={() => setIsExportOpen(!isExportOpen)}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-sm"
          >
            <Download size={18} /> Export <ChevronDown size={14} className={`transition-transform duration-200 ${isExportOpen ? 'rotate-180' : ''}`} />
          </button>
          {isExportOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsExportOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-gray-200 shadow-lg py-1.5 z-20">
                <button onClick={() => { exportToPDF(); setIsExportOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Printer size={15} className="text-red-500" /> Export PDF
                </button>
                <button onClick={() => { exportToExcel(); setIsExportOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Download size={15} className="text-emerald-600" /> Export Excel
                </button>
                <button onClick={() => { exportToWord(); setIsExportOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Download size={15} className="text-blue-500" /> Export Word
                </button>
                <button onClick={() => { exportToCSV(); setIsExportOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Download size={15} className="text-slate-600" /> Export CSV
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-4 font-semibold">Receipt No</th>
              <th className="px-4 py-4 font-semibold">Student / Fee</th>
              <th className="px-4 py-4 font-semibold">Amount Paid</th>
              <th className="px-4 py-4 font-semibold">Payment Details</th>
              <th className="px-4 py-4 font-semibold">Date & Time</th>
              <th className="px-4 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {payments.length > 0 ? payments.map(p => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-4"><span className="font-bold text-gray-900">{p.receiptNumber}</span></td>
                <td className="px-4 py-4">
                  <div className="font-medium text-gray-800">{p.StudentFee?.Student?.fullName}</div>
                  <div className="text-xs text-gray-500">{p.StudentFee?.FeeStructure?.title} • {p.StudentFee?.Student?.registerNumber}</div>
                </td>
                <td className="px-4 py-4 font-bold text-emerald-600">₹{p.amountPaid.toLocaleString()}</td>
                <td className="px-4 py-4">
                  <div className="font-medium text-gray-800">{p.paymentMethod}</div>
                  {p.transactionId && <div className="text-xs text-gray-500">Ref: {p.transactionId}</div>}
                </td>
                <td className="px-4 py-4 text-sm text-gray-600 flex items-center gap-1.5"><Clock size={14} className="text-gray-400" /> {new Date(p.paymentDate).toLocaleString()}</td>
                <td className="px-4 py-4 text-right">
                  <button onClick={() => handlePrintReceipt(p)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center justify-end w-full gap-1.5 font-medium text-xs">
                    <Printer size={14} /> Print
                  </button>
                </td>
              </tr>
            )) : <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-500">No payment transactions found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistoryTable;
