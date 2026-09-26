export type StoreDomainInterfaceRequest = {
    subproject_id: number;
    domain: string;
    interface_id: string;
    is_base?: boolean;
    page_route?: string;
    page_file?: string;
    block_name?: string;
    block_file?: string;
    purpose?: string;
    data_sources?: Array<any>;
    agent_use_cases?: Array<any>;
    tags?: Array<any>;
    enabled?: boolean;
};
//# sourceMappingURL=StoreDomainInterfaceRequest.d.ts.map