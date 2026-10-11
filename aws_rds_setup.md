# Hướng dẫn tạo AWS RDS (MySQL) - Free Tier 🚀

Dưới đây là các bước chi tiết để bạn tạo một Database MySQL miễn phí trên AWS, không lo mất tiền mà vẫn đạt chuẩn "xịn" nhé! Bạn cứ mở giao diện AWS lên, để hai màn hình song song và làm theo thứ tự này:

## Phần 1: Các bước tạo Database
1. Đăng nhập vào [AWS Management Console](https://console.aws.amazon.com/).
2. Ở thanh tìm kiếm trên cùng, gõ **RDS** và click vào dịch vụ RDS.
3. Nhìn sang góc phải hoặc ở giữa màn hình, nhấn nút màu cam **Create database**.
4. **Choose a database creation method:** Chọn **Standard create**.
5. **Engine options:** Chọn **MySQL**. (Phiên bản cứ để mặc định MySQL 8.x.x).
6. 🚨 **Templates (QUAN TRỌNG):** Bạn **BẮT BUỘC** phải chọn **Free tier** để không bị trừ tiền. (Nếu không thấy nút Free Tier, có nghĩa tài khoản bạn đã hết hạn Free tier 1 năm, hãy lưu ý nhé).

## Phần 2: Đặt tên và Mật khẩu (Settings)
1. **DB instance identifier:** Nhập tên cho DB trên AWS, ví dụ: `hb-cinema-db`
2. **Credentials Settings:** 
   - **Master username:** Bạn có thể đổi thành `admin` hoặc giữ mặc định. (Nên đổi thành `admin` cho dễ nhớ).
   - **Master password:** Nhập mật khẩu của bạn (VD: `HBCinema2026`). 
   - **Confirm password:** Nhập lại mật khẩu.
   *(Nhớ lưu lại Username và Password này để lát điền vào file `.env` nhé!)*

## Phần 3: Cấu hình Máy chủ (Instance & Storage)
- **Instance configuration:** Giữ nguyên mặc định (thường là `db.t3.micro` hoặc `db.t4g.micro`).
- **Storage:** Giữ nguyên `20 GB` (General Purpose SSD - gp2). 
- 🚨 Kéo xuống bỏ tick ô **Enable storage autoscaling** (Để tránh việc DB tự động tăng dung lượng tính phí nếu bị lỗi vòng lặp nào đó).

## Phần 4: Kết nối Mạng (Connectivity)
- **Virtual private cloud (VPC):** Để mặc định (Default VPC).
- 🚨 **Public access:** Chọn **Yes** (Cực kỳ quan trọng để lát nữa máy tính ở nhà của bạn có thể kết nối lên Cloud để test và chạy code).
- **VPC security group (firewall):** Chọn **Create new**.
- **New VPC security group name:** Đặt tên là `hb-cinema-sg`.

## Phần 5: Khởi tạo tên Database (Additional configuration)
Kéo xuống gần cuối, tìm phần **Additional configuration** (nó thường bị ẩn đi, bạn bấm vào hình tam giác nhỏ để mở rộng ra):
- **Initial database name:** Gõ vào `hb_cinema_db` (Việc này giúp AWS tự động tạo sẵn database trống mang tên này cho bạn, bạn không cần dùng lệnh `CREATE DATABASE` nữa).
- Kéo xuống dưới cùng, phần **Automated backups**: Bỏ tick ô **Enable automated backups** (Project học tập thì không cần backup hằng ngày để tiết kiệm tài nguyên Free tier).

## Phần 6: Khởi tạo
- Nhấn nút màu cam **Create database** ở dưới cùng.
- Sẽ mất khoảng **3 - 5 phút** để AWS tạo DB. Khi nào cột *Status* chuyển sang chữ **Available** màu xanh lá cây là xong!

---

## Sau khi tạo xong (Lấy Endpoint để kết nối)
Khi trạng thái là **Available**, bạn click vào tên DB (`hb-cinema-db`).
1. Nhìn phần **Connectivity & security**, bạn sẽ thấy một chuỗi dài gọi là **Endpoint** (ví dụ: `hb-cinema-db.xxx.ap-southeast-1.rds.amazonaws.com`). Hãy copy đoạn này.
2. Mở file `.env` trong source code Backend của bạn và sửa lại như sau:

```env
# Đổi localhost thành Endpoint của RDS
DB_URL=jdbc:mysql://<COPY_ENDPOINT_CỦA_BẠN_VÀO_ĐÂY>:3306/hb_cinema_db
DB_USERNAME=admin
DB_PASSWORD=<MẬT_KHẨU_BẠN_VỪA_ĐẶT>
```

> **Làm xong đến bước có Endpoint thì báo lại tôi nhé!** Tôi sẽ chỉ bạn cách mở tường lửa (Security Group) để code ở máy tính của bạn có thể truy cập được vào RDS (hiện tại AWS chặn mặc định).
