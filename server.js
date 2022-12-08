//https://lazy-sneakers-deer.cyclic.app/

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;


//define the user schema
var finalUsers = new Schema({
    "email" : {
        "type" : String,
        "unique" : true 
    },
    "password" : String
});


let User

//start DB
exports.startDB = () => {
    return new Promise( (resolve, reject) => {
        let db = mongoose.createConnection('mongodb+srv://MelikaHamedani:@senecaweb.61idexv.mongodb.net/?retryWrites=true&w=majority');
        db.on('error', (err) => {
            console.log('Cannot connect to Database.')
            reject(err);
        });
        db.once('open', () => {
            User = db.model('finalUsers', finalUsers);
            console.log('connection successful.')
            resolve();
        });
    });
};

//register(user)
exports.register =  (user) => {
    return new Promise( (resolve, reject) => {
        if (user.email == '' || user.password == '') {
            reject('Error: email or password cannot be empty.')
        }
        bcrypt.genSalt(10)
            .then(salt => bcrypt.hash(user.password, salt))
            .then(hash => {
                user.password = hash
                let newUser = new User(user);
                newUser.save().then(() => {
                    resolve(user)}).catch(err => {
                    if (err.code == 11000) {
                        reject(`Error: ${user.email} already exists`)
                    } else {
                        reject('Error: cannot create the user')
                    }
                })
            })
            .catch(err => {
                return reject(err)
            });
    });
};

//signIn(user)
exports.signIn = (user) => {
    return new Promise((resolve, reject) => {
        User.find({ email: user.email }).then(users => {
            if (users.length == 0) {
                return reject(`Unable to find user: ${user.email}`)
            }
            bcrypt.compare(user.password, users[0].password).then((res) => {
                if (res) {
                    resolve(user)
                } else {
                    return reject(`Incorrect password for user ${user.email} `)
                }

            });
        }).catch(err => reject(`Cannot find the user: ${user.email} `))
    });
};
