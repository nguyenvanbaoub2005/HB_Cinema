package com.baobeodev.identity_service.controller;

import com.baobeodev.identity_service.dto.request.ApiResponse;
import com.baobeodev.identity_service.dto.request.SeatRequest;
import com.baobeodev.identity_service.dto.response.SeatResponse;
import com.baobeodev.identity_service.service.SeatService;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/seats")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SeatController {
  @Autowired SeatService seatService;

  // Lấy thông tin về ghế dựa trên schedule và seat
  @GetMapping("schedule/{scheduleId}")
  public ApiResponse<List<SeatResponse>> getSeatsForSchedule(@PathVariable int scheduleId) {
    // Lấy ghế cho lịch chiếu từ bảng ScheduleSeat
    return ApiResponse.<List<SeatResponse>>builder()
        .result(seatService.getSeatsForSchedule(scheduleId))
        .message("lấy ghế thành công")
        .build();
  }

  @PutMapping("/{seatId}")
  public ApiResponse<SeatResponse> updateSeat(
      @RequestBody SeatRequest seatRequest, @PathVariable int seatId) {
    SeatResponse seatResponse = seatService.updateSeat(seatRequest, seatId);
    return ApiResponse.<SeatResponse>builder().result(seatResponse).build();
  }
}
