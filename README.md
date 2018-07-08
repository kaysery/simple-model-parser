# simple-model-parser
it's a javascript library to parse json and javascript object's values to fill html elements.

# use
To use this library,just import the simpleModelParser.js into your project,
then passes the object you want to parse as a parameter of function `$mp`.

### note
you have to named the html elements `id` with the name of properties from object.

## example
```html
<html>
    <head>
        <script src="simpleModelParser.js"></script>
        <script src="app.js"></script>
    </head>
<body>

<input id="name" type="text" ></input>
<p id="paragraph"></p>
  </html>
</body>
```

```javascript
var obj = {name: "test", paragraph: "this is a paragraph"};

window.onload = function(){
  //parsing object to html
  var a = $mp(obj);
}
```

# Parsing Arrays
also you can parse array and collections, just need to ad `var` attribute to index the object and them use this index to access to 
the properties object.

##  example dropdown
```html
<select id="users" var="us" name="users">
    <option value="0">Default</option>
    <option value="{{us.info.id}}">{{us.name}}</option>
    </select>
```

```javascript
var obj = {users: 
[{ name: "Kayseri", lastname: "Martinez",info:{age:25,id:"1234567889"} },
{ name: "Kayseri2", lastname: "Martinez2",info:{age:28,id:"123456752"} }
]};

window.onload = function(){
  //parsing object to html
  var a = $mp(obj);
}
```

##  example table
```html
   <table>
        <tr>
          <th>Firstname</th>
          <th>Lastname</th> 
          <th>Age</th>
        </tr>
       
        <tr id="users" var="arr">
          <td><span>{{arr.name}}</span></td>
          <td>{{arr.lastname}}</td> 
          <td>{{arr.info.age}}</td>
        </tr>
      </table>
```

##  example div
```html
<div id="users" var="arr">  
  <div>
    <p><span>{{arr.name}}</span></p>
  </div>
</div>
```
