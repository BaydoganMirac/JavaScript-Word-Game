var level = 0;
var gameData = JSON.parse(dataS);
function setGame(gameData, level){
    $('#animation').css("display", "none");
    if(level > 0){
        $('#animation').css("display", "block");
        konfeti.stop();
        konfeti.play();
        let audio = document.getElementById("soundEffect");
        audio.play();
    }

    gameData[level].harfler.forEach(function(item, index){
        $(".randomLetter").append('<div class="absoluteLet"><div class="let" data-id="'+index+'">'+item+'</div></div>');
    });
    let karakter = gameData[level].harfler.length;
    let aci = 360/karakter;
    $('.absoluteLet').each(function(index, item){
        let yatay = aci*index;
        $(item).css({'transform': 'rotate('+ yatay +'deg)'});
        $(item).children().css({'transform': 'rotate('+ -1*yatay +'deg)'});;
    });
    let html = "";
    gameData[level].kelimeler.forEach(function(item, index){
        html += "<div class='letter' data-id='"+index+"' data-valid='0' >";

        for(let i = 0; i<item.length; i++){
            html+= "<div class='letter-item'>_</div>";
        }
        html += "</div>";
        $(".text").html(html);
    });
}
function checkAnswer(gameData, level, answer){
    let isTrue = true;
    console.log(level);
    gameData[level].kelimeler.forEach(function(item, index){
        if(item.toString() === answer.toString()){
            isTrue = false;
            $(".draggable").css("color", "green");
            for(let i = 0; i<answer.length; i++){
                $($(".letter[data-id = "+index+"]").children()[i]).html(answer[i]);
                $(".letter[data-id = "+index+"]").attr("data-valid","1");
            }
            setTimeout(function(){
                $(".draggable").css("color", "white");
            },2000);
        }

    });
    if(isTrue){
        $(".draggable").css("color", "red");
            setTimeout(function(){
                $(".draggable").css("color", "white");
        },2000);
    }
}
function checkTrues(gameData){
    let sum = 0;
    $('.letter').each(function(index, item){
        sum += parseInt($(item).attr("data-valid"));
        console.log($(item).attr("data-valid"));
    });
    if(sum == gameData[level].kelimeler.length){
        level++;
        $(".absoluteLet").remove();
        setGame(gameData, level);
    }
}

window.onload = function(){
    var yOffset = $('.draggable').offset().top;
    var xOffset = $('.draggable').offset().left;
    setGame(gameData, level);
    let text = [];
    $(".draggable").draggable({revert: true, 
        start: function(){
            text = [];
        },
        drag: function(){
            let i = 0;
            $('.let').each(function(index, item){
                if(($(item).offset().top-20 < $(".draggable").offset().top &&  $(".draggable").offset().top <  $(item).offset().top+20) &&  ($(item).offset().left-20 < $(".draggable").offset().left &&  $(".draggable").offset().left <  $(item).offset().left+20) ){
                    $(item).css("background-color", "purple");
                    //console.log($(item).html());
                    let dataID = $(item).data("id");
                    let val = $(item).html();
                    let isAddable = false;
                    text.forEach(function(item){
                        if(parseInt(item.id) == parseInt(dataID)){
                            isAddable = true;
                        }
                    });
                    if(isAddable == false){
                        text.push({id:dataID, value:val});
                    }
                }
            });

            let top = (window.innerHeight/$('.draggable').offset().top > 2)? 2 : window.innerHeight/$('.draggable').offset().top ;
            let left = (window.innerWidth/$('.draggable').offset().left > 2) ? 2 : window.innerWidth/$('.draggable').offset().left;
            if(yOffset >= $('.draggable').offset().top || xOffset <= $('.draggable').offset().left){
                $(".navigation").css('box-shadow', ''+(left*-10)+'px '+(top*10)+'px 20px 3px #fff');
            }
             if( yOffset <= $('.draggable').offset().top || xOffset >= $('.draggable').offset().left ){
                $(".navigation").css('box-shadow', ''+(left*10)+'px '+(top*-10)+'px 20px 3px #fff');
            }
        },
        stop: function(){
            let answer = "";
            text.forEach(function(item){
                answer += item.value;
            });
            checkAnswer(gameData, level, answer);
            $('.let').each(function(index, item){
                $(item).css("background-color", "turquoise");
            });
            checkTrues(gameData);
        }
    });
}