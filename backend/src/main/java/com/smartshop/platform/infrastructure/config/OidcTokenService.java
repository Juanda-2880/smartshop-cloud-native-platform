package com.smartshop.platform.infrastructure.config;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import com.smartshop.platform.domain.model.User;
import com.smartshop.platform.domain.model.UserRole;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.stereotype.Service;

@Service
public class OidcTokenService {

    public static final String ISSUER = "http://keycloak.smartshop.local/realms/smartshop";

    private final RSAKey rsaJwk;
    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;
    private final Set<String> revokedTokenIds = ConcurrentHashMap.newKeySet();

    public OidcTokenService() {
        try {
            KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
            generator.initialize(2048);
            KeyPair keyPair = generator.generateKeyPair();
            RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
            RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();

            this.rsaJwk = new RSAKey.Builder(publicKey)
                    .privateKey(privateKey)
                    .keyID("smartshop-keycloak-rsa-kid-2026")
                    .build();

            JWKSource<SecurityContext> jwkSource = new ImmutableJWKSet<>(new JWKSet(rsaJwk));
            this.jwtEncoder = new NimbusJwtEncoder(jwkSource);

            NimbusJwtDecoder decoder = NimbusJwtDecoder.withPublicKey(publicKey).build();
            decoder.setJwtValidator(jwt -> {
                if (jwt.getId() != null && revokedTokenIds.contains(jwt.getId())) {
                    return OAuth2TokenValidatorResult.failure(
                            new OAuth2Error("invalid_token", "OIDC token has been logged out and revoked", null)
                    );
                }
                return OAuth2TokenValidatorResult.success();
            });
            this.jwtDecoder = decoder;
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to initialize RSA keypair for OIDC JWT service", ex);
        }
    }

    public String issueAccessToken(User user) {
        Instant now = Instant.now();
        List<String> grantedRoles = resolveHierarchyRoles(user.role());
        String jti = UUID.randomUUID().toString();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(ISSUER)
                .subject(user.id().toString())
                .id(jti)
                .issuedAt(now)
                .expiresAt(now.plusSeconds(3600))
                .claim("preferred_username", user.username())
                .claim("email", user.email())
                .claim("name", user.fullName())
                .claim("scope", "openid profile email roles")
                .claim("roles", grantedRoles)
                .claim("realm_access", Map.of("roles", grantedRoles))
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    public void revokeToken(String rawBearerToken) {
        String token = sanitizeBearer(rawBearerToken);
        if (token == null || token.isBlank()) {
            return;
        }
        Jwt decoded = jwtDecoder.decode(token);
        if (decoded.getId() != null) {
            revokedTokenIds.add(decoded.getId());
        }
    }

    public JwtDecoder getJwtDecoder() {
        return jwtDecoder;
    }

    public Map<String, Object> getPublicJwkSet() {
        return new JWKSet(rsaJwk.toPublicJWK()).toJSONObject();
    }

    private List<String> resolveHierarchyRoles(UserRole role) {
        return switch (role) {
            case ADMIN -> List.of("ADMIN", "MANAGER", "CUSTOMER");
            case MANAGER -> List.of("MANAGER", "CUSTOMER");
            case CUSTOMER -> List.of("CUSTOMER");
        };
    }

    private String sanitizeBearer(String headerOrToken) {
        if (headerOrToken == null) {
            return null;
        }
        if (headerOrToken.startsWith("Bearer ")) {
            return headerOrToken.substring(7).trim();
        }
        return headerOrToken.trim();
    }
}

