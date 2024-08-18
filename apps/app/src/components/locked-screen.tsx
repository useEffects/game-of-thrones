import { Box, Button, Container, TextField } from "@mui/material";
import { Formik } from "formik";
import useUser from "src/hooks/user";
import { timeAgo } from "src/lib/helpers";
import * as yup from 'yup';
import { IMessage, SenderType, SystemMessageType } from "./message-bubble";

export default function LockedScreen() {
    const { setUser } = useUser()

    const onSubmit = setUser

    return <Container maxWidth="sm">
        <Formik
            initialValues={{
                name: '',
                openAIKey: '',
                messages: messages,
            }}
            validationSchema={lockedScreenSchema}
            onSubmit={onSubmit}
        >
            {({ handleSubmit, values, errors, setFieldValue, handleBlur }) => <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    placeContent: "center",
                    alignItems: "stretch",
                    height: "100vh",
                }}
            >
                <TextField
                    label="Name"
                    value={values.name}
                    onChange={(e) => setFieldValue('name', e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name ?? undefined}
                    onBlur={() => handleBlur('name')}
                />
                <TextField
                    label="OpenAI API Key"
                    value={values.openAIKey}
                    onChange={(e) => setFieldValue('openAIKey', e.target.value)}
                    error={!!errors.openAIKey}
                    helperText={errors.openAIKey ?? undefined}
                    onBlur={() => handleBlur('openAIKey')}
                />
                <Button
                    onClick={() => handleSubmit()}
                >
                    Unlock
                </Button>
            </Box>}
        </Formik>
    </Container >
}

const lockedScreenSchema = yup.object({
    name: yup.string().required(),
    openAIKey: yup.string().required().matches(/sk-.+/),
})

const baseTime = Date.now();

const messages: IMessage[] = [
    {
        _id: 1,
        createdAt: baseTime,
        senderType: SenderType.System,
        systemMessageType: SystemMessageType.Timestamp,
        text: timeAgo.format(new Date(baseTime))
    },
    {
        _id: 2,
        text: "Hello, how can I help you?",
        createdAt: baseTime + 60000, // 1 minute later
        senderType: SenderType.Bot,
    },
];