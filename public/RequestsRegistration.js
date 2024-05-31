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
    
    $("input[name=log_in]").click(function(){
        let login = $("input[name=login]").val();
        let password = $("input[name=password]").val();

        if(login && password){
            $.ajax({
                type: "POST",
                url: "/log_in",
                data: {
                    'login': login,
                    'password': password
                },
                success: function(data){
                    console.log(data);
                    
                    if(data['result']){
                        window.location.href = `${data['data']}`;
                    }
                    else{
                        $("div.error").text(data['data']);
                    }
                }
            });
        }
        else{
            $("div.error").text("Введите данные");
        }
        
    });

    $("input[name=register]").click(function(){
        let login = $("input[name=login]").val();
        let password = $("input[name=password]").val();

        if(login && password){
            $.ajax({
                type: "POST",
                url: "/register",
                data: {
                    'login': login,
                    'password': password
                },
                success: function(data){
                    console.log(data);
                    $("div.error").text(data);
                }
            });
        }
        else{
            $("div.error").text("Введите данные");
        }
    });
};