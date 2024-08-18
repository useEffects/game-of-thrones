import { Box, SxProps, Tab, Tabs, Typography } from "@mui/material";
import dagre from 'dagre';
import { useEffect, useState } from "react";
import Highlight from "react-highlight";
import { Node } from 'reactflow';
import useUser from "src/hooks/user";
import { sortMessagesReverse } from "src/lib/helpers";
import * as yup from 'yup';
import Flow from "./flow";
import { IBotMessage, SenderType } from "./message-bubble";

export default function Visualizer({ sx = {} }: { sx?: SxProps }) {
    const [tab, setTab] = useState(0);
    const { user: { messages } } = useUser();

    const lastBotMessage = messages.sort(sortMessagesReverse).find(message => message.senderType === SenderType.Bot && message.executedCypher) as IBotMessage;
    console.log(lastBotMessage)

    return <Box sx={sx}>
        <Tabs
            value={tab}
            onChange={(_, newTab) => setTab(newTab)}
            variant="fullWidth"
        >
            <Tab label="Visualize" value={0} />
            <Tab label="JSON" value={1} />
        </Tabs>
        {tab === 0 && <RenderNodesDiagram query={lastBotMessage?.executedCypher} />}
        {tab === 1 && <RenderJsonResult cypherResult={lastBotMessage?.cypherResult} />}
    </Box>
}

function RenderNodesDiagram(props: { query?: string }) {
    return <Box sx={{
        height: "100%",
        width: "100%",
        padding: 4
    }}>
        <Flow query={props.query} />
    </Box>
}

function RenderJsonResult(props: { cypherResult?: string }) {
    const { cypherResult } = props;
    // const [parsedResult] = useCypherResult(cypherResult);

    return <Box sx={{
        overflowY: "auto",
        height: "100%",
        width: "100%",
    }}>
        <Typography variant="body1" component={"div"}>
            <Highlight className="json">
                {JSON.stringify(cypherResult, null, 2)}
            </Highlight>
        </Typography>
    </Box>

}

type CypherResultFromLLM = {
    identity: number;
    labels: string[];
    properties: {
        name: string;
        id: string;
    };
    elementId: string;
}

const cypherResultFromLLMSchema = yup.object().shape({
    identity: yup.number().required().positive().integer(),
    labels: yup.array().of(yup.string().required()).required(),
    properties: yup.object().shape({
        name: yup.string().required(),
        id: yup.string().required()
    }).required(),
    elementId: yup.string().required()
});

enum ResultType {
    LLM = "llm",
    Neo4j = "neo4j"
}

const useCypherResult = (cypherResult?: string) => {
    const [parsedResult, setParsedResult] = useState<{
        type: ResultType,
        data: CypherResultFromLLM[]
    }>();

    useEffect(() => {
        async function validateCypherResult() {
            try {
                if (!cypherResult) return;
                const parsedResult = JSON.parse(cypherResult);
                if (Array.isArray(parsedResult)) {
                    const result = await Promise.all(parsedResult.map(pr => cypherResultFromLLMSchema.validate(pr)));
                    setParsedResult({
                        type: ResultType.LLM,
                        data: result
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }
        validateCypherResult()
    }, [cypherResult])
    return [parsedResult, setParsedResult] as const;
}

const mapToReactFlowNodes = (data: CypherResultFromLLM[]): Node[] => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({});
    g.setDefaultEdgeLabel(() => ({}));

    data.forEach(item => {
        g.setNode(item.identity.toString(), { label: item.properties.name });
    });

    dagre.layout(g);

    return data.map(item => {
        const node = g.node(item.identity.toString());
        return {
            id: item.identity.toString(),
            data: {
                label: `${item.properties.name} (${item.labels.join(", ")})`,
            },
            position: { x: node.x, y: node.y },
        };
    });
};