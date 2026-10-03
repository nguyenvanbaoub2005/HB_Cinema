package com.baobeodev.identity_service.controller;

import com.baobeodev.identity_service.dto.request.ApiResponse;
import com.baobeodev.identity_service.dto.response.ScheduleSeatResponse;
import com.baobeodev.identity_service.service.ScheduleSeatService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/schedule_seat")
@RequiredArgsConstructor
public class ScheduleSeatController {
  private final ScheduleSeatService scheduleSeatService;

  @GetMapping("/schedule/{scheduleId}")
  public ApiResponse<List<ScheduleSeatResponse>> getTicketsByBillId(
      @PathVariable Integer scheduleId) {
    List<ScheduleSeatResponse> scheduleSeatResponses =
        scheduleSeatService.getScheduleSeatForIdSchedule(scheduleId);
    return ApiResponse.<List<ScheduleSeatResponse>>builder().result(scheduleSeatResponses).build();
  }
}
