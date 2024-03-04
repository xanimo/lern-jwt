const commands = [
    "abandontransaction"
    , "addmultisigaddress"
    , "addnode"
    , "addwitnessaddress"
    , "backupwallet"
    , "bumpfee"
    , "clearbanned"
    , "createauxblock"
    , "createmultisig"
    , "createrawtransaction"
    , "decoderawtransaction"
    , "decodescript"
    , "disconnectnode"
    , "dumpprivkey"
    , "dumpwallet"
    , "encryptwallet"
    , "estimatefee"
    , "estimatepriority"
    , "estimatesmartfee"
    , "estimatesmartpriority"
    , "fundrawtransaction"
    , "generate"
    , "generatetoaddress"
    , "getaccount"
    , "getaccountaddress"
    , "getaddednodeinfo"
    , "getaddressesbyaccount"
    , "getauxblock"
    , "getbalance"
    , "getbestblockhash"
    , "getblock"
    , "getblockchaininfo"
    , "getblockcount"
    , "getblockhash"
    , "getblockheader"
    , "getblockstats"
    , "getblocktemplate"
    , "getchaintips"
    , "getconnectioncount"
    , "getdifficulty"
    , "getinfo"
    , "getmemoryinfo"
    , "getmempoolancestors"
    , "getmempooldescendants"
    , "getmempoolentry"
    , "getmempoolinfo"
    , "getmininginfo"
    , "getnettotals"
    , "getnetworkhashps"
    , "getnetworkinfo"
    , "getnewaddress"
    , "getpeerinfo"
    , "getrawchangeaddress"
    , "getrawmempool"
    , "getrawtransaction"
    , "getreceivedbyaccount"
    , "getreceivedbyaddress"
    , "gettransaction"
    , "gettxout"
    , "gettxoutproof"
    , "gettxoutsetinfo"
    , "getunconfirmedbalance"
    , "getwalletinfo"
    , "help"
    , "importaddress"
    , "importmulti"
    , "importprivkey"
    , "importprunedfunds"
    , "importpubkey"
    , "importwallet"
    , "keypoolrefill"
    , "listaccounts"
    , "listaddressgroupings"
    , "listbanned"
    , "listlockunspent"
    , "listreceivedbyaccount"
    , "listreceivedbyaddress"
    , "listsinceblock"
    , "liststucktransactions"
    , "listtransactions"
    , "listunspent"
    , "lockunspent"
    , "move"
    , "ping"
    , "preciousblock"
    , "prioritisetransaction"
    , "pruneblockchain"
    , "removeprunedfunds"
    , "rescan"
    , "sendfrom"
    , "sendmany"
    , "sendrawtransaction"
    , "sendtoaddress"
    , "setaccount"
    , "setban"
    , "setmaxconnections"
    , "setnetworkactive"
    , "settxfee"
    , "signmessage"
    , "signmessagewithprivkey"
    , "signrawtransaction"
    , "stop"
    , "submitauxblock"
    , "submitblock"
    , "validateaddress"
    , "verifychain"
    , "verifymessage"
    , "verifytxoutproof"
  ]
  
  commands.is_command = (command) => {
    command = command.toLowerCase()
    for (var i = 0, len = commands.length; i < len; i++) {
      if (commands[i].toLowerCase() === command) {
        return true
      }
    }
  }
  
export default commands
