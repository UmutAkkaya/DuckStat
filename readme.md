### Approach
To not spend a lot of time on the front end, I kept it fairly simple. I have a table for displaying the previous records and a seperate component for adding a new record. On the backend, I kept it as organized as possible, having a file for the repository, a file for the controller, and a seperate file that lists all the routings. I used an existing server for hosting my database.

I started working on the backend before anything else. Afterwards, I created my db model and some of the db methods I might need in the future according to the requirements. I set up the database connection on the backend, wrote down a "get a list of all records" method, and moved on to the front end to list those records on a table. After I was done with the listing, I moved on the creating a new record and adding the required methods on the backend. 

When I was done making sure everything worked as expected I moved on to scheduling (optional requirement). I searched at first to see what third party scheduling libraries was available to me and decided to use node-cron - a widely used scheduling library. (https://www.npmjs.com/package/node-cron)

The final thing to do was to use Heroku to host the website and make sure everything worked properly on there as well.

### Technologies Used
I have used node.js and express.js since it's really easy to start building right away with them. I have searched for a boilerplate at the beginning thinking it would be easier to work on one. However, most of the boilerplates I have found online were really bloated with things I didnt need therefore I worked on it from scratch.

For the backend I used mongodb. Main reason is, similar to nodejs, it is really easy to set it up. I had a database server set up (for a hackathon) on digitalocean already therefore all I did was to add a seperate db for this application and use that.

For the front end, I went with React as it is very lightweight unlike Angular. I haven't used any custom libraries at the very beginning like bootstrap as I didnt know it was allowed so I just included my custom css. Later I learned that it was allowed.

For scheduling I used a third party library called node-cron. (https://www.npmjs.com/package/node-cron)
I chose to host it on Heroku because it was fairly straight-forward and easy to set up the CI - it connects to your github repo with one button to set up the continuous integration.

### High Level Component Diagram
    App
    |----Tabs
            |-----feedlist
            |-----newFeedings

### Database Model
    Feeding
        location: String
        amount: Number
        food: String
        foodType: String
        numDucks: Number
        dateTime: Number
        isScheduled: Boolean

### Hours spent
    Approximately 7 hours
    