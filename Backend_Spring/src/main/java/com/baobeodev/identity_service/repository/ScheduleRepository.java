package com.baobeodev.identity_service.repository;

import com.baobeodev.identity_service.entity.Schedule;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {
  List<Schedule> findByMovieId(int movieId);

  // Phương thức này sẽ truy vấn tất cả các roomId có lịch chiếu trong bảng schedules.
  @Query("SELECT DISTINCT s.room.id FROM Schedule s")
  List<Integer> findAllRoomIds();

  List<Schedule> findByRoomIdAndBranchId(int roomId, int branchId);

  // Tìm lịch chiếu đang diễn ra (sử dụng thời gian bắt đầu và thời gian kết thúc)
  // Tìm lịch chiếu đang diễn ra trong phòng
  List<Schedule> findByRoomIdAndStartDateTimeBetween(
      int roomId, LocalDateTime startDateTime, LocalDateTime endDateTime);
}
