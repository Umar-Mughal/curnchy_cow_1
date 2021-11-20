import { NextApiRequest, NextApiResponse } from "next";
const testFolder = '../';
const fs = require('fs');
import content from './_metadata1.json';

export default function getNftById(req, res){
    //let rawdata = fs.readFileSync(content);
    //let all_data = JSON.parse(rawdata);
    //  all_data[0].url = "asd";
    //console.log(all_data[0]);
    //console.log(content[0]);
    res.json(content[req.query.id]);
}