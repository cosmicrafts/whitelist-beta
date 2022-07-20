export const idlFactory = ({ IDL }) => {
  const NFTCode = IDL.Record({ 'id' : IDL.Nat, 'code' : IDL.Text });
  const NFTType__1 = IDL.Record({
    'code' : NFTCode,
    'shipName' : IDL.Text,
    'faction' : IDL.Text,
    'batch' : IDL.Nat,
  });
  const CodesList = IDL.Vec(NFTType__1);
  const BetaPlayerNFTs = IDL.Record({
    'nftsCodes' : IDL.Vec(NFTCode),
    'nftChar' : NFTCode,
  });
  const NFTType = IDL.Record({
    'code' : NFTCode,
    'shipName' : IDL.Text,
    'faction' : IDL.Text,
    'batch' : IDL.Nat,
  });
  const BetaPlayerId = IDL.Principal;
  const BetaPlayerData = IDL.Record({
    'id' : IDL.Principal,
    'faction' : IDL.Nat,
    'wallet' : IDL.Text,
  });
  const NFTsBeta = IDL.Service({
    'addBetaPlayer' : IDL.Func([IDL.Text, IDL.Nat], [IDL.Bool], []),
    'addCodes' : IDL.Func([CodesList], [IDL.Bool], []),
    'assignCodes' : IDL.Func([], [IDL.Text], []),
    'checkPlayerAdded' : IDL.Func([], [IDL.Bool], ['query']),
    'getAllCodes' : IDL.Func([], [IDL.Opt(BetaPlayerNFTs)], ['query']),
    'getAllCodesAv' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Nat, NFTType))],
        ['query'],
      ),
    'getAllCodesNum' : IDL.Func([], [IDL.Nat], ['query']),
    'getAllUsers' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(BetaPlayerId, BetaPlayerData))],
        ['query'],
      ),
    'getBetaPlayer' : IDL.Func([], [IDL.Opt(BetaPlayerData)], ['query']),
    'whoAmI' : IDL.Func([], [IDL.Principal], ['query']),
  });
  return NFTsBeta;
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
