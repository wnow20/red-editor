import {Button} from "../common";
import ReactDOM, {findDOMNode} from "react-dom";
import React, {useRef, useState} from "react";
import {useSlate} from "slate-react";
import {Editor} from "slate";

const Portal = ({children}) => {
    return typeof document === 'object'
        ? ReactDOM.createPortal(children, document.body)
        : null
}

export default function TypeSize() {
    let editor = useSlate();
    const sizeRef = useRef<HTMLDivElement | null>();
    const sizeTriggerRef = useRef<HTMLButtonElement | null>();
    const [sizePortalVisible, setSizePortalVisible] = useState(false);

    function handleSizeClick(size: string) {
        Editor.addMark(editor, "size", size);
    }

    return (
        <>
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
}
