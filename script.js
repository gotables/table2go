var store_key = "table_input"

function storage(act,key, value){
    if (act == "save"){
        sessionStorage.setItem(key, value)
    }else if (act == "clean"){
        sessionStorage.clear()
    }else if (act == "del"){
        sessionStorage.removeItem(key)
    }else if (act == "get"){
        return sessionStorage.getItem(key)
    }else(
        console.error("invaild action '" +act+ "' in storage")
    )
    return ""
}

function check_store(){
    var check = document.getElementById("store").checked
    storage("save", "store_check", check)
    if (check == false){
        storage("del", store_key, "")
        console.log("storage is invaild")
    }else if(check == true){
        var data = document.getElementById("input_table").value
        storage("save", store_key, data)
        console.log("inpute data is saved")
    }
}

function load_store_check(){
    var c = storage("get", "store_check")
    if (c == "false"){
        document.getElementById("store").checked = false
    }else{
        document.getElementById("store").checked = true
    }
}

function load_input_data(){
    var s = storage("get", store_key)
    if (s != null && s != ""){
        document.getElementById("input_table").value = s
    }else{
        document.getElementById("input_table").value = "input table data"
    }
}

function example(){
    var exa = 
"+--------------------+------------------+------+-----+---------+----------------+ \n \
| Field              | Type             | Null | Key | Default | Extra          | \n \
+--------------------+------------------+------+-----+---------+----------------+ \n \
| id                 | int(10) unsigned | NO   | PRI | NULL    | auto_increment | \n \
| uuid               | char(36)         | NO   | UNI | NULL    |                | \n \
| name               | varchar(64)      | NO   | UNI | NULL    |                | \n \
+--------------------+------------------+------+-----+---------+----------------+ \n \
"
    document.getElementById("input_table").value = exa
}