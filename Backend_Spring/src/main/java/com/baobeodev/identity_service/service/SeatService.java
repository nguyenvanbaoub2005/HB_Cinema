package com.baobeodev.identity_service.service;

import com.baobeodev.identity_service.dto.request.SeatRequest;
import com.baobeodev.identity_service.dto.response.SeatResponse;
import com.baobeodev.identity_service.entity.ScheduleSeat;
import com.baobeodev.identity_service.entity.Seat;
import com.baobeodev.identity_service.exception.AppException;
import com.baobeodev.identity_service.exception.ErrorCode;
import com.baobeodev.identity_service.repository.ScheduleSeatRepository;
import com.baobeodev.identity_service.repository.SeatRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j // cho ghi log
public class SeatService {
  ScheduleSeatRepository scheduleSeatRepository;
  SeatRepository seatRepository;

  public List<SeatResponse> getSeatsForSchedule(int scheduleId) {
    List<ScheduleSeat> scheduleSeats = scheduleSeatRepository.findByScheduleId(scheduleId);
    return scheduleSeats.stream()
        .map(
            scheduleSeat -> {
              Seat seat = scheduleSeat.getSeat();
              return new SeatResponse(
                  seat.getId(),
                  seat.getName(),
                  scheduleSeat.isBooked(), // Trạng thái booked từ ScheduleSeat
                  seat.getSeatType(),
                  seat.getPrice());
            })
        .collect(Collectors.toList());
  }

  @PreAuthorize("hasRole('ADMIN')")
  public SeatResponse updateSeat(SeatRequest seatRequest, int seatId) {
    Seat seat =
        seatRepository.findById(seatId).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

    seat.setName(seatRequest.getName());
    seat.setSeatType(seatRequest.getSeatType());
    seat.setPrice(seatRequest.getPrice());
    Seat updatedSeat = seatRepository.save(seat);

    return new SeatResponse(
        updatedSeat.getId(),
        updatedSeat.getName(),
        updatedSeat == null,
        updatedSeat.getSeatType(),
        updatedSeat.getPrice());
  }
}
