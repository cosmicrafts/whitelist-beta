import type { Principal } from '@dfinity/principal';
export interface BetaPlayerData {
  'id' : Principal,
  'faction' : bigint,
  'wallet' : string,
}
export type BetaPlayerId = Principal;
export interface BetaPlayerNFTs {
  'nftsCodes' : Array<NFTCode>,
  'nftChar' : NFTCode,
}
export type CodesList = Array<NFTType__1>;
export interface NFTCode { 'id' : bigint, 'code' : string }
export interface NFTType {
  'code' : NFTCode,
  'shipName' : string,
  'faction' : string,
  'batch' : bigint,
}
export interface NFTType__1 {
  'code' : NFTCode,
  'shipName' : string,
  'faction' : string,
  'batch' : bigint,
}
export interface NFTsBeta {
  'addBetaPlayer' : (arg_0: string, arg_1: bigint) => Promise<boolean>,
  'addCodes' : (arg_0: CodesList) => Promise<boolean>,
  'assignCodes' : () => Promise<string>,
  'checkPlayerAdded' : () => Promise<boolean>,
  'getAllCodes' : () => Promise<[] | [BetaPlayerNFTs]>,
  'getAllCodesAv' : () => Promise<Array<[bigint, NFTType]>>,
  'getAllCodesNum' : () => Promise<bigint>,
  'getAllUsers' : () => Promise<Array<[BetaPlayerId, BetaPlayerData]>>,
  'getBetaPlayer' : () => Promise<[] | [BetaPlayerData]>,
  'whoAmI' : () => Promise<Principal>,
}
export interface _SERVICE extends NFTsBeta {}
