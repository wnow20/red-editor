import ReactDOM, {findDOMNode} from "react-dom";
import React, {PropsWithChildren, useRef, useState} from "react";
import {BaseProps, Button, Icon, isMarkActive} from "../common";
import {useSlate} from "slate-react";
import {ReactComponent as FormatColorText} from "../format_color_text.svg";
import styles from "../Toolbar.module.scss";
import {Editor} from "slate";
import {SketchPicker} from 'react-color';

const Portal = ({children}) => {
    return typeof document === 'object'
        ? ReactDOM.createPortal(children, document.body)
        : null
}


const TextColor = (props: PropsWithChildren<BaseProps>) => {
    let editor = useSlate();
    const triggerRef = useRef<HTMLButtonElement | null>();
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

export default TextColor;
