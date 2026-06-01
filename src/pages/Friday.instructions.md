https://www.lineflow.grid-india.in/get-line-details/<LineNAME>
https://www.lineflow.grid-india.in/get_all_lines


https://www.lineflow.grid-inida.in/loginme --- Payload : 
{
    "username":"username",
    "password": "password HASH",
}

Response : 
{
    "employee iD":"empid",
    "username":"username",
    "last-login":"dd-mm-yyyy",
    "flag":"success",
    "message":"Login Successful"
}
"JWT Token authentication"

https://www.lineflow.grid-india.in/get_all_line_names -- Payload : 
 --JWT ToKen
SUCCESS  -- 
{
    "from-date":"dd-mm-yyyy",
    "to_date": "dd-mm-yyyy",
    "linekey":"Line Name",
    "linekey2": "Line Name 2",
    .
    .
    .
}
FAILURE -- 
{
    "Message":"ABC"
}

https://www.lineflow.grid-inida.in/get_line_data --- Payload : 
{
    "from-date":"dd-mm-yyyy",
    "to_date": "dd-mm-yyyy",
    "linename":"LINE NAME",
    "line_key":"Line Key",
}
https://www.lineflow.grid-inida.in/get_multi_line_data --- Payload : 
{
    "from-date":"dd-mm-yyyy",
    "to_date": "dd-mm-yyyy",
    "linenames":["LINE NAME 1", "LINE NAME 2", ...],
    "line_keys":["Line Key 1", "Line Key 2", ...],
}

CONTEXT API REACT

https://www.lineflow.grid-india.in/get_all_lines
