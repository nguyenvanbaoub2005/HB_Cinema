import React, { useEffect } from "react";
import { getAllSchedule } from "../../api/apiSchedule";

const ScheduleList = () => {
  useEffect(() => {
    const fetchAllSchedule = async () => {
      const data = await getAllSchedule();
      console.log(data);
    };

    fetchAllSchedule();
  }, []);
  return <div></div>;
};

export default ScheduleList;
