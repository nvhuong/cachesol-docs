package com.cachesol.platform.hrm.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "employee_id")
    private String id;

    @Column(name = "employee_code", nullable = false, unique = true, length = 20)
    private String employeeCode;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "full_name", nullable = false, length = 200)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "date_of_birth")
    private java.time.LocalDate dateOfBirth;

    @Column(name = "date_of_joining", nullable = false)
    private java.time.LocalDate dateOfJoining;

    @Column(name = "employment_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private EmploymentType employmentType;

    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private EmployeeStatus status = EmployeeStatus.ACTIVE;

    @PrePersist
    @PreUpdate
    public void updateFullName() {
        this.fullName = this.firstName + " " + this.lastName;
    }

    public enum EmploymentType {
        FULL_TIME, PART_TIME, CONTRACT, INTERN, PROBATION
    }

    public enum EmployeeStatus {
        ACTIVE, ON_LEAVE, SUSPENDED, RESIGNED, TERMINATED
    }
}
