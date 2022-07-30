import { DailyEventObjectNetworkConnectionEvent, DailyEventObjectNetworkQualityEvent, DailyNetworkTopology } from '@daily-co/daily-js';
interface UseNetworkArgs {
    onNetworkConnection?(ev: DailyEventObjectNetworkConnectionEvent): void;
    onNetworkQualityChange?(ev: DailyEventObjectNetworkQualityEvent): void;
}
/**
 * Returns current information about network quality and topology.
 * Allows to setup event listeners for daily's [network events](https://docs.daily.co/reference/daily-js/events/network-events).
 */
export declare const useNetwork: ({ onNetworkConnection, onNetworkQualityChange, }?: UseNetworkArgs) => {
    getStats: () => Promise<{
        latest: {
            recvBitsPerSecond: number;
            sendBitsPerSecond: number;
            timestamp: number;
            videoRecvBitsPerSecond: number;
            videoRecvPacketLoss: number;
            videoSendBitsPerSecond: number;
            videoSendPacketLoss: number;
            totalSendPacketLoss: number;
            totalRecvPacketLoss: number;
        };
        worstVideoRecvPacketLoss: number;
        worstVideoSendPacketLoss: number;
    } | undefined>;
    quality: number;
    threshold: "good" | "low" | "very-low";
    topology: DailyNetworkTopology;
};
export {};
