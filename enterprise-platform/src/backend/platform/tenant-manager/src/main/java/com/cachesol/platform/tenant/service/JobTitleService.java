package com.cachesol.platform.tenant.service;

import com.cachesol.platform.tenant.dto.JobTitleResponse;
import com.cachesol.platform.tenant.entity.JobTitle;
import com.cachesol.platform.tenant.repository.JobTitleRepository;
import com.cachesol.platform.shared.common.exception.ConflictException;
import com.cachesol.platform.shared.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JobTitleService {

    private final JobTitleRepository repo;

    public List<JobTitleResponse> list() {
        return repo.findAll().stream().map(JobTitleResponse::from).toList();
    }

    public JobTitleResponse get(UUID id) {
        return JobTitleResponse.from(repo.findById(id)
                .orElseThrow(() -> new NotFoundException("JobTitle", id.toString())));
    }

    public JobTitleResponse getByCode(String code) {
        return JobTitleResponse.from(repo.findByCode(code)
                .orElseThrow(() -> new NotFoundException("JobTitle", code)));
    }

    @Transactional
    public JobTitleResponse create(String code, String name, int level, boolean leader, String description) {
        if (repo.findByCode(code).isPresent()) {
            throw new ConflictException("JOB_TITLE_EXISTS", "Job title đã tồn tại: " + code);
        }
        JobTitle j = new JobTitle(code, name, level, leader);
        j.setDescription(description);
        return JobTitleResponse.from(repo.save(j));
    }

    @Transactional
    public JobTitleResponse update(UUID id, String name, Integer level, Boolean leader, String description) {
        JobTitle j = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("JobTitle", id.toString()));
        if (name        != null) j.setName(name);
        if (level      != null) j.setLevel(level);
        if (leader     != null) j.setLeader(leader);
        if (description != null) j.setDescription(description);
        return JobTitleResponse.from(repo.save(j));
    }

    @Transactional
    public void delete(UUID id) {
        if (!repo.existsById(id)) throw new NotFoundException("JobTitle", id.toString());
        repo.deleteById(id);
    }
}
