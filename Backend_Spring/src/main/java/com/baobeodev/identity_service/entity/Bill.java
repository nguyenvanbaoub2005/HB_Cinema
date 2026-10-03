package com.baobeodev.identity_service.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.annotation.CreatedDate;

@Data
@Entity
@Table(name = "bill")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Bill {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Integer id;

  @CreatedDate LocalDateTime createdTime;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(nullable = false, name = "user_id")
  @OnDelete(action = OnDeleteAction.CASCADE)
  User user;
  //    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL)
  //    List<Combo> combos; // Một hóa đơn có thể chứa nhiều combo
  //    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL)
  //    List<Ticket> tickets;  // Một hóa đơn có thể chứa nhiều vé
}
