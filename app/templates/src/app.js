import React from 'react';
import ReactDom from 'react-dom';
import Demo from './components/Demo';
import config from './settings/config.json';

import './styles/special.scss';

function App() {
  return (
    <div className="demo">
      <p>{config.helloWorld}</p>
      <Demo />
    </div>
  );
}

ReactDom.render(<App />, document.getElementById('root'));
