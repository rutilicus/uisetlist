package com.rutilicus.uisetlist.repository

import com.rutilicus.uisetlist.model.Userdata
import org.springframework.data.jpa.repository.JpaRepository

interface UserdataRepository: JpaRepository<Userdata, Int> {
    fun findByUsername(username: String): Userdata
}
