import React, { useContext } from "react"
import { Info, Repos, User, Search, Navbar } from "../components"
import loadingImage from "../images/preloader.gif"
import { GithubContext } from "../context/context"

const Dashoard: React.FC = () => {
	const { loading } = useContext(GithubContext)
	return (
		<main>
			<Navbar></Navbar>
			<Search></Search>
			{loading ? (
				<img src={loadingImage} alt="loading" className="loading-img" />
			) : (
				<>
					<Info></Info>
					<User></User>
					<Repos></Repos>
				</>
			)}
		</main>
	)
}

export default Dashoard
