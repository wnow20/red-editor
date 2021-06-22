import React, {CSSProperties, useCallback, useMemo, useState} from 'react';
import isHotkey from 'is-hotkey';
import {BaseEditor, createEditor, Descendant, Editor} from 'slate'

// Import the Slate components and React plugin.
import {Editable, ReactEditor, Slate, withReact} from 'slate-react'
import {withHistory} from 'slate-history'
import './RedEditor.css';
import {Toolbar} from "./Toolbar";
import initialValue from "./initialValue";


const Element = ({attributes, children, element}) => {
    const style = {} as CSSProperties;
    element.textAlign && (style.textAlign = element.textAlign);
    switch (element.type) {
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>
        case 'heading-1':
            return <h1 {...attributes} style={style}>{children}</h1>
        case 'heading-2':
            return <h2 {...attributes} style={style}>{children}</h2>
        case 'heading-3':
            return <h3 {...attributes} style={style}>{children}</h3>
        case 'heading-4':
            return <h4 {...attributes} style={style}>{children}</h4>
        case 'heading-5':
            return <h5 {...attributes} style={style}>{children}</h5>
        case 'list-item':
            return <li {...attributes}>{children}</li>
        case 'numbered-list':
            return <ol {...attributes}>{children}</ol>
        default:
            return <p {...attributes} style={style}>{children}</p>
    }
}

const Leaf = ({attributes, children, leaf}) => {
    const style: CSSProperties = {};
    leaf.size && (style.fontSize = leaf.size + "px");
    leaf.color && (style.color = leaf.color);
    leaf.fill && (style.backgroundColor = leaf.fill);
    leaf.strikethrough && (style.textDecoration = "line-through");
    if (leaf.bold) {
        children = <strong style={style}>{children}</strong>
    }

    if (leaf.code) {
        children = <code style={style}>{children}</code>
    }

    if (leaf.italic) {
        children = <em style={style}>{children}</em>
    }

    if (leaf.underline) {
        children = <u style={style}>{children}</u>
    }
    return <span {...attributes} style={style}>{children}</span>
}
const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}
const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
    // TODO strikethrough
}

const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
}

function RedEditor() {
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])
    const [value, setValue] = useState<Descendant[]>(initialValue as any)
    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])

    return (
        <div className="red-editor">
            <Slate editor={editor} value={value} onChange={setValue}>
                <Toolbar/>
                <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    onKeyDown={event => {
                        for (const hotkey in HOTKEYS) {
                            if (isHotkey(hotkey, event as any)) {
                                event.preventDefault()
                                const mark = HOTKEYS[hotkey]
                                toggleMark(editor, mark)
                            }
                        }
                    }}
                />
            </Slate>
        </div>
    );
}

export default RedEditor;
