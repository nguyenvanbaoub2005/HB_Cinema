# Hướng Dẫn Deploy Backend (Spring Boot) Lên AWS EC2

Giai đoạn này chúng ta sẽ thuê một máy chủ ảo (EC2) trên AWS, cài đặt Docker và chạy Backend của bạn trên đó.

## Bước 1: Tạo máy chủ EC2 (Miễn phí 100%)

1. Truy cập [AWS EC2 Console](https://console.aws.amazon.com/ec2). Đảm bảo góc trên cùng bên phải vẫn đang chọn Region là **US East (Ohio)** (trùng với nơi tạo RDS).
2. Nhấn nút **Launch Instance** (Màu cam).
3. **Name**: Điền tên tùy ý (ví dụ: `hb-cinema-backend`).
4. **Application and OS Images (Amazon Machine Image)**: 
   - Chọn logo **Ubuntu**.
   - Chọn bản **Ubuntu Server 22.04 LTS (HVM)** (Có chữ *Free tier eligible*).
5. **Instance type**: Để mặc định là **t2.micro** (*Free tier eligible*).
6. **Key pair (login)**:
   - Nhấn **Create new key pair**.
   - **Key pair name**: `hb-cinema-key` (hoặc tên gì bạn thích).
   - **Key pair type**: RSA.
   - **Private key file format**: `.pem`.
   - Nhấn **Create key pair**. Trình duyệt sẽ tải về một file `.pem`. **Lưu file này cẩn thận, không được để mất!**
7. **Network settings**:
   - Tích chọn: **Allow SSH traffic from** -> **Anywhere**.
   - Tích chọn: **Allow HTTP traffic from the internet**.
   - Tích chọn: **Allow HTTPS traffic from the internet**.
8. Nhấn **Launch instance** và chờ báo thành công (Success).

---

## Bước 2: Mở Port 8081 cho Backend

Vì Backend của chúng ta chạy ở port `8081`, ta phải mở cửa cho mạng ngoài vào được.

1. Bấm vào nút **View all instances**.
2. Click vào tên máy chủ (`hb-cinema-backend`) vừa tạo.
3. Chuyển sang tab **Security** (ở nửa dưới màn hình).
4. Click vào cái link màu xanh dưới chữ **Security groups** (ví dụ: `sg-0abc123...`).
5. Ở mục **Inbound rules**, nhấn **Edit inbound rules**.
6. Nhấn **Add rule**:
   - **Type**: Custom TCP
   - **Port range**: 8081
   - **Source**: Anywhere-IPv4 (`0.0.0.0/0`)
7. Nhấn **Save rules**.

---

## Bước 3: Kết nối vào EC2

Bạn có 2 cách để kết nối:

**Cách 1 (Dễ nhất - Dùng Web):**
1. Trở lại danh sách Instances, click chuột phải vào máy chủ -> Chọn **Connect**.
2. Chọn tab **EC2 Instance Connect** và bấm **Connect**. Một cửa sổ terminal đen thui sẽ hiện ra ngay trên trình duyệt.

**Cách 2 (Dùng Terminal trên Mac của bạn):**
1. Mở Terminal (Mac).
2. Đổi quyền cho file key vừa tải: `chmod 400 /path/to/hb-cinema-key.pem`
3. Kết nối: `ssh -i /path/to/hb-cinema-key.pem ubuntu@<IP_PUBLIC_CỦA_EC2>` (Lấy IP Public ở màn hình chi tiết Instance).

---

## Bước 4: Cài đặt môi trường trên EC2

Trong cửa sổ terminal đen thui (của EC2), bạn copy và paste chạy TỪNG DÒNG lệnh sau (chuột phải để paste):

```bash
# Cập nhật hệ thống
sudo apt update -y

# Cài đặt Docker
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker

# Cài đặt Docker Compose
sudo apt install docker-compose -y

# Cài đặt Git (thường đã có sẵn)
sudo apt install git -y
```

---

## Bước 5: Kéo Code và Chạy Backend

Vẫn trong terminal của EC2:

1. **Kéo code từ Github (Repo Monorepo của bạn):**
```bash
git clone https://github.com/nguyenvanbaoub2005/HB_Cinema.git
```

2. **Di chuyển vào thư mục Backend:**
```bash
cd HB_Cinema/Backend_Spring
```

3. **Tạo file `.env` chứa thông tin bảo mật:**
Chạy lệnh này để mở trình soạn thảo:
```bash
nano .env
```
Màn hình sẽ chuyển sang chế độ soạn thảo. Bạn dán toàn bộ nội dung file `.env` ở máy bạn vào đây (bao gồm cả link RDS, mật khẩu, JWT Key...).
Sau khi dán xong:
- Nhấn `Ctrl + O` -> `Enter` để lưu (Save).
- Nhấn `Ctrl + X` để thoát.

4. **Chạy Backend:**
```bash
sudo docker-compose --env-file .env up -d --build
```

Chờ nó tải và build xong. Khi chạy xong, hãy đợi khoảng 1 phút để ứng dụng khởi động.

---

## Bước 6: Kiểm tra kết quả

Trên máy Mac của bạn, mở trình duyệt và truy cập:

```
http://<IP_PUBLIC_CỦA_EC2>:8081/identity/movies
```
(Thay `<IP_PUBLIC_CỦA_EC2>` bằng địa chỉ IP Public thật của máy ảo EC2)

Nếu bạn thấy một đống chữ dữ liệu phim (JSON) hiện ra, tức là Backend đã sống trên mạng Internet! Khắp thế giới đều gọi được!
