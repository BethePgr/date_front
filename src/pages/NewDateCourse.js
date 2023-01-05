import moment from "moment/moment";
import React, {useEffect, useRef, useState} from "react";
import Calendar from 'react-calendar';
import { useLocation } from "react-router-dom";
import '../css/Calendar.css';
import '../css/NewDateCourse.css';
import { API_BASE_URL } from "../config/host-config";
import OneCourse from "../components/OneCourse";
export const BASE_URL = API_BASE_URL + '/api/mycourses';


const NewDateCourse = () => {

    const ACCESS_TOKEN = localStorage.getItem('ACCESS_TOKEN');

    const [value, setValue] = useState(new Date());

    //선택한 날짜
    const dateRef = useRef(null);
    const [meetingDate, setMeetingDate] = useState(null);

    const [myDateCourse, setMyDateCourse] = useState({
        postId: '',
        meetingDate: ''
    });

    const location = useLocation();

    //날짜를 선택한 후 받게 되는 POST 객체
    const [mypostList, setMyPostList] = useState([]);
    const [postCnt, setPostCnt] = useState(0);

    //날짜 선택 -> 전에 저장해놨던 일정을 조회(저장되어있는 POST)
    const clickDateHandler = e => {
        dateRef.current = e;
        console.log(moment(dateRef.current).format("YYYY-MM-DD"));
        let selectedDate = moment(dateRef.current).format("YYYY-MM-DD");
        setMyDateCourse({...myDateCourse, meetingDate: selectedDate});

        

        fetch(BASE_URL+`/mycourse/${selectedDate}`, {
            method: 'GET',
            headers: {
                'Authorization' : 'Bearer ' + ACCESS_TOKEN
            }
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
            setPostCnt(json.count);
            setMyPostList(json.posts);
        });

        // addCourseHandler(myDateCourse);

    }

    const mycourseItems = mypostList.map(mypost => <OneCourse key={mypost.postId} mypost={mypost}/>)



    //새로운 일정 등록하기
    const addCourseHandler = () => {
        console.log('myDateCourse: ', myDateCourse);

        fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization' : 'Bearer ' + ACCESS_TOKEN
            },
            body: JSON.stringify(myDateCourse)
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
            setPostCnt(json.count);
            setMyPostList(json.posts);
        })
    };


    useEffect(() => {
        let pageLocation = location.pathname;
        let pageId = pageLocation.substring(11);
        console.log(pageId);
        setMyDateCourse({...myDateCourse, postId: pageId});


    },[]);

    const noSchedule = (
        <div className="oneCourse">
            <div style={{fontSize: 20}}>등록된 일정이 없습니다</div>
        </div>
    );

    return (
        <>
            <div className="wrapper">
                <h5 style={{fontSize: 40, marginBottom: 40}}>내 일정</h5>
                <div style={{fontSize: 15}}>날짜를 선택해주세요</div>
                <div className="courseBox">
                    <Calendar onChange={setValue} onClickDay={clickDateHandler} value={value} className="react-calendar"/>
                    <div className="scheduleBox">
                        <div style={{fontWeight: 700}}>
                            {moment(value).format("YYYY년 MM월 DD일")} 
                        </div>
                        <box className="mySchedules">
                            {postCnt ? mycourseItems : noSchedule}
                        </box>
                        <button className="addScheduleBtn" onClick={addCourseHandler}>일정 추가하기</button>
                    </div>
                        
                </div>

            </div>
        </>
    );
};

export default NewDateCourse;