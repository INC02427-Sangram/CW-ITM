const ButtonTypes = {
    // Here apply means all types of action like save filter etc and cancel means clear cancel etc but not reject becoz for reject 
    // and pending we have different styling and color of buttons so use carefully.
    SAVE: "save",
    REQUEST: "save",
    TRY: "save",
    SEARCH: "save",
    APPLY: "save",
    YES: "save",
    NO: "clear",
    CLEAR: "clear",
    CANCEL: "clear",
    ADD: "clear",
    CHECK: "clear",
    VIEW: "clear",
    EDIT: "edit",
    REJECT: "reject",
    WAITING: "waiting",
    DELETE: "delete",
    DEFAULT: "clear",
};

const IconWrapperTypes={
    CONTAINED: "contained",
    OUTLINED: "outlined",
    DEFAULT:"outlined",
    
}

export {
    ButtonTypes,
    IconWrapperTypes,
}