const expect = require('expect');
const request = require('supertest');

var {
  ObjectID
} = require('mongodb');
const {
  app
} = require('./../server');
const {
  Todo
} = require('./../models/todo');

const {User}=require('./../models/user');

const {todos, populateTodos,users,populateUsers}=require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('Should create new Todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth',users[0].tokens[0].token)
      .send({
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find({
          text
        }).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth',users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });

});

describe('GET /todos', () => {
  it('Should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  })
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should not return todo doc created by other user', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('Should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('Should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123')
      .set('x-auth',users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('Should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth',users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));

      });
      it('Should remove a todo 2', (done) => {
        var hexId = todos[0]._id.toHexString();
        request(app)
          .delete(`/todos/${hexId}`)
          .set('x-auth',users[1].tokens[0].token)
          .expect(404)
          .end((err, res) => {
            if (err) {
              return done(err);
            }

            Todo.findById(hexId).then((todo) => {
              expect(todo).toExist();
              done();
            }).catch((e) => done(e));

          });
  });

  it('Should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth',users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('Should return 404 for non-object ids', (done) => {
    request(app)
      .delete('/todos/123')
      .set('x-auth',users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('Should update the todo', (done) => {
    var id = todos[0]._id.toHexString();
    var text = "New text 1";

    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth',users[0].tokens[0].token)
      .send({
        text,
        completed: true
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);

  });

  it('Should not update the todo for other user', (done) => {
    var id = todos[0]._id.toHexString();
    var text = "New text 1";

    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth',users[1].tokens[0].token)
      .send({
        text,
        completed: true
      })
      .expect(404)

      .end(done);

  });
  it('Should clear completedAt when todo is not completed', (done) => {
    var id = todos[1]._id.toHexString();
    var text = "New text 2";

    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth',users[1].tokens[0].token)
      .send({
        text,
        completed: false
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);

  });

  describe('GET /user/me', ()=>{
it('should return if user is authenticated',(done)=>{
request(app)
.get('/users/me')
.set('x-auth',users[0].tokens[0].token)
.expect(200)
.expect((res)=>{
  expect(res.body._id).toBe(users[0]._id.toHexString());
  expect(res.body.email).toBe(users[0].email);
}).end(done);


});

it('should return 401 if user is not authenticated',(done)=>{
  request(app)
  .get('/users/me')
  .expect(401)
  .expect((res)=>{
    expect(res.body).toEqual({});
  }).end(done);
});


  });

});


describe('POST /users',()=>{
  it('should create a user',(done)=>{
    var email='atik121@gmail.com';
    var password='123123';
    request(app)
    .post('/users')
    .send({email,password})
    .expect(200)
    .expect((res)=>{
      expect(res.header['x-auth']).toExist();
      expect(res.body._id).toExist();
      expect(res.body.email).toBe(email);
    }).end((err)=>{
      if(err){
          return done(err);
      }
        User.findOne({email}).then((user)=>{
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();


      }).catch((e)=>done(e));
    });
  });

  it('should return invalid email and password',(done)=>{
    request(app)
    .post('/users')
    .send({
      email:'atik',
      password:'123'
    })
    .expect(400)
    .end(done);
  });

  it('should not create if email is used',(done)=>{
    request(app)
    .post('/users')
    .send({
      email:users[0].email,
      password:'password123'
    })
    .expect(400)
    .end(done);
  });
});

describe('POST /users/login',()=>{
it('should login user and return auth token',(done)=>{
request(app)
.post('/users/login')
.send({
  email:users[1].email,
  password:users[1].password
})
.expect(200)
.expect((res)=>{
  expect(res.header['x-auth']).toExist();
}).end((err,res)=>{
  if(err){
    return done(err);
  }

  User.findById(users[1]._id).then((user)=>{
    expect(user.tokens[1]).toInclude({
      access:'auth',
      token:res.header['x-auth']
    });
    done();
  }).catch((e)=>done(e));
});



});

it('should reject invalid email and password',(done)=>{
request(app)
.post('/users/login')
.send({
  email:users[1].email,
  password:users[1].password + 'akdfjka'
})
.expect(400)
.expect((res)=>{
  expect(res.header['x-auth']).toNotExist();
}).end((err,res)=>{
  if(err){
    return done(err);
  }

  User.findById(users[1]._id).then((user)=>{
    expect(user.tokens.length).toBe(1);
    done();
  }).catch((e)=>done(e));
});
});
});

describe('Delete /user/me/token',()=>{
  it('should remove auth token on logout',(done)=>{
    request(app)
    .delete('/users/me/token')
    .send('x-auth',users[0].tokens[0].token)
    .expect(200)
    .end((err,res)=>{
      if(err){
        return done(err);
      }
      User.findById(users[0]._id).then((user)=>{
          expect(user.tokens.length).toBe(0);
          done();
      }).catch((e)=>done(e));
    });


  });
});

});
