import { Accordion, AccordionDetails, AccordionSummary, SxProps, Typography } from "@mui/material";
import { Box } from "@mui/system";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import hljs from 'highlight.js';
import hljsCypher from "highlightjs-cypher"
import Highlight from 'react-highlight'

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')

hljs.registerLanguage('cypher', hljsCypher);

export default function MessageBubble(props: { sx?: SxProps } & IMessage) {
    if (isSystemMessage(props)) {
        return <RenderSystemMessage {...props} />
    }
    if (isBotMessage(props)) {
        return <RenderBotMessage {...props} />
    }
    if (isUserMessage(props)) {
        return <RenderUserMessage {...props} />
    }
}

function RenderSystemMessage(props: ISystemMessage) {
    switch (props.systemMessageType) {
        case SystemMessageType.Timestamp:
            return <Typography variant="button" sx={{
                color: "text.secondary",
                marginX: "auto",
            }}>
                {props.text}
            </Typography>
    }
}

function RenderBotMessage(props: IBotMessage) {

    return <Box sx={{
        borderRadius: 8,
        borderBottomLeftRadius: 0,
        backgroundColor: "background.paper",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        width: "75%"
    }}>
        <Typography variant="body1">
            {props.text}
        </Typography>
        {props.executedCypher && (
            <Accordion variant="outlined">
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography variant="body2">
                        Executed Cypher Query
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography component={"div"} variant="body2">
                        <Highlight className="cypher">
                            {props.executedCypher}
                        </Highlight>
                    </Typography>
                </AccordionDetails>
            </Accordion>
        )}
        <Typography variant="caption">
            {timeAgo.format(new Date(props.createdAt))}
        </Typography>
    </Box>
}

function RenderUserMessage(props: IUserMessage) {
    return <Box sx={{
        borderRadius: 8,
        borderBottomRightRadius: 0,
        backgroundColor: "primary.main",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        color: "primary.contrastText",
        width: "75%",
        alignSelf: "flex-end"
    }}>
        <Typography variant="body1">
            {props.text}
        </Typography>
        <Typography variant="caption" sx={{
            alignSelf: "flex-end"
        }}>
            {timeAgo.format(new Date(props.createdAt))}
        </Typography>
    </Box>
}

const isSystemMessage = (message: IMessage): message is ISystemMessage => message.senderType === SenderType.System;
const isBotMessage = (message: IMessage): message is IBotMessage => message.senderType === SenderType.Bot;
const isUserMessage = (message: IMessage): message is IUserMessage => message.senderType === SenderType.User;

export enum SenderType {
    Bot = "bot",
    User = "user",
    System = "system"
}

export enum SystemMessageType {
    Timestamp = "timestamp",
}

export type IMessage = IBotMessage | IUserMessage | ISystemMessage;

export interface IBaseMessage {
    _id: string | number;
    createdAt: number;
    text: string;
}

export interface IBotMessage extends IBaseMessage {
    senderType: SenderType.Bot;
    quickReplies?: string[];
    executedCypher?: string;
    cypherResult?: string
}

export interface ISystemMessage extends IBaseMessage {
    senderType: SenderType.System;
    systemMessageType: string;
}

export interface IUserMessage extends IBaseMessage {
    senderType: SenderType.User;
}
