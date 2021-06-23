import {
    BaseEditor,
    BaseElement,
    BaseText,
    Editor,
    Element,
    Element as SlateElement,
    Point,
    Range,
    Transforms,
} from 'slate'
import {ReactEditor, useReadOnly, useSlate, useSlateStatic} from "slate-react";
import {ReactComponent as CheckListSVG} from '../checklist.svg';
import styles from './CheckLists.module.scss';
import {Button, isBlockActive, LIST_TYPES} from "../common";

function isCheckListItem(n: BaseEditor | BaseElement | BaseText) {
    // @ts-ignore
    return !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'check-list-item';
}

export const withChecklists = editor => {
    const {deleteBackward} = editor

    editor.deleteBackward = (...args) => {
        const {selection} = editor

        if (selection && Range.isCollapsed(selection)) {
            // @ts-ignore
            const [match] = Editor.nodes(editor, {
                match: n => isCheckListItem(n),
            })

            if (match) {
                const [, path] = match
                const start = Editor.start(editor, path)

                if (Point.equals(selection.anchor, start)) {
                    const newProperties: Partial<SlateElement> = {
                        type: 'paragraph',
                    }
                    Transforms.setNodes(editor, newProperties, {
                        match: n => isCheckListItem(n),
                    })
                    return
                }
            }
        }

        deleteBackward(...args)
    }

    return editor
}

export const CheckListItemElement = ({attributes, children, element}) => {
    const editor = useSlateStatic()
    const readOnly = useReadOnly()
    const {checked} = element
    return (
        <div
            {...attributes}
            className={styles.checkListItem}
        >
              <span contentEditable={false} style={{marginRight: '0.75em'}}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={event => {
                        const path = ReactEditor.findPath(editor, element)
                        const newProperties: Partial<SlateElement> = {
                            // @ts-ignore
                            checked: event.target.checked,
                        }
                        Transforms.setNodes(editor, newProperties, {at: path})
                    }}
                />
              </span>
            <span
                contentEditable={!readOnly}
                suppressContentEditableWarning
                className={styles.content}
            >
                {children}
              </span>
        </div>
    )
}

const list_type = ["check-list-item"];

const toggleCheckItem = (editor, format) => {
    const isActive = isBlockActive(editor, format)

    debugger
    if (isActive) {
        const newProperties: Partial<SlateElement> = {
            type: 'paragraph',
        }

        Transforms.unsetNodes(editor, 'checked', {
            match: (n) => list_type.includes(
                !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
            ),
            split: false,
        })
        Transforms.setNodes(editor, newProperties)
    } else {
        const newProperties: Partial<SlateElement> = {
            type: 'check-list-item',
            checked: false,
        }
        Transforms.setNodes(editor, newProperties)
    }

}

export const CheckListButton = () => {
    const editor = useSlate();
    return (
        <Button onMouseDown={(e) => {
            e.preventDefault();
            toggleCheckItem(editor, "check-list-item");
        }}>
            <CheckListSVG/>
        </Button>
    );
};
