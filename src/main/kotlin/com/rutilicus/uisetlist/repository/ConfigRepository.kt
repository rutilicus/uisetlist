package com.rutilicus.uisetlist.repository

import com.rutilicus.uisetlist.model.Config
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ConfigRepository: JpaRepository<Config, String> {
    fun findByKey(key: String): List<Config>
}
