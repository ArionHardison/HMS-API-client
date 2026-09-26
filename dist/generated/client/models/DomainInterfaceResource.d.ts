export type DomainInterfaceResource = {
    id: number;
    subproject_id: number;
    domain: string;
    interface_id: string;
    is_base: boolean;
    page_route: string | null;
    page_file: string | null;
    block_name: string | null;
    block_file: string | null;
    purpose: string | null;
    data_sources: Array<string>;
    agent_use_cases: Array<string>;
    tags: Array<string>;
    enabled: boolean;
    created_at: string | null;
    updated_at: string | null;
};
//# sourceMappingURL=DomainInterfaceResource.d.ts.map