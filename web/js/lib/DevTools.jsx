import React from 'react';
import { createDevTools, persistState } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

export default createDevTools(
    <DockMonitor defaultIsVisible={false} toggleVisibilityKey='ctrl-h' changePositionKey='ctrl-q'>
        <LogMonitor/>
    </DockMonitor>
);
