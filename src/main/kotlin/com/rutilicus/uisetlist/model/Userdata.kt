package com.rutilicus.uisetlist.model

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "userdata")
class Userdata {
    @Id
    @Column(name = "username")
    var username = ""

    @Column(name = "password")
    var password = ""
}
