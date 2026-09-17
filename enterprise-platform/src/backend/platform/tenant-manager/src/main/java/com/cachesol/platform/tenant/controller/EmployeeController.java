package com.cachesol.platform.tenant.controller;

import com.cachesol.platform.tenant.dto.CreateEmployeeRequest;
import com.cachesol.platform.tenant.dto.EmployeeAssignmentResponse;
import com.cachesol.platform.tenant.dto.EmployeeResponse;
import com.cachesol.platform.tenant.service.EmployeeService;
import com.cachesol.platform.shared.common.api.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/client-api/v1/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService service;

    @GetMapping
    public ApiResponse<List<EmployeeResponse>> list() {
        return ApiResponse.ok(service.list());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeResponse>> create(
            @Valid @RequestBody CreateEmployeeRequest req) {
        return ResponseEntity.status(201)
                .body(ApiResponse.ok(service.create(req)));
    }

    @GetMapping("/{id}")
    public ApiResponse<EmployeeResponse> get(@PathVariable UUID id) {
        return ApiResponse.ok(service.get(id));
    }

    @GetMapping("/by-code/{code}")
    public ApiResponse<EmployeeResponse> byCode(@PathVariable String code) {
        return ApiResponse.ok(service.getByCode(code));
    }

    @PatchMapping("/{id}")
    public ApiResponse<EmployeeResponse> update(
            @PathVariable UUID id,
            @RequestBody CreateEmployeeRequest req) {
        return ApiResponse.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ApiResponse.ok(null);
    }

    // ---- Assignments ----

    @GetMapping("/{id}/assignments")
    public ApiResponse<List<EmployeeAssignmentResponse>> listAssignments(@PathVariable UUID id) {
        return ApiResponse.ok(service.listAssignments(id));
    }

    @PostMapping("/{id}/assignments")
    public ApiResponse<EmployeeAssignmentResponse> addAssignment(
            @PathVariable UUID id,
            @Valid @RequestBody CreateEmployeeRequest req) {
        return ApiResponse.ok(service.addAssignment(id, req));
    }

    @DeleteMapping("/{id}/assignments/{assignmentId}")
    public ApiResponse<Void> removeAssignment(
            @PathVariable UUID id,
            @PathVariable UUID assignmentId) {
        service.removeAssignment(id, assignmentId);
        return ApiResponse.ok(null);
    }
}
