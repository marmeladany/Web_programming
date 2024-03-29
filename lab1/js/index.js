$(function() {
    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    function validate_coordinate(coordinate){
        if($(coordinate).is(':checked')){
            return true;
        }
        else{
            return false;
        }
    }

    function validate_y() {
        const Y_MIN = -3;
        const Y_MAX = 3;
        let yField = $('#y_input');
        let numY = yField.val().replace(',', '.');

        if (isNumeric(numY) && numY >= Y_MIN && numY <= Y_MAX)
        {
            return true;
        } else {
            return false;
        }
    }

    function validateForm() {
        return validate_coordinate('.x_input') & validate_y() & validate_coordinate('.r_input');
    }

    window.onunload = load_table();

    function load_table(){
        for(let i=0; i<sessionStorage.length; i++) {
            let key = sessionStorage.key(i);
            $('#result_table').append(sessionStorage.getItem(key));
        }
    }

    function get_random_int(){
        return Math.floor(Math.random() * 100);
    }

    $('#form').on('submit', function(event) {
        /*if(document.getElementById("errors").rows.length != 0){
            let table = document.getElementById("errors");
            let rowCount = table.rows.length;
            while(table.rows.length > 0) {
                table.deleteRow(0);
            }
        }*/
        event.preventDefault();
        document.getElementById("errors_div").innerHTML = '';

        if (!validate_coordinate('.x_input')){
            document.getElementById('errors_div').innerHTML = '<b>X coordinate error</b>';
            return;
        }
        if (!validate_y()){
            document.getElementById('errors_div').innerHTML = '<b>Y coordinate error</b>';
            return;
        }
        if (!validate_coordinate('.r_input')){
            document.getElementById('errors_div').innerHTML = '<b>R coordinate error</b>';
            return;
        }
        if (!validateForm()) return;

        $.ajax({
            url: 'php/index.php',
            method: 'POST',
            data: $(this).serialize() + '&timezone=' + new Date().getTimezoneOffset() + '',
            dataType: "HTML",
            success: function(answer) {
                if($(answer).find('#validation_error').html()){document.getElementById('errors_div').innerHTML = '<b>Server validation error</b>';}
                else{
                    let str = get_random_int().toString();
                    let result = '<tr>' + $(answer).find('#take_this').html() + '</tr>';
                    $('#result_table').append(result);
                    sessionStorage.setItem(str, result);
                }
            }
        });
    });
});
