import React, {forwardRef, PropsWithChildren, Ref} from "react";
import styles from "./Toolbar.module.scss";
import {BaseEditor, Editor, Element as SlateElement, Text, Transforms} from "slate";
import {ReactEditor, useSlate} from "slate-react";
import {Property} from "csstype";

export interface BaseProps {
    [key: string]: unknown
}

export const ButtonGroup = ({children}: PropsWithChildren<BaseProps>) => {
    return (
        <span className="button-group">
            {children}
        </span>
    )
};

export const Button = forwardRef((props: PropsWithChildren<BaseProps>, ref: Ref<OrNull<HTMLButtonElement>>) => {
    const {active, disabled, className, ...others} = props;
    const activeClassName = active ? "active" : '';
    const disabledClassName = disabled ? "disabled" : '';
    return (
        <button
            ref={ref}
            type="button"
            className={`${styles.button} ${activeClassName} ${disabledClassName} ${className??''}`}
            {...others}
        />
    );
});

type OrNull<T> = T | null
export const Icon = React.forwardRef(
    (
        {className, ...props}: PropsWithChildren<BaseProps>,
        ref: Ref<OrNull<HTMLSpanElement>>
    ) => (
        <span
            {...props}
            ref={ref}
            className="material-icons"
        />
    )
)
export const LIST_TYPES = ['numbered-list', 'bulleted-list']
export const isBlockActive = (editor, format) => {
    // @ts-ignore
    const [match] = Editor.nodes(editor, {
        match: n =>
            !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })

    return !!match
}
export const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
}
const isMarkDisabled = (editor, format) => {
    const {selection} = editor;
    return !selection;
}
const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}
export const BlockButton = ({format, icon}) => {
    const editor = useSlate()
    let disabled = isMarkDisabled(editor, format);
    return (
        <Button
            active={isBlockActive(editor, format)}
            disabled={disabled}
            onMouseDown={event => {
                event.preventDefault()
                if (disabled) {
                    return;
                }
                toggleBlock(editor, format)
            }}
        >
            <Icon>{icon}</Icon>
        </Button>
    )
}
export const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(editor, format)
    const isList = LIST_TYPES.includes(format)

    Transforms.unwrapNodes(editor, {
        match: n =>
            LIST_TYPES.includes(
                !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
            ),
        split: true,
    })
    const newProperties: Partial<SlateElement> = {
        type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
    Transforms.setNodes(editor, newProperties)

    if (!isActive && isList) {
        const block = {type: format, children: []}
        Transforms.wrapNodes(editor, block)
    }
}
export const MarkButton = ({format, icon}) => {
    const editor = useSlate()
    let disabled = isMarkDisabled(editor, format);
    return (
        <Button
            active={isMarkActive(editor, format)}
            disabled={disabled}
            onMouseDown={event => {
                event.preventDefault()
                if (disabled) {
                    return;
                }
                toggleMark(editor, format)
            }}
        >
            <Icon>{icon}</Icon>
        </Button>
    )
}
export const preventEvent = event => {
    event.preventDefault();
    event.stopPropagation();
};
export type CustomElement = { type: 'paragraph'; textAlign?: Property.TextAlign; children: Text[] }
export type CodeElement = { type: 'code'; children: Text[] }
export type CheckedElement = {type: "check-list-item", checked: boolean, children: Text[]}
export type LinkElement = { type: "link", url: string, children: Text[] }
export type CustomText = { text: string, bold?: boolean }
declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor
        Element: CustomElement | CodeElement | CheckedElement | LinkElement,
        Text: CustomText,
        Node: CustomElement | CustomText | CheckedElement,
    }
}
