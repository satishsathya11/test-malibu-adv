import React from "react";

import { SectionPage } from "./section";

// will be getting initially 9 stories, but showing only 8 for loadmore functionality
export const CollectionPage = props => <SectionPage {...props} />;
