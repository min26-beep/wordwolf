import React, { forwardRef } from "react";

/** variant: primary | secondary | ghost | danger, size: lg | md | sm */
const Button = forwardRef(function Button({ variant = "primary", size = "md", className = "", ...props }, ref) {
  return <button ref={ref} type="button" className={`btn btn-${variant} btn-${size} ${className}`} {...props} />;
});
export default Button;
