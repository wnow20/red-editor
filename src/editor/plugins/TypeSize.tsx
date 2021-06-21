import {Button} from "../common";
import React from "react";
import {useSlate} from "slate-react";
import {Editor} from "slate";
import {Dropdown, useDropdownMenu, useDropdownToggle} from "react-overlays";
import styles from "../Toolbar.module.scss";

const Toggle = () => {
    const [props] = useDropdownToggle();
    return (
        <Button
            type="button"
            {...props}
        >15px down</Button>
    );
};

const Menu = ({role}) => {
    const [props, {toggle, show}] = useDropdownMenu({
        flip: true,
        offset: [0, 8],
    });
    const editor = useSlate();
    const display = show ? "flex" : "none";
    const sizeArray = [13, 14, 15, 16, 19, 22, 24, 29, 32, 40, 48];

    function handleHeadingClick(size: number) {
        return function (event: React.MouseEvent<HTMLButtonElement>) {
            event.preventDefault();
            toggle(false, event);
            Editor.addMark(editor, "size", size);
        };
    }

    return (
        <div
            {...props}
            role={role}
            className={`${styles.dropdown_menu} ${display}`}
        >
            {sizeArray.map(size => {
                return (
                    <button onMouseDown={handleHeadingClick(size)} key={`size-${size}`}>{size}px</button>
                );
            })}
        </div>
    );
};

export default function TypeSize() {
    return (
        <Dropdown onToggle={show => console.log(show)}>
            <Toggle/>
            <Menu role="menu"/>
        </Dropdown>
    );
}
