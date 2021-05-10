const ical = require('node-ical');
const express= require('express');
const cors= require('cors');
const _= require('lodash');

const icalUrl= require('./config.json').url;

let app= express();
let scheduleDB= new Array();
let thisIndex= 0;

app.use(cors());

const setDataFormat= (type, date) => {
    date.setDate(date.getDate() + (type == "Home" ? -2 : 2));
    return date.toString();
}
const getDate= (schedule) => {
    return [{
        type : "Home",
        date : `${setDataFormat("Home", schedule.start)}`,
        uid : `${schedule.uid}-Home`
    }, {
        type : "School",
        date : `${setDataFormat("School", schedule.end)}`,
        uid : `${schedule.uid}-School`
    }];
};
const verifyDate= (DB) => { //organized data
    let i;
    for(i=0; i<DB.length-1; i++){
        if (new Date() < new Date(DB[i].date)){
            break;
        }
    }
    thisIndex= i;
}
const deleteDB= (DB) => { //organized data
    let i;
    let today= new Date();
    today.setDate(today.getDate() - 60);
    for(i=0; i<DB.length-1; i++){
        if (today < new Date(DB[i].date)){
            break;
        }
    }
    for(let j=0; j<i; j++){
        DB.shift();
    }
    return DB;
}
const arrayToObj= (DB) => {
    let Obj= new Object();
    for (let i=0; i<DB.length-1; i++){
        Obj[i]= DB[i];
    }
    return Obj;
}

const makeUnique= (DB) => {
    return _.uniqBy(DB, 'uid');
}
const getSchedule= () => ical.fromURL(icalUrl, {}, (err, data) => {
    setTimeout(getSchedule, 5000);
    if (err) console.log(err);

    schedules= Object.values(data);
    schedules.shift();

    for (const schedule of schedules){
        if ( ((schedule.summary.indexOf('원격') != -1) && (schedule.summary.indexOf('2학년') != -1)) ){
            scheduleDB= scheduleDB.concat(getDate(schedule));
        }
    }

    scheduleDB= makeUnique(scheduleDB);
    scheduleDB= scheduleDB.sort((a, b) => { return new Date(a.date).getTime() > new Date(b.date).getTime() ? 1 : -1; });
});

getSchedule();
setTimeout(() => { setInterval(() => { scheduleDB= deleteDB(scheduleDB)}, 5000)}, 100);
setTimeout(() => { setInterval(() => { verifyDate(scheduleDB)}, 5000)}, 250);

app.get('/getSchedule/comming', (req, res) => {
    console.log(scheduleDB[thisIndex]);
    res.json(scheduleDB[thisIndex]);
});
app.get('/getSchedules', (req, res) => {
    let obj= arrayToObj(scheduleDB);
    console.log(obj);
    res.json(obj);
})

app.listen(3000);