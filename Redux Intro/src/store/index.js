import { configureStore } from "@reduxjs/toolkit";

import counter from "./counter";
import auth from "./auth";

const store = configureStore({
  reducer: { counter, auth },
});

export default store;
