import SendIcon from '@mui/icons-material/Send';
import { IconButton, SxProps, TextField, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import useUser from "src/hooks/user";
import { langchainServer } from "src/lib/constants";
import { sortMessages } from "src/lib/helpers";
import MessageBubble, { SenderType } from "./message-bubble";

export default function ChatView({ sx = {} }: { sx?: SxProps }) {
    const { user, setUser } = useUser()
    const [text, setText] = useState("");
    const { palette } = useTheme()

    const handleSubmit = async () => {
        if (!text) return;
        const res = await fetch(`${langchainServer}`, {
            method: "POST",
            body: JSON.stringify({
                input: text,
                api_key: user.openAIKey
            })
        }).then(res => res.json())

        const intermediate_steps = res.response.intermediate_steps
        let executedCypher = ""
        let cypherResult = ""
        if (Array.isArray(intermediate_steps) && intermediate_steps.length) {
            executedCypher = intermediate_steps[0].query
            cypherResult = intermediate_steps[1].context
        }

        setUser({
            ...user,
            messages: [
                ...user.messages,
                {
                    senderType: SenderType.User,
                    text: text,
                    createdAt: Date.now(),
                    _id: Date.now()
                },
                {
                    senderType: SenderType.Bot,
                    text: res.response.result,
                    createdAt: Date.now(),
                    _id: Date.now() + 1,
                    executedCypher,
                    cypherResult
                }
            ]
        })

        setText("")
    }

    return <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 1,
        justifyContent: "flex-end",
        ...sx
    }}>
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            overflowY: "auto",
        }}>
            {user.messages.sort(sortMessages).map(message => <MessageBubble key={message._id} {...message} />)}
        </Box>
        <TextField
            InputProps={{
                sx: {
                    borderRadius: 9999,
                    backgroundColor: palette.background.paper,
                    ":active": {
                        backgroundColor: palette.action.selected
                    }
                },
                endAdornment: <IconButton
                    onClick={handleSubmit}
                >
                    <SendIcon />
                </IconButton>
            }}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
        />
        <Typography variant="caption" sx={{ alignSelf: "center" }}>
            AI can make mistakes. Check important information.
        </Typography>
    </Box>
}