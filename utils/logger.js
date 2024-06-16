//Logtash sync log file to central log server  http://172.26.16.109:5601/
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const debug = process.env.DEBUG;
const logELK = process.env.LOG_ELK;
const moment = require('moment');
const log_prefix=process.env.APP_NAME||'app';

// const message = messages => {
//     return typeof messages === 'object' && !Array.isArray(messages) ? messages : { extra: Array.isArray(messages) ? messages : [messages] };
// };

const message = input => {

    if (typeof input === 'object' && !Array.isArray(input)) return [input];
    if (Array.isArray(input)) {
        // If input is already an array, ensure all items are objects
        return input.map(item => (typeof item === 'object' ? item : { details: item.toString() }));
    } else {
        // If input is not an array, wrap it in an array of objects
        return [{ details: input.toString() }];
    }
};

async function logger(obj,id) {
    let trace_id = id;
    if (debug) {
        console.log(JSON.stringify(message(obj)));
    }

    let index_log = log_prefix + '-' + moment().format("YYYYMMDD");

    if (!logELK) {
        fs.writeFile(index_log +'.log', JSON.stringify({_time:moment().format(),"X-Trace-ID":trace_id, messages:message(obj)})+'\n', { flag: 'a+' }, err => {});
    }else{

            let value_log = JSON.stringify(message(obj));
            //let value_log = message(obj);
            let v_date =  moment().format();
            let v_body = `{"@timestamp":"${v_date}","X-Trace-ID":"${trace_id}","messages":${value_log}}`; //"X-Trace-ID":"${trace_id}",
			fetch(process.env.ELK_URL + '/' + index_log + '/_doc', {
				method: 'POST',
				body:v_body,
				headers: { 'Content-Type': 'application/json', 'Authorization': process.env.ELK_APIKEY },
				timeout: process.env.CACHE_TIMEOUT|| 1000
			})
            .then(async res => {
                if(res.status===201 || res.status ===200){
                    if (debug) {
                        console.log("Log to Elastic success");
                    }
                }else{
                    if (debug) {
                        let rs = await res.json();
                        console.log("Log to Elastic body", v_body);
                        console.log("Log to Elastic failed :", rs.error);
                    }
                    
                    fs.writeFile(index_log +'.log', JSON.stringify({_time:moment().format(),"X-Trace-ID":trace_id,error:res.status, messages:v_body})+'\n', { flag: 'a+' }, err => {});
                }
            }) 
            .catch(error => 
                fs.writeFile(index_log +'.log', JSON.stringify({_time:moment().format(),"X-Trace-ID":trace_id,error:error,messages:v_body})+'\n', { flag: 'a+' }, err => {})
             )
    }
}

module.exports = logger ;
