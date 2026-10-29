import { Link } from 'react-router-dom';

/**
 * Renders a router Link when `to` is given, an anchor when `href` is given, otherwise a button.
 * variant: primary | secondary | ghost | whatsapp   size: md | lg | sm
 */
export default function Button({ to, href, variant = 'primary', size = 'md', className = '', children, ...rest }) {
  const classes = `btn btn--${variant} btn--${size} ${className}`.trim();
  if (to) return <Link to={to} className={classes} {...rest}>{children}</Link>;
  if (href) return <a href={href} className={classes} {...rest}>{children}</a>;
  return <button type="button" className={classes} {...rest}>{children}</button>;
}
