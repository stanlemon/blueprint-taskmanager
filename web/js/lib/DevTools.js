/*eslint-disable */
import React from 'react';

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    const { createDevTools } = require('redux-devtools');
    const LogMonitor = require('redux-devtools-log-monitor').default;
    const DockMonitor = require('redux-devtools-dock-monitor').default;

    module.exports = createDevTools(
        <DockMonitor
            defaultIsVisible={false}
            toggleVisibilityKey="ctrl-h"
            changePositionKey="ctrl-q"
        >
            <LogMonitor />
        </DockMonitor>
    );
} else {
    const { applyMiddleware } = require('redux');

    module.exports = () => <div />;

    // This is a no-op store enhancer we're passing in place of the DevTools.instrument() method
    module.exports.instrument = () =>
        applyMiddleware(() => nextDispatch => action => nextDispatch(action));
}
