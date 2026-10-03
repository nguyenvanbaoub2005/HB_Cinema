package com.baobeodev.identity_service.controller;

import com.baobeodev.identity_service.dto.request.ApiResponse;
import com.baobeodev.identity_service.dto.request.ScheduleRequest;
import com.baobeodev.identity_service.dto.response.ScheduleResponse;
import com.baobeodev.identity_service.service.ScheduleService;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/schedule")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ScheduleController {
  ScheduleService scheduleService;

  @PostMapping
  public ApiResponse<ScheduleResponse> createSchedule(
      @RequestBody ScheduleRequest scheduleRequest) {
    ScheduleResponse scheduleResponse = scheduleService.createSchedule(scheduleRequest);
    return ApiResponse.<ScheduleResponse>builder()
        .result(scheduleResponse)
        .message("Schedule created successfully")
        .build();
  }

  @PostMapping("/movies/{movieId}")
  public ApiResponse<ScheduleResponse> createScheduleByMovieId(
      @PathVariable int movieId, @RequestBody ScheduleRequest scheduleRequest) {
    ScheduleResponse scheduleResponse =
        scheduleService.createScheduleByMovieId(movieId, scheduleRequest);
    return ApiResponse.<ScheduleResponse>builder()
        .result(scheduleResponse)
        .message("Schedule added successfully")
        .build();
  }

  @GetMapping("/movies/{movieId}")
  public ApiResponse<List<ScheduleResponse>> getSchedulesByMovie(@PathVariable int movieId) {
    List<ScheduleResponse> schedules = scheduleService.getSchedulesByMovie(movieId);
    return ApiResponse.<List<ScheduleResponse>>builder()
        .result(schedules)
        .message("Schedules retrieved successfully")
        .build();
  }

  @GetMapping()
  public ApiResponse<List<ScheduleResponse>> getAllSchedules() {
    List<ScheduleResponse> schedules = scheduleService.getAllSchedules();
    return ApiResponse.<List<ScheduleResponse>>builder()
        .result(schedules)
        .message("Fetch schedules successfully")
        .build();
  }

  @PutMapping("/{id}")
  public ApiResponse<ScheduleResponse> updateSchedule(
      @PathVariable int id, @RequestBody ScheduleRequest scheduleRequest) {
    ScheduleResponse updatedSchedule = scheduleService.updateSchedule(id, scheduleRequest);
    return ApiResponse.<ScheduleResponse>builder()
        .result(updatedSchedule)
        .message("Schedule updated successfully")
        .build();
  }

  @DeleteMapping("/{id}")
  public ApiResponse<Void> deleteSchedule(@PathVariable int id) {
    scheduleService.deleteSchedule(id);
    return ApiResponse.<Void>builder().message("Schedule deleted successfully").build();
  }

  @PutMapping("/update-seats/{roomId}")
  public ApiResponse<Void> updateSeatsAfterShow(@PathVariable int roomId) {
    try {
      scheduleService.updateRoomAndSeatsAfterShow(roomId);
      // Trả về phản hồi thành công
      return ApiResponse.<Void>builder().message("Seats updated successfully.").build();
    } catch (RuntimeException e) {
      System.out.println("Error while updating seats: " + e.getMessage());
      return ApiResponse.<Void>builder()
          .message(e.getMessage()) // Lỗi từ service (ví dụ: "Show is still ongoing")
          .build();
    }
  }
}
