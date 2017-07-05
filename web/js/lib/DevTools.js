/*eslint-disable */
import React from 'react';

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    const { createDevTools } = require('redux-devtools');
    const LogMonitor = require('redux-devtools-log-monitor').default;
    const DockMonitor = require('redux-devtools-dock-monitor').default;

    const DevTools = createDevTools(
        <DockMonitor
            defaultIsVisible={false}
            toggleVisibilityKey="ctrl-h"
            changePositionKey="ctrl-q"
        >
            <LogMonitor />
        </DockMonitor>
    );

    module.exports = DevTools;
} else {
    module.exports = () => <div />;
}
