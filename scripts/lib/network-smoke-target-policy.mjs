export const NETWORK_SMOKE_TARGET_POLICY = [
  {
    targetName: "ASDEV",
    target: "https://alirezasafaeisystems.ir/",
    owningProduct: "alirezasafaeigfx/alirezasafaeisystems",
    releaseRole: "ASDEV_OWNED",
    blocking: true,
  },
  {
    targetName: "Audit",
    target: "https://audit.alirezasafaeisystems.ir/",
    owningProduct: "alirezasafaeigfx/auditsystems",
    releaseRole: "EXTERNAL_PAIRED_TARGET",
    blocking: false,
  },
  {
    targetName: "PersianToolbox",
    target: "https://persiantoolbox.ir/",
    owningProduct: "alirezasafaeigfx/persiantoolbox",
    releaseRole: "EXTERNAL_PAIRED_TARGET",
    blocking: false,
  },
];

export const NETWORK_SMOKE_TARGETS = NETWORK_SMOKE_TARGET_POLICY.map(({ target }) => target);
