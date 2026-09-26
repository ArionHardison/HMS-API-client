export type CreateAgentRequest = {
    name: string;
    type: string;
    description?: string;
    capabilities?: Array<any>;
    configuration?: Array<any>;
    model?: any;
    temperature?: number;
    max_tokens?: number;
    system_prompt?: string;
    metadata?: Array<any>;
    parent_agent_id?: any;
};
//# sourceMappingURL=CreateAgentRequest.d.ts.map