window.onload = function(){
    $.ajax({
        type: "POST",
        url: "/category",
        success: function(data){
            console.log(data);
            let content = '';
            for(let i = 0; i < data.length; i++){
                content +=  `<option value=${data[i]['id']}>${data[i]['name']}</option>`;
            }
            $("select[name=category]").append(content);
        }
    });

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

    // //Фильтрация товаров с отправкой запроса на сервер

    // $("select[name=category]").change(function(){
    //     let id_category = $(this).val();
    //     console.log(id_category);
    //     $.ajax({
    //         type: "POST",
    //         url: "/productsFilter",
    //         data: {
    //             'id_category': id_category
    //         },
    //         success: function(data){
    //             console.log(data);
    //             $("table#content").empty();
    //             let content = '';
    //             for(let i = 0; i < data.length; i++){
    //                 content += `<tr>`;
    //                 content += `<td class='td_product'>`;
    //                 content += `<a href='/ProductCatalog/Product/${data[i]['article']}'>`;
    //                 content += `<img src='${data[i]['image']}'><br><br>`;
    //                 content += `${data[i]['title']} <br>`;
    //                 content += `${data[i]['price']} руб`;
    //                 content += `</a>`;
    //                 content += `</td>`;
    //                 content += `</tr>`;
    //             }
    //             $("table#content").append(content);
    //         }
    //     });
    // });

    $("select[name=category]").change(function(){
        let id_category = $(this).val();

        if(id_category > 0){
            $("table#content").find("tr").hide();
            $("table#content").find(`input[name=id_category][value=${id_category}]`).closest("tr").show();
        }
        else{
            $("table#content").find("tr").show();
        }
    });
};