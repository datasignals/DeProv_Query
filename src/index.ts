
// import Cors from "cors";
import Express from "express";
import bodyParser from "body-parser";
// // import {MongoService} from "./MongoService";
import {Route} from "./Routes";
// import * as config from '../config/config.json';

const app = Express()
//Port
const port = 3005;
// app.use(Cors({credentials: true}));
app.use(bodyParser.json());

app.get('/events/accountId',Route.Get.QuerryAllByAddress);
app.get('/events/filerecords',Route.Get.QuerryAllByFile);

app.listen(port, () => console.log(`File System Deprov Query listening on port ${port}`));

function Cors(arg0: { credentials: boolean; }): any {
    throw new Error("Function not implemented.");
}
