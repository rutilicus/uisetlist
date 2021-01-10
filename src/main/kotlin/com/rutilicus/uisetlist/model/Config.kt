package com.rutilicus.uisetlist.model

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "config")
class Config {
    @Id
    @Column(name = "key")
    var key = ""

    @Column(name = "value")
    var value = ""
}
