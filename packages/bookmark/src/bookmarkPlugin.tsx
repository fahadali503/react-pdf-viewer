/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { createStore, PdfJs, type Plugin, type PluginFunctions, type PluginOnDocumentLoad } from '@react-pdf-viewer/core';
import * as React from 'react';
import { BookmarkListWithStore } from './BookmarkListWithStore';
import { type IsBookmarkExpanded } from './types/IsBookmarkExpanded';
import { type RenderBookmarkItem } from './types/RenderBookmarkItemProps';
import { type StoreProps } from './types/StoreProps';

export interface BookmarksProps {
    isBookmarkExpanded?: IsBookmarkExpanded;
    renderBookmarkItem?: RenderBookmarkItem;
}

export interface BookmarkPlugin extends Plugin {
    Bookmarks: (props?: BookmarksProps) => React.ReactElement;
    bookmarks: PdfJs.Outline[]
}

export const bookmarkPlugin = (): BookmarkPlugin => {
    const [_bookmarks, _setBookmarks] = React.useState<PdfJs.Outline[]>([]);
    const store = React.useMemo(
        () =>
            createStore<StoreProps>({
                bookmarkExpandedMap: new Map(),
            }),
        [],
    );

    const BookmarksDecorator = (props?: BookmarksProps) => (
        <BookmarkListWithStore
            isBookmarkExpanded={props?.isBookmarkExpanded}
            renderBookmarkItem={props?.renderBookmarkItem}
            store={store}
            _setBookmarks={_setBookmarks}
        />
    );

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('jumpToDestination', pluginFunctions.jumpToDestination);
        },
        onDocumentLoad: (props: PluginOnDocumentLoad) => {
            store.update('doc', props.doc);
        },
        Bookmarks: BookmarksDecorator,
        bookmarks: _bookmarks
    };
};
