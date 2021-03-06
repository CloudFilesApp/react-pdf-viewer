/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import useKeyUp from '../hooks/useKeyUp';
import ThemeContext from '../theme/ThemeContext';

interface PopoverOverlayProps {
    closeOnEscape: boolean;
    onClose(): void;
}

const PopoverOverlay: React.FC<PopoverOverlayProps> = ({ closeOnEscape, onClose }) => {
    const theme = React.useContext(ThemeContext);

    useKeyUp(27, () => closeOnEscape && onClose());

    return (
        <div className={`${theme.prefixClass}-popover-overlay`} />
    );
};

export default PopoverOverlay;
