package com.rutilicus.uisetlist

import com.rutilicus.uisetlist.service.UserDetailsServiceImpl
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.builders.WebSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

@Configuration
@EnableWebSecurity
class WebSecurityConfig: WebSecurityConfigurerAdapter() {
    @Bean
    fun passwordEncoder() = BCryptPasswordEncoder()

    @Autowired
    val userDetailsService: UserDetailsServiceImpl = UserDetailsServiceImpl()

    override fun configure(web: WebSecurity?) {
        web?.ignoring()?.antMatchers(
                "/",
                "/movie/**",
                "/song/**")
    }

    override fun configure(http: HttpSecurity?) {
        http?.authorizeRequests()
                ?.antMatchers("/admin/**")?.authenticated()
                ?.anyRequest()?.permitAll()
                ?.and()
                ?.formLogin()
                ?.loginPage("/login")
                ?.usernameParameter("user")
                ?.passwordParameter("pass")
                ?.successForwardUrl("/admin/")
                ?.defaultSuccessUrl("/admin/", true)
                ?.failureUrl("/login?error")
                ?.permitAll()
                ?.and()
                ?.logout()
                ?.logoutUrl("/logout")
                ?.logoutSuccessUrl("/login?logout")
                ?.permitAll()
    }

    @Autowired
    override fun configure(auth: AuthenticationManagerBuilder?) {
        auth?.userDetailsService(userDetailsService)?.passwordEncoder(passwordEncoder())
    }
}
