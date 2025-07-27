import { Link, type LinkProps } from 'react-router-dom'

export const LinkWithBackToast = (props: LinkProps) => {
	return <Link {...props} state={{ ...props.state, showBackToast: true }} />
}
