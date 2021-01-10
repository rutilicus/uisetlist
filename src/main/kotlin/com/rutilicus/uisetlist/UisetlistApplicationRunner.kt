package com.rutilicus.uisetlist

import com.rutilicus.uisetlist.repository.ConfigRepository
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.stereotype.Component

@Component
class UisetlistApplicationRunner(val configRepository: ConfigRepository): ApplicationRunner {
    override fun run(args: ApplicationArguments?) {
        configRepository.findByKey(Constants.KEY_APP_NAME).let {
            Commons.appName = if (it.isEmpty()) {
                Constants.DEFAULT_APP_NAME
            } else {
                it.first().value
            }
        }
    }
}
