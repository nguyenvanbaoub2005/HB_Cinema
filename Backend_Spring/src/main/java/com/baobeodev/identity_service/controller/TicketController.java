package com.baobeodev.identity_service.controller;

import com.baobeodev.identity_service.dto.request.ApiResponse;
import com.baobeodev.identity_service.dto.request.TicketRequest;
import com.baobeodev.identity_service.dto.request.TicketRequestWrapper;
import com.baobeodev.identity_service.dto.response.TicketAggregateResponse;
import com.baobeodev.identity_service.dto.response.TicketResponse;
import com.baobeodev.identity_service.entity.Combo;
import com.baobeodev.identity_service.service.TicketService;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TicketController {
  TicketService ticketService;

  @GetMapping
  public ApiResponse<List<TicketResponse>> getAllTickets() {
    return ApiResponse.<List<TicketResponse>>builder()
        .result(ticketService.getAllTickets())
        .build();
  }

  @PostMapping
  public ApiResponse<TicketAggregateResponse> createTickets(
      @RequestParam(required = false) Integer billId,
      @RequestBody TicketRequestWrapper requestWrapper) {
    List<TicketRequest> ticketRequests = requestWrapper.getTicketRequests();
    List<Combo> combos = requestWrapper.getCombos();
    TicketAggregateResponse ticketAggregateResponse =
        ticketService.createTickets(billId, ticketRequests, combos);
    return ApiResponse.<TicketAggregateResponse>builder().result(ticketAggregateResponse).build();
  }

  @GetMapping("/bill/{billId}")
  public ApiResponse<List<TicketResponse>> getTicketsByBillId(@PathVariable Integer billId) {
    List<TicketResponse> ticketResponses = ticketService.getTicketsByBillId(billId);
    return ApiResponse.<List<TicketResponse>>builder().result(ticketResponses).build();
  }
}
