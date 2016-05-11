/* @flow weak */
import React from 'react';

export default function Error(props) {
    const { message } = props;

    return (
        <div className="alert alert-danger" role="alert">
            {message}
        </div>
    );
}

Error.propTypes = {
    message: React.PropTypes.string,
};
