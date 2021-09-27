import React, { useState, useEffect } from "react"
import mockUser from "./mockData.js/mockUser"
import mockRepos from "./mockData.js/mockRepos"
import mockFollowers from "./mockData.js/mockFollowers"
import axios from "axios"

const rootUrl = "https://api.github.com"

type rateLimitType = {
	rate: {
		remaining: number
	}
}

export type User = typeof mockUser

type Followers = typeof mockFollowers
type Repos = typeof mockRepos
type Object = {
	githubUser: User
	repos: Repos
	followers: Followers
	setFollowers: React.Dispatch<React.SetStateAction<Followers>>
	setGithubUser: React.Dispatch<React.SetStateAction<User>>
	setRepos: React.Dispatch<React.SetStateAction<Repos>>
	requests: number
	error: {
		show: boolean
		msg: string
	}
	searchGithubUser: (user: string) => Promise<void>
	loading: boolean
}

const GithubContext = React.createContext({} as Object)

const GithubProvider: React.FC = ({ children }) => {
	const [githubUser, setGithubUser] = useState(mockUser)
	const [repos, setRepos] = useState(mockRepos)
	const [followers, setFollowers] = useState(mockFollowers)
	const [requests, setRequests] = useState(0)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState({ show: false, msg: "" })
	//errors

	const searchGithubUser = async (user: string) => {
		setLoading(true)
		toggleError()
		try {
			await Promise.allSettled([
				axios.get<User>(rootUrl + "/users/" + user),
				axios.get<Followers>(
					rootUrl + "/users/" + user + "/followers?per_page=100"
				),
				axios.get<Repos>(
					rootUrl + "/users/" + user + "/repos?per_page=100"
				),
			]).then((data) => {
				const [user, followers, repos] = data
				if (user.status === "fulfilled") {
					setGithubUser(user.value.data)
				} else {
					throw new Error(user.reason)
				}
				if (followers.status === "fulfilled")
					setFollowers(followers.value.data)
				if (repos.status === "fulfilled") setRepos(repos.value.data)
			})
			checkRequests()
			setLoading(false)
		} catch (error) {
			toggleError(true, "There is no such user")
			checkRequests()
			setLoading(false)
		}
	}

	const checkRequests = () => {
		axios
			.get<rateLimitType>(rootUrl + "/rate_limit")
			.then((response) => {
				let {
					data: {
						rate: { remaining },
					},
				} = response
				setRequests(remaining)

				if (remaining === 0) {
					toggleError(true, "sorry, you've run out of requests")
				}
			})
			.catch((err: Error) => console.log(err))
	}
	function toggleError(show: boolean = false, msg: string = ""): void {
		setError({ show, msg })
	}
	useEffect(checkRequests, [])
	return (
		<GithubContext.Provider
			value={{
				githubUser,
				repos,
				followers,
				setFollowers,
				setGithubUser,
				setRepos,
				requests,
				error,
				searchGithubUser,
				loading,
			}}>
			{children}
		</GithubContext.Provider>
	)
}

export { GithubContext, GithubProvider }
