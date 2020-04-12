package com.rutilicus.uisetlist.model

import javax.validation.constraints.NotNull

class AddMetaForm {
    @NotNull
    private var name = ""
    @NotNull
    private var content = ""

    fun getName() = name
    fun setName(name: String) {
        this.name = name
    }

    fun getContent() = content
    fun setContent(content: String) {
        this.content = content
    }
}
