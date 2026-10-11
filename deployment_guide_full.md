# 🎬 HB Cinema - Tài Liệu Hướng Dẫn Triển Khai Toàn Bộ

> **Kiến trúc tổng quan:**
> `Dev (Mac)` → `GitHub` → `Docker Hub` → `AWS EC2` ← `AWS RDS`
> `Dev (Mac)` → `GitHub` → `Cloudflare Pages` (Frontend tự động)
> `GitHub Actions` tự động hoá toàn bộ quy trình Backend

---

## 📐 Sơ Đồ Kiến Trúc

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTERNET                                  │
│                                                                   │
│  Người dùng → cinema.fil.id.vn (Frontend)                       │
│             → api.fil.id.vn (Backend API)                       │
└────────────────┬──────────────────────────────────────────────--┘
                 │
    ┌────────────▼────────────┐      ┌──────────────────────────┐
    │  Cloudflare Pages       │      │  AWS EC2 (Ubuntu)        │
    │  (Frontend React)       │ ←──→ │  Docker: Spring Boot     │
    │  cinema.fil.id.vn       │      │  IP: 54.242.254.46       │
    └─────────────────────────┘      └──────────┬───────────────┘
                                                │
                                     ┌──────────▼───────────────┐
                                     │  AWS RDS (MySQL)         │
                                     │  hb-cinema-db.*.rds...   │
                                     └──────────────────────────┘
```

---

## PHẦN 1: CÀI ĐẶT AWS RDS (CƠ SỞ DỮ LIỆU)

### 1.1 Tạo RDS MySQL trên AWS Console
1. Vào **AWS Console** → **RDS** → **Create database**
2. Chọn:
   - Engine: **MySQL**
   - Template: **Free tier**
   - DB Identifier: `hb-cinema-db`
   - Username: `admin`
   - Password: `HBCinema2026`
   - Instance class: `db.t3.micro`
   - Public access: **Yes**
3. Ghi lại **Endpoint** sau khi tạo xong (dạng: `hb-cinema-db.c1keuokkwq68.us-east-2.rds.amazonaws.com`)

### 1.2 Cấu hình Security Group cho RDS
- Cho phép inbound port **3306** từ địa chỉ IP của EC2

### 1.3 Kết nối và tạo Database
```bash
# Từ máy Mac hoặc EC2, kết nối vào RDS
mysql -h hb-cinema-db.c1keuokkwq68.us-east-2.rds.amazonaws.com -u admin -p

# Tạo database
CREATE DATABASE hb_cinema_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## PHẦN 2: CÀI ĐẶT AWS EC2 (MÁY CHỦ BACKEND)

### 2.1 Tạo EC2 Instance
1. Vào **AWS Console** → **EC2** → **Launch Instance**
2. Chọn:
   - AMI: **Ubuntu Server 22.04 LTS**
   - Instance type: **t2.micro** (Free tier)
   - Key pair: Tạo mới `hb-cinema-key` → tải file `.pem` về máy
   - Security Group: Mở port **22** (SSH), **80** (HTTP), **443** (HTTPS), **8081** (Spring Boot)
3. Ghi lại **Public IP**: `54.242.254.46`

### 2.2 Kết Nối SSH vào EC2
```bash
# Cấp quyền file pem (chỉ làm 1 lần đầu)
chmod 400 ~/Downloads/hb-cinema-key.pem

# SSH vào EC2
ssh -i ~/Downloads/hb-cinema-key.pem ubuntu@54.242.254.46
```

### 2.3 Cài Đặt Docker trên EC2
```bash
# Cập nhật hệ thống
sudo apt-get update && sudo apt-get upgrade -y

# Cài Docker
sudo apt-get install -y docker.io docker-compose-plugin

# Cho phép chạy docker không cần sudo
sudo usermod -aG docker ubuntu
newgrp docker

# Kiểm tra
docker --version
```

### 2.4 Clone Code và Cấu Hình
```bash
# Clone repo về EC2
git clone https://github.com/nguyenvanbaoub2005/HB_Cinema.git ~/HB_Cinema

# Vào thư mục Backend
cd ~/HB_Cinema/Backend_Spring

# Tạo file .env với các biến môi trường thật
nano .env
```

Nội dung file `.env` trên EC2:
```env
# Database - AWS RDS
DB_URL=jdbc:mysql://hb-cinema-db.c1keuokkwq68.us-east-2.rds.amazonaws.com:3306/hb_cinema_db
DB_USERNAME=admin
DB_PASSWORD=HBCinema2026

# JWT
JWT_SIGNER_KEY=5z6FgquJbieYiLWnIX+VwsT3LQnEw5G9VFXJ7kqVfhaYbeam0SYWmPl/8EmysqlK84v1

# VNPay
VNPAY_TMN_CODE=DCP8PV4H
VNPAY_SECRET_KEY=XENHUUKCOLMANKYRUIODRACOZFQCYSVK
VNPAY_RETURN_URL=https://cinema.fil.id.vn/identity/payment/vn-pay-callback

# Email (Gmail SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=ptatamde@gmail.com
MAIL_PASSWORD=bjfkdbeafbnxpumd   # <- App Password của Gmail
```

