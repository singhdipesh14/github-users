import React from "react"
import { Route, Redirect } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"

type props = {
	children: React.ReactNode
	exact: boolean
	path: string
}

const PrivateRoute: React.FC<props> = ({ children, ...rest }) => {
	const { isAuthenticated, user } = useAuth0()
	const isUser = isAuthenticated && user

	return (
		<Route
			{...rest}
			render={() => {
				return isUser ? children : <Redirect to="/login" />
			}}></Route>
	)
}
export default PrivateRoute
