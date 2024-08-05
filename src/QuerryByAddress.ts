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
                    // console.log("QUERRY",templateModule)
                    // Querying the storage
                    const entries = await templateModule.disReAssembly.entries(account);
                    // console.log("ENTRIES", entries);
                    // Decode and log the entries
                    const allRecords = await Promise.all(entries.map(async ([storageKey, storageValue]) => {
                        // Decode the storage key
                        const accountId = storageKey.args.map(arg => arg.toString()).join('');
                      
                        // Convert storage value to a human-readable format
                        const decodedValue = storageValue.toHuman();
                      
                        // Log the decoded key and value
                        // console.log("KEYS", accountId);
                        // console.log("VALUE", decodedValue);
                      
                        const data = storageValue.toJSON() as {
                          eventtype: string;
                          creationtime: string;
                          filepath: string;
                          eventkey: string;
                        };
                      
                        // Await the result of decodeData
                        const decodedData = await this.decodeData(data);
                        // console.log("DATA", decodedData);
                      
                        return {
                          key: accountId,
                          value: decodedData
                        };
                      }));
                      
                      return allRecords;
                
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
    async decodeData(data: { eventtype: string,creationtime: string; filepath: string; eventkey: string }): Promise<{ eventtype: string;creationtime: string; filepath: string; eventkey: string; }> {
        return {
            eventtype: this.decodeHex(data.eventtype),
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