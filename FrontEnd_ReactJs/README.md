# Demo webapp

This is a demo web app for identity service

## Tech stack

* Node Js version 20 or above
* React Js
* MUI


## How to start application
`npm install`

`npm start`


import 'bootstrap/dist/js/bootstrap.bundle.min.js';

<div className="schedule-page">
            <h1>Schedules</h1>

            {/* Bọc bảng trong PerfectScrollbar */}
            <PerfectScrollbar
                style={{ maxHeight: "600px", width: "100%" }}  // Chiều cao giới hạn và chiều rộng 100%
                options={{ suppressScrollX: false }}  // Kích hoạt cuộn ngang
            >
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Phim</th>
                            <th>Thời Gian</th>
                            <th>Ngày</th>
                            <th>Phòng</th>
                            <th>Chi Nhánh</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.map((schedule, index) => (
                            <tr key={schedule.id}>
                                <td>{index + 1}</td>
                                <td>{schedule.movieName}</td>
                                <td>{new Date(schedule.startDateTime).toLocaleTimeString()}</td>
                                <td>{new Date(schedule.startDateTime).toLocaleDateString()}</td>
                                <td>{schedule.room.name}</td>
                                <td>{schedule.room.branch.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </PerfectScrollbar>
        </div>

        1241982