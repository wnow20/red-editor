import {Button, LinkElement, preventEvent} from "../common";
import React, {CSSProperties, useContext, useEffect, useState} from "react";
import usePopper from "react-overlays/usePopper";
import {createPortal} from "react-dom";
import textLinkStyles from './TextLink.module.scss';
import {useSlate} from "slate-react";
import isUrl from 'is-url'
import {Editor, Element, NodeEntry, Range, Selection, Transforms} from "slate";

function getSelectionLink(editor: Editor) {
    if (!editor.selection) {
        return "";
    }
    const entry: NodeEntry = Editor.above(editor, {
        match: n =>
            !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link'
    });
    if (!entry) {
        return "";
    }
    const node = entry[0] as LinkElement;
    return node.url;
}

export const Link = ({attributes, children, element}) => {
    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);
    const [arrowElement, setArrowElement] = useState(null);
    const {styles, attributes: popperAttributes} = usePopper(referenceElement, popperElement, {
        modifiers: [{name: 'arrow', options: {element: arrowElement}}],
        placement: 'bottom-start'
    });
    const [visible, setVisible] = useState(false);
    const [selection, setSelection]: [Selection, (Selection) => void] = useState<Selection>(null);
    // const {linkPopperVisible} = useLinkPopper();
    const [formVisible, setFormVisible] = useState(false);
    let editor = useSlate();
    let link = getSelectionLink(editor);

    // useEffect(() => {
    //     debugger
    //     setFormVisible(linkPopperVisible);
    // }, [linkPopperVisible]);

    function handleLinkChange({link}) {
        if (!selection) {
            return;
        }
        Transforms.setNodes(editor, {
            type: 'link',
            url: link,
        }, {
            at: selection,
            match: n =>
                !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link'
        })
        setVisible(false)
        setFormVisible(false)
        setSelection(null);
        setLock(false);
    }

    const [lock, setLock] = useState(false);
    const releaseLock = () => {
        setLock(false);
    };
    useEffect(() => {
        document.body.addEventListener('mouseup', releaseLock)
    }, []);

    let reactPortal = createPortal(
        <div
            {...popperAttributes.popper}
            ref={setPopperElement}
            style={styles.popper as CSSProperties}
            className={textLinkStyles.textLinkPopper}
            onMouseDown={event => {
                setLock(true);
            }}
            onMouseLeave={event => {
                preventEvent(event)
                if (!lock) {
                    setVisible(false)
                    setFormVisible(false)
                }
            }}
        >
            {formVisible ?
                <TextLinkForm link={link} onChange={(value) => {
                    handleLinkChange(value)
                }}/>
                : <LinkPopTool setFormVisible={setFormVisible} editor={editor}/>}
            <div ref={setArrowElement} style={styles.arrow as CSSProperties}/>
        </div>, document.body);
    return (
        <>
            <a {...attributes} href={element.url} ref={setReferenceElement}
               onMouseDown={event => {
                   setVisible(true);
               }}
               onClick={event => {
                   setSelection(editor.selection);
               }}
            >{children}</a>
            {visible ? reactPortal : null}
        </>
    );
};

const LinkPopTool = ({setFormVisible, editor}) => {
    return (
        <div>
            <Button onMouseDown={(e) => {
                setFormVisible(true);
            }}>
                <span className="material-icons">mode_edit</span>
            </Button>
            <Button onMouseDown={(e) => {
                unwrapLink(editor);
            }}>
                <span className="material-icons">link_off</span>
            </Button>
        </div>
    );
};

interface LinkForm {
    link?: string;
    onChange: ({link}: { link: string }) => void
}

const TextLinkForm = ({link: originLink, onChange}: LinkForm) => {
    const [link, setLink] = useState<string>(originLink ?? "");
    return (
        <div className={textLinkStyles.textLinkForm}>
            <div>
                <label htmlFor="text-link-link">Website Link </label>
                <input
                    id="text-link-link"
                    placeholder="website link..."
                    value={link}
                    onChange={event => {
                        setLink(event.target.value)
                    }}
                />
            </div>
            <button type="button" onClick={event => {
                onChange({link});
            }}>OK
            </button>
        </div>
    )
};

