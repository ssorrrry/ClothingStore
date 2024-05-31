window.onload = function(){
    let color = $("span#color").text().trim();
            
            if(color == "черный"){
                $("span#color").css("color", "black");
            } else if(color == "черный/белый"){
                $("span#color").css("color", "black"); 
            } else if(color == "золотой"){
                $("span#color").css("color", "yellow");
            } else if(color == "коричневый"){
                $("span#color").css("color", "brown");
            }

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

    $("input[type=submit]").click(function(){
        let id_product = $("input[name=id_product]").val();
        let size = $("select[name=size]").val();

        $.ajax({
            type: "POST",
            url: "/add_basket",
            data: {
                'id_product': id_product,
                'size': size
            },
            success: function(data){
                console.log(data);
                $("span.error").text(data);
            }
        });
    });
};