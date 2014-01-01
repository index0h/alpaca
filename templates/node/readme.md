# {{.Pkg.git.name}}-node

{{if .Pkg.official}}Official {{end}}{{.Pkg.name}} API library client for node.js

__This library is generated by [alpaca](https://github.com/pksunkara/alpaca)__

## Installation

Make sure you have [npm](https://npmjs.org) installed.

```bash
$ npm install {{.Pkg.package}}
```

#### Versions

Works with [ 0.8 / 0.9 / 0.10 / 0.11 ]

## Usage

```js
var {{call .Fnc.underscore .Pkg.name}} = require('{{.Pkg.package}}');

// Then we instantiate a client (as shown below)
```

### Build a client

##### Without any authentication

```js
var client = {{call .Fnc.underscore .Pkg.name}}.client();

// If you need to send options
var client = {{call .Fnc.underscore .Pkg.name}}.client({}, options);
```
{{if .Api.authorization.basic}}
##### Basic authentication

```js
var client = {{call .Fnc.underscore .Pkg.name}}.client({
    username: 'pksunkara',
    password: 'password'
}, options);
```
{{end}}{{if .Api.authorization.header}}
##### Authorization header token

```js
var client = {{call .Fnc.underscore .Pkg.name}}.client({{if .Api.authorization.oauth}}{ http_header: '1a2b3' }{{else}}'1a2b3'{{end}}, options);
```
{{end}}{{if .Api.authorization.oauth}}
##### Oauth acess token

```js
var client = {{call .Fnc.underscore .Pkg.name}}.client('1a2b3', options);
```

##### Oauth client secret

```js
var client = {{call .Fnc.underscore .Pkg.name}}.client({
    client_id: '09a8b7',
    client_secret: '1a2b3'
}, options);
```
{{end}}
### Response information

__All the callbacks provided to an api call will recieve the response as shown below__

```js
client.klass('args').method('args', function (err, response) {
    if (err) console.log(err);

    response.body;
    // >>> 'Hello world!'

    response.code;
    // >>> 200

    response.headers;
    // >>> {'content-type': 'text/html'}
}
```

##### HTML response

```js
response.body;
// >>> 'The username is pksunkara!'
```
{{if .Api.response.formats.json}}
##### JSON response

```js
response.body;
// >>> {'user': 'pksunkara'}
```
{{end}}
### Request body information

##### RAW request

```js
body = 'username=pksunkara';
```

##### FORM request

```js
body = {'user': 'pksunkara'};
```
{{if .Api.request.formats.json}}
##### JSON request

```js
body = {'user': 'pksunkara'};
```
{{end}}
### Client Options

The following options are available while instantiating a client:

 * __base__: Base url for the api
 * __api_version__: Default version of the api (to be used in url)
 * __user_agent__: Default user-agent for all requests
 * __headers__: Default headers for all requests
 * __request_type__: Default format of the request body{{if .Api.response.suffix}}
 * __response_type__: Default format of the response (to be used in url suffix){{end}}

### Method Options

The following options are available while calling a method of an api:

 * __api_version__: Version of the api (to be used in url)
 * __headers__: Headers for the request
 * __query__: Query parameters for the url
 * __body__: Body of the request
 * __request_type__: Format of the request body{{if .Api.response.suffix}}
 * __response_type__: Format of the response (to be used in url suffix){{end}}
{{with $data := .}}{{range .Api.classes}}
### {{index $data.Doc . "title"}} api

{{index $data.Doc . "desc"}}
{{with (index $data.Api.class . "args")}}
The following arguments are required:{{end}}
{{with $class := .}}{{range $index, $element := (index $data.Api.class . "args")}}
 * __{{.}}__: {{index $data.Doc $class "args" $index "desc"}}{{end}}

```js
var {{call $data.Fnc.camelizeDownFirst .}} = client.{{call $data.Fnc.camelizeDownFirst .}}({{call $data.Fnc.prnt.node (index $data.Doc . "args") ", " false}});
```
{{range (call $data.Fnc.methods (index $data.Api.class .))}}
##### {{index $data.Doc $class . "title"}} ({{call $data.Fnc.upper (or (index $data.Api.class $class . "method") "get")}} {{index $data.Api.class $class . "path"}})

{{index $data.Doc $class . "desc"}}
{{with (index $data.Api.class $class . "params")}}
The following arguments are required:{{end}}
{{with $method := .}}{{range $index, $element := (index $data.Api.class $class . "params")}}
 * __{{.}}__: {{index $data.Doc $class $method "params" $index "desc"}}{{end}}{{end}}

```js
{{call $data.Fnc.camelizeDownFirst $class}}.{{call $data.Fnc.camelizeDownFirst .}}({{call $data.Fnc.prnt.node (index $data.Doc $class . "params") ", " true}}options, callback);
```
{{end}}{{end}}{{end}}{{end}}
## Contributors
Here is a list of [Contributors]((https://{{.Pkg.git.site}}/{{.Pkg.git.user}}/{{.Pkg.git.name}}-node/contributors)

### TODO

## License
{{.Pkg.license}}

## Bug Reports
Report [here](https://{{.Pkg.git.site}}/{{.Pkg.git.user}}/{{.Pkg.git.name}}-node/issues).

## Contact
{{.Pkg.author.name}} ({{.Pkg.author.email}})