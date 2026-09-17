package com.cachesol.platform.tenant.controller;

import com.cachesol.platform.tenant.dto.JobTitleResponse;
import com.cachesol.platform.tenant.service.JobTitleService;
import com.cachesol.platform.shared.common.api.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/client-api/v1/job-titles")
@RequiredArgsConstructor
public class JobTitleController {

    private final JobTitleService service;

    public static class CreateJobTitleRequest {
        @NotBlank public String code;
        @NotBlank public String name;
        public int level = 0;
        public boolean leader = false;
        public String description;
    }

    public static class UpdateJobTitleRequest {
        public String name;
        public Integer level;
        public Boolean leader;
        public String description;
    }

    @GetMapping
    public ApiResponse<List<JobTitleResponse>> list() {
        return ApiResponse.ok(service.list());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<JobTitleResponse>> create(
            @Valid @RequestBody CreateJobTitleRequest req) {
        return ResponseEntity.status(201)
                .body(ApiResponse.ok(service.create(req.code, req.name, req.level, req.leader, req.description)));
    }

    @GetMapping("/{id}")
    public ApiResponse<JobTitleResponse> get(@PathVariable UUID id) {
        return ApiResponse.ok(service.get(id));
    }

    @GetMapping("/by-code/{code}")
    public ApiResponse<JobTitleResponse> byCode(@PathVariable String code) {
        return ApiResponse.ok(service.getByCode(code));
    }

    @PatchMapping("/{id}")
    public ApiResponse<JobTitleResponse> update(
            @PathVariable UUID id,
            @RequestBody UpdateJobTitleRequest req) {
        return ApiResponse.ok(service.update(id, req.name, req.level, req.leader, req.description));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ApiResponse.ok(null);
    }
}
