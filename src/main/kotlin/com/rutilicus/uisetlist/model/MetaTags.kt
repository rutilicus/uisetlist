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
    var name = ""

    @Column(name = "content")
    var content = ""
}
