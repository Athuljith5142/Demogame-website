
let Score = JSON.parse(localStorage.getItem('Score'));
if(Score === null){
    Score={
        win:0,
        loss:0,
        tie:0
    };
}
document.querySelector('.j-score').innerHTML=`${Score.win}`;
document.querySelector('.jb-score').innerHTML=`${Score.loss}`;
document.querySelector('.jd-score').innerHTML=`${Score.tie}`;
function rock(){

 let randomNumber = Math.random();
        let check='';
        const player = 'rock';
        if(randomNumber >= 0 && randomNumber <=1/3){
            check = 'rock';
        }
        else if(randomNumber>=1/3 && randomNumber<=2/3){
            check='paper';

        }
        else if(randomNumber >=2/3 && randomNumber <=1){
            check ='scissors';
        }

        let result='';
        if(check==='rock'){
            result='tie';
        }
        else if(check==='paper'){
            result='You lose';
        }
        else if(check==='scissors'){
            result='You win';
        }
        
        if(result==='You win'){
            Score.win+=1;
        }
        else if(result==='You lose'){
            Score.loss+=1;
        }
        else if(result==='tie'){
           Score.tie+=1;
        }

        localStorage.setItem('Score',JSON.stringify(Score));
    

document.querySelector('.j-score').innerHTML=`${Score.win}`;
document.querySelector('.jb-score').innerHTML=`${Score.loss}`;
document.querySelector('.jd-score').innerHTML=`${Score.tie}`;



document.getElementById('user').src = getImage(player);
document.getElementById('computer').src = getImage(check);
}

function paper(){
let randomNumber1 = Math.random();
    let check1='';
    const player = 'paper';
    let computerChoice = '';
    if(randomNumber1 >=0 && randomNumber1 <= 1/3){
        check1='rock';
    }
    else if(randomNumber1 >=1/3 && randomNumber1 <= 2/3){
        check1='paper';

    }
    else if(randomNumber1 >=2/3 && randomNumber1 <=1){
        check1='scissors';
    }
    
    let result1 = '';

    if(check1==='rock'){
        result1='You win';
    }
    else if(check1==='paper'){
        result1='tie';
    }
    else if(check1==='scissors'){
        result1='You lose';
    }


    if(result1==='You win'){
            Score.win+=1;
        }
    else if(result1==='You lose'){
            Score.loss+=1;
        }
    else if(result1==='tie'){
           Score.tie+=1;
        }


document.querySelector('.j-score').innerHTML=`${Score.win}`;
document.querySelector('.jb-score').innerHTML=`${Score.loss}`;
document.querySelector('.jd-score').innerHTML=`${Score.tie}`;


document.getElementById('user').src = getImage(player);
document.getElementById('computer').src = getImage(check1);
}

function getImage(choice) {
    return `./Assets/${choice}-emoji.png`;
}

function scissors(choice){
let randomNumber2 = Math.random();
    let check2='';
    const player = 'scissors';
    if(randomNumber2 >=0 && randomNumber2 <= 1/3){
        check2='rock';
    }
    else if(randomNumber2 >=1/3 && randomNumber2 <= 2/3){
        check2='paper';

    }
    else if(randomNumber2 >=2/3 && randomNumber2 <=1){
        check2='scissors';
    }
    
    let result2 = '';

    if(check2==='rock'){
        result2='You lose';
    }
    else if(check2==='paper'){
        result2='You win';
    }
    else if(check2==='scissors'){
        result2='tie';
    }
   
     if(result2==='You win'){
            Score.win+=1;
        }
    else if(result2==='You lose'){
            Score.loss+=1;
        }
    else if(result2==='tie'){
           Score.tie+=1;
        }


document.querySelector('.j-score').innerHTML=`${Score.win}`;
document.querySelector('.jb-score').innerHTML=`${Score.loss}`;
document.querySelector('.jd-score').innerHTML=`${Score.tie}`;


document.getElementById('user').src = getImage(player);
document.getElementById('computer').src = getImage(check2);
}
