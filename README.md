# combined-bcard
Bankless Card Combined App Package

    # bcard-api-server
    Backend API Server for BCard Custodial Wallets

    # bcard-admin-server
    Server to process logins, handle user UI and expose some control buttons to admin users.
    
## installation guide
    $ (goto package root -> contains app.ts && package.json)

    $ cd bcard-admin-client-main
    $ npm install
    $ npm run build         //  to create static version of the admin app to serve
    
    $ cd.. (back to root)
    $ touch .env            //  add in the API keys here
    $ npm install  --force     
    $ npm run start:dev     //  to start the API server && readout from API Calls in window here
    
go to http://localhost:3080 in your browser to view the app and login.

tested ok: mac os (intel), ubuntu 20
