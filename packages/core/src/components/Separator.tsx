/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import ThemeContext from '../theme/ThemeContext';

const Separator: React.FC = () => {
    const theme = React.useContext(ThemeContext);

    return (
        <div className={`${theme.prefixClass}-separator`} />
    );
};

export default Separator;
