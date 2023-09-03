# Back-end boilerplate
My personal setup for building express api

## Setting up back-end

### dependencies and configs

1. npm init -y
2. npm i express
3. npm i nodemon -D
4. date-fns
5. uuid
6. morgan
7. cookieParser
8. cors

9. create .gitignore and ignore
   - node_modules
   - logs
10. create server.js

#### dev depends

1. nodemon

### on server.js

1. import express
2. create port on ENV
3. `import path from 'path'`
4. app.listen to ENV_PORT || 3500
5. create public and inside css folder.
6. make public files static

   ```js
   const path = require("path");
   app.use("/", express.static(path.join(__dirname, "public")));
   ```

7. to accept json.

- ```js
  const express = "express";
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  ```

8. to allow public to access our api endpoint

```js
const cors = require("cors");
app.use(cors(corsOptions?));
```

- in config/allowedOrigins

  ```js
  const allowedOrigins = ["http://localhost:3000", "https://www.google.com"];

  module.exports = allowedOrigins;
  ```

- in config/corsOptions.js

  ```js
  const allowedOrigins = require("./allowedOrigins");

  const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionSuccessStatus: 200,
  };

  module.exports = corsOptions;
  ```

7. to use custom middleware 'logger.js'

   ```js
   const { logger } = require("./middleware/logger");
   app.use(logger());
   ```

8. to accept cookies

   ```js
   const cookieParser = require("cookie-parser");
   app.use(cookieParser());
   ```

### on dir routes

1. create root.js

   ```js
   const express = require("express");
     const path = require("path");
   
     const router = express.Router();
   
     router.get("^/$ | ^/index(.html)$", (req, res) => {
     res.sendFile(path.join(\_\_dirname, "../views/index.html"));
     });
   
     module.exports = router;
   ```

### on dir views

1. create index.html
2. as well as 404.html

### custom middlewares

- Logger event middleware

   ```js
   const { format } = require("date-fns");
   const { v4: uuid } = require("uuid");
   
   const fs = require("fs");
   const fsPromises = require("fs").promises;
   
   const path = require("path");
   
   const logEvents = async (message, logFileName) => {
     const dateTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");
     const logMessage = `${dateTime}\t ${uuid()} - ${message}\n`;
   
     try {
       if (!fs.existsSync(path.join(__dirname, "../logs"))) {
         fs.mkdirSync(path.join(__dirname, "../logs"));
       }
   
       await fsPromises.appendFile(
         path.join(__dirname, `../logs/${logFileName}`),
         logMessage
       );
     } catch (e) {
       console.log(e);
     }
   };
   
   const logger = (req, res, next) => {
     const { method, url } = req;
     const message = `${method}\t ${url}\t${req.headers.origin}`;
     logEvents(message, "access.log");
     console.log(`${req.method} ${req.path}`);
     next();
   };
   
   module.exports = { logger, logEvents };
   ```
