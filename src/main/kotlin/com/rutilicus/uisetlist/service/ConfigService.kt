package com.rutilicus.uisetlist.service

import com.rutilicus.uisetlist.model.Config
import com.rutilicus.uisetlist.repository.ConfigRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class ConfigService(private val configRepository: ConfigRepository) {
    fun findAll(): List<Config> {
        return configRepository.findAll()
    }

    fun setConfig(config: List<Config>): List<Config> {
        return configRepository.saveAll(config)
    }
}
