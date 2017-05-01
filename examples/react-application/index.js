import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Coroutine from 'react-coroutine';
import { ActorSystem, MessageDispatcher, ExecutionContext, AnimationFrameExecutor, Message } from 'actor-system';
import Application from './modules/Application.react';
import Storage from './modules/Storage';

const executor = new AnimationFrameExecutor();
const context = new ExecutionContext(executor);
const dispatcher = new MessageDispatcher(context);
const system = new ActorSystem(dispatcher);
const storage = new Storage();

ReactDOM.render((
  <Application system={system} storage={storage}>
  </Application>
), document.querySelector('main'));
