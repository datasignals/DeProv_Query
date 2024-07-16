import { ApiPromise, WsProvider } from '@polkadot/api';
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
                    return true;
                }
            } else {
                return false;
            }
        } catch (error) {
            console.error("Error connecting to the blockchain node");
            return false;
        } finally {
            if (provider) {
                provider.disconnect();
            }
        }
    }
    // const api = await ApiPromise.create({provider});
    // console.log("API",api)
    
    // if(api){
    //     return true
    // }
    // else {
    //     return false}
    // try {
    //     // Fetch the storage map for the specific account ID
    //     const event = await api.query.palletTemplate.disReAssembly(accountId);

    //     if (event) {
    //         return { error: 'No events found for this account' };
    //     } else {
    //         return event;
    //     }
    // } catch (error) {
    //     throw new Error(`Failed to query events: }`);
    // } finally {
    //     await api.disconnect();
    // }
}
