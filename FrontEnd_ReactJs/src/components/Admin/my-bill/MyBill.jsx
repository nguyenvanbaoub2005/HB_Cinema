import React, { useEffect, useState } from "react";
import { useNotificationModal } from "../../User/notificationModal/NotificationModal";
import { getMyBill } from "../../../api/apiBill";
import { useNavigate } from "react-router-dom";
import { CheckCircleIcon, FileText } from "lucide-react";
import { jsPDF } from "jspdf"; // Import jsPDF
import "../all-bill/all-bill.css"; // Import CSS file

const MyBill = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { openModal, ModalComponent } = useNotificationModal();
  const [filterDate, setFilterDate] = useState("");
  const [filteredBills, setFilteredBills] = useState([]);

  useEffect(() => {
    fetchAllBill();
  }, []);

  useEffect(() => {
    filterBills();
  }, [bills, filterDate]);

  const fetchAllBill = async () => {
    try {
      const data = await getMyBill();
      setBills(data.result);
    } catch (err) {
      setError(err.message);
      openModal({ type: "error", title: "Lỗi", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const filterBills = () => {
    if (!filterDate) {
      setFilteredBills(bills);
      return;
    }
    const filtered = bills.filter(
      (bill) =>
        new Date(bill.createdTime).toDateString() ===
        new Date(filterDate).toDateString()
    );
    setFilteredBills(filtered);
  };

  const handleBillClick = (id) => {
    navigate(`/admin/my-ticket/${id}`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const header = `Bill Report (${filterDate || "All time"})\n\n`;

    // Set the header text
    doc.setFontSize(16);
    doc.text(header, 10, 10);

    let yPosition = 20;

    // Set content
    filteredBills.forEach((bill) => {
      const billDetails = `Bill ID: ${bill.id}\nDate: ${new Date(
        bill.createdTime
      ).toLocaleString()}\n\n`;

      doc.setFontSize(12);
      doc.text(billDetails, 10, yPosition);

      yPosition += 20; // Adjust vertical space between bill details

      // Check if the page is overflowing, if so, add a new page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 10;
      }
    });

    // Save the PDF
    doc.save("bills-report.pdf");
  };

  return (
    <div className="admin-bill-container">
      <div className="admin-bill-header">
        <h2 className="text-2xl font-bold mb-6">Bill Management</h2>
        <div className="admin-bill-filter">
          <div className="filter-item">
            Date:
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button onClick={exportToPDF} className="export-button">
            <FileText className="w-4 h-4" />
            PDF Export
          </button>
        </div>
        <div className="admin-bill-table">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left font-semibold">ID</th>
                <th className="py-3 px-4 text-left font-semibold">
                  Date created
                </th>
                <th className="py-3 px-4 text-left font-semibold">Status</th>
                <th className="py-3 px-4 text-center font-semibold">
                  Operation
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill) => (
                <tr
                  key={bill.id}
                  className="border-t hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleBillClick(bill.id)}
                >
                  <td className="py-3 px-4">{bill.id}</td>
                  <td className="py-3 px-4">
                    {new Date(bill.createdTime).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      <span>Successfully</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button className="operation-button">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ModalComponent />
    </div>
  );
};

export default MyBill;
