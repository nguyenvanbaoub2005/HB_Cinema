import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Home, Receipt, Ticket } from 'lucide-react';
import { createTicket } from '../../../api/apiTicket';
import { removeBookingDataStorage, getBookingDataStorage } from '../../../api/dataBookingStorage';
import { AlertCircle, XCircle } from 'lucide-react';

const BillVNPay = () => {
    const navigate = useNavigate();
    const bookingData = getBookingDataStorage();

    const [status, setStatus] = useState('processing'); // 'processing', 'success', 'failed'
    const [statusMessage, setStatusMessage] = useState('Đang xử lý kết quả thanh toán và chốt vé...');
    const [paymentInfo, setPaymentInfo] = useState({
        vnp_Amount: 0,
        vnp_BankCode: "",
        vnp_BankTranNo: "",
        vnp_CardType: "",
        vnp_OrderInfo: "",
        vnp_PayDate: ""
    });

    useEffect(() => {
        const handlePaymentCallback = async () => {
            const params = new URLSearchParams(window.location.search);
            const vnp_Amount = params.get('vnp_Amount') || '0';
            const vnp_BankCode = params.get('vnp_BankCode') || 'NCB';
            const vnp_BankTranNo = params.get('vnp_BankTranNo') || '';
            const vnp_CardType = params.get('vnp_CardType') || 'ATM';
            const vnp_OrderInfo = params.get('vnp_OrderInfo') || '';
            const vnp_PayDate = params.get('vnp_PayDate') || '';
            const vnp_ResponseCode = params.get('vnp_ResponseCode');
            const vnp_TransactionStatus = params.get('vnp_TransactionStatus');

            setPaymentInfo({
                vnp_Amount,
                vnp_BankCode,
                vnp_BankTranNo,
                vnp_CardType,
                vnp_OrderInfo,
                vnp_PayDate
            });

            // Kiểm tra kết quả từ VNPay
            if (vnp_ResponseCode !== '00' || vnp_TransactionStatus !== '00') {
                setStatus('failed');
                setStatusMessage('Thanh toán VNPay không thành công hoặc đã bị hủy.');
                return;
            }

            // Kiểm tra dữ liệu đặt vé trong localStorage
            if (!bookingData) {
                setStatus('failed');
                setStatusMessage('Không tìm thấy thông tin đặt vé trong trình duyệt (bookingData trống). Hãy kiểm tra lại tên miền truy cập!');
                return;
            }

            try {
                // Thanh toán thành công → gọi API tạo vé và gửi email
                await createTicket(bookingData);
                removeBookingDataStorage(); // Dọn dẹp storage sau khi đã tạo vé thành công
                setStatus('success');
                setStatusMessage('Thanh toán thành công và vé đã được chốt!');
            } catch (error) {
                console.error('Lỗi tạo vé:', error);
                setStatus('failed');
                setStatusMessage(`Thanh toán tiền thành công nhưng lỗi khi chốt vé: ${error.message}`);
            }
        };

        handlePaymentCallback();
    }, []);

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
                        {/* Biểu tượng trạng thái */}
                        {status === 'success' && (
                            <div className="bg-green-500 text-white rounded-full p-4">
                                <Check size={48} />
                            </div>
                        )}
                        {status === 'failed' && (
                            <div className="bg-red-500 text-white rounded-full p-4">
                                <XCircle size={48} />
                            </div>
                        )}
                        {status === 'processing' && (
                            <div className="bg-blue-500 text-white rounded-full p-4 animate-spin">
                                <AlertCircle size={48} />
                            </div>
                        )}

                        {/* Tiêu đề & Thông báo */}
                        <h2 className="text-2xl font-bold text-gray-800 text-center">
                            {status === 'success' ? 'Thanh toán thành công' : status === 'failed' ? 'Có lỗi xảy ra' : 'Đang xử lý đơn hàng...'}
                        </h2>
                        <p className={`text-sm text-center px-2 ${status === 'success' ? 'text-green-600' : status === 'failed' ? 'text-red-500' : 'text-gray-500'}`}>
                            {statusMessage}
                        </p>

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