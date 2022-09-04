import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import "@nomiclabs/hardhat-etherscan";
import * as dotenv from 'dotenv'
dotenv.config()

const config: HardhatUserConfig = {
  defaultNetwork: "goerli",
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 1337,
      //   chainId: 80001,
      //   allowUnlimitedContractSize: false,
      //   blockGasLimit: 20000000, // 20 million
      //   forking: {
      //     url: "https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_MUMBAI}",
      //     url: "https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_API_RINKEBY}",
      //     url: "https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_MAINNET}",
      //   },
    },
    mumbai: {
      chainId: 80001,
      url: process.env.RPC_80001 || 'https://rpc.ankr.com/polygon_mumbai',
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    goerli: {
      chainId: 5,
      url: process.env.RPC_5 || 'https://rpc.ankr.com/eth_goerli',
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    gnosis: {
      url: 'https://rpc.gnosischain.com/',
      gasPrice: 1000000000,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    chiado: {
      url: 'https://rpc-chiado.gnosistestnet.com',
      gasPrice: 1000000000,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    sokol: {
      url: 'https://sokol.poa.network',
      accounts: [`${process.env.PRIVATE_KEY}`],
      chainId: 77,
    },
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_API_KEY}`,
  },
};

export default config;
