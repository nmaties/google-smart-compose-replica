import ReactDOM from 'react-dom';
import ChatBox from './components/ChatBox/ChatBox';
import React from 'react';
const mountNode = document.getElementById('root');
ReactDOM.hydrate(
  <ChatBox />,
  mountNode
);