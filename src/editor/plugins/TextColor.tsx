import React, {PropsWithChildren, useState} from "react";
import {BaseProps, Button, Icon, isMarkActive} from "../common";
import {useSlate} from "slate-react";
import {ReactComponent as FormatColorText} from "../format_color_text.svg";
import styles from "../Toolbar.module.scss";
import {Dropdown, useDropdownMenu, useDropdownToggle} from "react-overlays";
import {Editor, Transforms} from "slate";
import {SketchPicker} from 'react-color';

const Toggle = () => {
    const editor = useSlate();
    const [props] = useDropdownToggle();
    return (
        <Button
            type="button"
            active={isMarkActive(editor, "color")}
            {...props}
        ><Icon><FormatColorText className={styles.format_color_text}/></Icon></Button>
    );
};

const Menu = () => {
    const [props, {toggle, show}] = useDropdownMenu({
        flip: true,
        offset: [0, 8],
        rootCloseEvent: "mousedown",
    });
    const editor = useSlate();
    const display = show ? "flex" : "none";
    const [color, setColor] = useState<String>()
    const {selection} = editor;

    return (
        <div
            {...props}
            className={`${styles.dropdown_menu} ${display}`}
            onMouseDown={event => {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }}
            onClick={event => {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }}
            contentEditable={false}
        >
            <SketchPicker color={color} onChange={(color) => {
                setColor(color.rgb)
                Transforms.select(editor, selection);
                Editor.addMark(editor, "color", color.hex);
            }}/>
        </div>
    );
};

const TextColor = (props: PropsWithChildren<BaseProps>) => {
    return (
        <Dropdown onToggle={() => null}>
            <Toggle/>
            <Menu/>
        </Dropdown>
    );
};

export default TextColor;
