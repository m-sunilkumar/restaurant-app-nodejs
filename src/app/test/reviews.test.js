// process.env.NODE_ENV = '
process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../server");
const client = require("../db/postgress");
const Reviews = require("../models/reviews/reviews.model");
let should = chai.should();
const token = process.env.AUTH_TOKEN;
chai.use(chaiHttp);

describe("Reviews", () => {
  before(function (done) {
    Reviews.remove((err, result) => {
      if (err) return done(err);
      done();
    });
  });

  describe("/POST Reviews", () => {
    it("it should POST a reviews data ", (done) => {
      const restaurantId = "1";
      let reviewsData = {
        business_id: "1",
        restaurantName: "biriyani zone",
        review: {
          title: " good restaurant",
          description: "Good environment and good foods",
          ratings: 4,
        },
        date: "23 aug 2021",
      };

      chai
        .request(server)
        .post(`/reviews-and-ratings/${restaurantId}`)
        .set("Authorization", "Bearer " + token)
        .send(reviewsData)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("Review Added Successfully");
          done();
        });
    });

    it("it should not POST a Reviews without business_id", (done) => {
      const restaurantId = "";
      let reviewsData = {
        restaurantName: "biriyani zone",
        review: {
          title: " good restaurant",
          description: "Good environment and good foods",
          ratings: 4,
        },
        date: "23 aug 2021",
      };
      chai
        .request(server)
        .post(`/reviews-and-restaurants/${restaurantId}`)
        .set("Authorization", "Bearer " + token)
        .send(reviewsData)

        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          //   res.body.errors.should.have.property("kind").eql("required");
          done();
        });
    });
  });
  describe("/GET Reviews", () => {
    let Reviews = {
      ReviewsId: 4,
    };

    it("it should GET the  reviews details for resturant with id", (done) => {
      const restaurantId = 1;
      chai
        .request(server)
        .get(`/reviews-and-ratings/${restaurantId}`)
        .set("Authorization", "Bearer " + token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          done();
        });
    });
    it("it should not GET Reviews if restaurantId  is incorrect", (done) => {
      const restaurantId = "99";
      chai
        .request(server)
        .get(`/reviews-and-ratings/${restaurantId}`)
        .set("Authorization", "Bearer " + token)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          res.body.should.have.property("error");

          done();
        });
    });
    it("it should not GET Reviews details without passing restaurantId", (done) => {
      const query = "";
      chai
        .request(server)
        .get(`/reviews-and-ratings/${query}`)
        .set("Authorization", "Bearer " + token)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          //   res.body.should.have.property("error");

          done();
        });
    });
  });

  describe("/PATCH/:id Reviews", () => {
    it("it should UPDATE a Reviews given the id", (done) => {
      const restaurantsId = 1;
      let reviewsData = {
        business_id: 1,
        restaurantName: "biriyani zone",
        review: {
          title: " very good restaurant",
          description: "Good environment and good foods",
          ratings: 4,
        },
        date: "23 aug 2021",
      };
      let reviews = new Reviews({
        restaurantName: "biriyani zone",
        review: {
          title: " very good restaurant",
          description: "Good environment and good foods",
          ratings: 4,
        },
        date: "23 aug 2021",
      });
      reviews.save((err, review) => {
        chai
          .request(server)
          .patch(`/reviews-and-ratings/${restaurantsId}`)
          .set("Authorization", "Bearer " + token)
          .send(reviewsData)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql(`Reviews updated successfully`);

            done();
          });
      });
    });

    it("it should not UPDATE a Reviews a without business_id", (done) => {
      let reviewsData = {
        restaurantName: "biriyani zone",
        review: {
          title: " very good restaurant",
          description: "Good environment and good foods",
          ratings: 4,
        },
        date: "23 aug 2021",
      };

      chai
        .request(server)
        .patch(`/reviews-and-ratings/${null}`)
        .send(reviewsData)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  /*
   * Test the /DELETE/:id route
   */
  describe("/DELETE/:id Reviews", () => {
    it("it should give 404 if id not found", (done) => {
      let restaurantsData = {
        business_id: 10,
      };
      chai
        .request(server)
        .delete(`/reviews-and-ratings/${restaurantsData.business_id}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          done();
        });
      //   done();
    });
    it("it should DELETE a Reviews given the id", (done) => {
      let restaurants = {
        business_id: "7",
      };
      let reviews = new Reviews({
        restaurantName: "biriyani zone",
        review: {
          title: " very good restaurant",
          description: "Good environment and good foods",
          ratings: 4,
        },
        date: "23 aug 2021",
      });

      reviews.save((err, review) => {
        chai
          .request(server)
          .delete(`/reviews-and-ratings/${restaurants.business_id}`)
          .set("Authorization", "Bearer " + token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql("Review has been deleted successfully");
            res.body.result.should.have.property("data");

            done();
          });
      });
    });
    it("it should not DELETE a Reviews without passing id", (done) => {
      let restaurants = {
        business_id: null,
      };

      chai
        .request(server)
        .delete(`/reviews-and-ratings/${restaurants.business_id}`)
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
