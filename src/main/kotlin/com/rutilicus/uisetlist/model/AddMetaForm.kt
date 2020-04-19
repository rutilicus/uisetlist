package com.rutilicus.uisetlist.model

import javax.validation.constraints.NotNull

class AddMetaForm {
    @NotNull
    var name = ""
    @NotNull
    var content = ""
}
