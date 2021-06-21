import {Dropdown, useDropdownMenu, useDropdownToggle} from "react-overlays";
import {useSlate} from "slate-react";
import React from "react";
import styles from "../Toolbar.module.scss";
import {Button, toggleBlock} from "../common";

const Menu = ({role}) => {
    const [props, {toggle, show}] = useDropdownMenu({
        flip: true,
        offset: [0, 8],
    });
    let editor = useSlate();
    const display = show ? "flex" : "none";
    let headings = ['H1', 'H2', 'H3', 'H4', 'H5'];

    function handleHeadingClick(heading: string) {
        return function (event: React.MouseEvent<HTMLButtonElement>) {
            event.preventDefault();
            toggle(false, event);
            toggleBlock(editor, "heading-" + heading);
        };
    }

    return (
        <div
            {...props}
            role={role}
            className={`${styles.dropdown_menu} ${display}`}
        >
            {headings.map((heading, index) => (
                <div key={heading}>
                    <button onMouseDown={handleHeadingClick(String(index + 1))}>{heading}</button>
                </div>
            ))}
        </div>
    );
};

const Toggle = () => {
    const [props] = useDropdownToggle();
    return (
        <Button
            type="button"
            {...props}
        >heading</Button>
    );
};

export default function Heading() {
    return (
        <Dropdown onToggle={p => console.log(p)}>
            <Toggle/>
            <Menu role="menu"/>
        </Dropdown>
    );
}
