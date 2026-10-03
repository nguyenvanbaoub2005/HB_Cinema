package com.baobeodev.identity_service.repository;

import com.baobeodev.identity_service.entity.Schedule;
import com.baobeodev.identity_service.entity.ScheduleSeat;
import com.baobeodev.identity_service.entity.Seat;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScheduleSeatRepository extends JpaRepository<ScheduleSeat, Integer> {
  List<ScheduleSeat> findByScheduleId(int scheduleId);

  Optional<ScheduleSeat> findByScheduleAndSeat(Schedule schedule, Seat seat);

  // Truy vấn tất cả ghế trong một phòng và có trạng thái booked = true
  List<ScheduleSeat> findBySchedule_Room_Id(int roomId);
}
