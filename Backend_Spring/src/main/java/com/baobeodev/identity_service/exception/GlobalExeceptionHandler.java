package com.baobeodev.identity_service.exception;

import com.baobeodev.identity_service.dto.request.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.View;

@ControllerAdvice
public class GlobalExeceptionHandler {
  private final View error;

  public GlobalExeceptionHandler(View error) {
    this.error = error;
  }

  //    @ExceptionHandler(value = Exception.class)
  //    ResponseEntity<ApiResponse> handleRuntimeException(RuntimeException exception){
  //        ApiResponse apiResponse = new ApiResponse();
  //        apiResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
  //        // lấy lỗi ở chính exception
  //        apiResponse.setMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage());
  //        return  ResponseEntity.badRequest().body(apiResponse);
  //    }
  // tự tạo lớpbắt lỗi AppException
  @ExceptionHandler(value = AppException.class)
  ResponseEntity<ApiResponse> handleAppException(AppException exception) {
    ApiResponse apiResponse = new ApiResponse<>();
    ErrorCode errorCode = exception.getErrorCode();
    apiResponse.setCode(errorCode.getCode());
    apiResponse.setMessage(errorCode.getMessage());
    return ResponseEntity.badRequest().body(apiResponse);
  }

  // Dùng valid
  // dùng chuẩn hoá
  @ExceptionHandler(value = MethodArgumentNotValidException.class)
  ResponseEntity<ApiResponse> handleMethodArgumentNotValidException(
      MethodArgumentNotValidException exception) {
    String enumKey = exception.getFieldError().getDefaultMessage();
    ErrorCode errorCode;
    try {
      errorCode = ErrorCode.valueOf((enumKey));
    } catch (IllegalArgumentException e) {
      errorCode = ErrorCode.INVALID_KEY;
    }
    ApiResponse apiResponse = new ApiResponse();
    apiResponse.setCode(errorCode.getCode());
    apiResponse.setMessage(errorCode.getMessage());
    return ResponseEntity.badRequest().body(apiResponse);
  }
}
