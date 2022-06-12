# Instructions 

## How To Start

**First Step** - `npm install` (To install all dependencies for project)

**Second Step** -`nodemon` (To Automatically restart the application)



## How to run the code
**1) Registration (To Register In Registered User Table) :** 

route - POST /api/v1/users/register

access - Public

fields - `{
    "name" : "Test Name",
    "email" : NULL || "test@gmail.com"
    "phoneNumber" : "1234567890",
    "password" : "password"
}`

**2) Add User To Spam List In Global Table**

access - Private (Only Registered Users)

route -  PUT /api/v1/users/spam

fields - `{
    "phoneNumber" : "1234567890"
}`

**3) Search by name**

access - Private (Only Registered Users)

route -  POST /api/v1/users/searchbyname

fields - `{
    "search" : "te"
}`

**4) Search by phone number**

access - Private (Only Registered Users)

route -  POST /api/v1/users/searchbyphone

fields - `{
    "search" : "123456"
}`

**5) Registration (To Register In Global User Table) :** 

route - POST /api/v1/global/register

access - Public

fields - `{
    "name" : "Test Name",
    "email" : NULL || "test@gmail.com",
    "phoneNumber" : "1234567890",
}`

**6)  Get details of a registered or unregistered user**

route - GET /api/v1/users/:id

access - Private (Only Registered Users)

parameter - id (global table)



## Additional Features

**To populate database with sample data** - `node seeder -i`

**To delete all data from databas** - `node seeder -d`








