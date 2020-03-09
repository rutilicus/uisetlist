package com.rutilicus.uisetlist.model

import javax.validation.constraints.NotNull

class EditSongForm: AddSongForm() {
    @NotNull
    private var originalId = ""

    @NotNull
    private var originalTime = 0

    fun getOriginalId() = originalId
    fun getOriginalTime() = originalTime

    fun setOriginalId(originalId: String) {
        this.originalId = originalId
    }

    fun setOriginalTime(originalTime: Int) {
        this.originalTime = originalTime
    }
}
