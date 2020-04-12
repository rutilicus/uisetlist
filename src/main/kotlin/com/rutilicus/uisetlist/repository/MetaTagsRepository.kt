package com.rutilicus.uisetlist.repository

import com.rutilicus.uisetlist.model.MetaTags
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MetaTagsRepository: JpaRepository<MetaTags, String> {
    fun findByName(name: String): List<MetaTags>
}
