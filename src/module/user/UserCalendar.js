import { Fragment, useEffect, useState } from "react";
import Loader from "../Loader";
import get from "../../func/get";
import css from "../../css/userCalendar.module.css";

import { Tooltip } from 'react-tooltip'

function rewrap(challenges) {
   try {
      let response = {}
      for (let i = 0; i < challenges.length; i++) {
         response[challenges[i][0]] = challenges[i]
      }
      return response
   } catch (e) {
      console.warn({ error: "Error: Most likely no matches played since feature activation" })
   }
}

var getDaysArray = function (start, end) {
   for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
      arr.push([`${dt.getMonth() + 1}-${dt.getDate()}`, dt.toDateString()]);
   }
   return arr;
};

function toObject(list) {
   const response = {};

   list.forEach(item => {
      response[item.challengeId] = item;
   });

   return response;
}

export default function Calendar({ user, verified }) {


   function loadHistory() {
      get("https://challenges.darkintaqt.com/api/v1/history/?id=" + user.id, setHistory)
   }

   const [history, setHistory] = useState({});
   const [currentFilter, setCurrentFilter] = useState("progress");

   function setFilter(evt) {
      setCurrentFilter(evt.currentTarget.getAttribute("data-action"));
   }


   if (verified === 0 || user.challenges.length === 0) {
      return <div style={{ width: "100%", float: "left" }}>
         <Loader />
         <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>Loading Summoner...</p>
      </div>
   }
   if (verified === false) {
      return "";
   }

   if (Object.keys(history).length === 0) {
      loadHistory();
      return <div style={{ width: "100%", float: "left" }}>
         <Loader />
         <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>Loading Calendar...</p>
      </div>
   }


   const dates = {};
   let challenges = rewrap(history.start);

   history.response.forEach(game => {
      const date = new Date(game.date * 1000);
      const dateString = `${date.getMonth() + 1}-${date.getDate()}`

      if (!dates[dateString]) {
         dates[dateString] = [[game.changes, game.matchId]];
      } else {
         dates[dateString].push([game.changes, game.matchId]);
      }
   });

   let datesFormatted = Object.keys(dates).map((key) => [key, dates[key]]);

   const datesFinal = {};
   let mostProgress = 0;
   let mostMatches = 0;
   let mostUpgrades = 0;

   for (let i = 0; i < datesFormatted.length; i++) {
      const date = datesFormatted[i];

      const [dateId, data] = date;

      for (let j = 0; j < data.length; j++) {
         const [changes, matchId] = data[j];
         let newChanges = []

         for (let k = 0; k < changes.length; k++) {
            const change = changes[k];
            let old = {
               tier: -1,
               points: 0
            }
            try {
               old = {
                  tier: challenges[change[0]][1],
                  points: challenges[change[0]][2]
               }
            } catch (e) {
               console.warn(`${change[0]} does not exist`)
            } finally {

               if (old.tier !== change[1] || old.points !== change[2]) {

                  newChanges.push({
                     challengeId: change[0],
                     new: {
                        tier: change[1],
                        points: change[2]
                     },
                     old: old
                  })

                  challenges[change[0]] = change
               }
            }
         }
         datesFormatted[i][1][j][0] = newChanges;
      }

      const newData = datesFormatted[i][1];
      let totalProgress = toObject(newData[0][0]);
      let matchIds = [];
      let upgrades = 0;

      for (let i = 0; i < newData.length; i++) {
         const day = newData[i];
         matchIds.push(day[1]);

         for (let k = 0; k < day[0].length; k++) {
            const oneDayData = day[0][k];

            if (!totalProgress[oneDayData.challengeId]) {
               totalProgress[oneDayData.challengeId] = oneDayData;
            } else {
               const today = totalProgress[oneDayData.challengeId];
               if (today.new.tier < oneDayData.new.tier || today.new.points < oneDayData.new.points) {
                  totalProgress[oneDayData.challengeId].new = today.new;
                  if (today.new.tier < oneDayData.new.tier) {
                     upgrades++;
                  }
               }
            }
         }
      }

      datesFinal[dateId] = {
         matchIds,
         totalProgress,
         upgrades
      }

      if (Object.keys(totalProgress).length > mostProgress) {
         mostProgress = Object.keys(totalProgress).length
      }
      if (matchIds.length > mostMatches) {
         mostMatches = matchIds.length;
      }
      if (upgrades > mostUpgrades) {
         mostUpgrades = upgrades;
      }
   }

   let firstDate = Date.now() - (1000 * 60 * 60 * 24 * 90);
   let datesArray = getDaysArray(firstDate, Date.now());

   const datesComponent = datesArray.map((dateIds) => {

      const date = dateIds[0];

      if (!datesFinal[date]) {
         return <div key={date} className={`${css.off}`} data-tooltip-id={date} data-tooltip-content={dateIds[1]}>
            <Tooltip id={date} />
         </div>;
      } else {

         if (Object.keys(datesFinal[date].totalProgress).length > 200) {
            console.log(datesFinal[date])
         }

         let offset = .5;
         if (currentFilter === "matches") {
            offset = Math.min(datesFinal[date].matchIds.length / mostMatches, 1);
         }
         if (currentFilter === "progress") {
            offset = Object.keys(datesFinal[date].totalProgress).length / mostProgress
         }
         if (currentFilter === "upgrades") {
            console.log(datesFinal[date].upgrades);
            offset = datesFinal[date].upgrades / mostUpgrades
         }

         return <div key={date} className={`${css.on}`} style={{ "--opacity": Math.max(offset, .05) }} data-tooltip-id={date} data-tooltip-html={dateIds[1] + "<br/><br/>" + datesFinal[date].matchIds.length + " Game" + (datesFinal[date].matchIds.length === 1 ? "" : "s") + "<br/>" + Object.keys(datesFinal[date].totalProgress).length + " progressed<br/>" + datesFinal[date].upgrades + " upgraded"}>
            <Tooltip id={date} />
         </div>;
      }

   });

   function overflow(min, max, num) {
      while (num > max && num > min) {
         num -= max;
      }
      return num;
   }

   for (let i = 0; i < overflow(0, 6, new Date(firstDate).getDay() + 6); i++) {
      datesComponent.unshift(<div className={css.placeholder} key={i} />)
   }

   ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].reverse().forEach(day => {
      datesComponent.unshift(<div key={day} className={css.day}>{day}</div>);
   })



   return <div className={css.calendar}>

      <div className={`${css.buttons} ${css[currentFilter]}`}>
         <button onClick={setFilter} data-action="matches" className={css.matches}>By matches</button>
         <button onClick={setFilter} data-action="progress" className={css.progress}><i className="fa-solid fa-angles-right"></i> By progress</button>
         <button onClick={setFilter} data-action="upgrades" className={css.upgrades}><i className="fa-solid fa-angles-up"></i> By upgrades</button>
      </div>

      <div className={css.calendarElement}>
         {datesComponent}
      </div>
   </div>;
}