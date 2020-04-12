package com.rutilicus.uisetlist.model

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "metatags")
class MetaTags {
    @Id
    @Column(name = "name")
    private var name = ""

    @Column(name = "content")
    private var content = ""

    fun getName() = name
    fun setName(name: String) {
        this.name = name
    }

    fun getContent() = content
    fun setContent(content: String) {
        this.content = content
    }
}
