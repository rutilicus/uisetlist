package com.rutilicus.uisetlist.service

import com.rutilicus.uisetlist.model.Userdata
import com.rutilicus.uisetlist.repository.UserdataRepository
import org.springframework.stereotype.Service

@Service
class UserdataService(private val userdataRepository: UserdataRepository) {
    fun findByUsername(user: String): Userdata {
        return userdataRepository.findByUsername(user)
    }
}
