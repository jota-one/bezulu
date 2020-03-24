<template>
  <div id="app">
    <div class="heading">
      <h1>
        <span class="bold">
          Be
        </span>
        <span class="bold">
          Zulu!
        </span>
        <span>
          Podcast
        </span>
      </h1>
    </div>
    <div class="grid">
      <Episode
        active
        ref="player"
        :song="episodes[selected]"
        :index="selected"
        :playing="playing"
        @playPause="playing = !playing" />
      <Episode
        v-for="(episode, index) in filteredEpisodes"
        :key="index"
        :song="episode"
        :index="episode.index"
        :selected="selected === index"
        @select="selected = index; playing = true" />
      <div style="clear:left"/>
    </div>
  </div>
</template>

<script>
import Amplitude from 'amplitudejs'
import Episode from '@/components/Episode'

export default {
  name: 'App',

  components: { Episode },

  data: () => ({
    playing: false,
    selected: 0,
    episodes: [
      // {
      //   name: 'ZuluMix 41',
      //   artist: 'DJ Djive',
      //   genres: ['House', 'Techno'],
      //   url: '/ZuluMix_41_Dj_Djive.wav',
      //   cover_art_url: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
      // },
      {
        name: 'My Story Of House Music Part 2',
        artist: 'Lionites',
        genres: ['House', 'Techno'],
        url: '/test/MyStoryOfHouseMusic-02_House_Lionites.m4a',
        cover_art_url: 'http://www.zuluparty.ch/media/Images/CD_Covers/MSOHM-part-2.jpg',
      },
      {
        name: 'ZuluMix 40',
        artist: 'DJ Djive',
        genres: ['Techno'],
        url: '/test/ZuluMix-40_Techno_Djive.m4a',
        cover_art_url: 'http://www.zuluparty.ch/media/Images/CD_Covers/ZM40.jpg',
      },
      {
        name: 'ZuluMix 39',
        artist: 'DJ Djive',
        genres: ['Techno'],
        url: '/test/ZuluMix-39_Techno_Djive.m4a',
        cover_art_url: 'http://www.zuluparty.ch/media/Images/CD_Covers/ZM39.jpg'
      },
      {
        name: 'ZuluMix 38',
        artist: 'DJ Djive',
        genres: ['Techno'],
        url: '/test/ZuluMix-38_Techno_Djive.m4a',
        cover_art_url: 'http://www.zuluparty.ch/media/Images/CD_Covers/ZM38.jpg'
      },
      {
        name: 'ZuluMix 37',
        artist: 'Lionites',
        genres: ['Drum&Bass'],
        url: '/test/ZuluMix-37_DnB_Lionites.m4a',
        cover_art_url: 'http://www.zuluparty.ch/media/Images/CD_Covers/ZM37.jpg'
      },
      {
        url: '/test/MyStoryOfHouseMusic-02_House_Lionites.m4a',
        cover_art_url: 'http://www.zuluparty.ch/media/Images/CD_Covers/ZM36.jpg',
      },
      {
        url: '/test/ZuluMix-40_Techno_Djive.m4a',
        cover_art_url: 'http://www.zuluparty.ch/media/Images/CD_Covers/ZM27.jpg',
      },
      {
        url: '/test/ZuluMix-39_Techno_Djive.m4a',
        cover_art_url: 'http://www.zuluparty.ch/media/Images/CD_Covers/ZM26.jpg'
      },
      {
        url: '/test/ZuluMix-38_Techno_Djive.m4a',
        cover_art_url: 'http://www.zuluparty.ch/media/Images/CD_Covers/ZuluMix22.png'
      },
      {
        url: '/test/ZuluMix-37_DnB_Lionites.m4a',
        cover_art_url: 'http://www.zuluparty.ch/media/Images/CD_Covers/ZuluMix21.jpg'
      }
    ]
  }),

  computed: {
    filteredEpisodes () {
      return this.episodes
        .map((episode, index) => ({ ...episode, ...{ index }}))
    }
  },

  mounted () {
    Amplitude.init({
      songs: this.episodes
    })

    window.Amplitude = Amplitude
  }
}
</script>

<style lang="postcss">

@import url('https://fonts.googleapis.com/css?family=Oswald:200,400,700&display=swap');

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: Oswald, system-ui, system;
  font-size: 15px;
  font-weight: 200;
  background-color: rgb(10,10,10);
}

button:focus {
  outline: none;
}

#app {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  margin: 0 auto;

  @media screen and (min-width: 75vh) {
    max-width: 75vh;
  }

  @media screen and (min-width: 100vh) {
    max-width: 100vh;
  }

  @media screen and (min-width: 125vh) {
    max-width: 125vh;
  }

  @media screen and (min-width: 150vh) {
    max-width: 150vh;
  }
}

/* Heading */
.heading {
  position: fixed;
  top: 4vh;
  left: 4vh;
  transform: skew(0, -10deg);
  z-index: 2;
  color: rgb(200,200,200);
  text-shadow: 0 0 1rem rgb(0,0,0);
  mix-blend-mode: luminosity;
  pointer-events: none;

  @media screen and (min-width: 75vh) {
    left: calc(50vw - 33vh);
  }

  @media screen and (min-width: 100vh) {
    left: calc(50vw - 46vh);
  }

  @media screen and (min-width: 125vh) {
    left: calc(50vw - 58.25vh);
  }

  @media screen and (min-width: 150vh) {
    left: calc(50vw - 70.75vh);
  }

  h1 {
    margin: 0;
    padding: 0;
    font-size: 5vh;
    line-height: 1;
    font-weight: 200;
    text-transform: uppercase;

    .bold {
      display: block;
      font-size: 120%;
      font-weight: 700;
    }
  }
}

/* Grid */
.grid {
  & > * {
    float: left;
  }
}
</style>
