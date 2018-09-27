export declare const noCocoaPodsConsequence: string;
export declare const cocoaPodsInstallInstructions: string;
export declare const cocoaPodsUpgradeInstructions: string;
export declare enum CocoaPodsStatus {
    notInstalled = 0,
    belowMinimumVersion = 1,
    belowRecommendedVersion = 2,
    recommended = 3
}
export declare class CocoaPods {
    cocoaPodsMinimumVersion: string;
    cocoaPodsRecommendedVersion: string;
    cocoaPodsVersionText: string;
    constructor();
    readonly evaluateCocoaPodsInstallation: CocoaPodsStatus;
    readonly isCocoaPodsInitialized: boolean;
}
