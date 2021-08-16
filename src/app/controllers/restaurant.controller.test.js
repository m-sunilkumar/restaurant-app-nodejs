// process.env.NODE_ENV = '
process.env.NODE_ENV = "test";

const Restaurants = require("../controllers/restaurants.controller");

let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();
chai.use(chaiHttp);

describe("Restaurants", () => {
  before((done) => {});
  describe("Restaurants operations addNewRestaurant", () => {
    it("it should POST a Restaurant data ", (done) => {
      let req = {
        body: {
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
        },
      };
      Restaurants.addRestaurant(req, res)
        .then((result) => {
          result.should.be.a("object");
          done();
        })
        .catch((err) => {
          err.to.be.a("string");
          done();
        });
    });
  });
});
