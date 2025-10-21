// ----------------------------------------------------------------------

export interface CustomerJourneyProcess {
    id: number | string;
    name: string;
    status: string;
    customer_journey: {
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
    customer_journey: number[];
}
