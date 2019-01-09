# Start

`npm start` (`npm start -- -p 9898 -d 1000`) to start the server.

- HTTP GET `http://localhost:3000/todos` to access current todos
- websocket `http://localhost:3000` to subscribe/push events

## CLI parameters

- `port` / `p`
- `delay` / `d` - minimum delay of each response/broadcast (milliseconds)

## Client connection

Start with following code on client side:

#### markup

```html
<script src="http://localhost:3000/socket.io/socket.io.js"></script>
```

#### client logic

```js
const socket = io('http://localhost:3000')

socket.on('cmd', (data) => {
	console.log('received', data)
})
```

# Commands

Each command requires to have a `type` specified, as well as `id` of the item that is being modified.

## Responses

Responses are being sent only to the direct sender (committing the change). The response object contains the todo entity for all 3 operations (_add_, _delete_, _update_).

## Broadcasts

If a request gets committed, it's also broadcasted to all _other_ clients. The broadcasted event is the same as the request.

#### schema

```json
{
  "type": "ADD" | "DELETE" | "UPDATE",
  "payload": {
    "id": GUID,
    "title": STRING,
    "completed": BOOLEAN,
  }
}
```

## `ADD`

Adds a todo. The server assigns the `id`.

#### schema

```json
{
  "type": "ADD",
  "payload": {
    "title": STRING
  }
}
```

#### example

```json
{
  "type": "ADD",
  "payload": {
    "title": "do some cool stuff",
  }
}
```

## `DELETE`

Deletes a todo.

#### schema

```json
{
  "type": "DELETE",
  "payload": {
    "id": GUID
  }
}
```

#### example

```json
{
  "type": "DELETE",
  "payload": {
    "id": "45a70dfd-d6f7-4c80-a493-f6bbf7005d96"
  }
}
```

## `UPDATE`

Can be used to either change todo _title_ or mark as _(in)complete_, depending on which attributes of the todo object are being changed

#### schema

```json
{
  "type": "UPDATE",
  "payload": {
    "id": GUID,
    "data": {
      "title": STRING,
      "completed": BOOLEAN
    }
  }
}
```

#### example: marking as complete

```json
{
  "type": "UPDATE",
  "payload": {
    "id": "45a70dfd-d6f7-4c80-a493-f6bbf7005d96",
    "data": {
      "completed": true
    }
  }
}
```

#### example: marking as complete

```json
{
  "type": "UPDATE",
  "payload": {
    "id": "45a70dfd-d6f7-4c80-a493-f6bbf7005d96",
    "data": {
      "title": "Go do some jogging"
    }
  }
}
```
