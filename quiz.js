"use strict"
/*基本データ */
//地理のクイズ
const data = [
{
    question:"日本で一番面積が大きい都道府県は？",
    answers:["沖縄県","北海道","東京都","福岡県"],
    correct: "北海道"
},
{
    question:"日本で一番人口が多い都道府県は？",
    answers:["沖縄県","東京都","福岡県","北海道"],
    correct: "東京都"
},
{
    question:"日本で一番人口密度が高い都道府県は？",
    answers:["東京都","沖縄県","福岡県","北海道"],
    correct: "東京都"
},
];
//出題する問題数
const QUESTION_LENGTH = 3;
//解答時間（ms）
const ANSWER_TIME_MS = 10000;
//インターバル時間（ms）
const INTERVAL_TIME_MS = 10;

//解答の開始時間
let startTime = null;
//インターバルID
let intervalId = null;
//
let elapsedTime = 0;
//出題する問題データ
// let questions = data.slice(0, QUESTION_LENGTH);
let questions  =getRandomQuestion();
//出題する問題のインデックス
let questionIndex = 0;
//正解数
let correctCount = 0;



/*要素一覧 */
const startPage = document.getElementById("startPage");
const questionPage = document.getElementById("questionPage");
const resultPage = document.getElementById("resultPage");
const startButton = document.getElementById("startButton");
const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");
const optionButtons = document.querySelectorAll("#questionPage button");
console.log(optionButtons.length);
const resultMassage = document.getElementById("resultMessage");
const backButton = document.getElementById("backButton");
const questionProgress = document.getElementById("questionprogress");
const dialog = document.getElementById("dialog");
const questionResult = document.getElementById("questionResult");
const nextButton = document.getElementById("nextButton");
console.log(dialog, questionResult, nextButton);
/*処理 */
 startButton,addEventListener("click", clickStartButton);

 optionButtons.forEach((button) => {
    button.addEventListener("click", clickOptionButton);
 });

 nextButton.addEventListener("click", clickNextButton);

 backButton.addEventListener("click", clickBackButton);
/*関数一覧 */
function questionTimeOver(){
    questionResult.innerText = "✖";
    //ダイアログのボタンのテキストを設定する
    if(isQuestionEnd()){
        nextButton.innerText = "結果を見る";
    }else{
        nextButton.innerText = "次の問題へ";
    }
    //ダイアログを表示する
    dialog.showModal();
}

function startProgress(){
    startTime = Date.now;
    intervalId = setInterval(() => {
        const currentTime = Date.now();
        const progress = ((currentTime - startTime) / ANSWER_TIME_MS) * 100;
        questionProgress.value = progress;
        if(startTime + ANSWER_TIME_MS <= elapsedTime) {
            stopProgress();
            questionTimeOver();
            return;
        }
        elapsedTime += INTERVAL_TIME_MS;
    }, INTERVAL_TIME_MS);
}


function stopProgress(){
    //インタバルを停止する
    if(intervalId !== null){
        clearInterval(intervalId);
        intervalId = null;
    }
}

function reset() {
    questions = getRandomQuestion();
    questionIndex = 0;
    correctCount = 0;
    intervalId = null;
    elapsedTime = 0;
    //開始時間を初期化する
    startTime = 0;
    //開始時間を
    startTime = null;
    for (let i =0; i < optionButtons.length; i++){
        optionButtons[i].removeAttribute("disabled");
    }
}

function isQuestionEnd()  {
    return questionIndex +1 === QUESTION_LENGTH;
}

function getRandomQuestion() {
    const questionIndexList = [];
    while(questionIndexList.length !== QUESTION_LENGTH) {
        //出題する問題のインデックスをランダムに生成する
        const index = Math.floor(Math.random() * data.length);
        //インデックスリストに含まれていない場合、インデックスリストに追加する
        if (!questionIndexList.includes(index)) {
            questionIndexList.push(index);
        }
    }
    //出題する問題リストを取得する
    const questionList = questionIndexList.map((index) => data[index]);
    return questionList;
}

function setResult() {
    //正解率を計算
    const accuracy = Math.floor((correctCount / QUESTION_LENGTH) * 100);
    //正解率を表示する
    resultMassage.innerText = '正解率: ${accuracy}%';
}

function setQuestion() {
    //問題を取得する
    const question = questions[questionIndex];
    //問題番号を表示する
    questionNumber.innerText = `第 ${questionIndex +1} 間`;
    //問題文を表示する
    questionText.innerText = question.question;
    //選択肢を表示する
    for (let i = 0; i < optionButtons.length; i++){
        optionButtons[i].innerText = question.answers[i];
    }
}
/*イベント関数 */
function clickOptionButton(event) {
    //解答中の経過時間を停止する
    stopProgress();
    //すべての選択肢を無効化する
    optionButtons.forEach((button) =>{
    button.disabled = true;

        // button.setAttribute("disabled", "disabled");
    });
   
    const optionText = event.target.innerText;
    const correctText = questions[questionIndex].correct;

    if(optionText === correctText){
        correctCount++;
        questionResult.innerText = "○";
        // alert("正解");
    }else{
        questionResult.innerText = "✖";
        // alert("不正解");×
    }
    //最後の問題かどうかを判定する
    if(isQuestionEnd()){
        nextButton.innerText = "結果を見る";
    }else{
        nextButton.innerText = "次の問題へ";
    }

    //
    dialog.showModal();
    //     //正解率を設定する
    //     setResult();
        
    // //スタート画面を非表示
    // startPage.classList.add("hidden");
    // //問題画面を表示する
    // questionPage.classList.add("hidden");
    // //結果画面を表示する
    // resultPage.classList.remove("hidden")
}


function clickStartButton(){
    //クイズをリセットする
    reset();
    //問題画面に問題を設定する
    setQuestion();
    //解答の計測を開始する
    startProgress();
    //スタート画面を非表示
    startPage.classList.add("hidden");
    //問題画面を表示する
    questionPage.classList.remove("hidden");
    //結果画面を表示する
    resultPage.classList.add("hidden");
}

function clickNextButton() {
    console.log("nextbutton");
    if(isQuestionEnd()){
    setResult();
    //ダイアログを閉じる
    dialog.close();
    
    startPage.classList.add("hidden");
    //問題画面を非表示する
    questionPage.classList.add("hidden");
    //結果画面を表示する
    resultPage.classList.remove("hidden");
    }else{
        questionIndex++;
        //問題画面に問題を設定する
        setQuestion();   
        //すべての選択肢を有効化する
        //インターバルIDを初期化する
        intervalId = null;
        //解答中の経過時間を初期化する
        elapsedTime = 0;
        
        for(let i = 0; i < optionButtons.length; i++) {
            optionButtons[i].removeAttribute("disabled");
        }
        //ダイアログを閉じる
        dialog.close();
        //解答の経過時間計測
        startProgress();
    }
}

function clickBackButton() {
    startPage.classList.remove("hidden");
    questionPage.classList.add("hidden");
    resultPage.classList.add("hidden");
}