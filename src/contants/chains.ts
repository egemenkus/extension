const WASM = "WASM";
const EVM = "EVM";
type suppotedAccountType = typeof WASM | typeof EVM;
export interface Chain {
  name: string;
  chain?: string;
  addressPrefix?: number;
  rpc: {
    wasm?: string;
    evm?: string;
  };
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  explorers: {
    name: string;
    url: string;
  }[];
  supportedAccounts?: suppotedAccountType[];
}

export const RELAYCHAINS: Chain[] = [
  {
    name: "Polkadot",
    chain: "substrate",
    rpc: { wasm: "wss://rpc.polkadot.io" },
    addressPrefix: 0,
    nativeCurrency: {
      name: "DOT",
      symbol: "DOT",
      decimals: 10,
    },
    explorers: [
      {
        name: "subscan",
        url: "https://polkadot.subscan.io/",
      },
    ],
    supportedAccounts: [WASM],
  },
  {
    name: "Kusama",
    chain: "substrate",
    rpc: { wasm: "wss://kusama-rpc.polkadot.io" },
    addressPrefix: 2,
    nativeCurrency: {
      name: "KSM",
      symbol: "KSM",
      decimals: 12,
    },
    explorers: [
      {
        name: "subscanß",
        url: "https://kusama.subscan.io/",
      },
    ],
    supportedAccounts: [WASM],
  },
];

export const PARACHAINS: Chain[] = [
  {
    name: "Astar",
    chain: "ASTR",
    rpc: {
      evm: "https://evm.astar.network",
      wasm: "wss://rpc.astar.network",
    },
    addressPrefix: 5,
    nativeCurrency: {
      name: "Astar",
      symbol: "ASTR",
      decimals: 18,
    },
    explorers: [
      {
        name: "subscan",
        url: "https://astar.subscan.io",
      },
    ],
    supportedAccounts: [WASM],
  },
  {
    name: "Moonbeam",
    chain: "MOON",
    rpc: {
      evm: "https://rpc.api.moonbeam.network",
      wasm: "wss://wss.api.moonbeam.network",
    },
    addressPrefix: 1284,
    nativeCurrency: {
      name: "Glimmer",
      symbol: "GLMR",
      decimals: 18,
    },
    explorers: [
      {
        name: "moonscan",
        url: "https://moonbeam.moonscan.io",
      },
    ],
    supportedAccounts: [WASM],
  },

  {
    name: "Moonriver",
    chain: "MOON",
    rpc: { wasm: "wss://wss.api.moonriver.moonbeam.network" },
    addressPrefix: 1284,
    nativeCurrency: {
      name: "Moonriver",
      symbol: "MOVR",
      decimals: 18,
    },

    explorers: [
      {
        name: "moonscan",
        url: "https://moonriver.moonscan.io",
      },
    ],
    supportedAccounts: [WASM],
  },
  {
    name: "Shiden",
    chain: "SDN",
    rpc: {
      wasm: "wss://shiden.api.onfinality.io/public-ws",
    },
    addressPrefix: 5,
    nativeCurrency: {
      name: "Shiden",
      symbol: "SDN",
      decimals: 18,
    },
    explorers: [
      {
        name: "subscan",
        url: "https://shiden.subscan.io",
      },
    ],
    supportedAccounts: [WASM],
  },
];

export const TESTNETS: Chain[] = [
  {
    name: "Moonbase Alpha",
    chain: "MOON",
    rpc: {
      wasm: "wss://wss.api.moonbase.moonbeam.network",
    },
    addressPrefix: 1287,
    nativeCurrency: {
      name: "Dev",
      symbol: "DEV",
      decimals: 18,
    },
    explorers: [
      {
        name: "moonscan",
        url: "https://moonbase.moonscan.io",
      },
    ],
  },
  {
    name: "Shibuya",
    chain: "substrate",
    rpc: {
      wasm: "wss://shibuya-rpc.dwellir.com",
    },
    nativeCurrency: {
      name: "shibuya",
      symbol: "SBY",
      decimals: 18,
    },
    addressPrefix: 5,

    explorers: [
      {
        name: "subscan",
        url: "https://shibuya.subscan.io/",
      },
    ],
  },
  {
    name: "Contracts Testnet",
    chain: "Rococo",
    rpc: {
      wasm: "wss://rococo-contracts-rpc.polkadot.io",
    },
    nativeCurrency: {
      name: "roc",
      symbol: "ROC",
      decimals: 12,
    },
    explorers: [
      {
        name: "",
        url: "",
      },
    ],
  },
];

export const CHAINS = [
  {
    name: "Relay chains",
    chains: RELAYCHAINS,
  },
  {
    name: "Parachains",
    chains: PARACHAINS,
  },
  {
    name: "Testnets",
    chains: TESTNETS,
  },
];
