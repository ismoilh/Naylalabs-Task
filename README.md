# Nodejs

A NodeJS task

# Installation

To install dependencies use `npm install` command:

```
npm install
```

Or Just use `make` command:

```
make install
```

# Running

To start the server use `npm` command:

```
npm start
```

Or just use `make` command:

```
make run
```

# Easiest way

To both install dependencies and start server simply use `make` command:

```
make all
```

# User Routes

## Register user

```
http://localhost:8080/v1/register

POST {
    username,
    email,
    password,
    bio,
    image
}
```

## Login

```
http://localhost:8080/v1/login

PATCH {
    email,
    password,
    username
}
```

## Update Data Of User

```
http://localhost:8080/v1/update/:id

PUT {
    username,
    email,
    bio
}
```

## Change Password

```
http://localhost:8080/v1/forgot/:id

PUT {
    password
}
```
