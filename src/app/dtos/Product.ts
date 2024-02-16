interface ExtraData{
    AGA: {
        APE: string;
        KAT: string;
        LGA: string;
        PRI: string;
        TYP: string;
        VOL: string;
        VPE: string;
        XP1: string;
        XP2: string;
    }
}

export interface Product{
    id: string; 
    name: string;
    extra?: ExtraData
}

