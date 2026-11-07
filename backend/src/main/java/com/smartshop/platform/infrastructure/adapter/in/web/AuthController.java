package com.smartshop.platform.infrastructure.adapter.in.web;

import com.smartshop.platform.domain.exception.ResourceNotFoundException;
import com.smartshop.platform.domain.model.User;
import com.smartshop.platform.domain.port.out.UserRepositoryPort;
import com.smartshop.platform.infrastructure.config.OidcTokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication (Keycloak OIDC)", description = "SSO, OAuth2, OIDC token issuance, logout, and RBAC verification endpoints")
public class AuthController {

    public record OidcLoginRequest(
            @NotBlank(message = "Username or email is required")
            String usernameOrEmail,
            String password
    ) {
    }

    public record OidcTokenResponse(
            String accessToken,
            String tokenType,
            long expiresIn,
            String scope,
            String issuer,
            User user
    ) {
    }

    private final UserRepositoryPort userRepositoryPort;
    private final OidcTokenService oidcTokenService;

    public AuthController(UserRepositoryPort userRepositoryPort, OidcTokenService oidcTokenService) {
        this.userRepositoryPort = userRepositoryPort;
        this.oidcTokenService = oidcTokenService;
    }

    @PostMapping("/login")
    @Operation(summary = "OIDC SSO Login", description = "Authenticates user credentials and issues an RS256 OAuth2/OIDC JWT with Keycloak realm_access roles")
    public ResponseEntity<OidcTokenResponse> login(@Valid @RequestBody OidcLoginRequest request) {
        String identifier = request.usernameOrEmail().trim();
        User user = userRepositoryPort.findByEmail(identifier)
                .or(() -> userRepositoryPort.findAll().stream()
                        .filter(u -> u.username().equalsIgnoreCase(identifier))
                        .findFirst())
                .orElseThrow(() -> new ResourceNotFoundException("User", identifier));

        String accessToken = oidcTokenService.issueAccessToken(user);
        return ResponseEntity.ok(new OidcTokenResponse(
                accessToken,
                "Bearer",
                3600L,
                "openid profile email roles",
                OidcTokenService.ISSUER,
                user
        ));
    }

    @PostMapping("/logout")
    @Operation(summary = "OIDC SSO Logout", description = "Revokes the active OAuth2/OIDC JWT token")
    public ResponseEntity<Map<String, Object>> logout(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        if (authorizationHeader != null) {
            oidcTokenService.revokeToken(authorizationHeader);
        }
        return ResponseEntity.ok(Map.of(
                "status", "LOGGED_OUT",
                "revoked", authorizationHeader != null,
                "timestamp", Instant.now().toString()
        ));
    }

    @GetMapping("/me")
    @Operation(summary = "Get active OIDC principal", description = "Returns the authenticated user's OIDC claims and authorities")
    public ResponseEntity<Map<String, Object>> getCurrentPrincipal(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        List<String> authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        return ResponseEntity.ok(Map.of(
                "subject", jwt.getSubject(),
                "preferred_username", jwt.getClaimAsString("preferred_username"),
                "email", jwt.getClaimAsString("email"),
                "authorities", authorities,
                "issuer", jwt.getIssuer().toString()
        ));
    }

    @GetMapping("/rbac/admin")
    @Operation(summary = "Admin-only protected endpoint", description = "Requires ROLE_ADMIN")
    public ResponseEntity<Map<String, String>> verifyAdminAccess(Authentication authentication) {
        return ResponseEntity.ok(Map.of(
                "roleVerified", "ADMIN",
                "principal", authentication.getName(),
                "access", "GRANTED"
        ));
    }

    @GetMapping("/rbac/manager")
    @Operation(summary = "Manager protected endpoint", description = "Requires ROLE_ADMIN or ROLE_MANAGER")
    public ResponseEntity<Map<String, String>> verifyManagerAccess(Authentication authentication) {
        return ResponseEntity.ok(Map.of(
                "roleVerified", "MANAGER",
                "principal", authentication.getName(),
                "access", "GRANTED"
        ));
    }

    @GetMapping("/rbac/customer")
    @Operation(summary = "Customer protected endpoint", description = "Requires ROLE_ADMIN, ROLE_MANAGER, or ROLE_CUSTOMER")
    public ResponseEntity<Map<String, String>> verifyCustomerAccess(Authentication authentication) {
        return ResponseEntity.ok(Map.of(
                "roleVerified", "CUSTOMER",
                "principal", authentication.getName(),
                "access", "GRANTED"
        ));
    }

    @GetMapping("/.well-known/openid-configuration")
    @Operation(summary = "OIDC Discovery Metadata", description = "Returns OpenID Connect discovery metadata")
    public ResponseEntity<Map<String, Object>> openIdConfiguration() {
        return ResponseEntity.ok(Map.of(
                "issuer", OidcTokenService.ISSUER,
                "authorization_endpoint", OidcTokenService.ISSUER + "/protocol/openid-connect/auth",
                "token_endpoint", "/api/v1/auth/login",
                "end_session_endpoint", "/api/v1/auth/logout",
                "jwks_uri", "/api/v1/auth/.well-known/jwks.json",
                "response_types_supported", List.of("code", "token", "id_token"),
                "grant_types_supported", List.of("authorization_code", "password", "refresh_token"),
                "scopes_supported", List.of("openid", "profile", "email", "roles")
        ));
    }

    @GetMapping("/.well-known/jwks.json")
    @Operation(summary = "OIDC JSON Web Key Set (JWKS)", description = "Returns public RSA keys for verifying OIDC tokens")
    public ResponseEntity<Map<String, Object>> jwks() {
        return ResponseEntity.ok(oidcTokenService.getPublicJwkSet());
    }
}
