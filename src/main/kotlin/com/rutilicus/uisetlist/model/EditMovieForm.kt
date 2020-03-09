package com.rutilicus.uisetlist.model

import javax.validation.constraints.NotNull

class EditMovieForm: AddMovieForm() {
    @NotNull
    private var originalId = ""

    fun getOriginalId() = originalId

    fun setOriginalId(originalId: String) {
        this.originalId = originalId
    }
}
