package com.baobeodev.identity_service.controller;

import com.baobeodev.identity_service.dto.request.ApiResponse;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * HealthController - Dùng để kiểm tra server có đang chạy không.
 * Không yêu cầu xác thực (cấu hình trong SecurityConfig).
 */
@RestController
@RequestMapping("/health")
public class HealthController {

    private static final String VERSION = "1.0.1"; // Tăng version để test CI/CD deploy

    @GetMapping
    public ApiResponse<Map<String, String>> healthCheck() {
        Map<String, String> info = new LinkedHashMap<>();
        info.put("status", "UP");
        info.put("service", "HB Cinema Backend");
        info.put("version", VERSION);
        info.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        info.put("message", "Server is running normally 🎬");

        return ApiResponse.<Map<String, String>>builder()
                .result(info)
                .message("Health check passed")
                .build();
    }
}
