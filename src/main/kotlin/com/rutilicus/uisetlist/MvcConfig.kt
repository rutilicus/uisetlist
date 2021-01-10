package com.rutilicus.uisetlist

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class MvcConfig: WebMvcConfigurer {
    override fun addViewControllers(registry: ViewControllerRegistry) {
        registry.addViewController("/login").setViewName("login")
    }

    override fun addInterceptors(registry: InterceptorRegistry) {
        registry.addInterceptor(CommonAttributeInterceptor()).addPathPatterns("/**")
    }
}
