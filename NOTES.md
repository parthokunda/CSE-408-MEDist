## Patient Service RPC call from Auth Service
#### GET_ID
```typescript
const payload: RPC_Request_Payload = {
      type: "GET_ID",
      data: {
        userID: existingUser.id,
      },
    };
```
> get patient id from patient service if patient exists ( signed up already )


## kill port if already in use
```bash
npx kill-port 3000 3001 3002 3003 3004 3005
```


#### CREATE_NEW_ENTITY 
```typescript
  const payload: RPC_Request_Payload = {
      type: "CREATE_NEW_ENTITY",
      data: {
        userID: newUser.id,
      },
    };
```
> create new patient entity in patient service if patient does not exist ( sign up first time )

## Auth Service RPC call
#### AUTHORIZATION 
```typescript
const payload: RPC_Request_Payload = {
            type: "AUTHORIZATION",
            data: {
                token: token,
            }
        };
```
> check if the user is authorized to access the resource


## DateTime Regex
```typescript
const dateTimeRegex =
            /^(?:(?:\d{4}-\d{2}-\d{2})|(?:\d{2}:\d{2}(?::\d{2})?)|(?:\d{4}-\d{2}-\d{2} \d{2}:\d{2}(?::\d{2})?))$/;

return dateTimeRegex.test(val)
```
> Explanation of the regex:
- `^`: Anchors the regex at the start of the string.
- `(?: ... | ... | ...)`: This part uses non-capturing groups to allow for different patterns.
- - `(?:\d{4}-\d{2}-\d{2})`: Matches the date pattern `YYYY-MM-DD`.
- - `(?:\d{2}:\d{2}(?::\d{2})?)`: Matches the time pattern `HH:MM` or `HH:MM:SS`.
- - `(?:\d{4}-\d{2}-\d{2} \d{2}:\d{2}(?::\d{2})?)`: Matches the date and time pattern `YYYY-MM-DD HH:MM` or `YYYY-MM-DD HH:MM:SS`.
- - `$`: Anchors the regex at the end of the string.

> This regex will match the following:
- `YYYY-MM-DD`
- `HH:MM` or `HH:MM:SS`
- `YYYY-MM-DD HH:MM` or `YYYY-MM-DD HH:MM:SS`
- `YYYY-MM-DDTHH:MM` or `YYYY-MM-DDTHH:MM:SS`
```

