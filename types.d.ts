interface BaseResponse<T> {
    code: number;
    status: string;
    data: T;
}

type RankNo = '1' | '5' | '20' | '100' | '500'

type CutOff = Record<RankNo, number>;

interface ServerCutOff {
    servernum: number;
    serverip: string;
    lastmodifided: number;
    cutoff: CutOff;
}

type ServerListResponse = BaseResponse<ServerCutOff[]>

interface CutOffWithTs {
    cutoff: CutOff;
    timestamp: number;
}

type Prediction = Record<RankNo, [number, number]>

interface Senka {
    rankno: number;
    senka: number;
    timestamp: number;
}

interface Player {
    rankno: number;
    name: string;
    comment: string;
    curRanking: number;
    curMedal: number;
    senka: Senka[];
    stddev: number;
    predicteo: number;
    senka_val: number;
    color: string;
    predicteo_special: number;
}

interface ServerDetail extends ServerCutOff {
    cutofflist: CutOffWithTs[];
    prediction: Prediction;
    players: Player[]
}

type ServerDetailResponse = BaseResponse<ServerDetail>