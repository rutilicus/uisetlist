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
    private var username = ""

    @Column(name = "password")
    private var password = ""

    fun getUsername() = username
    fun setUsername(username: String) {
        this.username = username
    }

    fun getPassword() = password
    fun setPassword(password: String) {
        this.password = password
    }
}
