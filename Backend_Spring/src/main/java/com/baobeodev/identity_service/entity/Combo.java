package com.baobeodev.identity_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Entity
@Table(name = "combo")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Combo {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id; // ID combo đồ ăn

  private String name; // Tên combo đồ ăn
  private double price; // Giá combo đồ ăn

  @ManyToOne
  @JoinColumn(name = "bill_id", nullable = false)
  private Bill bill; // Mối quan hệ với hóa đơn (Bill)

  // Getters and Setters
}
