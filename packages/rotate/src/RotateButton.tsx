/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Button, LocalizationContext, Position, Tooltip } from '@react-pdf-viewer/core';

import { RenderRotateProps } from './Rotate';
import RotateBackwardIcon from './RotateBackwardIcon';
import RotateForwardIcon from './RotateForwardIcon';
import RotateDirection from './RotateDirection';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const RotateButton: React.FC<RenderRotateProps> = ({ direction, onClick }) => {
    const l10n = React.useContext(LocalizationContext);

    const backwardLabel = l10n && l10n.rotate ? l10n.rotate.rotateBackward : 'Rotate counterclockwise';
    const forwardLabel = l10n && l10n.rotate ? l10n.rotate.rotateForward : 'Rotate clockwise';
    const label = (direction === RotateDirection.Backward) ? backwardLabel : forwardLabel;
    const icon = (direction === RotateDirection.Backward) ? <RotateBackwardIcon /> : <RotateForwardIcon />;

    return (
        <Tooltip
            position={Position.BottomCenter}
            target={<Button onClick={onClick}>{icon}</Button>}
            content={() => label}
            offset={TOOLTIP_OFFSET}
        />
    );
};

export default RotateButton;
