'use client';

import { React, useState } from 'react';
import { processCommand } from 'functions/Commands';

function Console() {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState([]);

  function handleCommand() {
    const result = processCommand(command);
    setOutput(output.concat(result));
    setCommand('');
  }

  function renderOutput() {
    return output.map((item, index) => (
      <div key={index} style={{ padding: '0.5rem' }}>{item}</div>
    ));
  }

  return (
    <div style={{ backgroundColor: 'black', color: 'white', fontFamily: 'monospace' }}>
      {renderOutput()}
      <input value={command} onChange={(e) => setCommand(e.target.value)} />
      <button onClick={handleCommand}>Submit</button>
    </div>
  );
}

export default Console;
