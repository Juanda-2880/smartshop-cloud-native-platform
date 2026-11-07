package com.smartshop.platform.infrastructure.adapter.in.web;

import com.smartshop.platform.domain.model.User;
import com.smartshop.platform.domain.port.in.UserUseCase;
import com.smartshop.platform.infrastructure.adapter.in.web.dto.UserRequestDto;
import com.smartshop.platform.infrastructure.adapter.in.web.mapper.WebDtoMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Users", description = "CRUD operations for SmartShop platform users")
public class UserController {

    private final UserUseCase userUseCase;
    private final WebDtoMapper webDtoMapper;

    public UserController(UserUseCase userUseCase, WebDtoMapper webDtoMapper) {
        this.userUseCase = userUseCase;
        this.webDtoMapper = webDtoMapper;
    }

    @GetMapping
    @Operation(summary = "List all users", description = "Retrieves all registered platform users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userUseCase.findAllUsers());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Retrieves a single user by UUID")
    public ResponseEntity<User> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(userUseCase.findUserById(id));
    }

    @PostMapping
    @Operation(summary = "Create user", description = "Creates a new platform user")
    public ResponseEntity<User> createUser(@Valid @RequestBody UserRequestDto requestDto) {
        User created = userUseCase.createUser(webDtoMapper.toDomain(requestDto));
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user", description = "Updates an existing user by UUID")
    public ResponseEntity<User> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UserRequestDto requestDto
    ) {
        User updated = userUseCase.updateUser(id, webDtoMapper.toDomain(requestDto));
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user", description = "Deletes an existing user by UUID")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userUseCase.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
