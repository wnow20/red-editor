import {Button} from "../common";
import React from "react";
import {useSlate} from "slate-react";
import {Editor} from "slate";
import {Dropdown, useDropdownMenu, useDropdownToggle} from "react-overlays";
import styles from "../Toolbar.module.scss";
import {ReactComponent as ArrowDropDown} from "../arrow_drop_down.svg";

function getTypeSize(editor: Editor): number {
    const marks = Editor.marks(editor)
    if (!marks) {
        return null;
    }
    return marks['size'] as number;
}

const Toggle = () => {
    const [props] = useDropdownToggle();
    let editor = useSlate();
    let typeSize = getTypeSize(editor)??null;
    return (
        <Button
            type="button"
            {...props}
            className={styles.typeSizeTrigger}
        >
            <span className={styles.typeSizePlaceholder}>
                {typeSize !== null ? typeSize + 'px' : null}
            </span>
            <ArrowDropDown className={styles.arrow_drop_down}/>
        </Button>
    );
};

const Menu = ({role}) => {
    const [props, {toggle, show}] = useDropdownMenu({
        flip: true,
        offset: [0, 8],
    });
    const editor = useSlate();
    const display = show ? "" : "hidden";
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
