// process.env.NODE_ENV = '
process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../server");
const client = require("../db/postgress");
let should = chai.should();
const token = process.env.AUTH_TOKEN;
chai.use(chaiHttp);

describe("Orders", () => {
  before((done) => {
    client.query(`DROP TABLE  IF EXISTS Orders`, (err, res) => {
      if (err) {
        console.error("error in DROPPING table", err);
        return;
      }
      console.log("Table dropped  successfully ");
    });

    //Delete database table if its exists
    client.query(
      `CREATE TABLE  IF NOT EXISTS Orders(
             orderId          SERIAL PRIMARY KEY,
             customer_id      VARCHAR(50),
             restaurantId     VARCHAR(50),
             restaurant_name   VARCHAR(10),
             orderTotal       INTEGER,
             orderItems       JSON ARRAY
           )`,
      (err, res) => {
        if (err) {
          console.error("error in creating table", err);
          return;
        }
        console.log("Table is successfully created");
      }
    );

    //Create table if not exists before each test
    client.query(
      `CREATE TABLE  IF NOT EXISTS Orders(
           orderId          SERIAL PRIMARY KEY,
           customer_id      VARCHAR(50),
           restaurantId     VARCHAR(50),
           restaurant_name   VARCHAR(10),
           orderTotal       INTEGER,
           orderItems       JSON ARRAY
         )`,
      (err, res) => {
        if (err) {
          console.error("error in creating table", err);
          return;
        }
        console.log("Table is successfully created");
      }
    );
    done();
  });
  describe("/GET order", () => {
    let order = {
      orderId: 4,
    };
    it("IT should give 401 error if not authorized", (done) => {
      chai
        .request(server)
        .get("/order/" + order.orderId)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it("it should GET all the order", (done) => {
      chai
        .request(server)
        .get("/order/" + order.orderId)
        .set("Authorization", "Bearer " + token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("orderid");
          done();
        });
    });
    it("it should not GET order details without passing orderId", (done) => {
      chai
        .request(server)
        .get(`/order/ ${null}`)
        .set("Authorization", "Bearer " + token)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a("object");
          res.body.should.have.property("error");

          done();
        });
    });
  });
  describe("/POST order", () => {
    it("it should POST a order ", (done) => {
      let order = {
        orderId: 11,
        customer_id: "1",
        restaurantId: "1",
        restaurant_name: "jjj grand",
        orderTotal: 23,
        orderItems: [
          {
            title: "halva",
            qty: 1,
            price: 23.5,
          },
        ],
      };
      chai
        .request(server)
        .post(`/order/new`)
        .set("Authorization", "Bearer " + token)
        .send(order)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("order successfully placed!");
          done();
        });
    });
    it("IT should give 401 error if not authorized", (done) => {
      chai
        .request(server)
        .post("/order/new")
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it("it should not POST a order without orderId field", (done) => {
      let order = {
        customer_id: "1",
        restaurantId: "1",
        restaurant_name: "biriyani zone",
        orderTotal: 23,
        orderItems: [
          {
            title: "kabab",
            qty: 1,
            price: 23.5,
          },
        ],
      };
      chai
        .request(server)
        .post("/order/new")
        .set("Authorization", "Bearer " + token)
        .send(order)

        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a("object");
          res.body.should.have.property("error");
          //   res.body.errors.should.have.property("kind").eql("required");
          done();
        });
    });
    it("it should not POST a order if order already presents(if orderId presents)", (done) => {
      let order = {
        orderId: 7,
        customer_id: "1",
        restaurantId: "1",
        restaurant_name: "biriyani zone",
        orderTotal: 23,
        orderItems: [
          {
            title: "kabab",
            qty: 1,
            price: 23.5,
          },
        ],
      };
      chai
        .request(server)
        .post("/order/new")
        .set("Authorization", "Bearer " + token)
        .send(order)

        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a("object");
          res.body.should.have.property("error");
          //   res.body.errors.should.have.property("kind").eql("required");
          done();
        });
    });
  });

  describe("/PATCH/:id order", () => {
    it("it should UPDATE a order given the id", (done) => {
      const orderId = 7;
      let order = {
        restaurantId: "1",
        orderTotal: 23,
        orderItems: [
          {
            title: "kabab",
            qty: 1,
            price: 23.5,
          },
        ],
      };

      chai
        .request(server)
        .patch(`/order/${7}`)
        .set("Authorization", "Bearer " + token)
        .send(order)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql(
              `order details updated successfully for user with orderId: ${orderId}`
            );

          done();
        });
    });

    it("it should not UPDATE a order a without order id", (done) => {
      let order = {
        customer_id: "1",
        restaurantId: "1",
        restaurant_name: "biriyani zone",
        orderTotal: 23,
        orderItems: [
          {
            title: "kabab",
            qty: 1,
            price: 23.5,
          },
        ],
      };

      chai
        .request(server)
        .patch(`/order/${order.orderId}`)
        .set("Authorization", "Bearer " + token)
        .send(order)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          done();
        });
    });
  });
  /*
   * Test the /DELETE/:id route
   */
  describe("/DELETE/:id order", () => {
    it("it should give 404 if id not found", (done) => {
      let order = {
        orderId: 8,
      };
      chai
        .request(server)
        .delete(`/order/delete/${order.orderId}`)
        .set("Authorization", "Bearer " + token)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          done();
        });
      //   done();
    });
    it("it should DELETE a order given the id", (done) => {
      let order = {
        orderId: 4,
      };

      chai
        .request(server)
        .delete(`/order/delete/${order.orderId}`)
        .set("Authorization", "Bearer " + token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("Order details deleted succesfully");
          res.body.result.should.have.property("id").eql(order.orderId);
          done();
        });
      //   done();
    });
    it("it should not DELETE a order without passing id", (done) => {
      let order = {
        orderId: null,
      };

      chai
        .request(server)
        .delete(`/order/delete/${order.orderId}`)
        .set("Authorization", "Bearer " + token)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          done();
        });
      // done();
    });
  });
});
