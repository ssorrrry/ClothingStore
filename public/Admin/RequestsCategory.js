$(document).ready(function(){
    $.ajax({
        type: "POST",
        url: "/category",
        success: function(data){
            updateTable(data);
        },
        error: function(http, status, e)
        {
            console.log(http);
        }
    });

    $("#category").on("click", "input[name=update]", function() 
    {
        let tr = $(this).closest('tr');
        let id = tr.find('input[name=id]').val();
        let name = tr.find('input[name=name]').val();

        let data = {
            id: id,
            name: name
        };

        $.ajax({
            type: "POST",
            url: "/update_category",
            data: data,
            success: function(data){
                if(!data['result']){
                    $("#log").text(data['err']);
                }
                else{
                    $("#log").text(data['answ']);
                }
            },
            error: function(http, status, e)
            {
                console.log(http);
            }
        });
    });

    $("#category").on("click", "input[name=delete]", function() 
    {
        let tr = $(this).closest('tr');
        let id = tr.find('input[name=id]').val();
        let name = tr.find('input[name=name]').val();

        let data = {
            id: id,
        };

        $.ajax({
            type: "POST",
            url: "/delete_category",
            data: data,
            success: function(data){
                if(data){
                    tr.remove();
                    $("#log").text(data['answ']);
                }
            },
            error: function(http, status, e)
            {
                console.log(http);
            }
        });
    });

    $("input[name=create]").click(function()
    {
        let tr = $(this).closest('tr');
        let name = tr.find('input[name=name]').val();
        tr.find('input[name=name]').val('');

        if(name != '')
        {
            let data ={
                name: name
            };
    
            $.ajax({
                type: "POST",
                url: "/create_category",
                data: data,
                success: function(data){
                    if(data['result']){
                        let newRow = $("<tr>");
                        newRow.append(`<input type='hidden' name='id' value='${data['id']}'>`);
                        newRow.append(`<td class='category_table'><input type='text' name='name' value='${data['name']}' class='input_text'></td>`);
                        newRow.append(`<td class='category_table'><input type='button' value='Редактировать' name='update' class='submit-update'></td>`);
                        newRow.append(`<td class='category_table'><input type='button' value='Удалить' name='delete' class='submit-delete'></td>`);
                        $("#category").append(newRow);

                        $("#log").text(data['answ']);
                    }
                    else{
                        $("#log").text(data['err']);
                    }
                    
                },
                error: function(http, status, e)
                {
                    console.log(http);
                }
            });
        }        
    });
});

function updateTable(data)
{
    for(let i = 0; i < data.length; i++)
    {
        let newRow = $("<tr>");
        newRow.append(`<input type='hidden' name='id' value='${data[i]['id']}'>`);
        newRow.append(`<td class='category_table'><input type='text' name='name' value='${data[i]['name']}' class='input_text'></td>`);
        newRow.append(`<td class='category_table'><input type='button' value='Редактировать' name='update' class='submit-update'></td>`);
        newRow.append(`<td class='category_table'><input type='button' value='Удалить' name='delete' class='submit-delete'></td>`);
        $("#category").append(newRow);
    }
}