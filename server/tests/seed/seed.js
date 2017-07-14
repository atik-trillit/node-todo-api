const {ObjectID}=require('mongodb');
const {Todo}=require('./../../models/todo');
const {User}=require('./../../models/user');
const jwt=require('jsonwebtoken');


var userOneId=new ObjectID();
var userTwoId=new ObjectID();

const todos = [{
  _id: new ObjectID(),
  text: "First test todo",
  _creator:userOneId
}, {
  _id: new ObjectID(),
  text: "Second test todo",
  _creator:userTwoId
}];


const users=[{
  _id:userOneId,
  email:'atik323@gmail.com',
  password:'113344',
  tokens:[{
    access:'auth',
    token:jwt.sign({_id:userOneId,access:'auth'},'abc123').toString()
  }]
},{
  _id:userTwoId,
  email:'santosh323@gmail.com',
  password:'113344',
  tokens:[{
    access:'auth',
    token:jwt.sign({_id:userTwoId,access:'auth'},'abc123').toString()
  }]
}]


const populateTodos=(done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
}


const populateUsers=(done)=>{
  User.remove({}).then(()=>{
    var userOne=new User(users[0]).save();
    var userTwo=new User(users[1]).save();

    return Promise.all([userOne,userTwo]);
  }).then(()=>done());
}
module.exports={todos,populateTodos,users,populateUsers};
