import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Để lấy branchId từ URL
import { getToken } from '../../../api/localStorage'; // Giả sử bạn đã có service để lấy JWT từ localStorage
import "./room.css"




const Room = () => {
        const navigate = useNavigate();
    const { id } = useParams(); // Lấy branchId từ URL
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const token = getToken(); // Lấy JWT từ localStorage
                const response = await fetch(`http://localhost:8081/identity/rooms/branch/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Thêm token vào header
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setRooms(data.result); // Giả sử dữ liệu trả về có trường `result` chứa danh sách phòng
                setLoading(false);
            } catch (error) {
                console.error('Error fetching rooms:', error);
                setError('Không thể tải dữ liệu phòng');
                setLoading(false);
            }
        };

        fetchRooms();
    }, [id]); // useEffect chỉ gọi lại khi `branchId` thay đổi

       // xem ghe
       const handleViewSeat = (scheduleId) => {
        navigate(`/admin/branch/rooms/seats/${scheduleId}`); 
    }

    if (loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
            {rooms.map((room) => (
                <div
                    key={room.id}
                    className="bg-white shadow-md rounded-lg overflow-hidden"
                    onClick={() => handleViewSeat(room.id)}
                >
                    <img
                        src={room.imgURL}
                        alt={room.name}
                        className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-2">{room.name}</h2>
                        <p className="mb-2">Sức chứa: {room.capacity} người</p>
                        <p className="mb-2">Diện tích: {room.totalArea} m²</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Room;
