// @ts-check
import '../style.css';
import { createMachine, assign, interpret, send } from 'xstate';
import { raise } from 'xstate/lib/actions';
import elements from '../utils/elements';

const playerMachine = createMachine({
  initial: 'loading',
  states: {
    loading: {
      entry: ['loadData'],
      on: {
        LOADED: {
          actions: 'assignSongData',
          target: 'playing',
        },
      },
    },
    paused: {
      on: {
        PLAY: { target: 'playing' },
      },
    },
    playing: {
      entry: ['playAudio'],
      exit: ['pauseAudio'],
      on: {
        PAUSE: { target: 'paused' },
      },
    },
  },
  on: {
    SKIP: {
      actions: ['skipSong', raise('LOADED')],
      target: 'loading',
    },
    LIKE: {
      actions: 'likeSong'
    },
    UNLIKE: {
      actions: 'unlikeSong'
    },
    DISLIKE: {
      actions: ['dislikeSong', raise('SKIP')]
    },
    VOLUME: {
      actions: 'assignVolume'
    },
  },
}).withConfig({
  actions: {
    loadData: () => console.log('Loading Data'),
    assignSongData: () => console.log('Assigning Song Data'),
    playAudio: () => {console.log('Playing Audio')},
    pauseAudio: () => {console.log('Pausing Audio')},
    skipSong: () => {console.log('Skip Audio')},
    likeSong: () => {console.log('Like Song')},
    unlikeSong: () => {console.log('Unlike Song')},
    dislikeSong: () => {console.log('Dislike Song')},
    assignVolume: () => {console.log('Assigning Volume')},


  },
});

elements.elPlayButton.addEventListener('click', () => {
  service.send({ type: 'PLAY' });
});
elements.elPauseButton.addEventListener('click', () => {
  service.send({ type: 'PAUSE' });
});
elements.elSkipButton.addEventListener('click', () => {
  service.send({ type: 'SKIP' });
});
elements.elLikeButton.addEventListener('click', () => {
  service.send({ type: 'LIKE' });
});
elements.elDislikeButton.addEventListener('click', () => {
  service.send({ type: 'DISLIKE' });
});

const service = interpret(playerMachine).start();

service.subscribe((state) => {
  console.log(state.actions);

  elements.elLoadingButton.hidden = !state.matches('loading');
  elements.elPlayButton.hidden = !state.can({ type: 'PLAY' });
  elements.elPauseButton.hidden = !state.can({ type: 'PAUSE' });
});

service.send('LOADED');
