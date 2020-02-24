package com.rutilicus.uisetlist.service

import com.rutilicus.uisetlist.LoginUser
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class UserDetailsServiceImpl: UserDetailsService {
    @Autowired
    lateinit var userdataService: UserdataService

    override fun loadUserByUsername(username: String): UserDetails {
        val user = try {
            userdataService.findByUsername(username)
        } catch (e: Exception) {
            throw UsernameNotFoundException(username + "does not exists.")
        }

        return LoginUser(user)
    }
}
