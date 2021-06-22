import {Dropdown, useDropdownMenu, useDropdownToggle} from "react-overlays";
import {useSlate} from "slate-react";
import React from "react";
import styles from "../Toolbar.module.scss";
import {Button, CustomElement, toggleBlock} from "../common";
import {Editor} from "slate";

function getBlockType(editor: Editor): string {
    const generator = Editor.nodes(editor, {
        match: (node: CustomElement) => !!node.type,
    });

    const entry = generator.next().value;
    if (!entry) {
        return null;
    }
    const node = entry[0] as CustomElement;
    return node.type;
}

// TODO i18n
const headings = [
    { type: 'normal', text: 'Normal'},
    { type: 'heading-1', text: 'Heading-1'},
    { type: 'heading-2', text: 'Heading-2'},
    { type: 'heading-3', text: 'Heading-3'},
    { type: 'heading-4', text: 'Heading-4'},
    { type: 'heading-5', text: 'Heading-5'},
] as Array<{
    type: string,
    text: string,
}>;
const headingMap = {};
headings.forEach(heading => {
    headingMap[heading.type] = heading.text;
})
const getHeadingText = (type: string) => {
    if (!type) {
        return headings[0].text;
    }
    return headingMap[type]??headings[0].text;
}

const Menu = ({role}) => {
    const [props, {toggle, show}] = useDropdownMenu({
        flip: true,
        offset: [0, 8],
    });
    let editor = useSlate();
    const display = show ? "" : "hidden";


    function handleHeadingClick(heading: string) {
        return function (event: React.MouseEvent<HTMLButtonElement>) {
            event.preventDefault();
            toggle(false, event);
            toggleBlock(editor, heading);
        };
    }
    const type = getBlockType(editor);

    return (
        <div
            {...props}
            role={role}
            className={`${styles.dropdown_menu} ${display}`}
        >
            {headings.map((heading, index) => (
                <button
                    key={heading.type}
                    onMouseDown={handleHeadingClick(heading.type)}
                    className={`${styles.headingButton} ${type == heading.type ? 'active' : ''} ${heading.type}`}
                >
                    <span className={`material-icons ${styles.menu_item_check}`}>check</span>
                    <span className={styles.align_text}>{heading.text}</span>
                </button>
            ))}
        </div>
    );
};


const Toggle = () => {
    const [props] = useDropdownToggle();
    const editor = useSlate();
    const type = getBlockType(editor);
    return (
        <Button
            type="button"
            {...props}
        >{getHeadingText(type)}</Button>
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
