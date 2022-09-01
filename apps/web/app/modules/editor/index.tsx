import Document from '@tiptap/extension-document';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import type { EditorOptions } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { memo } from 'react';
import showdown from 'showdown';

interface Props {
    initialContent?: string;
    editable?: EditorOptions['editable'];
}

const converter = new showdown.Converter();

const PLACEHOLDER = 'Start by giving your page a title...';

const CustomDocument = Document.extend({
    content: 'heading block*',
});

// Don't want to rerender the editor over and over
export const Editor = memo(function Editor({ initialContent }: Props) {
    const editor = useEditor({
        ...(initialContent && { content: converter.makeHtml(initialContent) }),
        extensions: [
            LinkExtension,
            CustomDocument,
            StarterKit.configure({
                document: false,
            }),
            Placeholder.configure({
                // Placeholder won't work if the editor is initially disabled on load. If this
                // becomes an issue with the page viewer we can create a separate "Read Only" editor
                showOnlyWhenEditable: false,
                placeholder: ({ node }) => {
                    if (node.type.name === 'heading') {
                        return PLACEHOLDER;
                    }

                    return '';
                },
            }),
        ],
        editorProps: {
            attributes: {
                class: 'editor prose prose-zinc max-w-none focus:outline-none text-geo-grey-100 text-geo-body',
            },
        },
        onUpdate: ({ editor }) => converter.makeMarkdown(editor.getHTML()),
    });

    return <EditorContent editor={editor} />;
});

export function ReadOnlyEditor({ content }: { content: string; class?: string }) {
    const editor = useEditor({
        extensions: [LinkExtension, StarterKit],
        content: converter.makeHtml(content),
        editable: false,
        editorProps: {
            attributes: {
                class: 'editor',
            },
        },
    });

    return <EditorContent editor={editor} />;
}