package com.baobeodev.identity_service.controller;

import com.baobeodev.identity_service.dto.request.ApiResponse;
import com.baobeodev.identity_service.dto.request.RoomRequest;
import com.baobeodev.identity_service.dto.response.RoomResponse;
import com.baobeodev.identity_service.service.RoomService;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rooms")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class RoomController {
  RoomService roomService;

  @GetMapping("/branch/{branchId}")
  public ApiResponse<List<RoomResponse>> getRoomsByBranch(@PathVariable int branchId) {
    List<RoomResponse> rooms = roomService.getRoomsByBranch(branchId);
    return ApiResponse.<List<RoomResponse>>builder().result(rooms).build();
  }

  @GetMapping
  public ApiResponse<List<RoomResponse>> getRooms() {
    return ApiResponse.<List<RoomResponse>>builder().result(roomService.getRooms()).build();
  }

  @PostMapping
  public ApiResponse<RoomResponse> createRoom(@RequestBody RoomRequest roomRequest) {
    RoomResponse roomResponse = roomService.createRoom(roomRequest);
    return ApiResponse.<RoomResponse>builder().result(roomResponse).build();
  }
}
