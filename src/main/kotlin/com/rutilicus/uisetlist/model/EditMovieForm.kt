package com.rutilicus.uisetlist.model

import javax.validation.constraints.NotNull

class EditMovieForm: AddMovieForm() {
    @NotNull
    var originalId = ""
}
