import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Coroutine from 'react-coroutine';
import { ActorSystem, MessageDispatcher, ExecutionContext, AnimationFrameExecutor, Message } from 'actor-system';
import Application from './modules/Application.react';
import Storage from './modules/Storage';
import { SomeMessage } from './modules/Messages';

const executor = new AnimationFrameExecutor();
const context = new ExecutionContext(executor);
const dispatcher = new MessageDispatcher(context);
const system = new ActorSystem(dispatcher);
const storage = new Storage();

async function Main(system) {
  setInterval(() => {
    system.dispatcher.dispatch(new SomeMessage(performance.now()));
  }, 1000);
}

ReactDOM.render((
  <Application system={system} storage={storage}>
  </Application>
), document.querySelector('main'));

system.spawn(Main);
