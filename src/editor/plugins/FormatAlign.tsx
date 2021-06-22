import {Dropdown, useDropdownMenu, useDropdownToggle} from "react-overlays";
import {Button, CustomElement} from "../common";
import {ReactComponent as ArrowDropDown} from "../arrow_drop_down.svg";
import styles from "../Toolbar.module.scss";
import React from "react";
import {useSlate} from "slate-react";
import {Editor, Transforms} from "slate";
import {Property} from "csstype";

function getSelectionAlign(editor: Editor): Property.TextAlign {
    const generator = Editor.nodes(editor, {
        match: (node: CustomElement) => !!node.textAlign,
    });

    const entry = generator.next().value;
    if (!entry) {
        return null;
    }
    const node = entry[0] as CustomElement;
    return node.textAlign;
}

const Menu = ({role}) => {
    const [props, {toggle, show}] = useDropdownMenu({
        flip: true,
        offset: [0, 8],
    });
    let editor = useSlate();
    const display = show ? "" : "hidden";
    /* TODO i18n */
    const aligns = [
        {icon: 'format_align_left', text: 'Left align', type: "left"},
        {icon: 'format_align_right', text: 'Right align', type: "right"},
        {icon: 'format_align_center', text: 'Centre', type: "center"},
        {icon: 'format_align_justify', text: 'Justify', type: "justify"},
    ] as Array<{
        icon: string,
        text: string,
        type: Property.TextAlign,
    }>;

    function handleHeadingClick(align: Property.TextAlign) {
        return function (event: React.MouseEvent<HTMLButtonElement>) {
            event.preventDefault();
            toggle(false, event);
            Transforms.setNodes(editor, {
                textAlign: align,
            });
        };
    }
    const selectionAlign = getSelectionAlign(editor);

    return (
        <div
            {...props}
            role={role}
            className={`${styles.dropdown_menu} ${display}`}
        >
            {aligns.map(align => {
                return (
                    <button
                        key={align.icon}
                        onMouseDown={handleHeadingClick(align.type)}
                        className={`${selectionAlign == align.type ? 'active' : ''}`}
                    >
                        <span className={`material-icons ${styles.menu_item_check}`}>check</span>
                        <span className={`material-icons ${styles.menu_item_icon}`}>{align.icon}</span>
                        <span className={styles.menu_item_text}>{align.text}</span>
                    </button>
                );
            })}
        </div>
    );
};

const Toggle = () => {
    const [props] = useDropdownToggle();
    return (
        <Button type="button" {...props}>
            <span className="material-icons">format_align_left</span>
            <ArrowDropDown className={styles.arrow_drop_down}/>
        </Button>
    );
};

const FormatAlign = () => {
    return (
        <Dropdown onToggle={() => null}>
            <Toggle/>
            <Menu role="menu"/>
        </Dropdown>
    );
}

export default FormatAlign;
