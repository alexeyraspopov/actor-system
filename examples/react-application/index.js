import React from 'react';
import ReactDOM from 'react-dom';
import { ActorSystem, MessageDispatcher, ExecutionContext, AnimationFrameExecutor } from 'actor-system';
import Application from './modules/Application.react';
import Wrapper from './modules/Wrapper.react';
import Storage from './modules/Storage';
import Main from './modules/Main.actor';

const executor = new AnimationFrameExecutor();
const context = new ExecutionContext(executor);
const dispatcher = new MessageDispatcher(context);
const system = new ActorSystem(dispatcher);
const storage = new Storage();

ReactDOM.render((
  <Application system={system} storage={storage}>
    <Wrapper />
  </Application>
), document.querySelector('main'));

system.spawn(Main);
