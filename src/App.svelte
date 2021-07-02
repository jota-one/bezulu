<script>
	import Player from "./Ple";
	import { basePath, items } from '../public/feed.json'

	// const tracks = [...Array(620).keys()].map((i) => ({
	// 	id: i,
	// 	selected: i === 5,
	// 	artist: "artist",
	// 	title: "title",
	// 	duration: 10,
	// 	albumId: undefined,
	// 	dates: {
	// 		added: undefined,
	// 		updated: undefined,
	// 	},
	// 	coverUrl: "coverUrl",
	// 	audioUrl: "audioUrl",
	// }));

	const tracks = items
</script>

<Player {tracks} {basePath} />

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		font-family: sans-serif;
		font-size: 13px;
		font-weight: 200;
	}

	:global(body) {
		background: black;
	}
</style>
