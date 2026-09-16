package com.cachesol.platform.hrm.application.service;

import com.cachesol.platform.hrm.application.dto.CreateEmployeeRequest;
import com.cachesol.platform.hrm.application.dto.EmployeeResponse;
import com.cachesol.platform.hrm.application.dto.PageResponse;
import com.cachesol.platform.hrm.domain.entity.Employee;
import com.cachesol.platform.hrm.domain.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmployeeService {

    private final EmployeeRepository repository;

    public PageResponse<EmployeeResponse> getAll(Pageable pageable) {
        Page<Employee> page = repository.findAll(pageable);
        List<EmployeeResponse> content = page.map(this::toResponse).getContent();
        return PageResponse.of(content, page.getNumber(), page.getSize(), page.getTotalElements());
    }

    public EmployeeResponse getById(String id) {
        Employee employee = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found: " + id));
        return toResponse(employee);
    }

    @Transactional
    public EmployeeResponse create(CreateEmployeeRequest request) {
        if (repository.existsByEmployeeCode(request.getEmployeeCode())) {
            throw new RuntimeException("Employee code exists");
        }
        Employee employee = Employee.builder()
                .employeeCode(request.getEmployeeCode())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .dateOfBirth(request.getDateOfBirth())
                .dateOfJoining(request.getDateOfJoining())
                .employmentType(Employee.EmploymentType.valueOf(request.getEmploymentType()))
                .build();
        return toResponse(repository.save(employee));
    }

    @Transactional
    public void delete(String id) {
        repository.deleteById(id);
    }

    private EmployeeResponse toResponse(Employee e) {
        return EmployeeResponse.builder()
                .id(e.getId())
                .employeeCode(e.getEmployeeCode())
                .fullName(e.getFullName())
                .email(e.getEmail())
                .phone(e.getPhone())
                .employmentType(e.getEmploymentType() != null ? e.getEmploymentType().name() : null)
                .status(e.getStatus() != null ? e.getStatus().name() : null)
                .build();
    }
}
