package com.rutilicus.uisetlist.service

import com.rutilicus.uisetlist.model.MetaTags
import com.rutilicus.uisetlist.repository.MetaTagsRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class MetaTagsService(private val metaTagsRepository: MetaTagsRepository) {
    fun findAll(): List<MetaTags> {
        return metaTagsRepository.findAll()
    }

    fun findAllByName(name: String): List<MetaTags> {
        return metaTagsRepository.findByName(name)
    }

    fun addMetaTag(metaTags: MetaTags): MetaTags {
        return metaTagsRepository.saveAndFlush(metaTags)
    }

    fun deleteByName(name: String) {
        metaTagsRepository.deleteById(name)
    }
}
