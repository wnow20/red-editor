import React, {PropsWithChildren} from "react";
import "material-design-icons/iconfont/material-icons.css"
import {BaseProps, BlockButton, ButtonGroup, MarkButton, preventEvent} from "./common";
import TypeSize from "./plugins/TypeSize";
import TextColor from "./plugins/TextColor";
import Heading from "./plugins/Heading";
import FillColor from "./plugins/FillColor";
import FormatAlign from "./plugins/FormatAlign";
import {CheckListButton} from "./plugins/CheckLists";

export const Toolbar = (props: PropsWithChildren<BaseProps>) => {
    return (
        <div
            className="toolbar" {...props}
            // bring about keyboard nav failed
            onMouseDown={event => {
                preventEvent(event);
            }}
            onClick={event => {
                preventEvent(event);
            }}
        >
            <ButtonGroup>
                <Heading/>
                <TypeSize/>
            </ButtonGroup>
            <ButtonGroup>
                <MarkButton format="bold" icon="format_bold"/>
                <MarkButton format="italic" icon="format_italic"/>
                <MarkButton format="underline" icon="format_underlined"/>
                <MarkButton format="strikethrough" icon="strikethrough_s"/>
            </ButtonGroup>

            <ButtonGroup>
                <MarkButton format="code" icon="code"/>
                <BlockButton format="block-quote" icon="format_quote"/>
                <BlockButton format="numbered-list" icon="format_list_numbered"/>
                <BlockButton format="bulleted-list" icon="format_list_bulleted"/>
            </ButtonGroup>

            <ButtonGroup>
                <TextColor/>
                <FillColor/>
            </ButtonGroup>

            <ButtonGroup>
                <FormatAlign/>
                <CheckListButton/>
            </ButtonGroup>
        </div>
    );
}
