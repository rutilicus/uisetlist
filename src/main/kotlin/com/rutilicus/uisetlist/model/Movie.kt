package com.rutilicus.uisetlist.model

import com.rutilicus.uisetlist.Constants.Companion.ID_LEN
import java.sql.Date
import javax.persistence.*

@Entity
@Table(name = "movie")
class Movie {
    @Id
    @Column(name = "movieid")
    var movieId = ""
        set(value) {
            if (value.length == ID_LEN) {
                field = value
            }
        }

    @Column(name = "name")
    var name = ""

    @Column(name = "date")
    var date = Date(0L)

    @OneToMany(mappedBy = "movie")
    var songs = listOf<Song>()
}
