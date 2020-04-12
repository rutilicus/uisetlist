package com.rutilicus.uisetlist.model

import javax.validation.constraints.NotNull

class DelMetaForm {
    @NotNull
    private var name = ""

    fun getName() = name
    fun setName(name: String) {
        this.name = name
    }
}
