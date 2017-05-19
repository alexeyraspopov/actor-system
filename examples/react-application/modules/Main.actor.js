import { SomeMessage } from './Messages';

export default async function Main(system) {
  setInterval(() => {
    system.dispatcher.dispatch(new SomeMessage(performance.now()));
  }, 1000);
}
