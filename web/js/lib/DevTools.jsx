import React from 'react';

let DevTools;

if (process.env.NODE_ENV !== 'production') {
    let { createDevTools, persistState } = require('redux-devtools');
    let logMonitor = require('redux-devtools-log-monitor');
    let LogMonitor = logMonitor.default;
    let dockMonitor = require('redux-devtools-dock-monitor');
    let DockMonitor = dockMonitor.default;

    DevTools = createDevTools(
        <DockMonitor defaultIsVisible={false} toggleVisibilityKey='ctrl-h' changePositionKey='ctrl-q'>
            <LogMonitor/>
        </DockMonitor>
    );

    module.exports = DevTools;
} else {
    module.exports = <div/>;
}
