import {useSlate} from "slate-react";
import {Editor, Element as SlateElement, Transforms} from "slate";
import React, {forwardRef, PropsWithChildren, Ref, useRef, useState} from "react";
import "material-design-icons/iconfont/material-icons.css"
import {ReactComponent as FormatColorText} from "./format_color_text.svg";
import styles from "./Toolbar.module.scss";
import ReactDOM, {findDOMNode} from "react-dom";
import {SketchPicker} from 'react-color';

const ButtonGroup = ({children}: PropsWithChildren<BaseProps>) => {
    return (
        <span className="button-group">
            {children}
        </span>
    )
};

const HeadingTrigger = forwardRef((props: PropsWithChildren<BaseProps>, ref: Ref<OrNull<HTMLSpanElement>>) => {
    return (
        <Button
            ref={ref}
            {...props}
        >heading</Button>
    );
});

const TypeSize = ({editor}: { editor: Editor }) => {
    const typeRef = useRef<HTMLDivElement | null>()
    const typeTriggerRef = useRef<HTMLDivElement | null>()
    const [typePortalVisible, setTypePortalVisible] = useState(false);

    const sizeRef = useRef<HTMLDivElement | null>();
    const sizeTriggerRef = useRef<HTMLDivElement | null>();
    const [sizePortalVisible, setSizePortalVisible] = useState(false);

    function handleSizeClick(size: string) {
        Editor.addMark(editor, "size", size);
    }

    function handleHeadingClick(heading: string) {
        return function (event: React.MouseEvent<HTMLButtonElement>) {
            event.preventDefault();
            setTypePortalVisible(false);
            toggleBlock(editor, "heading-" + heading);
        };
    }

    return (
        <>
            <HeadingTrigger
                ref={typeTriggerRef}
                onMouseDown={event => {
                    event.preventDefault();
                    let ele = typeRef.current;
                    let trigger = findDOMNode(typeTriggerRef.current);
                    if (trigger instanceof HTMLElement) {
                        if (!typePortalVisible) {
                            ele.style.top = trigger.offsetTop + trigger.offsetHeight + "px";
                            ele.style.left = trigger.offsetLeft + "px";
                        } else {
                            ele.style.top = "-9999px";
                            ele.style.left = "-9999px";
                        }
                        setTypePortalVisible(!typePortalVisible);
                    }
                }}
            />
            <Portal>
                <div
                    ref={typeRef}
                    style={{
                        top: '-9999px',
                        left: '-9999px',
                        position: 'absolute',
                        zIndex: 1,
                        padding: '3px',
                        background: 'white',
                        borderRadius: '4px',
                        boxShadow: '0 1px 5px rgba(0,0,0,.2)',
                    }}
                >
                    <div key="h1">
                        <button onMouseDown={handleHeadingClick("1")}>H1</button>
                    </div>
                    <div key="h2">
                        <button onMouseDown={handleHeadingClick("2")}>H2</button>
                    </div>
                    <div key="h3">
                        <button onMouseDown={handleHeadingClick("3")}>H3</button>
                    </div>
                    <div key="h4">
                        <button onMouseDown={handleHeadingClick("4")}>H4</button>
                    </div>
                    <div key="h5">
                        <button onMouseDown={handleHeadingClick("5")}>H5</button>
                    </div>
                </div>
            </Portal>
            <Button
                ref={sizeTriggerRef}
                onMouseDown={event => {
                    event.preventDefault();
                    let ele = sizeRef.current;
                    let trigger = findDOMNode(sizeTriggerRef.current);
                    if (trigger instanceof HTMLElement) {
                        if (!sizePortalVisible) {
                            ele.style.top = trigger.offsetTop + trigger.offsetHeight + "px";
                            ele.style.left = trigger.offsetLeft + "px";
                        } else {
                            ele.style.top = "-9999px";
                            ele.style.left = "-9999px";
                        }
                        setSizePortalVisible(!sizePortalVisible);
                    }
                }}
            >15px down</Button>
            <Portal>
                <div
                    ref={sizeRef}
                    style={{
                        top: '-9999px',
                        left: '-9999px',
                        position: 'absolute',
                        zIndex: 1,
                        padding: '3px',
                        background: 'white',
                        borderRadius: '4px',
                        boxShadow: '0 1px 5px rgba(0,0,0,.2)',
                    }}
                >
                    {"13,14,15,16,19,22,24,29,32,40,48".split(",").map(size => {
                        return (
                            <a
                                style={{display: "block", padding: "5 20", cursor: 'pointer'}}
                                onMouseDown={(e) => {
                                    e.preventDefault()
                                    setSizePortalVisible(false);
                                    handleSizeClick(size)
                                }}
                                key={`size-${size}`}
                            >{size}px</a>
                        );
                    })}
                </div>
            </Portal>
        </>
    );
};

