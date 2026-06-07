export type CreateConnectorRequest = {
    title: string;
    description?: string;
    server_command: string;
    server_args?: Array<any>;
    server_env?: Array<any>;
    selected_tool?: string;
    tool_parameters?: Array<any>;
    timeout?: number;
};
//# sourceMappingURL=CreateConnectorRequest.d.ts.map