package com.rutilicus.uisetlist.model

import com.rutilicus.uisetlist.Constants.Companion.ID_LEN
import javax.persistence.*

@Entity
@Table(name = "song")
@IdClass(value = SongKey::class)
class Song {
    @Id
    @Column(name = "movieid")
    var movieId = ""
        set(value) {
            if (value.length == ID_LEN) {
                field = value
            }
        }

    @Id
    @Column(name = "time")
    var time = 0

    @Column(name = "songname")
    var songName = ""

    @Column(name = "writer")
    var writer = ""

    @ManyToOne
    @JoinColumn(name = "movieid", insertable = false, updatable = false)
    var movie = Movie()
}
