package com.baobeodev.identity_service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {

  // lỗi chung
  UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
  NOT_FOUND(999, "Not found", HttpStatus.BAD_REQUEST),
  // lỗi auth
  INVALID_KEY(9000, "Uncategorized error", HttpStatus.BAD_REQUEST),
  UNAUTHENTICATED(9001, "Unauthenticated", HttpStatus.UNAUTHORIZED),
  UNAUTHORIZED(9002, "You do not have permission", HttpStatus.FORBIDDEN),
  // lỗi user
  USER_EXISTED(1000, "User existed", HttpStatus.BAD_REQUEST),
  USERNAME_INVALID(1001, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
  PASSWORD_INVALID(1002, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
  USER_NOT_EXISTED(1003, "User not existed", HttpStatus.NOT_FOUND),
  INVALID_DOB(1004, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
  // lỗi phòng
  NOT_FOUND_ROOM_IN_BRAND(1010, "Not found in the room in the branch", HttpStatus.BAD_REQUEST),
  NOT_FOUND_ROOM(1011, "Room not found", HttpStatus.BAD_REQUEST),
  NOT_FOUND_BRANCH(1012, "Branch not found", HttpStatus.BAD_REQUEST),
  // lỗi phim
  NOT_FOUND_MOVIE(1020, "Movie not found", HttpStatus.BAD_REQUEST),
  // lỗi existedted
  MOVIE_EXISTED(2001, "Movie existed", HttpStatus.BAD_REQUEST),
  BRANCH_EXISTED(2002, "Branch existed", HttpStatus.BAD_REQUEST),

  // lỗi lịch
  NOT_FOUND_SCHEDULE(2009, "Schedule not found", HttpStatus.BAD_REQUEST),
  DUPLICATE_SHOWTIMES(
      3000,
      "Lịch chiếu trùng với lịch đã có tại thời gian này hoặc phòng đang được chiếu bởi phim khác",
      HttpStatus.BAD_REQUEST),
  AN_ONGOING_SCHEDULE(3001, "Phòng vẫn đang có phim đang chiếu", HttpStatus.BAD_REQUEST),
  NO_SCHEDULES_GOING_FOUND(
      3002, "Không tìm thấy lịch chiếu đang diễn ra ở phòng này", HttpStatus.BAD_REQUEST),
  NO_FINISHED_SCHEDULES(3003, "Phòng chiếu vấn chưa kết thúc", HttpStatus.BAD_REQUEST),
  SHOWTIME_LATE(
      3004, "Lịch chiếu không thể được thêm trễ hơn giờ hiện tại", HttpStatus.BAD_REQUEST),
  CREATE_SIX_HOURT_BEFORE(
      3005, "Lịch chiếu phải được thêm trước ít nhất 6 tiếng", HttpStatus.BAD_REQUEST),
  // lỗi mua vé
  SEAT_HAD_ORDERED_BY_OTHER_USER(4000, "Ghế đã được đặt bởi người khác", HttpStatus.BAD_REQUEST),
  INVALID_SEAT_FOR_SCHEDULE(4001, "Ghế phải ở trong lịch chứa phòng chiếu", HttpStatus.BAD_REQUEST);

  ErrorCode(int code, String message, HttpStatusCode statusCode) {
    this.code = code;
    this.message = message;
    this.statusCode = statusCode;
  }

  private final int code;
  private final String message;
  private final HttpStatusCode statusCode;
}
