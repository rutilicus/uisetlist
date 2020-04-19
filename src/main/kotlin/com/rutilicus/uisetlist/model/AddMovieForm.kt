package com.rutilicus.uisetlist.model

import org.springframework.format.annotation.DateTimeFormat
import java.time.LocalDate
import javax.validation.constraints.NotNull

open class AddMovieForm {
    @NotNull
    var movieId = ""

    @NotNull
    var movieName = ""

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    var date: LocalDate? = LocalDate.ofEpochDay(0L)
        set(value) {
            if (value != null) {
                field = value
            }
        }
}
