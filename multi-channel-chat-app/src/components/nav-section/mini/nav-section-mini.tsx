/* eslint-disable @typescript-eslint/no-explicit-any */
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";

import { NavList } from "./nav-list";
import { NavUl, NavLi } from "../styles";
import { navSectionClasses } from "../classes";
import { navSectionCssVars } from "../css-vars";

// ----------------------------------------------------------------------

export function NavSectionMini({
  sx,
  data,
  render,
  slotProps,
  enabledRootRedirect,
  cssVars: overridesVars,
}: any) {
  const theme = useTheme();

  const cssVars = {
    ...navSectionCssVars.mini(theme),
    ...overridesVars,
  };

  return (
    <Stack
      component="nav"
      className={navSectionClasses.mini.root}
      sx={{ ...cssVars, ...sx }}
    >
      <NavUl sx={{ flex: "1 1 auto", gap: "var(--nav-item-gap)" }}>
        {data.map((group: any) => (
          <Group
            key={group.subheader ?? group.items[0].title}
            render={render}
            cssVars={cssVars}
            items={group.items}
            slotProps={slotProps}
            enabledRootRedirect={enabledRootRedirect}
          />
        ))}
      </NavUl>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function Group({
  items,
  render,
  slotProps,
  enabledRootRedirect,
  cssVars,
}: any) {
  return (
    <NavLi>
      <NavUl sx={{ gap: "var(--nav-item-gap)" }}>
        {items.map((list: any) => (
          <NavList
            key={list.title}
            depth={1}
            data={list}
            render={render}
            cssVars={cssVars}
            slotProps={slotProps}
            enabledRootRedirect={enabledRootRedirect}
          />
        ))}
      </NavUl>
    </NavLi>
  );
}
