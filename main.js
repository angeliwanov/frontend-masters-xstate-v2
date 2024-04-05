import './style.css';

//state {status: 'idle'}
//envet: {type: 'FETCH'}
function transition(state, event) {
  switch (state.status) {
    case 'idle':
      if (event.type === 'FETCH') {
        console.log('Starting ot the fetch data');
        return {status : 'loading'}
      }
      return state
    case 'loading':
      break;
    default:
      break
  }
  return state;
}

const machine = {
  initial: 'idle',
  states: {
    idle: {
      FETCH: 'loading'
    },
    loading: {}
  }
}

function transition2(state, event){
  const nextStatus = machine.states[state.status].on?.[event.type] ?? state.status;

  return {
    status: nextStatus
  }
}

window.machine = machine;
window.transition = transition;
window.transition2 = transition2;