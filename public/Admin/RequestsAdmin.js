window.onload = function(){
    $("div#info").find("a").click(function(){
        if($(this).text() == "Скрыть"){
            $("div#info").find("div").hide();
            $(this).text("Показать");
        }
        else{
            $("div#info").find("div").show();
            $(this).text("Скрыть");
        }
    });
};