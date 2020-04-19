package com.rutilicus.uisetlist

import com.rutilicus.uisetlist.model.Userdata
import org.springframework.security.core.authority.AuthorityUtils
import org.springframework.security.core.userdetails.User

class LoginUser(userdata: Userdata): User(
        userdata.username,
        userdata.password,
        AuthorityUtils.createAuthorityList("ADMIN")) {
    var loginUser: Userdata? = null

    init {
        this.loginUser = userdata
    }
}
