window.onload = function(){
    $.ajax({
        type: "POST",
        url: "/check_session",
        success: function(data){
            console.log(data);
            if(data){
                $("a.account").text("Выйти");
                $("a.account").attr('href', '/log_out')
            }
        }
    });

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