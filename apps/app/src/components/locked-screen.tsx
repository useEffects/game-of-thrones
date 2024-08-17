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
    {
        _id: 3,
        text: "Who are the children of Tywin Lannister?",
        createdAt: baseTime + 120000, // 2 minutes later
        senderType: SenderType.User,
    },
    {
        _id: 4,
        text: "The children of Tywin Lannister are Tyrion, Jaime, and Cersei.",
        createdAt: baseTime + 180000, // 3 minutes later
        senderType: SenderType.Bot,
        executedCypher: "MATCH (p:Person {name: 'Tywin Lannister'})-[:PARENT_OF]->(child) RETURN child",
        cypherResult: JSON.stringify([
            {
                "identity": 210,
                "labels": [
                    "Character"
                ],
                "properties": {
                    "name": "Tyrion Lannister",
                    "id": "/wiki/Tyrion_Lannister"
                },
                "elementId": "4:2315bd12-2ba2-4906-a0fe-816d8a3378ff:210"
            },
            {
                "identity": 444,
                "labels": [
                    "Character"
                ],
                "properties": {
                    "name": "Jaime Lannister",
                    "id": "/wiki/Jaime_Lannister"
                },
                "elementId": "4:2315bd12-2ba2-4906-a0fe-816d8a3378ff:444"
            },
            {
                "identity": 483,
                "labels": [
                    "Character"
                ],
                "properties": {
                    "name": "Cersei Lannister",
                    "id": "/wiki/Cersei_Lannister"
                },
                "elementId": "4:2315bd12-2ba2-4906-a0fe-816d8a3378ff:483"
            }
        ])
    },
    {
        _id: 5,
        text: "Which house does Tywin Lannister belong to?",
        createdAt: baseTime + 240000, // 4 minutes later
        senderType: SenderType.User,
    },
    {
        _id: 6,
        text: "Tywin Lannister belongs to House Lannister.",
        createdAt: baseTime + 300000, // 5 minutes later
        senderType: SenderType.Bot,
        executedCypher: "MATCH (t:Character {name: Tywin Lannister})-[:HAS_ALLEGIANCE_TO]->(h:House) RETURN h",
        cypherResult: JSON.stringify([
            {
                "identity": 740,
                "labels": [
                    "House"
                ],
                "properties": {
                    "name": "House Lannister",
                    "id": "/wiki/House_Lannister"
                },
                "elementId": "4:2315bd12-2ba2-4906-a0fe-816d8a3378ff:740"
            }
        ])
    }
];