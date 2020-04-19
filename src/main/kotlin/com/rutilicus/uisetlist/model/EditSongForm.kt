package com.rutilicus.uisetlist.model

import javax.validation.constraints.NotNull

class EditSongForm: AddSongForm() {
    @NotNull
    var originalId = ""

    @NotNull
    var originalTime = 0
}
