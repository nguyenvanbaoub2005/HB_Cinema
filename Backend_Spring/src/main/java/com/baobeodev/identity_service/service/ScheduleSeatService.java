package com.baobeodev.identity_service.service;

import com.baobeodev.identity_service.dto.response.ScheduleSeatResponse;
import com.baobeodev.identity_service.entity.Schedule;
import com.baobeodev.identity_service.entity.ScheduleSeat;
import com.baobeodev.identity_service.entity.Seat;
import com.baobeodev.identity_service.exception.AppException;
import com.baobeodev.identity_service.exception.ErrorCode;
import com.baobeodev.identity_service.repository.ScheduleRepository;
import com.baobeodev.identity_service.repository.ScheduleSeatRepository;
import com.baobeodev.identity_service.repository.SeatRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ScheduleSeatService {
  private final ScheduleSeatRepository scheduleSeatRepository;
  private final SeatRepository seatRepository;
  private final ScheduleRepository scheduleRepository;

  @Transactional
  public ScheduleSeat bookSeatForSchedule(int scheduleId, int seatId) {
    // Kiểm tra lịch chiếu
    Schedule schedule =
        scheduleRepository
            .findById(scheduleId)
            .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND_SCHEDULE));
    // Kiểm tra ghế
    Seat seat = seatRepository.findById(seatId).orElseThrow(() -> new RuntimeException("K có ghế"));
    // Kiểm tra ghế có thuộc phòng của lịch không
    if (!Objects.equals(seat.getRoom().getId(), schedule.getRoom().getId())) {
      throw new AppException(ErrorCode.INVALID_SEAT_FOR_SCHEDULE);
    }
    // Lấy `ScheduleSeat`
    ScheduleSeat scheduleSeat =
        scheduleSeatRepository
            .findByScheduleAndSeat(schedule, seat)
            .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    // Kiểm tra ghế đã được đặt chưa
    if (scheduleSeat.isBooked()) {
      throw new AppException(ErrorCode.SEAT_HAD_ORDERED_BY_OTHER_USER);
    }
    // Đánh dấu ghế đã được đặt
    scheduleSeat.setBooked(true);
    scheduleSeatRepository.save(scheduleSeat);

    return scheduleSeat;
  }

  public List<ScheduleSeatResponse> getScheduleSeatForIdSchedule(int scheduleId) {
    List<ScheduleSeat> scheduleSeats = scheduleSeatRepository.findByScheduleId(scheduleId);
    return scheduleSeats.stream()
        .map(
            seat ->
                new ScheduleSeatResponse(
                    seat.getId(), seat.getSeat(), seat.isBooked() //
                    ))
        .collect(Collectors.toList());
  }
}
