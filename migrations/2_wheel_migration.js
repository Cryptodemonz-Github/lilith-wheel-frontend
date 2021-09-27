const Wheel = artifacts.require("Wheel");

module.exports = function (deployer) {
  deployer.deploy(Wheel, "0xBe9aA783395bEd56B1E33115141F485E35213c53");
};
