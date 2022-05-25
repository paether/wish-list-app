The idea of the project came when I couldn't find a site that supported both english and hungarian languages and didn't require e-mail registration just to do a simple task as a wish list. So I have decided to make this site and add it to my portfolio.

## Main features

- Create a wish list without the need to register (Firebase auth with bcrypt and JWT).
- Hungarian and English language support.
- Add presents/items to de wish list if you are administrator of the list.
- The list can be shared with other people who can indicate they have reserved/bought a gift.
- Any changes on the wish list appeares on any other opened windows as well (socket.io websockets).
- Switch between admin and non-admin mode with a password to be able to delete/update/add (CRUD) gifts.

## Challenges

- Since I used a non-generic authentication with Firebase anonymous sessions I had to create my own unique version of
  handling users securely with the help of JWT tokens encrypted with bcrypt and stored on the backend.
- Coordinating the multiple UI updates that are coming from different websockets through socket.io was quite a challange, React's useEffect and useCallback were a big help in solving them.
- Firebase data handling are quite unique compared to mongoDB/T-SQL which I am already used to, so it was a good learning challange to find out how to query and store data with their special real-time snapshot updates with the help of their documentation.
- I wanted to try out Heroku's node.js hosting which was challenging in the beginning but thanks to their detailed documentation I could solve it quickly.
- I came up with the design of the site on my own as well which was also challenging in a way that I ad to it from the ground up, but it was worth it in the end also practiced a lot of CSS.

## Technologies used:

- React
- Javascript
- HTML5 / CSS
- Node.js / Express
- Socket.io
- Axios
- Firebase

## The site is currently hosted at:

https://paether-wishlistapp.herokuapp.com/
