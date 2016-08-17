import React from 'react';
import { isDev } from './Utils';

if (isDev()) {
    const { createDevTools, persistState } = require('redux-devtools');
    const LogMonitor = require('redux-devtools-log-monitor').default;
    const DockMonitor = require('redux-devtools-dock-monitor').default;

    const DevTools = createDevTools(
        <DockMonitor defaultIsVisible={false} toggleVisibilityKey='ctrl-h' changePositionKey='ctrl-q'>
            <LogMonitor />
        </DockMonitor>
    );

    module.exports = DevTools;
} else {
    module.exports = function () {
        return (<div />);
    };
}
