import React from "react";

import { PageState } from "./types";
import Page from "./Store/Page";


export const PageContext = React.createContext<PageState>({
    page: new Page()
})
