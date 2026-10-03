import React, { useEffect, useState } from "react";
import { useNotificationModal } from "../../User/notificationModal/NotificationModal";
import { getTicketByBill } from "../../../api/apiTicket";
import { useParams } from "react-router-dom";
import { PDFDownloadLink, Document, Page, Text, Image, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20 },
  title: { fontSize: 20, marginBottom: 10, textAlign: "center" },
  section: { marginBottom: 10, padding: 10, border: "1px solid #ddd" },
  qrImage: { width: 100, height: 100 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  boldText: { fontWeight: "bold" },
});

const TicketPDF = ({ tickets }) => (
  <Document>
    {tickets.map((ticket) => (
      <Page size="A4" style={styles.page} key={ticket.id}>
        <Text style={styles.title}>Movie Ticket</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.boldText}>Movie:</Text>
            <Text>{ticket.scheduleDetails.movie.title}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.boldText}>Seat:</Text>
            <Text>{ticket.seatName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.boldText}>Branch:</Text>
            <Text>{ticket.scheduleDetails.branch.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.boldText}>Room:</Text>
            <Text>{ticket.scheduleDetails.room.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.boldText}>Date & Time:</Text>
            <Text>{new Date(ticket.scheduleDetails.startDateTime).toLocaleString()}</Text>
          </View>
          <Image style={styles.qrImage} src={ticket.qrImageURL} />
        </View>
      </Page>
    ))}
  </Document>
);

const MyTicket = () => {
  const { id } = useParams();
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { openModal, ModalComponent } = useNotificationModal();

  useEffect(() => {
    fetchTicketsByBill();
  }, []);

  const fetchTicketsByBill = async () => {
    setLoading(true);
    try {
      const data = await getTicketByBill(id);
      setTickets(data.result);
    } catch (err) {
      setError(err.message);
      openModal({ type: "error", title: "Error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>Loading tickets...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        {tickets.map((ticket) => (
          <div key={ticket.id} style={{ border: "1px solid #ddd", margin: "10px", padding: "10px" }}>
            <h3>{ticket.scheduleDetails.movie.title}</h3>
            <p><strong>Seat:</strong> {ticket.seatName}</p>
            <p><strong>Branch:</strong> {ticket.scheduleDetails.branch.name}</p>
            <p><strong>Room:</strong> {ticket.scheduleDetails.room.name}</p>
            <p><strong>Date & Time:</strong> {new Date(ticket.scheduleDetails.startDateTime).toLocaleString()}</p>
            <img src={ticket.qrImageURL} alt="QR Code" style={{ width: "100px", height: "100px" }} />
          </div>
        ))}
      </div>
      {tickets.length > 0 && (
        <PDFDownloadLink document={<TicketPDF tickets={tickets} />} fileName="tickets.pdf">
          {({ loading }) => (loading ? "Generating PDF..." : <button>Download Tickets PDF</button>)}
        </PDFDownloadLink>
      )}
      <ModalComponent />
    </div>
  );
};

export default MyTicket;
