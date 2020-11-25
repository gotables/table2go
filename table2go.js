
function table2go(in_table,opt){
    var go_struct_h = 'type Table struct \n{\n'
    var go_struct_f = '}'

    var example_mysql_var = {
        name:"",
        type:"",//int, string,uint
        null:false,
        key:"",//pri,uni,""
        default:"",//type is int, string
        extra:""
    }
    
    //console.log("in data:", in_table.trim())
    if (in_table.trim() == "input table data"){
        alert("Please input table")
        return
    }
    var opt = new Object()
    opt.simple = document.getElementById("simple").checked
    opt.store = document.getElementById("store").checked
    console.log(opt)

    if (opt.store == true){
        storage("save", "table_input", in_table)
        console.log("inpute data is saved")
    }

    try{
        var sql_vars = para_mysql_data(in_table)
    }catch (e){
        console.error(e)
        document.getElementById("output_go").innerHTML = e
        return
    }
    //console.log("sql var:", sql_vars)

    try{
       var out = create_go(sql_vars)
    }catch (e){
        console.error(e)
        document.getElementById("output_go").innerHTML = e
        return
    }
    document.getElementById("output_go").innerHTML = out
    //console.log("out data:", out)

    // console.log(go_struct)

    // var tempFn = doT.template(go_struct);
    // var result = tempFn({test:'id int'})
    // console.log(result)


    function para_mysql_data(input){
        var input_array = input.split('\n')
        var error 
        //console.log(input_array)
        var mysql_vars =new Array()
        for (var k = 0; k< input_array.length; k++) {
            var v = input_array[k].trim()
            console.log(k)
            console.log(v)
            if (v.indexOf("+--") >= 0){
                if (k > 2){
                    break
                }
            }else if (k == 1 && v.indexOf("Field") >= 0){
                continue
            }else if ( k > 2){
                var mysql_var = new Object()
                var v_low = v.toLowerCase()
                var v_array = v_low.slice(1,v_low.length-2).split('|')
                //console.log("v array:", v_array)
                if (v_array.length < 5){
                    throw new Error("syntax error: " + v)
                }
                //Field
                mysql_var.name = v_array[0].trim()
                //Type
                if (v_array[1].indexOf("unsigned") >= 0){
                    mysql_var.type = "uint"
                }else if (v_array[1].indexOf("int") >= 0){
                    mysql_var.type = "int"
                }else if (v_array[1].indexOf("char") >= 0 || v_array[1].indexOf("text") >= 0){
                    mysql_var.type = "string"
                }else{
                    throw new Error("syntax error: " + v)
                }
                //Null
                if (v_array[2].indexOf("no") >= 0){
                    mysql_var.null = false
                }else{
                    mysql_var.null = true
                }
                //Key
                mysql_var.key = v_array[3].trim()
                //Default
                mysql_var.default = v_array[4].trim()
                //Extra
                mysql_var.extra = v_array[5].trim()
                //console.log("mysql_var: ", mysql_var)
                mysql_vars.push(mysql_var)
            }else {
                throw new Error("syntax error: " + v)
            }
        }
        return mysql_vars
    }

    function create_go(input){
        var go_s = go_struct_h
        for (var i = 0;i< input.length;i++){
            var v = input[i]
            var go_name = go_name_marshal(v.name)
            var item = "\t"+go_name+"\t"+v.type +"\t" +"`gorm:\"column:"+v.name
            if (v.key == "pri"){
                item += ";primary_key"
            }
            if (opt.simple == false){
                if (v.null == false){
                    item += ";not null"
                }
                if (v.default!= "" && v.default != "null"){
                    item += ";default:'" + v.default +"'"
                }
                if (v.extra != ""){
                    item += ";" + v.extra.toUpperCase()
                }
            }
            item += "\"`\n"
            go_s += item
        }
        go_s += go_struct_f
        return go_s
    }

    function go_name_marshal(in_str){
        const commonInitialisms = [
            "ACL", "API", "ASCII", "CPU", "CSS", "DNS", "EOF", "GUID", "HTML", "HTTP", 
            "HTTPS", "ID", "IP", "JSON", "LHS", "QPS", "RAM", "RHS", "RPC", "SLA", 
            "SMTP", "SQL", "SSH", "TCP", "TLS", "TTL", "UDP", "UI", "UID", "UUID", 
            "URI", "URL", "UTF8", "VM", "XML", "XMPP", "XSRF", "XSS"
        ];
        var out_str = ""
        if (commonInitialisms.indexOf(in_str.toUpperCase())>=0){
            return in_str.toUpperCase()
        }
        for (var i=0;i<in_str.length;i++){
            var a = in_str.charAt(i)
            if (a == '_'){
                i++
                a = in_str.charAt(i).toUpperCase()
            }
            if (i == 0){
                a = a.toUpperCase()
            }
            out_str += a
        }
        if (out_str != ""){
            return out_str
        }
        return in_str
    }

}