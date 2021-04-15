<script>
	import ZPlayer from './ZPlayer'

	const tracks = [...Array(100).keys()].map(i => ({
		id: i,
		artist: 'artist',
		title: 'title',
		duration: 10,
		albumId: undefined,
		dates:{
			added: undefined,
			updated: undefined
		}, 
		coverUrl: 'coverUrl',
		audioUrl: 'audioUrl'
	}))
</script>

<ZPlayer {tracks} />

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
</style>