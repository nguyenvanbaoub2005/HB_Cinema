import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Home, Receipt, Ticket } from 'lucide-react';
import { createTicket } from '../../../api/apiTicket';
import { getBookingDataStorage } from '../../../api/dataBookingStorage';


const BillVNPay = () => {
    const navigate = useNavigate();
    const bookingData = getBookingDataStorage();

    const [bill, setBill] = useState([]);
    const [paymentInfo, setPaymentInfo] = useState({
        vnp_Amount: 65000000,
        vnp_BankCode: "NCB",
        vnp_BankTranNo: "VNP14739207",
        vnp_CardType: "ATM",
        vnp_OrderInfo: "Thanh toan don hang:19473404",
        vnp_PayDate: "20241212154313"
    });

    useEffect(() => {
        // Lấy các tham số từ URL
        const params = new URLSearchParams(window.location.search);
        const vnp_Amount = params.get('vnp_Amount');
        const vnp_BankCode = params.get('vnp_BankCode');
        const vnp_BankTranNo = params.get('vnp_BankTranNo');
        const vnp_CardType = params.get('vnp_CardType');
        const vnp_OrderInfo = params.get('vnp_OrderInfo');
        const vnp_PayDate = params.get('vnp_PayDate');
        const vnp_ResponseCode = params.get('vnp_ResponseCode');
        const vnp_TmnCode = params.get('vnp_TmnCode');
        const vnp_TransactionNo = params.get('vnp_TransactionNo');
        const vnp_TransactionStatus = params.get('vnp_TransactionStatus');
        const vnp_TxnRef = params.get('vnp_TxnRef');
        const vnp_SecureHash = params.get('vnp_SecureHash');

        // Kiểm tra kết quả thanh toán
        if (vnp_ResponseCode === '00' && vnp_TransactionStatus === '00' && bookingData) {
            // Thanh toán thành công, gửi thông tin về tab trước
            const data = createTicket(bookingData);
            // Cập nhật paymentInfo nếu thanh toán thành công
            setPaymentInfo({
                vnp_Amount: vnp_Amount,
                vnp_BankCode: vnp_BankCode,
                vnp_BankTranNo: vnp_BankTranNo,
                vnp_CardType: vnp_CardType,
                vnp_OrderInfo: vnp_OrderInfo,
                vnp_PayDate: vnp_PayDate
            });
        } else {
            // Thanh toán thất bại
            console.log('Thanh toán thất bại');
        }
    }, [navigate]);

    // Chuyển đổi số tiền từ VNPay (đơn vị xu) sang đồng
    const formatAmount = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount / 100);
    };

    // Định dạng ngày từ chuỗi VNPAY
    const formatDate = (dateString) => {
        if (dateString.length !== 14) return dateString;

        const year = dateString.substr(0, 4);
        const month = dateString.substr(4, 2);
        const day = dateString.substr(6, 2);
        const hour = dateString.substr(8, 2);
        const minute = dateString.substr(10, 2);
        const second = dateString.substr(12, 2);

        return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    };

    // Ánh xạ mã ngân hàng
    const getBankName = (bankCode) => {
        const bankNames = {
            "NCB": "Ngân hàng Quốc Dân (NCB)",
            // Thêm các ngân hàng khác nếu cần
            "DEFAULT": "Ngân hàng không xác định"
        };
        return bankNames[bankCode] || bankNames["DEFAULT"];
    };

    // Ánh xạ loại thẻ
    const getCardTypeName = (cardType) => {
        const cardTypes = {
            "ATM": "Thẻ ATM",
            "CREDIT": "Thẻ Tín Dụng",
            "DEFAULT": "Loại thẻ khác"
        };
        return cardTypes[cardType] || cardTypes["DEFAULT"];
    };

    const handleToProfile = () => {
        navigate('/profile')
    };

    const handleToBuyTicket = () => {
        navigate('/');
    };

    return (
        <div>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                    <div className="flex flex-col items-center space-y-4">
                        {/* Biểu tượng thanh toán thành công */}
                        <div className="bg-green-500 text-white rounded-full p-4">
                            <Check size={48} />
                        </div>

                        {/* Tiêu đề */}
                        <h2 className="text-2xl font-bold text-gray-800">
                            Thanh toán thành công
                        </h2>

                        {/* Chi tiết giao dịch */}
                        <div className="w-full bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Mã đơn hàng:</span>
                                <span className="font-semibold">
                                    {paymentInfo.vnp_OrderInfo.split(':')[1] || 'Không xác định'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Số tiền:</span>
                                <span className="font-semibold text-green-600">
                                    {formatAmount(paymentInfo.vnp_Amount)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Ngân hàng:</span>
                                <span>{getBankName(paymentInfo.vnp_BankCode)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Mã giao dịch:</span>
                                <span>{paymentInfo.vnp_BankTranNo}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Thời gian:</span>
                                <span>{formatDate(paymentInfo.vnp_PayDate)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Loại thẻ:</span>
                                <span>{getCardTypeName(paymentInfo.vnp_CardType)}</span>
                            </div>
                        </div>

                        {/* Các nút chức năng */}
                        <div className="flex w-full space-x-3">
                            <button
                                onClick={handleToBuyTicket}
                                className="flex-1 flex items-center justify-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                            >
                                <Home className="mr-2" size={20} />
                                Trang chủ
                            </button>
                            <button
                                onClick={handleToProfile}
                                className="flex-1 flex items-center justify-center bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                            >
                                <Ticket className="mr-2" size={20} />
                                Xem hoá đơn
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillVNPay; 