---

## PHẦN 3: BUILD & PUSH DOCKER IMAGE LÊN DOCKER HUB

### 3.1 Tại sao cần Docker Hub?
EC2 không thể build trực tiếp từ Mac (khác chip ARM64 vs AMD64).
Quy trình đúng: **Mac build → Docker Hub → EC2 pull về**.

### 3.2 Build Image Đúng Kiến Trúc (Bắt buộc!)
```bash
# Tại máy Mac, vào thư mục Backend
cd ~/Student/HB_CinemaWeb/Backend_Spring

# Tạo builder hỗ trợ cross-platform (chỉ làm 1 lần)
docker buildx create --use

# Build image cho linux/amd64 (EC2 chạy Intel/AMD) và push thẳng lên Hub
docker buildx build \
  --platform linux/amd64 \
  -t booooo226a/hb_cinema_backend:latest \
  --push \
  .
```

> ⚠️ **Lỗi hay gặp:** Nếu không dùng `--platform linux/amd64`, khi EC2 chạy sẽ báo:
> `exec /usr/bin/java: exec format error`

### 3.3 Kiểm Tra Image trên Docker Hub
Vào [hub.docker.com](https://hub.docker.com) → Repository `booooo226a/hb_cinema_backend` → Kiểm tra tag `latest` vừa push.

---

## PHẦN 4: EC2 PULL IMAGE VÀ CHẠY BACKEND

### 4.1 Lần Đầu Chạy
```bash
# SSH vào EC2
ssh -i ~/Downloads/hb-cinema-key.pem ubuntu@54.242.254.46

cd ~/HB_Cinema/Backend_Spring

# Pull image mới nhất từ Docker Hub
docker pull booooo226a/hb_cinema_backend:latest

# Chạy bằng docker compose với file .env
sudo docker compose --env-file .env up -d

# Kiểm tra container đang chạy
sudo docker ps

# Xem log để chắc chắn khởi động thành công
sudo docker logs Backend_Spring --tail=50
```

### 4.2 Cập Nhật (Update) Khi Có Code Mới
```bash
cd ~/HB_Cinema/Backend_Spring

# Dừng container cũ
sudo docker compose down

# Xoá image cũ để tải bản mới
sudo docker rmi booooo226a/hb_cinema_backend:latest

# Pull bản mới và chạy lại
sudo docker compose --env-file .env up -d
```

### 4.3 Các Lệnh Docker Hay Dùng
```bash
# Xem tất cả container đang chạy
sudo docker ps

# Xem log realtime
sudo docker logs Backend_Spring -f

# Xem log 50 dòng cuối và lọc lỗi
sudo docker logs Backend_Spring --tail=50 2>&1 | grep -i "error\|mail\|send"

# Vào trong container để debug
sudo docker exec -it Backend_Spring bash

# Xem dung lượng ổ đĩa
df -h
docker system df
```

---

## PHẦN 5: CẤU HÌNH TÊN MIỀN (CLOUDFLARE + EC2)

### 5.1 Tổng Quan
- Tên miền gốc: `fil.id.vn` (mua từ nhà cung cấp, quản lý trên Cloudflare)
- Frontend: `cinema.fil.id.vn` → trỏ vào Cloudflare Pages
- Backend API: `api.fil.id.vn` → trỏ vào EC2

### 5.2 Cấu Hình DNS trên Cloudflare

Vào **Cloudflare Dashboard** → chọn domain `fil.id.vn` → **DNS** → **Records**:

| Type  | Name    | Content                  | Proxy |
|-------|---------|--------------------------|-------|
| A     | api     | 54.242.254.46            | ✅ On |
| CNAME | cinema  | hb-cinema-web.pages.dev  | ✅ On |

> ⚠️ Không tự thêm CNAME cho `cinema` vào đây! Phải làm theo Bước 5.3 dưới.

### 5.3 Gắn Tên Miền Vào Cloudflare Pages (Frontend)
1. **Cloudflare Dashboard** → **Workers & Pages** → Chọn project `hb-cinema-web`
2. Tab **Custom domains** → **Set up a custom domain**
3. Gõ: `cinema.fil.id.vn` → **Continue** → **Activate domain**
4. Cloudflare tự động tạo bản ghi CNAME và cấp SSL!

### 5.4 SSL & Routing cho Backend - Dùng Cloudflare Proxy

> ✅ **Không cần cài Nginx hay Certbot trên EC2!**
> Vì bật **Cloudflare Proxy** (đám mây cam 🟠) cho bản ghi `api.fil.id.vn`, Cloudflare đóng vai trò như một reverse proxy + SSL termination tự động.

**Cách hoạt động:**
```
Người dùng → https://api.fil.id.vn (Cloudflare nhận, cấp SSL tự động)
           → Cloudflare chuyển tiếp → http://54.242.254.46:8081 (EC2, port 8081)
```

**Cấu hình:** Chỉ cần thao tác trên Cloudflare Dashboard:
1. Vào **DNS** → **Records**
2. Thêm bản ghi:
   - **Type:** `A`
   - **Name:** `api`
   - **IPv4 address:** `54.242.254.46`
   - **Proxy status:** BẬT (đám mây cam 🟠) ← **Quan trọng!**
3. Bấm **Save**

Xong! Cloudflare sẽ tự cấp chứng chỉ SSL và `https://api.fil.id.vn` sẽ hoạt động ngay sau vài phút.

> ⚠️ **Lưu ý:** Cloudflare Proxy mặc định chỉ forward HTTP đến port **80, 443, 8080, 8443, 8880**... Nếu backend chạy trên port **8081**, cần đảm bảo Security Group của EC2 đã mở port 8081, và Cloudflare sẽ proxy qua đúng port đó.

---


## PHẦN 6: CLOUDFLARE PAGES (FRONTEND AUTO-DEPLOY)

### 6.1 Kết Nối GitHub với Cloudflare Pages (Lần Đầu)
1. **Cloudflare Dashboard** → **Workers & Pages** → **Create application** → **Pages**
2. **Connect to Git** → Chọn repo `HB_Cinema`
3. Cấu hình build:
   - **Project name:** `hb-cinema-web`
   - **Production branch:** `main`
   - **Framework preset:** `Vite`
   - **Build command:** `cd FrontEnd_ReactJs && npm install && npm run build`
   - **Build output directory:** `FrontEnd_ReactJs/dist`
4. Thêm **Environment variables:**
   ```
   VITE_API_URL = https://api.fil.id.vn
   ```
5. Bấm **Save and Deploy**

### 6.2 Cách Hoạt Động Tự Động
Mỗi lần `git push` lên nhánh `main`:
```
git push → Cloudflare tự detect → npm run build → Deploy lên CDN → Xong!
```
**Thời gian:** ~2-3 phút. Xem tiến trình tại tab **Deployments**.

### 6.3 Cấu Hình SPA Routing (Quan Trọng!)
Vì React dùng client-side routing, cần tạo file `_redirects`:
```bash
# File: FrontEnd_ReactJs/public/_redirects
/* /index.html 200
```
File này đảm bảo khi người dùng F5 trang (VD: `cinema.fil.id.vn/profile`), Cloudflare không báo 404.

---

## PHẦN 7: CI/CD VỚI GITHUB ACTIONS

### 7.1 Tổng Quan Luồng CI/CD
```
Sửa code Backend → git push → GitHub Actions tự chạy:
  1. Checkout code
  2. Cài Java 21
  3. Maven build → file .jar
  4. Docker buildx → image linux/amd64
  5. Push lên Docker Hub
  6. SSH vào EC2 → docker compose down → pull → up -d
```

### 7.2 File Cấu Hình `.github/workflows/backend-deploy.yml`
```yaml
name: Backend CI/CD Pipeline

on:
  push:
    branches:
      - main
    paths:
      - 'Backend_Spring/**' # Chỉ chạy khi có thay đổi Backend
  workflow_dispatch: # Cho phép bấm chạy thủ công

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up JDK 21
        uses: actions/setup-java@v3
        with:
          java-version: '21'
          distribution: 'corretto'
          cache: 'maven'

      - name: Build with Maven
        run: |
          cd Backend_Spring
          mvn clean package -DskipTests

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and Push Docker Image
        run: |
          cd Backend_Spring
          docker buildx build --platform linux/amd64 \
            -t booooo226a/hb_cinema_backend:latest --push .

      - name: Deploy to EC2
        uses: appleboy/ssh-action@v0.1.10
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USERNAME }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd ~/HB_Cinema/Backend_Spring
            sudo docker compose down
            sudo docker rmi booooo226a/hb_cinema_backend:latest
            sudo docker compose --env-file .env up -d
```

### 7.3 Khai Báo Secrets trên GitHub
Vào Repo GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Secret Name    | Giá Trị                                          |
|----------------|--------------------------------------------------|
| DOCKER_USERNAME| `booooo226a`                                     |
| DOCKER_PASSWORD| Docker Access Token (tạo tại hub.docker.com)     |
| EC2_HOST       | `54.242.254.46`                                  |
| EC2_USERNAME   | `ubuntu`                                         |
| EC2_SSH_KEY    | Toàn bộ nội dung file `hb-cinema-key.pem`        |

**Cách copy file .pem vào clipboard trên Mac:**
```bash
cat ~/Downloads/hb-cinema-key.pem | pbcopy
# Sau đó Cmd+V vào ô EC2_SSH_KEY trên GitHub
```

### 7.4 Chạy Thủ Công
1. GitHub → Tab **Actions** → Chọn **Backend CI/CD Pipeline**
2. Bấm **Run workflow** → **Run workflow**

---

## PHẦN 8: VNPAY CALLBACK CONFIGURATION

Khi tên miền thay đổi, phải cập nhật Return URL ở 3 nơi:

### 8.1 File `.env` trên EC2
```bash
sed -i 's|VNPAY_RETURN_URL=.*|VNPAY_RETURN_URL=https://cinema.fil.id.vn/identity/payment/vn-pay-callback|' \
  ~/HB_Cinema/Backend_Spring/.env
```

### 8.2 Dashboard VNPay Sandbox
1. Vào [sandbox.vnpayment.vn/merchantv2](https://sandbox.vnpayment.vn/merchantv2/)
2. Menu trái → **Quản lý website** → Tìm website của bạn → **Sửa**
3. Cập nhật **URL Callback** thành:
   `https://cinema.fil.id.vn/identity/payment/vn-pay-callback`
4. Lưu lại

### 8.3 Thẻ Test VNPay Sandbox (NCB)
```
Số thẻ:   9704198526191432198
Tên chủ:  NGUYEN VAN A
Ngày hết: 07/15
Mã OTP:   123456
```

---

## PHẦN 9: GMAIL APP PASSWORD (SMTP EMAIL)

Spring Boot gửi mail qua Gmail SMTP. Nếu bạn đăng nhập Gmail bằng Google Account (không có mật khẩu), phải tạo **App Password**:

1. Vào [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Đảm bảo đã bật **Xác minh 2 bước**
3. Điền tên (VD: `HB Cinema`) → **Create**
4. Copy mật khẩu 16 ký tự (bỏ khoảng trắng)
5. Cập nhật vào `.env` trên EC2:
```bash
sed -i 's/MAIL_PASSWORD=.*/MAIL_PASSWORD=<app_password_mới>/' \
  ~/HB_Cinema/Backend_Spring/.env
```
6. Restart Docker:
```bash
cd ~/HB_Cinema/Backend_Spring
sudo docker compose down && sudo docker compose --env-file .env up -d
```

---

## PHẦN 10: TROUBLESHOOTING (XỬ LÝ LỖI PHỔ BIẾN)

| Lỗi | Nguyên Nhân | Cách Sửa |
|-----|-------------|----------|
| `exec format error` | Build image sai kiến trúc (ARM thay vì AMD64) | Dùng `docker buildx --platform linux/amd64` |
| `535 Username and Password not accepted` | Gmail App Password hết hạn | Tạo App Password mới tại myaccount.google.com |
| VNPay báo "trang không tồn tại" | Return URL không khớp | Cập nhật URL ở file .env và dashboard VNPay |
| CORS error | SecurityConfig.java chưa thêm domain mới | Thêm domain vào allowedOrigins trong SecurityConfig |
| 404 khi F5 trên Cloudflare | Thiếu file `_redirects` | Tạo file `public/_redirects` với nội dung `/* /index.html 200` |
| EC2 hết RAM | Quá nhiều process chạy | `sudo docker system prune -f` để dọn dẹp |

---

## 📋 CHECKLIST DEPLOY LẦN ĐẦU

- [ ] Tạo AWS RDS MySQL
- [ ] Tạo AWS EC2 Ubuntu, mở đúng port
- [ ] Cài Docker trên EC2
- [ ] Clone repo về EC2, tạo file `.env`
- [ ] Build Docker image `linux/amd64` từ Mac → push Docker Hub
- [ ] EC2 pull image và chạy `docker compose up -d`
- [ ] Cấu hình DNS trên Cloudflare (A record cho `api.fil.id.vn`)
- [ ] Cài Nginx + SSL trên EC2
- [ ] Kết nối GitHub với Cloudflare Pages
- [ ] Thêm file `_redirects` cho SPA routing
- [ ] Khai báo 5 Secrets trên GitHub
- [ ] Test GitHub Actions tự động deploy
- [ ] Cập nhật Return URL VNPay
- [ ] Cập nhật CORS trong SecurityConfig.java

---

*Tài liệu được tạo: 2026-10-11 | Dự án: HB Cinema Web*
