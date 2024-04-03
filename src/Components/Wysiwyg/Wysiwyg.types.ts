export enum NodeName {
    P = "P",
    H1 = "H1",
    H2 = "H2",
    H3 = "H3",
    H4 = "H4",
    H5 = "H5",
    H6 = "H6",
}

export enum Command {
    BOLD = "bold",
    ITALIC = "italic",
    UNDERLINE = "underline",

    COLOUR = "foreColor",
    BACKGROUND_COLOUR = "hiliteColor",

    JUSTIFY = "justifyFull",
    JUSTIFY_LEFT = "justifyLeft",
    JUSTIFY_CENTER = "justifyCenter",
    JUSTIFY_RIGHT = "justifyRight",

    INSERT_HTML = "insertHTML",
    FORMAT_BLOCK = "formatBlock",

    CUSTOM__INSERT_NODE = "customInsertNode"
}
