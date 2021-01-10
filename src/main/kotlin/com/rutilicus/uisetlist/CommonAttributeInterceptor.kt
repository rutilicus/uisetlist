package com.rutilicus.uisetlist

import org.springframework.web.servlet.HandlerInterceptor
import org.springframework.web.servlet.ModelAndView
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class CommonAttributeInterceptor: HandlerInterceptor {
    override fun postHandle(
            request: HttpServletRequest,
            response: HttpServletResponse,
            handler: Any,
            modelAndView: ModelAndView?) {
        modelAndView?.apply {
            if (this.viewName?.startsWith("redirect:") != true) {
                this.modelMap.addAttribute("appName", Commons.appName)
            }
        }
    }
}
