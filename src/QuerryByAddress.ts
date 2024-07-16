import { ApiPromise, WsProvider } from '@polkadot/api';
import { Codec } from '@polkadot/types/types';
import * as config from '../config/config.json';

export const blockchainConfig = config.blockchain;

export default class QueryAllByAddress{
    
    async  queryallbyaddress(account: string | undefined) {
        console.log("IN ROUTES",account)
        let provider: WsProvider | null = null;
        try {
            console.log("IN ROUTES", account);
    
            // Connect to the blockchain node
            console.log("PROVIDER CON", blockchainConfig.provider);
            provider = new WsProvider(blockchainConfig.provider);
    
            // Wait for the provider to be ready with a timeout
            await Promise.race([
                provider.isReady,
                new Promise((_, reject) => setTimeout(() => reject(new Error("Connection timeout")), 5000))
            ]);
    
            console.log("PROVIDER", provider.isConnected);
    
            if (provider.isConnected) {
                const api = await ApiPromise.create({ provider });
                if (api.isConnected) {
                    console.log("API", api.isConnected);
                    // Querying storage
                    const { templateModule } = api.query; // Adjust to match your pallet name in Substrate
                    console.log("QUERRY",templateModule)
                    // Querying the storage
                    const storageResult = await templateModule.disReAssembly(account);
                    // const entries = await api.query.templateModule.disReAssembly.entries();
                    // console.log("DISASSEMBLY",entries);
                    // let creationtimeHex =  '0x6c6f636b756c6172000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
                    // const creationtime = await this.decodeHex(creationtimeHex);
                    // console.log("Decoded Creation Time:", creationtime);

                    const data = storageResult.toJSON() as {
                        creationtime: string;
                        filepath: string;
                        eventkey: string;
                    };
                    const decodedData = this.decodeData(data);
                    console.log("DATA",decodedData)
                    return decodedData;
                    // Query all entries in the storage map
                // const entries = await api.query.templateModule.disReAssembly.entries();
                // // console.log("ENTRIES", entries.());

                // // Fetch and decode all records
                // const allRecords = entries.map(([storageKey, storageValue]) => {
                //     console.log("STOR",storageKey)
                //     console.log("STOR",storageValue.toHuman)
                //     const accountId = storageKey.args.map(arg => arg.toString()).join('');
                //     // const decodedValue = storageValue.unwrapOr(null);

                //     // const decodedKey = key.toHuman() as string;
                //     console.log("KEYS",accountId);
                //     // console.log("VALUE",value.toHex);
                //     // const decodedValue = value.toJSON() as {
                //     //     creationtime: string;
                //     //     filepath: string;
                //     //     eventkey: string;
                //     // };
                //     // return {
                //     //     key: decodedKey,
                //     //     value: this.decodeData(decodedValue)
                //     // };
                   
                // });

                // return allRecords;
                    
                
                
                }
            } else {
                return false;
            }
        } catch (error) {
            console.error("Error connecting to the blockchain Node");
            return error;
        } finally {
            if (provider) {
                provider.disconnect();
            }
        }
    }
    async decodeData(data: { creationtime: string; filepath: string; eventkey: string }): Promise<{ creationtime: string; filepath: string; eventkey: string; }> {
        return {
            creationtime: this.decodeHex(data.creationtime),
            filepath: this.decodeHex(data.filepath),
            eventkey: this.decodeHex(data.eventkey)
        };
    }



    decodeHex(hexString: string): string {
        // Remove '0x' prefix if present
        if (hexString.startsWith('0x')) {
            hexString = hexString.slice(2);
        }

        // Convert hex to bytes
        const bytes = [];
        for (let i = 0; i < hexString.length; i += 2) {
            bytes.push(parseInt(hexString.substr(i, 2), 16));
        }

        // Convert bytes to string (assuming UTF-8 encoding)
        const decodedString = new TextDecoder().decode(new Uint8Array(bytes));
        return decodedString.replace(/\0/g, ''); // Remove null characters
    }

    
}
// DATA Promise {
//     {
//       creationtime: 'Jul 16 15:18:45 2024',
//       filepath: '/A.txt',
//       eventkey: 'lockular'
//     }
//   }