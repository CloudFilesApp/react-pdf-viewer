/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import useIntersectionObserver, { VisibilityChanged } from './hooks/useIntersectionObserver';
import usePrevious from './hooks/usePrevious';
import Inner from './layouts/Inner';
import PageSize from './layouts/PageSize'; 
import PageSizeCalculator from './layouts/PageSizeCalculator';
import { RenderPage } from './layouts/RenderPage';
import DocumentLoader, { RenderError } from './loader/DocumentLoader';
import LocalizationMap from './localization/LocalizationMap';
import LocalizationProvider from './localization/LocalizationProvider';
import SpecialZoomLevel from './SpecialZoomLevel';
import ThemeProvider from './theme/ThemeProvider';
import PdfJs from './vendors/PdfJs';
import { Plugin } from './types/Plugin';

export interface DocumentLoadEvent {
    doc: PdfJs.PdfDocument;
}
export interface PageChangeEvent {
    currentPage: number;
    doc: PdfJs.PdfDocument;
}
export interface ZoomEvent {
    doc: PdfJs.PdfDocument;
    scale: number;
}

export interface CharacterMap {
    isCompressed: boolean;
    url: string;
}

export interface ViewerProps {
    characterMap?: CharacterMap;
    // The default zoom level
    // If it's not set, the initial zoom level will be calculated based on the dimesion of page and the container width
    defaultScale?: number | SpecialZoomLevel;
    fileUrl: string | Uint8Array;
    // Additional authentication headers
    httpHeaders?: Record<string, string | string[]>;
    // The page (zero-index based) that will be displayed initially
    initialPage?: number;
    // Plugins
    plugins?: Plugin[];
    localization?: LocalizationMap;
    // The prefix for CSS classes
    prefixClass?: string;
    renderError?: RenderError;
    renderPage?: RenderPage;
    renderLoader?(percentages: number): React.ReactElement;
    // Indicate the cross-site requests should be made with credentials such as cookie and authorization headers.
    // The default value is `false` 
    withCredentials?: boolean;
    // The text selection mode
    selectionMode?: SelectionMode;
    onDocumentLoad?(e: DocumentLoadEvent): void;
    onPageChange?(e: PageChangeEvent): void;
    onZoom?(e: ZoomEvent): void;
}

interface FileState {
    data: PdfJs.FileData;
    name: string;
    shouldLoad: boolean;
}

const Viewer: React.FC<ViewerProps> = ({
    characterMap,
    defaultScale,
    fileUrl,
    httpHeaders = {},
    initialPage = 0,
    localization,
    plugins = [],
    prefixClass,
    renderError,
    renderPage,
    renderLoader,
    withCredentials = false,
    onDocumentLoad = () => {/**/},
    onPageChange = () => {/**/},
    onZoom = () => {/**/},
}) => {
    const [file, setFile] = React.useState<FileState>({
        data: fileUrl,
        name: (typeof fileUrl === 'string') ? fileUrl : '',
        shouldLoad: false, 
    });

    const openFile = (fileName: string, data: Uint8Array) => {
        setFile({
            data,
            name: fileName,
            shouldLoad: true,
        });
    };
    const [visible, setVisible] = React.useState(false);

    const prevFile = usePrevious<FileState>(file);

    React.useEffect(() => {
        // If the document is changed
        if (prevFile.data !== fileUrl) {
            setFile({
                data: fileUrl,
                name: (typeof fileUrl === 'string') ? fileUrl : '',
                shouldLoad: visible,
            });
        }
    }, [fileUrl, visible]);

    const visibilityChanged = (params: VisibilityChanged): void => {
        setVisible(params.isVisible);
        if (params.isVisible) {
            setFile(currentFile => Object.assign({}, currentFile, { shouldLoad: true }));
        }
    };

    const containerRef = useIntersectionObserver({
        onVisibilityChanged: visibilityChanged,
    });

    return (
        <ThemeProvider prefixClass={prefixClass}>
            <LocalizationProvider localization={localization}>
                {(_) => ( // eslint-disable-line @typescript-eslint/no-unused-vars
                    <div
                        ref={containerRef}
                        data-testid='viewer'
                        style={{
                            height: '100%',
                            width: '100%',
                        }}
                    >
                    {
                        file.shouldLoad && (
                            <DocumentLoader
                                characterMap={characterMap}
                                file={file.data}
                                httpHeaders={httpHeaders}
                                render={(doc: PdfJs.PdfDocument) => (
                                    <PageSizeCalculator
                                        doc={doc}
                                        render={(ps: PageSize) => (
                                            <Inner
                                                defaultScale={defaultScale}
                                                doc={doc}
                                                initialPage={initialPage}
                                                pageSize={ps}
                                                plugins={plugins}
                                                renderPage={renderPage}
                                                viewerState={{
                                                    file,
                                                    pageIndex: initialPage,
                                                    pageHeight: ps.pageHeight,
                                                    pageWidth: ps.pageWidth,
                                                    rotation: 0,
                                                    scale: ps.scale,
                                                }}
                                                onDocumentLoad={onDocumentLoad}
                                                onOpenFile={openFile}
                                                onPageChange={onPageChange}
                                                onZoom={onZoom}
                                            />
                                        )}
                                    />
                                )}
                                renderError={renderError}
                                renderLoader={renderLoader}
                                withCredentials={withCredentials}
                            />
                        )
                    }
                    </div>
                )}
            </LocalizationProvider>
        </ThemeProvider>
    );
};

export default Viewer;
