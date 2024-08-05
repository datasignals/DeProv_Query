import {Request, Response} from "express";
import QueryAllByAddress from "./QuerryByAddress";

export namespace Route {
    export namespace Get {
        export async function QuerryAllByAddress(req: Request, res: Response) {
          
            // console.log("IN ROUTES", req.query.accountId)
            const account = req.query.accountId?.toString();
            try {
                
                const events = await new QueryAllByAddress().queryallbyaddress(account);
                // console.log("RESULT", events);
                    if (events) {
                        res.status(200).send({ success: true, status: 'Connected', data: events });
                    } else {
                        res.status(404).send({ success: false, status: 'Not Connected' });
                    }
            } catch (error) {
                res.status(500).send({ success: false, status: 'Internal Server Error' });
            }
        }   
    }
}