export const Portal = ({children}) => {
    return typeof document === 'object'
        ? ReactDOM.createPortal(children, document.body)
        : null
}


const TextColor = (props: PropsWithChildren<BaseProps>) => {
    let editor = useSlate();
    const triggerRef = useRef<HTMLDivElement | null>();
    const colorPickerRef = useRef<HTMLDivElement | null>();
    const [color, setColor] = useState<String>()
    const [visible, setVisible] = useState<boolean>(false);

    return (
        <>
            <Button
                ref={triggerRef}
                active={isMarkActive(editor, "color")}
                disabled={false}
                onMouseDown={event => {
                    event.preventDefault()
                    let ele = colorPickerRef.current;
                    let trigger = findDOMNode(triggerRef.current);
                    if (trigger instanceof HTMLElement) {
                        if (!visible) {
                            ele.style.top = trigger.offsetTop + trigger.offsetHeight + "px";
                            ele.style.left = trigger.offsetLeft + "px";
                        } else {
                            ele.style.top = "-9999px";
                            ele.style.left = "-9999px";
                        }
                        setVisible(!visible);
                    }
                }}
            >
                <Icon><FormatColorText style={{color: "red"}} className={styles.format_color_text}/></Icon>
            </Button>

            <Portal>
                <div
                    ref={colorPickerRef}
                    style={{
                        top: '-9999px',
                        left: '-9999px',
                        position: 'absolute',
                        zIndex: 1,
                        padding: '3px',
                        background: 'white',
                        borderRadius: '4px',
                        boxShadow: '0 1px 5px rgba(0,0,0,.2)',
                    }}
                >
                    <SketchPicker color={color} onChange={(color) => {
                        setColor(color.rgb)
                        Editor.addMark(editor, "color", color.hex);
                    }}/>
                </div>
            </Portal>
        </>
    );
};

export const Toolbar = (props: PropsWithChildren<BaseProps>) => {
    let editor = useSlate();

    return (
        <div className="toolbar" {...props}>
            <ButtonGroup>
                <TypeSize editor={editor}/>
            </ButtonGroup>
            <ButtonGroup>
                <MarkButton format="bold" icon="format_bold"/>
                <MarkButton format="italic" icon="format_italic"/>
                <MarkButton format="underline" icon="format_underlined"/>
            </ButtonGroup>

            <ButtonGroup>
                <MarkButton format="code" icon="code"/>
                <BlockButton format="block-quote" icon="format_quote"/>
                <BlockButton format="numbered-list" icon="format_list_numbered"/>
                <BlockButton format="bulleted-list" icon="format_list_bulleted"/>
            </ButtonGroup>

            <ButtonGroup>
                <TextColor/>
            </ButtonGroup>
        </div>
    );
}

const Button = forwardRef((props: PropsWithChildren<BaseProps>, ref: Ref<OrNull<HTMLSpanElement>>) => {
    const {active, disabled} = props;
    const activeClassName = active ? "active" : '';
    const disabledClassName = disabled ? "disabled" : '';
    return <span
        className={`${styles.button} ${activeClassName} ${disabledClassName}`}
        ref={ref}
        {...props}
    />;
});

const isBlockActive = (editor, format) => {
    // @ts-ignore
    const [match] = Editor.nodes(editor, {
        match: n =>
            !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })

    return !!match
}

const isMarkActive = (editor, format) => {
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

const BlockButton = ({format, icon}) => {
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

const LIST_TYPES = ['numbered-list', 'bulleted-list']

const toggleBlock = (editor, format) => {
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


const MarkButton = ({format, icon}) => {
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

interface BaseProps {
    [key: string]: unknown
}

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

