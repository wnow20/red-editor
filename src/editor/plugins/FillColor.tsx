import React, {PropsWithChildren, useState} from "react";
import {BaseProps, Button, Icon, isMarkActive} from "../common";
import {useSlate} from "slate-react";
import {ReactComponent as FormatColorFill} from "../format_color_fill.svg";
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
            active={isMarkActive(editor, "fill")}
            {...props}
        ><Icon><FormatColorFill className={styles.format_color_fill}/></Icon></Button>
    );
};

const Menu = () => {
    const [props, {toggle, show}] = useDropdownMenu({
        flip: true,
        offset: [0, 8],
        rootCloseEvent: "mousedown",
    });
    const editor = useSlate();
    const display = show ? "" : "hidden";
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
            {/* TODO give users some colors in usual*/}
            <SketchPicker color={color} onChange={(color) => {
                setColor(color.rgb)
                console.log("selection");
                console.log(selection);
                console.log("editor");
                console.log(editor);
                console.log("editor.selection");
                console.log(editor.selection);
                Transforms.select(editor, selection);
                Editor.addMark(editor, "fill", color.hex);
            }}/>
        </div>
    );
};

const FillColor = (props: PropsWithChildren<BaseProps>) => {
    return (
        <Dropdown onToggle={() => null}>
            <Toggle/>
            <Menu/>
        </Dropdown>
    );
};

export default FillColor;
