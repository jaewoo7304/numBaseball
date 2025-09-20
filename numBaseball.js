const readline = require("readline");
//const { start } = require("repl");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let gameRecords = []; // 게임 기록 저장할 배열
let gameNum = 0; // 게임 번호 
let startTime;
let endTime;
let tryCount = 0;

function startMenu() {
    rl.question("게임을 새로 시작하려면 1, 기록을 보려면 2, 종료하려면 9를 입력하세요. \n", (line) => {
        if(line == 1){
            gameStart();
        }
        else if(line == 2){
            showRecords();
        }
        else if(line == 9){
            console.log("애플리케이션이 종료되었습니다.");
            rl.close();
        }
        else{
            console.log("잘못된 입력입니다.");
            startMenu();
        }
    });
}
// startMenu(); : 시작 / 종료 / 다른 숫자 입력 됐을 시 출력시키는 함수

function getRandomNumbers(){
    const correctNumberSet = new Set();
    while(correctNumberSet.size < 3){
        const setNum = Math.floor(Math.random() * 9) + 1;
        // math.random() : 0이상 1미만의 실수 난수 생성
        // math.random() * 9 : 0이상 9미만의 실수 난수 생성 0~8
        // math.floor() : 소수점 이하 버림 
        // 0~8까지의 정수 난수 생성
        // +1 : 1~9까지의 정수 난수 생성
        correctNumberSet.add(setNum);
    }
    console.log(correctNumberSet);
    console.log("컴퓨터가 숫자를 뽑았습니다.\n");
    return Array.from(correctNumberSet);
}

// getRandomNumbers(); : 컴퓨터가 서로 다른 3개의 숫자를 생성하는 함수
// set : 자동으로 중복 제거가 된다고 하여 사용
// 후에 배열로 변환 : 위치 정보를 위해서 변환함

function userInput(callback){ 
    rl.question("숫자를 입력해주세요 : ", (answer)=>{
        const userNumber = [];
        if(answer.length !== 3){
            console.log("3자리 숫자를 입력해주세요.");
            return userInput(callback);
        } 
        for(let i=0; i<3; i++){
            const num = parseInt(answer[i]);                    
            if(num < 1 || num > 9 || userNumber.includes(num)){
                console.log("1부터 9까지의 서로 다른 숫자를 입력해주세요.");
                return userInput(callback);
            }               
            userNumber.push(num);
        }       
        callback(userNumber);
    }); 
}


function strikeOrBall(userNumber, correctNumber, roundHistory){
    let strike = 0;
    let ball = 0;   
    for(let i=0; i<3; i++){
        if(userNumber[i] === correctNumber[i]){
            strike++;
        }
        else if(correctNumber.includes(userNumber[i])){
            ball++;
        }
    }
    
    if(strike === 0 && ball === 0){
        console.log("일치하는 숫자와 위치가 없습니다.");
        roundHistory.push("일치하는 숫자와 위치가 없습니다.")
    } else {
        console.log(`${ball} 볼 ${strike} 스트라이크`);
        roundHistory.push(`${ball} 볼 ${strike} 스트라이크`);
    }
    if(strike === 3){
        console.log("\n3개의 숫자를 모두 맞히셨습니다.");
        roundHistory.push("3개의 숫자를 모두 맞히셨습니다.")
        console.log("----------게임 종료----------");
        return true;
    }   
    return false;
}

// strikeOrBall(); : 스트라이크, 볼, 낫싱을 판별하는 함수
// 스트라이크, 볼, 낫싱을 판별하여 출력
// 스트라이크가 3개일 때 게임 종료
// 게임이 종료되었는지 여부를 true/false로 반환
// 이 booean 값을 gameStart 함수에서 받음


function gameStart(){
    const correctNumber = getRandomNumbers();
    startTime = new Date();
    tryCount = 0; // 새 게임 시작 시 시도횟수 리셋
    let roundHistory = [];
    

    function playRound() {
        userInput(function(userNumber){
            tryCount++;
            roundHistory.push(`숫자를 입력해주세요 : ${userNumber.join("")}`);
            const isGameOver = strikeOrBall(userNumber, correctNumber, roundHistory);
            if(!isGameOver){
                playRound();
            } else {
                endTime = new Date();
                gameNum++;
                gameRecords.push({
                    id : gameNum,
                    start : formatDate(startTime),
                    end : formatDate(endTime),
                    count : tryCount,
                    history : roundHistory
                })
                startMenu();
            }
        });
    }
    playRound();
}

function showRecords(){
    if(gameRecords.length === 0){
        console.log("저장된 게임 기록이 없습니다.");
        console.log("--------------------------");
        startMenu();  // 다시 게임 시작해야함
    } else{
        console.log("\n게임 기록");
        gameRecords.forEach((record) => {
            console.log(
                `[${record.id}] / 시작시간 : ${record.start} / 종료시간 : ${record.end} / 횟수 : ${record.count}`
            );
        });
        selectRecords();
    }
}
        
          

