// Imports:
import classes from "./PageBody.module.css";
import { Outlet } from "react-router-dom";
import { Box } from "@mantine/core";

// PageBody component:
export function PageBody() {
  return (
    <Box className={classes.pageBody}>
      {/* Main content of all pages */}
      <Outlet />
    </Box>
  );
}
