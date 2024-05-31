window.onload = function(){
    let total_sum = sessionStorage.getItem("total_sum");
    sessionStorage.removeItem("total_sum");

    $("span#total_sum").text(total_sum);

    $("input[name=buy]").click(function(){
        let name = $("input[name=name]").val();
        let telephone = $("input[name=telephone]").val();
        let method_obtaining = $("select[name=method_obtaining]").val();
        let method_payment = $("select[name=method_payment]").val();

        if(name && telephone){
            console.log("send");
            $.ajax({
                type: "POST",
                url: "/buy",
                data: {
                    'name': name,
                    'telephone': telephone,
                    'method_obtaining': method_obtaining,
                    'method_payment': method_payment,
                },
                success: function(data){
                    console.log(data);
                    if(data['result']){
                        $("div.content").html(`${data['answ']} <br> <a href='/Basket'>Нажмите, чтобы вернуться к покупкам</a>`);
                    }
                }
            });
        }
    });
};