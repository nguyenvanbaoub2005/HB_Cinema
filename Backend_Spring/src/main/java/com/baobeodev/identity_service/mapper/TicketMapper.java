package com.baobeodev.identity_service.mapper;

import com.baobeodev.identity_service.dto.request.TicketRequest;
import com.baobeodev.identity_service.dto.response.TicketResponse;
import com.baobeodev.identity_service.entity.Ticket;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TicketMapper {
  // Mapping từ DTO request sang Entity
  @Mapping(target = "seat", ignore = true) // Sẽ xử lý riêng seat trong service
  @Mapping(target = "schedule", ignore = true) // Sẽ xử lý riêng schedule trong service
  @Mapping(target = "bill", ignore = true) // Sẽ xử lý riêng bill trong service
  Ticket toTicketEntity(TicketRequest ticketRequest);

  // Mapping từ Entity sang DTO response
  @Mapping(target = "seatName", source = "seat.name")
  @Mapping(target = "price", source = "seat.price")
  @Mapping(target = "scheduleDetails", source = "schedule")
  TicketResponse toTicketResponse(Ticket ticket);
}
