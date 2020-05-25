import React, { Component } from "react"
import { NavLink } from "react-router-dom"

/**
 * React Router Nav Link wrapper to forward the ref to fix "Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?"
 *
 * From https://material-ui.com/guides/composition/#caveat-with-refs
 */
const NavLinkMui = (props: any) =>  {
  const { forwardedRef, ..._props } = props;
  return <NavLink {..._props} ref={forwardedRef} />
}

export default NavLinkMui;