function selectRecords(){
    rl.question("확인할 게임 번호를 입력하세요 (종료하려면 0을 입력) : ", (recordNum) => {
            const num = parseInt(recordNum);
            if(num === 0){
                startMenu();
            } else{
                const recordId = gameRecords.find(index => index.id === num);
                if(!recordId){
                    console.log("게임 기록이 없습니다.");
                } else{
                    console.log(`\n${recordId.id}번 게임 결과`);
                    recordId.history.forEach(records => console.log(records));
                    console.log("--------기록 종료-----------");
                }
                selectRecords();
            }
        })
}

function formatDate(date){
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}`; 
}

startMenu();

/* 게임 기록 말고 끝난 게임 진행 내역 보여주는거
구현 어떻게 해야되지?
playRound() 함수 안에서 내가 입력했던 숫자랑 출력했던 로그들을
저장해두고 gameRecords 배열 안에 있는 gameNum id값을 입력 받아서
해당 id값에 맞는 라운드 기록을 출력하면 될텐데
일단 배열을 하나 만들어서 거기에 기록들을 게임이 종료될 때까지 똑같이 콘솔 로그로 
push하면 될 것 같은데 
기록들을 게임 진행 과정과 똑같이 어떻게 저장을 할까
*/






// rl.on('closse', ()=>{
//     process.exit();
// })

// function getRandomNumbers() {
//     const ranNum = [];
//     while(ranNum.length < 3){
        
//     }
// }

/*
1 ~ 9까지 서로 다른 숫자로 이루어진 3자리 숫자 맞추기 게임

사용자가 1을 입력 시 게임 시작
9을 입력 시 게임 종료

시작 
-----
컴퓨터가 1 ~ 9까지 랜덤 3자리 숫자 선택
플레이어는 컴퓨터가 뽑은 랜덤 3자리 숫자를 입력해야함.

규칙
------
스트라이크 : 입력한 숫자가 위치와 숫자 모두 동일
볼 : 숫자가 포함되지만 위치가 다를 경우
낫싱 : 숫자와 위치 모두 다를 경우

--------------------------------------------------------------

반복문으로 시작 (while)

조건문 -> 만약 사용자가 입력한 값이 1이라면
-> 
컴퓨터는 랜덤한 3자리 숫자를 생성 후, 배열에 넣음. (위치까지 생각해야함)
"컴퓨터가 숫자를 뽑았습니다." 텍스트 출력

"숫자를 입력해주세요 : " 텍스트 출력 후 사용자가 3자리 숫자 입력(배열로 입력?)

이거 찾아보니까 입력이 비동기 식이라서 안 되는 구현 방법인거 같음
*/

// 콜백함수 부분
// 하다가 도저히 구현 자체가 안 되서 썼다.
// 썼는데, 우윤님이랑 페어프로그래밍 하면서 해석을 해봤다. 같이 설명을 해봤다.
// 추가 설명이 필요하다. 콜백함수에 대해

// userInput(); : 사용자가 3자리 숫자를 입력하는 함수
// 입력한 숫자가 3자리가 아니거나 1~9까지의 숫자가 아니거나, 중복된 숫자가 있을 때 다시 입력받음
// 제대로 숫자를 입력했을 때 callback 함수 실행
// callback 함수는? : 나중에 실행하기 위해 다른 함수에 전달되는 함수
// userInput 함수 끝난 후 후에 gameStart 함수에서 재실행

// gameStart(); : 게임 시작 함수
// correctNumber 변수에 컴퓨터가 생성한 3자리 숫자 배열을 저장
// playRound 함수 : 라운드 처리 함수
// playRound 함수 안에서 userInput 함수 호출
// userInput 함수가 끝난 후에 콜백 함수 실행
// 콜백 함수 안에서 strikeOrBall 함수 호출
// strikeOrBall 함수가 반환한 boolean 값을 isGameOver 변수에 저장
// isGameOver 값이 false일 때 playRound 함수 재귀호출 다시 숫자 입력 받음
// isGameOver 값이 true일 때 startMenu 함수 호출하여 게임 종료 후 시작/종료 메뉴로 돌아감

// 동기 비동기
// 동기 : 동기는 한 작업이 끝나야만 다음 작업이 실행 가능
// 비동기 : 작업이 완료되지 않아도 다음 작업을 진행 가능
// 궁금한 점 : readline은 비동기적으로 사용자에게 입력을 받는 것으로 알고있는데, while문 같은 반복문은 동기식으로 동작 
// 처음에 게임 종료 후 다시 1부터 9까지 숫자 입력 받는 것을 while(true)를 통한 무한 반복문으로 만드려고 했는데, 불가능한지