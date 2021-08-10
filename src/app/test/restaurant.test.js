// process.env.NODE_ENV = '
process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../server");
const client = require("../db/postgress");
let should = chai.should();
const token = process.env.AUTH_TOKEN;
chai.use(chaiHttp);

describe("Restaurants", () => {
  describe("/POST Restaurants", () => {
    it("it should POST a Restaurant data ", (done) => {
      let restaurantData = {
        longitude: 3335,
        latitude: 3035,
        reviewCount: 30336,
        ratings: 4,
        catagories: ["south indian"],
        business_id: Math.ceil(Math.random() * 100),
        name: "gowdara mane",
        address: "bangalore whitefield",
        city: "bangalore",
        menu: [
          {
            item: "veg fried rice",
            catogory: "chinese",
          },
          {
            item: "chicken fried rice",
            catogory: "chinese",
          },
          {
            item: "chicken lollypop",
            catogory: "chinese",
          },
        ],
        is_open: true,
      };
      chai
        .request(server)
        .post(`/restaurants`)
        .send(restaurantData)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("Restaurants successfully placed!");
          done();
        });
    });

    it("it should not POST a Restaurants without business_id field", (done) => {
      let restaurantData = {
        longitude: 3335,
        latitude: 3035,
        reviewCount: 30336,
        ratings: 4,
        catagories: ["south indian"],
        business_id: "",
        name: "gowdara mane",
        address: "bangalore whitefield",
        city: "bangalore",
        menu: [
          {
            item: "veg fried rice",
            catogory: "chinese",
          },
          {
            item: "chicken fried rice",
            catogory: "chinese",
          },
          {
            item: "chicken lollypop",
            catogory: "chinese",
          },
        ],
        is_open: true,
      };
      chai
        .request(server)
        .post("/restaurants")
        .send(restaurantData)

        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          //   res.body.errors.should.have.property("kind").eql("required");
          done();
        });
    });
    it("it should not POST a Restaurants if Restaurants already presents(if business_id  matches with exists)", (done) => {
      let restaurantData = {
        longitude: 3335,
        latitude: 3035,
        reviewCount: 30336,
        ratings: 4,
        catagories: ["south indian"],
        business_id: "3",
        name: "gowdara mane",
        address: "bangalore whitefield",
        city: "bangalore",
        menu: [
          {
            item: "veg fried rice",
            catogory: "chinese",
          },
          {
            item: "chicken fried rice",
            catogory: "chinese",
          },
          {
            item: "chicken lollypop",
            catogory: "chinese",
          },
        ],
        is_open: true,
      };
      chai
        .request(server)
        .post("/restaurants")
        .send(restaurantData)

        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          //   res.body.errors.should.have.property("kind").eql("required");
          done();
        });
    });
  });
  describe("/GET Restaurant", () => {
    let Restaurant = {
      RestaurantId: 4,
    };

    it("it should GET the all restaurants data ", (done) => {
      chai
        .request(server)
        .get("/restaurants")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          done();
        });
    });
    it("it should  GET Restaurants details based on query passed", (done) => {
      const searchQuery = "city=bangalore";
      chai
        .request(server)
        .get(`/restaurants/search?${searchQuery}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("data");

          done();
        });
    });
    it("it should not GET Restaurants details without passing correct query", (done) => {
      const query = "date?23 aug";
      chai
        .request(server)
        .get(`/restaurants/search?${query}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("message");

          done();
        });
    });
  });

  describe("/PATCH/:id Restaurants", () => {
    it("it should UPDATE a Restaurants given the id", (done) => {
      const restaurantsId = 7;
      let restaurantData = {
        longitude: 3335,
        latitude: 3035,
        reviewCount: 30336,
        ratings: 4,
        catagories: ["south indian"],
        business_id: "7",
        name: "gowdara mane",
        address: "bangalore whitefield",
        city: "bangalore",
        menu: [
          {
            item: "veg fried rice",
            catogory: "chinese",
          },
          {
            item: "chicken fried rice",
            catogory: "chinese",
          },
          {
            item: "chicken lollypop",
            catogory: "chinese",
          },
        ],
        is_open: true,
      };

      chai
        .request(server)
        .patch(`/restaurants/${7}`)
        .send(restaurantData)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql(
              `Restaurants details updated successfully for restaurant with business_id: ${restaurantsId}`
            );

          done();
        });
      done();
    });

    it("it should not UPDATE a Restaurants a without Restaurants id", (done) => {
      let restaurantData = {
        longitude: 3335,
        latitude: 3035,
        reviewCount: 30336,
        ratings: 4,
        catagories: ["south indian"],
        business_id: "",
        name: "gowdara mane",
        address: "bangalore whitefield",
        city: "bangalore",
        menu: [
          {
            item: "veg fried rice",
            catogory: "chinese",
          },
          {
            item: "chicken fried rice",
            catogory: "chinese",
          },
          {
            item: "chicken lollypop",
            catogory: "chinese",
          },
        ],
        is_open: true,
      };

      chai
        .request(server)
        .patch(`/restaurants/${null}`)
        .send(restaurantData)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
      done();
    });
  });
  /*
   * Test the /DELETE/:id route
   */
  describe("/DELETE/:id Restaurants", () => {
    it("it should give 404 if id not found", (done) => {
      let restaurantsData = {
        business_id: 7,
      };
      chai
        .request(server)
        .delete(`/restaurants/${11}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          done();
        });
      //   done();
    });
    it("it should DELETE a Restaurants given the id", (done) => {
      let restaurants = {
        business_id: "7",
      };

      chai
        .request(server)
        .delete(`/restaurants/${restaurants.business_id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("Restaurant Record Deleted Successfully");
          res.body.should.have.property("id").eql(restaurants.business_id);
          done();
        });
      //   done();
    });
    it("it should not DELETE a Restaurants without passing id", (done) => {
      let restaurants = {
        business_id: null,
      };

      chai
        .request(server)
        .delete(`/restaurants/${restaurants.business_id}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          done();
        });
      // done();
    });
  });
});
