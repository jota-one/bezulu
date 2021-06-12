<script>
	import Player from "./Player";

	const tracks = [...Array(620).keys()].map((i) => ({
		id: i,
		selected: i === 5,
		artist: "artist",
		title: "title",
		duration: 10,
		albumId: undefined,
		dates: {
			added: undefined,
			updated: undefined,
		},
		coverUrl: "coverUrl",
		audioUrl: "audioUrl",
	}));
</script>

<Player {tracks} />

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
