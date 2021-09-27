import { useContext } from "react"
import styled from "styled-components"
import { GithubContext } from "../context/context"
import { Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts"

export type chartDataType = {
	label: string
	value: number
}

type reduceFunc = {
	[key: string]: chartDataType
}

const Repos = () => {
	const { repos } = useContext(GithubContext)
	let languages = repos.reduce((total: reduceFunc, repo) => {
		const { language } = repo
		if (!language) return total
		total[language] = total[language]
			? { ...total[language], value: total[language].value + 1 }
			: { label: language, value: 1 }
		return total
	}, {})
	const languagesArray = Object.values(languages)
		.sort((a, b) => b.value - a.value)
		.slice(0, 5)
	let starsPerLang = repos.reduce((total: reduceFunc, repo) => {
		const { language, stargazers_count } = repo
		if (!language) return total
		total[language] = total[language]
			? {
					...total[language],
					value: total[language].value + stargazers_count,
			  }
			: { label: language, value: stargazers_count }
		return total
	}, {})
	const starsPerLangArray = Object.values(starsPerLang)
		.sort((a, b) => b.value - a.value)
		.slice(0, 5)
	const mostPopularArray = repos
		.map((repo, index): chartDataType => {
			return { label: repo.name, value: repo.stargazers_count }
		})
		.sort((a, b) => b.value - a.value)
		.slice(0, 5)
	const mostForked = repos
		.map((repo, index) => {
			return { label: repo.name, value: repo.forks }
		})
		.sort((a, b) => b.value - a.value)
		.slice(0, 5)
	return (
		<section className="section">
			<Wrapper className="section-center">
				<Pie3D data={languagesArray} />
				<div>
					<Column3D data={mostPopularArray} />
				</div>
				<Doughnut2D data={starsPerLangArray} />
				<div>
					<Bar3D data={mostForked}></Bar3D>
				</div>
			</Wrapper>
		</section>
	)
}

const Wrapper = styled.div`
	display: grid;
	justify-items: center;
	gap: 2rem;
	@media (min-width: 800px) {
		grid-template-columns: 1fr 1fr;
	}

	@media (min-width: 1200px) {
		grid-template-columns: 2fr 3fr;
	}

	div {
		width: 100% !important;
		height: 400px;
	}
	.fusioncharts-container {
		width: 100% !important;
		div {
			width: auto !important;
			height: auto !important;
		}
	}
	svg {
		width: 100% !important;
		border-radius: var(--radius) !important;
	}
`

export default Repos
