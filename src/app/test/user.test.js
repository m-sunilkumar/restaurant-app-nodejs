// process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require("../models/user/user.model");
process.env.NODE_ENV = "test";
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../server");
let should = chai.should();
const token = process.env.AUTH_TOKEN;
chai.use(chaiHttp);

describe("Users", () => {
  before((done) => {
    User.remove({}, (err) => {
      done();
    });
  });

  describe(" /POST Login /users", () => {
    it("it should ADD  users to the database", (done) => {
      let user = {
        id: 10,
        email: "hello@mindtree.com",
        password: "password",
        name: "brodha",
        city: "bangalore",
        address: "kundalhalli",
        phone: 7892531304,
        gender: "Male",
      };
      chai
        .request(server)
        .post("/users")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("name");
          res.body.should.have.property("email");
          done();
        });
    });
    it("IT should give 400 error if signup format is not correct", (done) => {
      let user = {
        id: 6,
        password: "password",
        name: "brodha",
        city: "bangalore",
        address: "kundalhalli",
        phone: 7892531304,
        gender: "Male",
      };
      chai
        .request(server)
        .post("/users")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it("it should login when user puts correct login creds", (done) => {
      chai
        .request(server)
        .post(`/users/login`)
        .send({
          email: "sunil.m@gmail.com",
          password: "Hi@pass",
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("token");

          done();
        });
    });
    it("it should not login when user puts wrong login creds", (done) => {
      chai
        .request(server)
        .post(`/users/login`)
        .send({
          email: "sunil.m@gmail.com",
          password: "@pass",
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("error");

          done();
        });
    });
  });
  describe("/GET Users ", () => {
    it("get logged in user if authorized", (done) => {
      chai
        .request(server)
        .get("/users/me")
        .set("Authorization", "Bearer " + token)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a("object");
          done();
        });
    });
    it("Give 401 error if user not authorized", (done) => {
      chai
        .request(server)
        .get("/users/me")
        .set("Authorization", "Bearer " + "")
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
  describe("/POST Logout users", () => {
    it("it should Logout a user if user authonticated ", (done) => {
      chai
        .request(server)
        .post(`/users/logout`)
        .set("Authorization", "Bearer " + token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it("IT should not logout user and give 401 error if not authorized", (done) => {
      chai
        .request(server)
        .post("/users/logout")
        .set("Authorization", `Bearer ""`)
        .end((err, res) => {
          res.should.have.status(401);
          res.should.have.property("error");
          done();
        });
    });
    it("it should logout user from all active sessions", (done) => {
      chai
        .request(server)
        .post("/users/logoutAll")
        .set("Authorization", "Bearer " + token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe("/PATCH  /users/me user", () => {
    it("it should UPDATE a user data given the user details", (done) => {
      let user = {
        email: "sunil.m@gmail.com",
        password: "Hi@pass",
        name: "sunilkumar",
        city: "bengaluru",
      };

      chai
        .request(server)
        .patch(`/users/me`)
        .set("Authorization", "Bearer " + token)
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql(`User data updated successfully`);

          done();
        });
    });

    it("it should not UPDATE a user if reqest body validation fails", (done) => {
      let user = {
        email: "sunil.m@gmail.com",
        password: "Hi@pass",
        name: "sunilkumar",
        city: "sirsi",
        country: "",
      };

      chai
        .request(server)
        .patch(`/users/me`)
        .set("Authorization", "Bearer " + token)
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          done();
        });
    });
  });
  /*
   * Test the /DELETE/:id route
   */
  describe("/DELETE/ user data", () => {
    it("it should give 401 if user not authorized", (done) => {
      chai
        .request(server)
        .delete(`/users/me`)
        .set("Authorization", "Bearer " + "dddd")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a("object");
          done();
        });
    });
    it("it should DELETE a user data of authorized user", (done) => {
      chai
        .request(server)
        .delete(`/users/me`)
        .set("Authorization", "Bearer " + token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("name");
          done();
        });
    });
  });
});
