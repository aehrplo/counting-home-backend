# counting-home-backend
[Coupy](https://github.com/HyeokjinKang) 가 만든 [집 가고 싶다](https://github.com/HyeokjinKang/counting-home) 를 위한 백엔드입니다. <br>
주단위로 하드코딩 되어있던 기존 코드를 대신해 _어떤어떤_ ical에서 정보를 주기적으로 동기화합니다.<br><br>
`const icalURL`에 참조하고싶은 ical 주소를 넣으세요.<br><br>
모든 스케줄은 `Array` 타입의 `ScheduleDB` 에 저장됩니다.<br>
`ScheduleDB`는 주기적으로 정렬되며, 60일 이전의 스케줄은 모두 지워집니다.
<br><br>
## API
---
`GET /schedule/comming`
<br><br>
### Response
```{.JSON}
{  
  type: 'School',
  date: 'Mon May 24 2021 00:00:00 GMT+0900 (Korean Standard Time)',
  uid: 'anyUid-School'  
}
```
<br><br>
`GET /schedule/all`
<br><br>
### Response
```{.JSON}
{
  '0': {
    type: 'Home',
    date: 'Sat Apr 10 2021 00:00:00 GMT+0900 (Korean Standard Time)',
    uid: 'anyUid-Home'
  },
  '1': {
    type: 'School',
    date: 'Mon Apr 26 2021 00:00:00 GMT+0900 (Korean Standard Time)',
    uid: 'anyUid-School'
  },

...

  '6': {
    type: 'Home',
    date: 'Sat Jul 03 2021 00:00:00 GMT+0900 (Korean Standard Time)',
    uid: 'anyUid-Home'
  }
}
```