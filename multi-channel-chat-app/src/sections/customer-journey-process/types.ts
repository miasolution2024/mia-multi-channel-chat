// ----------------------------------------------------------------------

export interface CustomerJourneyProcess {
    id: number | string;
    name: string;
    status: string;
    customer_journey: {
        id: number; // Relationship ID
        customer_journey_id: {
            id: number;
            name: string;
        };
    }[];
    date_created?: string;
    date_updated?: string;
    [key: string]: unknown;
}

export interface CustomerJourneyProcessFormData {
    name: string;
    status: string;
    customer_journey: {
        create: Array<{
            customer_journey_process_id: string;
            customer_journey_id: {
                id: number;
            };
        }>;
        update: Array<unknown>;
        delete: Array<unknown>;
    };
}

// Internal form data type for UI handling
export interface CustomerJourneyProcessFormDataInternal {
    name: string;
    status: string;
    customer_journey: number[];
    // Mapping from customer_journey_id to relationship ID for delete operations
    customer_journey_relationship_map?: Record<number, number>;
}
