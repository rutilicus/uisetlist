package com.rutilicus.uisetlist.controller

import com.rutilicus.uisetlist.model.Userdata
import com.rutilicus.uisetlist.service.UserdataService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("initUser")
class InitUserController(val service: UserdataService) {
    @GetMapping("/")
    fun initUserPage(model: Model): String {
        val encoder = BCryptPasswordEncoder()

        val envUserName = System.getenv("INIT_USER_NAME")
        val envUserPass = System.getenv("INIT_USER_PASS")

        if (!envUserName.isNullOrBlank() && !envUserPass.isNullOrBlank()) {
            // 環境変数設定がされている
            service.addUser(Userdata().apply {
                this.username = envUserName
                this.password = encoder.encode(envUserPass)
            })
            model.addAttribute("success", true)
        } else {
            // 環境変数設定がされていないまたは空文字列が設定されている
            model.addAttribute("success", false)
        }
        return "initUser"
    }
}