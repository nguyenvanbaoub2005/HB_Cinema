#!/usr/bin/env python3
import subprocess

CONTAINER = "backend_spring-mysql_db-1"
DB = "hb_cinema_db"

def run_sql(sql):
    cmd = ["docker", "exec", "-i", CONTAINER, "mysql", "-uroot", "-proot", DB]
    result = subprocess.run(cmd, input=sql.encode("utf-8"), capture_output=True)
    if result.returncode != 0:
        print(f"❌ Error: {result.stderr.decode()}")
    else:
        print("✅ Success!")

def main():
    sql = """
    UPDATE movie SET 
        title='Mai',
        image='https://image.tmdb.org/t/p/w500/2nF8xD200rcDawuCg5ObxxqA2fC.jpg',
        over_view='Mai, một nhân viên massage 37 tuổi có quá khứ nhiều vết xước, sống khép kín và bị xã hội dị nghị. Cuộc sống cô thay đổi khi gặp Dương - chàng trai trẻ đào hoa, quyết tâm chinh phục cô. Tình yêu cháy bỏng của họ gặp sóng gió bởi định kiến xã hội, khoảng cách tuổi tác và nỗi sợ hãi của chính Mai.',
        rating=7.5,
        release_date='2024-02-10 00:00:00',
        language='vi'
    WHERE id=1;

    UPDATE movie SET 
        title='Lật Mặt 7: Một Điều Ước',
        image='https://image.tmdb.org/t/p/w500/2mg6ktvWxsOG9iMBP4P1pwOYltk.jpg',
        over_view='Thông qua những cảnh đan xen, ẩn chứa vô số nụ cười và nước mắt, Lật Mặt 7: Một Điều Ước là câu chuyện cảm động về người mẹ già 73 tuổi - một bà mẹ đơn thân một mình nuôi 5 đứa con khôn lớn. Khi lớn lên, mỗi người đều tự xây dựng cuộc sống, gia đình cho riêng mình. Đột nhiên, một cơn khủng hoảng ập đến, bộc lộ những góc khuất, những nỗi buồn, lo lắng, gánh nặng hằn sâu trong lòng người mẹ. Trách nhiệm thuộc về ai?',
        rating=8.0,
        release_date='2024-04-26 00:00:00',
        language='vi'
    WHERE id=2;
    """
    
    print("📝 Updating ID 1 (Mai) and ID 2 (Lật Mặt 7) in MySQL...")
    run_sql(sql)

if __name__ == "__main__":
    main()