export const LinkButton = () => {
    const editor = useSlate();
    // const {toggleLinkPopper} = useLinkPopper();
    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);
    const [arrowElement, setArrowElement] = useState(null);
    const {styles, attributes: popperAttributes} = usePopper(referenceElement, popperElement, {
        modifiers: [{name: 'arrow', options: {element: arrowElement}}],
        placement: 'bottom-start'
    });
    const [visible, setVisible] = useState(false);
    const [selection, setSelection]: [Selection, (Selection) => void] = useState<Selection>(null);

    // const {linkPopperVisible} = useLinkPopper();
    function handleLinkChange({link}) {
        if (!selection) {
            return;
        }
        insertLinkV2(editor, selection, link);
        setVisible(false)
        setSelection(null);
    }

    let reactPortal = createPortal(
        <div
            {...popperAttributes.popper}
            ref={setPopperElement}
            style={styles.popper as CSSProperties}
            className={textLinkStyles.textLinkPopper}
            onMouseLeave={event => {
                preventEvent(event)
                setVisible(false)
            }}
        >
            <TextLinkForm onChange={(value) => {
                handleLinkChange(value)
            }}/>
            <div ref={setArrowElement} style={styles.arrow as CSSProperties}/>
        </div>, document.body);

    return (
        <>
            <Button
                ref={setReferenceElement}
                onMouseDown={(event) => {
                    event.preventDefault()
                    // const url = window.prompt('Enter the URL of the link:')
                    // if (!url) return
                    // insertLink(editor, url);
                    // toggleLinkPopper(true);
                    setSelection(editor.selection);
                    setVisible(true);
                }}
            >
                <span className="material-icons">link</span>
            </Button>
            {visible ? reactPortal : null}
        </>
    );
}

const insertLink = (editor, url) => {
    if (editor.selection) {
        wrapLink(editor, url)
    }
}
const insertLinkV2 = (editor, selection, url) => {
    debugger
    if (selection) {
        wrapLinkV2(editor, selection, url)
    }
}

// export interface LinkPopper {
//     linkPopperVisible: boolean;
//     toggleLinkPopper: (boolean) => void
// }
//
// const linkPopperDefaultValue: LinkPopper = {
//     linkPopperVisible: false,
//     toggleLinkPopper: () => {}
// };
//
// export const LinkPopperContext = React.createContext<LinkPopper>(linkPopperDefaultValue);
//
// export const useLinkPopper = () => {
//     return useContext(LinkPopperContext);
// }

export const withLinks = editor => {
    const {insertData, insertText, isInline} = editor

    editor.isInline = element => {
        return element.type === 'link' ? true : isInline(element)
    }

    editor.insertText = text => {
        if (text && isUrl(text)) {
            wrapLink(editor, text)
        } else {
            insertText(text)
        }
    }

    editor.insertData = data => {
        const text = data.getData('text/plain')

        if (text && isUrl(text)) {
            wrapLink(editor, text)
        } else {
            insertData(data)
        }
    }

    return editor
}

const unwrapLink = editor => {
    Transforms.unwrapNodes(editor, {
        match: n =>
            !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
    })
}

const wrapLink = (editor, url) => {
    if (isLinkActive(editor)) {
        unwrapLink(editor)
    }

    const {selection} = editor
    const isCollapsed = selection && Range.isCollapsed(selection)
    const link: LinkElement = {
        type: 'link',
        url,
        children: isCollapsed ? [{text: url}] : [],
    }

    if (isCollapsed) {
        Transforms.insertNodes(editor, link)
    } else {
        Transforms.wrapNodes(editor, link, {split: true})
        Transforms.collapse(editor, {edge: 'end'})
    }
}
const wrapLinkV2 = (editor, selection, url) => {
    if (isLinkActiveV2(editor, selection)) {
        unwrapLink(editor)
    }

    const isCollapsed = selection && Range.isCollapsed(selection)
    const link: LinkElement = {
        type: 'link',
        url,
        children: isCollapsed ? [{text: url}] : [],
    }

    if (isCollapsed) {
        Transforms.insertNodes(editor, link, {
            at: selection,
        });
    } else {
        Transforms.wrapNodes(editor, link, {at: selection, split: true})
        Transforms.collapse(editor, {edge: 'end'})
    }
}

const isLinkActive = editor => {
    // @ts-ignore
    const [link] = Editor.nodes(editor, {
        match: n =>
            !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
    })
    return !!link
}
const isLinkActiveV2 = (editor, selection) => {
    // @ts-ignore
    const [link] = Editor.nodes(editor, {
        at: selection,
        match: n =>
            !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
    })
    return !!link
}

