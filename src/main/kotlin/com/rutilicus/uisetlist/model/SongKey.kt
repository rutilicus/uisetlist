package com.rutilicus.uisetlist.model

import com.rutilicus.uisetlist.Constants
import java.io.Serializable

class SongKey : Serializable {
    var movieId = ""
        set(value) {
            if (value.length == Constants.ID_LEN) {
                field = value
            }
        }

    var time = 0
}
