package com.rutilicus.uisetlist

import org.postgresql.ds.PGSimpleDataSource
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.stereotype.Component
import javax.sql.DataSource

@Component
@Configuration
class DataSourceConfig {
    companion object {
        private val REGEX = Regex("""postgres://(.*):(.*)@(.*):(.*)""")
    }

    @Bean
    public fun dataSource(): DataSource {
        val ds = PGSimpleDataSource()
        // デフォルト値を設定
        ds.setUrl("jdbc:postgresql://localhost:5432/uisetlist")
        ds.user = "postgres"
        ds.password = "postgres"

        val env = System.getenv("DATABASE_URL")
        if (env != null) {
            REGEX.matchEntire(env)
                    ?.destructured
                    ?.let { (user, pass, url1, url2) ->
                        ds.user = user
                        ds.password = pass
                        ds.setUrl("jdbc:postgresql://$url1:$url2?sslmode=require")
                    }
        }

        return ds
    }
}
