import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, use } from "chai";
import { ethers } from "hardhat";
import { Booker } from "../typechain-types";


describe("Booker Contract", function () {
    let bookerContract: Booker;
    let owner: SignerWithAddress;
    let user: SignerWithAddress;
    let user2: SignerWithAddress;

    before(async function () {
        const bookerFactory = await ethers.getContractFactory("Booker");
        bookerContract = await bookerFactory.deploy();

        const accounts = await ethers.getSigners();
        owner = accounts[0];
        user = accounts[1];
        user2 = accounts[2];
    });

    it("Adds a stay", async function () {
        const bookerWithOwner = bookerContract.connect(owner);
        bookerWithOwner.addStay("1", 10000000, 2, "imageurl");
    });
})