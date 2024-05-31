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

    $("input[name=delete]").click(function(){
        let elem_tr = $(this).closest("tr");
        let id = $(this).siblings("input[name=id_product_update]").val();
        let size = $(this).siblings("input[name=size_product_update]").val();
        let price = parseInt(elem_tr.find("span#price").text());
        let quantity = elem_tr.find("input[name=quantity_product_update]").val();
        
        $.ajax({
            type: "POST",
            url: "/delete_pr_basket",
            data: {
                'id': id,
                'size': size
            },
            success: function(data){
                console.log(data);
                if(data){
                    elem_tr.remove();
                    let total_sum = 0;
                    $("span#sum").each(function() {
                        total_sum += parseInt($(this).text());
                    });
                    if(total_sum == 0){
                        $("div.res").empty();
                        $("div.res").text("Пусто");
                    }
                    else{
                        $("span#total_sum").text(total_sum);
                    }   
                }
            }
        });
    });

    $("input[name=update]").click(function(){
        let elem_tr = $(this).closest("tr");
        let id = $(this).siblings("input[name=id_product_update]").val();
        let size = $(this).siblings("input[name=size_product_update]").val();
        let quantity = elem_tr.find("input[name=quantity_product_update]").val();
        let price = parseInt(elem_tr.find("span#price").text());

        if(quantity > 0){
            $.ajax({
                type: "POST",
                url: "/update_pr_basket",
                data: {
                    'id': id,
                    'size': size,
                    'quantity': quantity
                },
                success: function(data){
                    console.log(data);
                    if(data){
                        elem_tr.find("span#quantity").text(quantity);
                        elem_tr.find("span#sum").text(price * quantity);
                        let total_sum = 0;
                        $("span#sum").each(function() {
                            total_sum += parseInt($(this).text());
                        });
                        $("span#total_sum").text(total_sum);
                    }
    
                }
            });
        }
        else{
            $.ajax({
                type: "POST",
                url: "/delete_pr_basket",
                data: {
                    'id': id,
                    'size': size
                },
                success: function(data){
                    console.log(data);
                    if(data){
                        elem_tr.remove();
                        let total_sum = 0;
                        $("span#sum").each(function() {
                            total_sum += parseInt($(this).text());
                        });
                        if(total_sum == 0){
                            $("div.res").empty();
                            $("div.res").text("Пусто");
                        }
                        else{
                            $("span#total_sum").text(total_sum);
                        }   
                    }
                }
            });
        }

        
    });

    $("input[name=clear]").click(function(){
        $.ajax({
            type: "POST",
            url: "/clear_basket",
            success: function(data){
                console.log(data);
                if(data){
                    $("table.table-basket").empty();
                    $("div.res").empty();
                    $("div.res").text("Пусто");
                }
            }
        });
    });

    $("input[name=buy]").click(function(){
        let total_sum = parseInt($("span#total_sum").text());
        sessionStorage.setItem("total_sum", total_sum);
        window.location.href = "/BuyForm";
    });
};