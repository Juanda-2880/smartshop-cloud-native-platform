package com.smartshop.platform.infrastructure.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import java.util.List;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfiguration {

    @Bean
    public OpenAPI smartShopOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("SmartShop Cloud-Native Platform API")
                        .version("1.0.0")
                        .description("Hexagonal Architecture E-Commerce REST API for Users, Categories, Products, Carts, and Orders")
                        .contact(new Contact()
                                .name("SmartShop Platform Engineering")
                                .email("architecture@smartshop.io"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Local Development Server"),
                        new Server().url("http://smartshop.local").description("Kubernetes Ingress Server")
                ));
    }
}

